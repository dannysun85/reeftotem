# Billing Engine 开源选型结论

更新日期：2026-05-14

## 1. 结论

ReefTotem 的计费系统不建议完全复刻 Stripe Billing，也不建议把 Stripe 当内部计费中心。

推荐路线：

```text
第一阶段：自研轻量 Billing Core
第二阶段：评估 Lago 或 OpenMeter 作为用量计费/账单引擎 sidecar
支付路由：国内直连微信支付/支付宝/对公转账，海外再接 Stripe
```

当前仓库已经先落地了第一阶段的 Billing Core 骨架：

- `billing_products`
- `billing_plans`
- `payment_orders`
- `billing_subscriptions`
- `credit_wallets`
- `credit_ledger_entries`
- `usage_reservations`

这些表必须继续保留为 ReefTotem 的业务源头。即使未来接入开源 Billing Engine，也只能作为 sidecar 或执行引擎，不能替代 ReefTotem 自己的订单、权益和账本边界。

## 2. 为什么不直接整体接 Stripe Billing

Stripe Billing 适合海外订阅和银行卡支付，但不适合作为国内主计费中心。

- Stripe Billing 是收费产品，不是免费计费中心。
- Stripe 支持 Alipay / WeChat Pay 但场景有限：WeChat Pay 不支持 recurring payments，Alipay 订阅需要审批。
- Stripe 账号地区不覆盖中国大陆主体。
- 国内微信/支付宝支付回调最终仍要进入 ReefTotem 自己的订单和账本。

所以 Stripe 在 ReefTotem 中只应是海外 Payment Adapter。

## 3. 候选开源项目

### 3.1 Lago

GitHub: https://github.com/getlago/lago

定位：开源 usage-based、subscription-based、hybrid billing 平台。

优点：

- 覆盖 usage metering、subscription、invoice、entitlement。
- Payment-agnostic，官方说明可与 Stripe、Adyen、GoCardless 或任意 payment gateway 配合。
- API-first，适合作为 sidecar。
- 场景贴近 AI 产品、API 产品和 usage-based billing。
- 有预付费 credits / usage billing 的现成思路。

风险：

- 许可证是 AGPL-3.0。若修改并通过网络提供服务，通常需要向网络用户开放对应源码，必须做法律确认。
- Ruby/Rails 体系，与当前 FastAPI 后端不是同技术栈。
- 如果直接深度改造，长期维护成本和许可证风险会上升。

适合 ReefTotem 的方式：

```text
可以作为独立 sidecar 评估；
不要直接复制代码进主仓库；
不要在未确认 AGPL 影响前做深度二开。
```

### 3.2 OpenMeter

GitHub: https://github.com/openmeterio/openmeter

定位：面向 AI、agentic、DevTool 的实时 metering 和 billing 平台。

优点：

- Apache-2.0 license，对商业集成更友好。
- 强项是 usage event、meter、limits、entitlements、prepaid credits、LLM cost tracking。
- 技术上更适合接 OPC 自动化、星伴模型调用、QuantAgent 回测这种高频用量事件。
- 可作为“用量采集和额度限制引擎”，不必接管所有订单。

风险：

- 更偏 usage metering / billing engine，不一定完整覆盖中国支付、发票、对公合同等商业流程。
- 需要自己保留 PaymentOrder、Subscription、Wallet、Ledger 等核心表。

适合 ReefTotem 的方式：

```text
优先作为 usage metering sidecar；
保留 ReefTotem Billing Core；
由产品系统向 OpenMeter 上报 usage events；
由 ReefTotem ledger 做最终扣款和审计源头。
```

### 3.3 Kill Bill

GitHub: https://github.com/killbill/killbill

定位：成熟的开源 subscription billing & payments platform。

优点：

- Apache-2.0 license。
- 时间长、成熟、模块完整，支持复杂订阅、用量和支付插件。
- 更接近传统 SaaS 企业计费系统。

风险：

- Java 体系，系统较重。
- 对 ReefTotem 当前阶段偏复杂，接入成本明显高于收益。
- AI credits、LLM token、QuantAgent 回测这种现代 AI 用量计费需要额外建模。

适合 ReefTotem 的方式：

```text
作为参考架构，不建议第一阶段接入。
除非未来企业计费、发票、订阅复杂度大幅上升，再重新评估。
```

### 3.4 Hyperswitch

GitHub: https://github.com/juspay/hyperswitch

