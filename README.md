# AgentPay ⚡🤖

<p align="center"><img src="docs/logo.png" width="160" alt="AgentPay logo"></p>

> **Submitted to the Colosseum Crypto World's Fair Hackathon — Superteam Vietnam Track (Oct 2025).**

**Micropayment gateway for the AI agent economy — pay-per-request on Solana, verified on-chain.**

AI agents can't pass KYC, can't hold credit cards, and can't do subscriptions.
AgentPay lets any API charge per request with **3 lines of code**: the server replies
`402 Payment Required` with Solana payment instructions, the agent pays, retries, and
gets served. Settlement is final in under a second and costs less than $0.001.

Built for the **Colosseum Crypto World's Fair Hackathon — Superteam Vietnam Track**.

---

## How it works

```
Agent                          API (AgentPay middleware)
  |  GET /api/brief                 |
  |-------------------------------> |
  |  402 {payTo, amount, memo, requestId}
  | <-------------------------------|
  |  SOL transfer + memo on Solana  |
  |  GET /api/brief?requestId&signature
  |-------------------------------> |
  |  verify on-chain (amount + memo)|
  |  200 { data }                   |
  | <-------------------------------|
```

- **No accounts. No API keys. No chargebacks.** The transaction *is* the credential.
- Replay-safe: each `requestId` is single-use and expires in 10 minutes.
- Works today with System Program transfers + Memo Program — no custom program deploy needed.

## Proof of work (devnet)

End-to-end paid request executed on Solana devnet (2026-09-18):

- Agent received `402` challenge → paid 5,000 lamports + memo `agentpay:<requestId>` → gateway verified on-chain → data served.
- Payment tx: [`5BTVHeF4UNj8ZTe3QQD6aoqdDrc6LpEGc8sorRRxaEnw9XYufvF9bSTnLcQ8hfYyHTy8avNAs1WhJcCbP4K3LrYB`](https://explorer.solana.com/tx/5BTVHeF4UNj8ZTe3QQD6aoqdDrc6LpEGc8sorRRxaEnw9XYufvF9bSTnLcQ8hfYyHTy8avNAs1WhJcCbP4K3LrYB?cluster=devnet)
- Agent wallet: `6oRWtUw1GBQF1P6z3kgpxBbQc1cqLs33Kn8ijo7ZP5Jw` · Merchant: `93qfjBLokhsdXux8VWHHEmX8bqvKENFnpcQHoVbGjLxG`

## Quickstart (devnet)

```bash
npm install

# 1. start the paid demo API
AGENTPAY_MERCHANT=<your-devnet-address> npm run demo

# 2. run the autonomous agent (generates an ephemeral wallet, airdrops, pays, consumes)
npm run agent -- http://localhost:3402/api/brief
```

## Use as middleware

```js
import { AgentPayGateway } from 'agentpay';

const gateway = new AgentPayGateway({
  merchantAddress: 'YourSolanaAddress',
  priceLamports: 5000,        // per request
});

// no payment? -> const c = gateway.createChallenge('/api/brief');  // return 402 c.body
// with payment? -> await gateway.verifyPayment(requestId, signature) // { ok: true }
```

## Business model

| Layer | Revenue |
|---|---|
| Open-source SDK (this repo) | adoption / funnel |
| Hosted gateway (verify-as-a-service, analytics, fiat off-ramp) | 0.5% per settled request |
| Enterprise SLA (custom chains, compliance reporting) | annual contracts |

**GTM:** Solana ecosystem APIs and AI-agent projects (dozens are being built on Superteam
Earn *right now*) are the first customers. Distribution via npm + integration PRs into
popular agent frameworks.

## Roadmap

- [x] 402 challenge/verify core (devnet)
- [x] Autonomous agent client (auto-pay + retry)
- [ ] USDC (SPL token) payments
- [ ] Hosted gateway dashboard
- [ ] x402-compatible adapter

## Tech

Node 24 · @solana/web3.js · zero-dependency HTTP demo server · Solana devnet

## License

MIT
