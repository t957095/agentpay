// AgentPay gateway: HTTP 402 micropayment middleware for Solana.
// Flow: request -> 402 + payment instructions -> agent pays on-chain -> retry with signature -> verify -> serve.
import { Connection, PublicKey } from '@solana/web3.js';
import crypto from 'node:crypto';

export class AgentPayGateway {
  /**
   * @param {object} opts
   * @param {string} opts.merchantAddress - Solana address receiving payments
   * @param {string} [opts.rpcUrl] - defaults to devnet
   * @param {number} [opts.priceLamports] - price per request in lamports (default 5000 = 0.000005 SOL)
   */
  constructor({ merchantAddress, rpcUrl = 'https://api.devnet.solana.com', priceLamports = 5000 }) {
    this.merchant = new PublicKey(merchantAddress);
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.priceLamports = priceLamports;
    this.pending = new Map(); // requestId -> { createdAt, used }
  }

  /** Create a payment challenge. Returns the 402 body. */
  createChallenge(resource) {
    const requestId = crypto.randomBytes(8).toString('hex');
    this.pending.set(requestId, { createdAt: Date.now(), used: false });
    // expire challenges after 10 min
    setTimeout(() => this.pending.delete(requestId), 10 * 60 * 1000).unref?.();
    return {
      status: 402,
      body: {
        error: 'Payment Required',
        protocol: 'agentpay/0.1',
        requestId,
        payTo: this.merchant.toBase58(),
        amountLamports: this.priceLamports,
        memo: `agentpay:${requestId}`,
        resource,
        expiresInSeconds: 600,
      },
    };
  }

  /**
   * Verify a payment transaction for a challenge.
   * @param {string} requestId
   * @param {string} signature - tx signature submitted by the agent
   * @returns {Promise<{ok: boolean, reason?: string}>}
   */
  async verifyPayment(requestId, signature) {
    const challenge = this.pending.get(requestId);
    if (!challenge) return { ok: false, reason: 'unknown or expired requestId' };
    if (challenge.used) return { ok: false, reason: 'requestId already redeemed' };

    let tx;
    try {
      tx = await this.connection.getParsedTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      });
    } catch {
      return { ok: false, reason: 'rpc error fetching transaction' };
    }
    if (!tx || tx.meta?.err) return { ok: false, reason: 'transaction not found or failed' };

    // 1. memo must match agentpay:<requestId>
    const memoOk = (tx.transaction.message.instructions || []).some((ix) => {
      const data = ix.parsed?.info?.memo ?? ix.parsed ?? ix.data;
      return typeof data === 'string' && data.includes(`agentpay:${requestId}`);
    });
    if (!memoOk) return { ok: false, reason: 'memo mismatch' };

    // 2. merchant must have received >= price
    const idx = tx.transaction.message.accountKeys.findIndex(
      (k) => (k.pubkey ?? k).toBase58?.() === this.merchant.toBase58()
    );
    if (idx === -1) return { ok: false, reason: 'merchant not in accounts' };
    const received = Number(tx.meta.postBalances[idx]) - Number(tx.meta.preBalances[idx]);
    if (received < this.priceLamports) return { ok: false, reason: `underpaid: ${received} lamports` };

    challenge.used = true;
    return { ok: true };
  }
}
