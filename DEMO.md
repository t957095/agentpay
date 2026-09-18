# End-to-End Demo Log — Solana Devnet, 2026-09-18

Real run, unedited output. Every step is independently verifiable on-chain.

```
$ AGENTPAY_MERCHANT=93qfjBLokhsdXux8VWHHEmX8bqvKENFnpcQHoVbGjLxG node src/demo-server.js
AgentPay demo API on http://localhost:3402/api/brief

$ node src/agent-client.js http://localhost:3402/api/brief
402 received: pay 5000 lamports to 93qfjBLokhsdXux8VWHHEmX8bqvKENFnpcQHoVbGjLxG
paid: 5BTVHeF4UNj8ZTe3QQD6aoqdDrc6LpEGc8sorRRxaEnw9XYufvF9bSTnLcQ8hfYyHTy8avNAs1WhJcCbP4K3LrYB
200 {"brief":"Solana ecosystem brief (devnet demo): ...","paidWith":"5BTVHeF4..."}
```

## Verify it yourself

- Payment transaction (5,000 lamports + memo `agentpay:<requestId>`):
  https://explorer.solana.com/tx/5BTVHeF4UNj8ZTe3QQD6aoqdDrc6LpEGc8sorRRxaEnw9XYufvF9bSTnLcQ8hfYyHTy8avNAs1WhJcCbP4K3LrYB?cluster=devnet
- Agent wallet: `6oRWtUw1GBQF1P6z3kgpxBbQc1cqLs33Kn8ijo7ZP5Jw`
- Merchant wallet: `93qfjBLokhsdXux8VWHHEmX8bqvKENFnpcQHoVbGjLxG`

The gateway rejected a forged requestId/signature pair in the same test run
(`unknown or expired requestId`) — replay protection working as designed.
