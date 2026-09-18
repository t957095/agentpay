// Demo paid API: "Solana ecosystem brief" — pay 5000 lamports on devnet to unlock.
// Zero dependencies beyond @solana/web3.js: plain node:http so anyone can run it.
import http from 'node:http';
import { AgentPayGateway } from './gateway.js';

const MERCHANT = process.env.AGENTPAY_MERCHANT; // merchant Solana address (devnet)
if (!MERCHANT) {
  console.error('Set AGENTPAY_MERCHANT=<devnet solana address> first.');
  process.exit(1);
}
const gateway = new AgentPayGateway({ merchantAddress: MERCHANT });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname !== '/api/brief') {
    res.writeHead(404).end('not found');
    return;
  }
  const requestId = url.searchParams.get('requestId');
  const signature = url.searchParams.get('signature');

  if (requestId && signature) {
    const v = await gateway.verifyPayment(requestId, signature);
    if (v.ok) {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({
        brief: 'Solana ecosystem brief (devnet demo): agent payments narrative is heating up; Colosseum Crypto World\'s Fair hackathon is open; AI x crypto remains the fastest-growing builder track.',
        paidWith: signature,
      }));
      return;
    }
    res.writeHead(402, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'payment verification failed', reason: v.reason }));
    return;
  }

  const challenge = gateway.createChallenge('/api/brief');
  res.writeHead(402, { 'content-type': 'application/json' });
  res.end(JSON.stringify(challenge.body));
});

const port = process.env.PORT || 3402;
server.listen(port, () => console.log(`AgentPay demo API on http://localhost:${port}/api/brief`));