定位：开源 payment switch，不是 billing engine。

优点：

- Apache-2.0 license。
- Rust 实现，性能和工程质量较强。
- 强项是多 PSP 路由、支付观测、重试、vault、reconciliation。
- 适合未来统一 Stripe、Adyen、PayPal 等海外支付通道。

风险：

- 不解决套餐、订阅权益、RFT Credits、用量计费。
- 国内微信支付/支付宝直连仍需要确认 connector 覆盖和商户条件。
- 对当前第一阶段过重。

适合 ReefTotem 的方式：

```text
未来海外多支付通道变复杂时再考虑；
现在不作为 Billing Center。
```

### 3.5 Meteroid

GitHub: https://github.com/meteroid-oss/meteroid

定位：开源 pricing and billing infrastructure，覆盖 subscription、invoicing、pricing、usage-based billing。

优点：

- 产品方向贴近现代 SaaS monetization。
- 支持 subscription、usage-based billing、pricing、reporting。
- Rust 技术栈对性能和长期维护有吸引力。

风险：

- 相比 Lago / Kill Bill / OpenMeter，生态和成熟度仍需实测确认。
- 当前阶段不应直接押注为核心计费系统。

适合 ReefTotem 的方式：

```text
列入第二批 PoC；
如果 OpenMeter 不满足 invoice/plan 复杂度，再对比 Meteroid。
```

## 4. 自研 vs 开源

### 自研轻量 Billing Core

适合第一阶段必须自己做的部分：

- 订单号和支付状态
- 国内微信/支付宝回调
- 对公转账人工确认
- 产品权益
- RFT Credits 钱包
- 不可变账本
- usage reserve / commit / release

原因：

- 这些是公司业务事实，不能完全交给外部系统。
- 国内支付和企业合同很难被海外 Billing SaaS 完整覆盖。
- 账本、权益和产品状态必须能被 OPC、星伴、QuantAgent 直接信任。

### 开源项目适合作 sidecar

适合引入开源项目的部分：

- 高频 usage event 聚合
- 多维度 meter
- 阈值提醒
- usage dashboard
- 复杂价格实验
- invoice preview

不适合交给开源项目的部分：

- 国内收款源头
- 企业合同确认
- 钱包最终余额
- 财务审计源账本
- 产品是否可用的最终判断

## 5. 推荐 PoC 顺序

### PoC A: OpenMeter

目标：验证 AI/自动化/回测用量事件能不能低成本接入。

测试事件：

- `assistant.model_tokens`
- `opc.workflow_run`
- `opc.agent_tool_call`
- `quantagent.backtest_cpu_seconds`
- `quantagent.research_report`

验收标准：

- 能按用户 / 组织 / 产品聚合。
- 能按小时、天、月查询。
- 能表达 limits 和 prepaid credits。
- 能提供 API 给 Billing Core 做扣款参考。
- 不要求它接管支付。

### PoC B: Lago

目标：验证套餐、invoice、subscription、credits 是否比自研更省事。

验收标准：

- 能表达星伴 Pro/Max、OPC Pro、QuantAgent Research。
- 能表达月费 + included credits + overage。
- 能对接非 Stripe 支付状态。
- 能避免 AGPL 影响主仓库闭源边界。

### PoC C: Hyperswitch

目标：只在海外支付通道复杂后验证。

验收标准：

- 能接 Stripe/Adyen/PayPal。
- 能统一支付日志和退款。
- 不影响国内微信支付/支付宝直连。

## 6. 最终推荐

当前阶段不要直接拿一个开源项目替换 Billing Center。

最稳路线：

```text
1. 继续自研 ReefTotem Billing Core
2. 国内支付直连微信支付/支付宝
3. OpenMeter 做第一候选 sidecar，用于用量采集和额度限制 PoC
4. Lago 做第二候选，用于复杂 billing/invoice/credits PoC
5. Kill Bill 和 Hyperswitch 暂时只参考，不进入第一阶段
```

## 7. 当前决策

第一阶段代码继续沿用当前仓库已落地的 Billing Core。

下一步不是重写，而是补：

- `checkout` API
- `wechat` / `alipay` payment adapter
- `payment_orders` 状态机
- `credit_ledger_entries` 入账服务
- `usage reserve / commit / release`
- 后台 Billing Admin 页面

OpenMeter 和 Lago 先作为 sidecar PoC，不进入生产主链路。
