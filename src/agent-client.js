// Agent-side client: detects 402, pays on Solana devnet, retries automatically.
// Usage: AGENT_KEYPAIR=<base58-or-json-array> node src/agent-client.js http://localhost:3402/api/brief
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import fs from 'node:fs';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export async function agentFetch(url, { keypair, rpcUrl = 'https://api.devnet.solana.com' } = {}) {
  const first = await fetch(url);
  if (first.status !== 402) return first;

  const challenge = await first.json();
  if (challenge.protocol !== 'agentpay/0.1') throw new Error('unknown 402 protocol');
  console.log(`402 received: pay ${challenge.amountLamports} lamports to ${challenge.payTo}`);

  const connection = new Connection(rpcUrl, 'confirmed');
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: new PublicKey(challenge.payTo),
      lamports: challenge.amountLamports,
    }),
    new TransactionInstruction({
      keys: [],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(challenge.memo, 'utf8'),
    })
  );
  const signature = await connection.sendTransaction(tx, [keypair]);
  await connection.confirmTransaction(signature, 'confirmed');
  console.log(`paid: ${signature}`);

  const sep = url.includes('?') ? '&' : '?';
  return fetch(`${url}${sep}requestId=${challenge.requestId}&signature=${signature}`);
}

// CLI mode
if (process.argv[2]) {
  const url = process.argv[2];
  let secret;
  const envKey = process.env.AGENT_KEYPAIR;
  if (envKey && envKey.startsWith('[')) secret = Uint8Array.from(JSON.parse(envKey));
  else if (envKey) secret = Uint8Array.from(JSON.parse(fs.readFileSync(envKey, 'utf8')));
  else {
    // generate ephemeral devnet wallet and self-fund via airdrop
    const kp = Keypair.generate();
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    console.log(`ephemeral agent wallet: ${kp.publicKey.toBase58()} — requesting airdrop...`);
    const sig = await connection.requestAirdrop(kp.publicKey, 1_000_000_000);
    await connection.confirmTransaction(sig, 'confirmed');
    secret = kp.secretKey;
  }
  const keypair = Keypair.fromSecretKey(secret);
  const res = await agentFetch(url, { keypair });
  console.log(res.status, await res.text());
}
