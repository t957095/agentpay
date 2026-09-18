# AgentPay — Pitch Deck 大纲 / 3 分钟 Demo 视频脚本

## Slide 1 — 标题（0:00–0:15）
**AgentPay: Micropayments for the AI agent economy.**
Pay-per-request for any API, settled on Solana in <1s for <$0.001.

## Slide 2 — 问题（0:15–0:40）
- AI agents 正在爆发，但它们无法通过 KYC、没有信用卡、不能订阅。
- 机器对机器的服务交易没有支付层 —— agent 经济卡在「最后一公里」。
- 现有 402/x402 方案多数停留在规范，缺少「3 行接入 + 链上真实结算」的实现。

## Slide 3 — 产品演示（0:40–1:40）★ 核心
屏幕录制：
1. `npm run demo` 启动付费 API
2. `curl` 直接访问 → 返回 402 + 支付指令（展示 JSON）
3. `npm run agent` —— agent 自动生成钱包、支付、重试、拿到数据
4. 展示 Solana Explorer 上的真实交易（memo = `agentpay:<requestId>`）

## Slide 4 — 技术（1:40–2:00）
- System Program 转账 + Memo Program，无需部署自定义程序，今天就能用
- 服务端链上验证：金额 + memo + 一次性 requestId（防重放，10 分钟过期）
- 路线图：USDC (SPL) → 托管网关 → x402 适配器

## Slide 5 — 商业模式与 GTM（2:00–2:30）
- 开源 SDK 获客 → 托管网关 0.5%/笔 → 企业 SLA
- 首批客户：Solana 生态 API + AI agent 项目（Superteam Earn 上正在涌现）
- 分发：npm + 向主流 agent 框架提集成 PR

## Slide 6 — 为什么是现在 / 结尾（2:30–3:00）
- AI x crypto 是本届黑客松最热赛道；支付是 agent 经济的底层缺块
- AgentPay 是那块拼图。**The transaction is the credential.**

## 提交清单（Agent API）
- eligibilityAnswers: Project Name = "AgentPay"; Project Description = 上方一句话 + 要点; GitHub = 待建公开仓库; Website = demo/index.html 托管; Video = Loom 录屏（需用户录制或屏幕录制工具）
- telegram: 需要用户的 t.me/<username>（project 类列表必填）
