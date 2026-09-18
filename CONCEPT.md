# AgentPay — Colosseum Hackathon / Superteam Vietnam Track 参赛项目

**一句话：** 面向 AI Agent 经济的 Solana 微支付网关 —— 让任何 API/服务用 3 行代码实现「先付 USDC，再给结果」。

## 问题

- AI Agent 正在爆发，但 agent 之间、agent 与服务之间没有原生的支付层。
- 现有方案（Stripe、订阅制）需要人类身份、信用卡、KYC —— autonomous agent 全部无法通过。
- Solana 的亚秒确认 + <$0.001 手续费是唯一适合机器对机器微支付的公链。

## 产品

一个 TypeScript SDK + 参考实现（devnet 可运行 demo）：

1. **`agentpay-sdk`**：服务端中间件。包装任何 HTTP endpoint，返回 402 Payment Required + Solana 支付指令；验证链上转账（Memo 包含 request hash）后放行。
2. **客户端 SDK**：agent 侧自动检测 402 → 构造并签名转账 → 重试请求。
3. **Demo 服务**：一个真实的付费 API（如「AI 生成的 Solana 生态简报」），完整跑通 402 流程，部署于 devnet，任何人可测。

## 为什么能赢（对齐评审标准）

| 评审点 | 我们的答案 |
|---|---|
| Problem Statement | Agent 经济无支付层，真实且紧迫 |
| Potential Impact | 每个 AI agent 都是潜在用户；x402 叙事正热 |
| Business Case / GTM | SDK 开源获客 → 托管网关收 0.5% 手续费 → 面向 Solana 生态 API 项目直销（Earn 上大量 AI agent 项目即目标客户）|
| Technical Implementation | 链上验证真实转账，非 mock |
| 早期 traction | Demo 服务真实可调用；SDK 发 npm |

## 技术栈（本机可构建）

- Node 24 + TypeScript + @solana/web3.js + @solana/spl-token
- Devnet 真实交易（System Program + Memo Program，无需本地 Rust/Anchor）
- Demo 前端：单页 HTML，连接 Phantom 或直接展示 agent 脚本调用
- 无服务器成本：devnet 免费，前端可挂 GitHub Pages

## 里程碑

- [ ] M1：SDK 核心（402 中间件 + 链上验证器）
- [ ] M2：Demo 付费 API + agent 客户端脚本
- [ ] M3：前端 demo 页 + README + 公开 GitHub 仓库
- [ ] M4：Pitch deck + 3 分钟 demo 视频脚本
- [ ] M5：通过 Agent API 提交（需 human 的 Telegram URL）

**截止：2026-10-13 | 奖金池：$10,000 USDG**
