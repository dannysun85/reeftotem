# ReefTotem Billing Center 落地方案

更新日期：2026-05-14

## 1. 结论

ReefTotem 不应只接一个“充值通道”。OPC、星伴 Assistant、QuantAgent 都会付费，真正需要建设的是统一计费域：

```text
ReefTotem Account
  -> Billing Center
  -> Product entitlement
  -> Subscription / top-up / enterprise invoice
  -> RFT Credits wallet
  -> Immutable ledger
  -> Usage metering
```

支付通道只负责收钱。产品能不能用、额度怎么扣、退款怎么回滚、企业合同如何开通，必须由内部 Billing Center 统一决定。

## 2. Stripe 是否能接微信和支付宝

答案：能，但不能作为中国大陆业务的唯一默认方案。

官方资料显示：

- Stripe 支持 Alipay，支持 Checkout、Payment Links、Elements、部分 Subscriptions/Invoicing，但 Alipay 订阅能力需要审批；支持的 Stripe 账号地区包括香港、新加坡、美国、英国、欧盟等，不包括中国大陆主体直接开户。
- Stripe 支持 WeChat Pay，但 WeChat Pay 的 `Recurring payments` 是 `No`，并且 Checkout subscription/setup mode 不支持 WeChat Pay。
- Stripe global availability 列表包括 Hong Kong、Singapore、United States、United Kingdom 等；中国大陆不在直接支持账号地区列表内。

因此：

- 如果 ReefTotem 只有深圳前海大陆主体，Stripe 不能作为国内主收款通道。
- 如果后续有香港/新加坡/美国主体，Stripe 很适合作为海外客户、银行卡、海外订阅和部分钱包支付通道。
- 国内用户支付应优先直连微信支付和支付宝。

## 3. 推荐支付通道路由

### 3.1 第一阶段默认路由

| 场景 | 默认通道 | 说明 |
| --- | --- | --- |
| 国内个人购买星伴 | 微信支付 / 支付宝直连 | 一次性订单、充值包优先，支付成功后发放订阅和额度 |
| 国内 OPC 小团队 | 微信支付 / 支付宝 / 对公转账 | 月付可以先做“支付后开通 30 天”，不急做自动扣款 |
| OPC 企业客户 | 对公转账 | 合同、发票、后台人工确认，开通企业套餐和信用额度 |
| QuantAgent 内测 | 对公转账 / 支付宝 / 微信支付 | 暂不做收益分成，先做软件和研究算力付费 |
| 海外客户 | Stripe | 银行卡、海外钱包、订阅、发票 |

### 3.2 可选支付服务商

| 方案 | 适合 | 优点 | 风险 |
| --- | --- | --- | --- |
| 微信支付直连 + 支付宝直连 | 国内主体和国内客户 | 资金链路清晰，用户熟悉，费率低 | 接入两个 SDK，订阅自动续费要额外申请 |
| Stripe | 海外客户 / 香港或新加坡主体 | 订阅、发票、税务、银行卡能力成熟 | 中国大陆主体不能直接作为 Stripe 账号地区；微信不支持订阅 |
| Airwallex | 跨境收单、多币种、Alipay/WeChat Pay | 同时覆盖卡、钱包、跨境结算，适合全球化 | 需要完成商户审核，费用和开通条件需商务确认 |
| Paddle | 海外 SaaS / Merchant of Record | 代收、部分税务和支付方式处理，支持 Alipay，WeChat Pay 有限制 | 国内微信支付/支付宝覆盖不如直连；适合海外软件销售 |
| Adyen | 大企业全球支付 | 全球支付方式丰富，能力完整 | 接入门槛高，商务签约周期长；官方说明 Alipay 不处理中国境内支付 |
| 对公转账 | 企业合同 | 合规、可开票、适合大额 | 非实时，需要后台人工确认 |

第一阶段建议：

```text
国内：微信支付直连 + 支付宝直连 + 对公转账
海外：Stripe 作为可插拔通道，等境外主体或海外客户明确后再开
```

## 4. 产品收费模型

### 4.1 不采用单纯“积分”

不要把所有东西都叫“积分”。“积分”容易变成营销资产、储值卡、可转让余额，合规和财务解释都更麻烦。

建议公开叫：

```text
RFT Credits / AI 算力额度
```

内部按分计量：

```text
1 RFT Credit = 1 CNY 可用平台额度
1 credit_cent = 0.01 RFT Credit
```

数据库只存整数 `credit_cents`，避免浮点误差。

### 4.2 三类收入

| 类型 | 解决什么问题 | 产品例子 |
| --- | --- | --- |
| 订阅 | 使用资格、基础功能、基础额度 | 星伴 Pro、OPC Pro、QuantAgent Research |
| 充值包 | 高成本 AI 调用、自动化任务、回测、深度研究 | 100 / 500 / 2000 RFT Credits |
| 企业合同 | 大客户、私有化、SLA、后付费 | OPC Business、QuantAgent Institution |

### 4.3 套餐建议

| 产品 | 套餐 | 建议价 | 含额度 | 备注 |
| --- | --- | --- | --- | --- |
| 星伴 | Pro | ¥49/月，¥499/年 | 30 credits/月 | 个人入门 |
| 星伴 | Max | ¥99/月，¥999/年 | 80 credits/月 | 长上下文、语音、自动化 |
| OPC | Pro | ¥1299/月 | 500 credits/月 | 10 seats，小团队 |
| OPC | Business | ¥3999/月起 | 2000 credits/月 | 企业工作区、审计、更多席位 |
| QuantAgent | Research | ¥299/月 | 120 credits/月 | 策略研究和有限回测 |
| QuantAgent | Pro | ¥999/月 | 500 credits/月 | 证据工厂、更多回测、告警 |

套餐赠送额度按月重置，不结转。用户额外购买的充值包建议 12 个月有效，赠送额度 30-90 天有效。

## 5. 系统边界

### 5.1 Billing Center 负责

- 套餐定义
- 价格版本
- 订单
- 支付回调
- 订阅状态
- 产品权益
- Credits 钱包
- 不可变账本
- 使用量计量
- 企业信用额度
- 退款和人工调整

### 5.2 产品系统只负责

- 调用前询问：当前用户有没有权益？
- 高成本任务前询问：是否能 reserve credits？
- 任务完成后上报 usage event。
- 不直接改余额。
- 不直接相信前端支付状态。

## 6. 数据模型

第一阶段已在后端落地这些模型：

- `billing_products`
- `billing_plans`
- `credit_wallets`
- `credit_ledger_entries`
- `payment_orders`
- `billing_subscriptions`
- `usage_reservations`

核心规则：

- 钱包余额只能通过 ledger 改变。
- 支付成功 webhook 只创建 ledger credit，不直接在产品里开权限。
- 订阅状态和产品权益由 Billing Center 投影生成。
- 所有回调必须有 `idempotency_key`。
- 退款必须写反向 ledger，不能删除原始流水。

## 7. API 第一阶段

已落地：

- `GET /api/v1/billing/payment-routes`
  - 返回国内/海外支付通道路由和限制。
- `GET /api/v1/billing/plans`
  - 返回默认公开套餐；后续可从数据库读取。
- `POST /api/v1/billing/checkout`
  - 登录用户创建订阅或充值订单，返回 `payment_action`。生产环境由微信/支付宝/Stripe/对公转账适配器补齐二维码、跳转链接或人工确认说明。
- `GET /api/v1/billing/me/portal`
  - 登录用户查看钱包、订阅、产品权益、最近订单和最近账本。
- `GET /api/v1/billing/me/orders`
  - 登录用户查看个人订单。
- `GET /api/v1/billing/me/ledger`
  - 登录用户查看个人钱包流水。
- `GET /api/v1/billing/me/subscriptions`
  - 登录用户查看订阅。
- `GET /api/v1/billing/me/entitlements`
  - 登录用户查看 OPC、星伴、QuantAgent 是否可访问。
- `POST /api/v1/billing/me/orders/{order_no}/mock-pay`
  - 开发/手动通道的用户侧模拟支付确认，真实生产只用于人工或支付回调替代前的测试。
- `POST /api/v1/billing/me/usage/reserve`
  - 登录用户侧用量预冻结。
- `POST /api/v1/billing/me/usage/commit`
  - 登录用户侧用量确认扣费。
- `POST /api/v1/billing/me/usage/release`
  - 登录用户侧释放冻结额度。
- `GET /api/v1/billing/admin-dashboard`
  - 管理员计费运营聚合接口，返回收入指标、订单状态、支付通道、订阅状态、用户画像和报表入口。
- `POST /api/v1/billing/orders/{order_no}/mark-paid`
  - 管理员确认对公转账、手动收款或异常订单入账。
- `POST /api/v1/billing/usage/reserve`
  - 管理员/服务侧为指定 owner 预冻结额度。
- `POST /api/v1/billing/usage/commit`
  - 管理员/服务侧确认扣费。
- `POST /api/v1/billing/usage/release`
  - 管理员/服务侧释放冻结额度。
- `POST /api/v1/billing/products`
  - 管理员创建计费产品。
- `POST /api/v1/billing/plans`
  - 管理员创建套餐。
- `PUT /api/v1/billing/plans/{plan_code}`
  - 管理员更新套餐。
- `GET /api/v1/billing/wallets/{owner_type}/{owner_id}`
  - 管理员查看钱包。
- `GET /api/v1/billing/wallets/{wallet_id}/ledger`
  - 管理员查看账本流水。

仍待接真实商户通道：

- `POST /api/v1/billing/webhooks/stripe`
- `POST /api/v1/billing/webhooks/wechat`
- `POST /api/v1/billing/webhooks/alipay`

## 8. 官网闭环

官网新增 `/billing` 账户钱包页面，负责：

1. 客户通过统一账号中心登录，后端创建 `account_sessions`。
2. 读取 `GET /api/v1/billing/me/portal` 展示钱包余额、冻结额度、产品权益、订阅、订单和账本。
3. 创建充值包订单：`POST /api/v1/billing/checkout`，`order_type=top_up`。
4. 创建套餐订单：`POST /api/v1/billing/checkout`，`order_type=subscription`。
5. 开发/手动通道可通过 `POST /api/v1/billing/me/orders/{order_no}/mock-pay` 完成入账；生产环境改为支付回调或后台确认。
6. 用户可以在同一页查看所有软件的可访问状态和消费流水。

身份和会话边界见 `docs/account_center_phase1.md`。Billing Center 不负责判断“用户是谁”，只基于 Account Center 提供的 `user_id` / owner 处理权益和账务。

## 9. 软件接入闭环

三款软件都不直接修改余额，不直接相信前端支付状态，只接 Billing Core。

### 9.1 星伴 Assistant

- 登录后读取 `GET /api/v1/billing/me/portal`。
- 启动高成本云模型调用前调用 `POST /api/v1/billing/me/usage/reserve`。
- 模型调用完成后调用 `POST /api/v1/billing/me/usage/commit`。
- 调用失败、取消或超时调用 `POST /api/v1/billing/me/usage/release`。
- 访问条件：`xingban.can_access=true` 或钱包可用余额大于本次任务预估成本。

### 9.2 OPC 企业平台

- 个人版可以用 `owner_type=user`；企业工作区应升级为 `owner_type=organization`。
- 企业空间进入前读取对应 owner 的 entitlement。
- AI 员工任务、工作流执行、报告生成、外部工具调用按 `reserve -> commit/release` 扣费。
- 对公转账和企业合同由后台 `mark-paid` 或后续合同开通接口确认。

### 9.3 QuantAgent

- 内测阶段使用 `quantagent` 产品权益和通用钱包额度。
- 策略研究、回测、证据报告、告警任务按成本预估冻结额度。
- 研究任务成功后扣费，失败或风控拒绝释放冻结额度。
- 机构版后续使用 `owner_type=organization` 和企业额度池，不走个人钱包。

## 10. 第一阶段实施顺序

1. 固化 Billing Center 数据模型和 API 合同。
2. 在后台管理端增加计费中心：收入图表、订单状态、通道结构、订阅健康、报表中心和用户状态画像。
3. 接微信支付直连和支付宝直连的一次性订单。
4. 支付成功后写入 `payment_orders` 和 `credit_ledger_entries`。
5. 星伴登录后读取订阅和额度。
6. OPC 按组织读取企业套餐和共享额度。
7. QuantAgent 内测先走人工开通和额度扣减。
8. 境外主体明确后再启用 Stripe。

## 11. 当前决策

当前落地决策：

- 国内不以 Stripe 为主通道。
- Stripe 保留为海外通道，不从代码里绑定死。
- Billing Core 自研，开源 Billing Engine 只作为后续 sidecar PoC，不进入第一阶段主链路。
- 管理后台需要围绕业务事实建模，不只是静态图表：所有统计必须来自 `payment_orders`、`billing_subscriptions`、`credit_wallets`、`credit_ledger_entries` 和用户表。
- 第一阶段不做复杂自动续费，先做一次性支付 + 手动/周期订阅开通。
- 所有产品共用 RFT Credits，但套餐权益按产品隔离。
- QuantAgent 第一阶段按软件和研究算力收费，不做收益分成。

## 12. 管理后台第一版

已落地后台页面：

- `admin/src/components/admin/BillingCenterView.tsx`
- `admin/src/stores/billingStore.ts`

后台导航新增“计费中心”，覆盖：

- 近 30 天收入、钱包余额、活跃订阅、活跃用户 KPI。
- 近 6 个月收入趋势。
- 产品收入结构。
- 支付通道结构。
- 订单状态分布。
- 订阅状态分布。
- 报表中心：收入日报/月报、余额负债、用户生命周期画像、订阅健康。
- 用户状态画像：注册、支付中、付费、订阅、停用等生命周期分层，以及健康、需跟进、观察、新用户、停用等风险状态。
- 最近订单可以由管理员执行“确认入账”，用于对公转账、手动收款和支付回调未接入前的真实运营闭环。

这部分已经从只读后台推进到可确认入账。下一阶段再增加订单详情页、退款反向流水、报表导出、套餐编辑表单和真实支付回调审计。

## 13. 参考资料

- Stripe Alipay: https://docs.stripe.com/payments/alipay
- Stripe WeChat Pay: https://docs.stripe.com/payments/wechat-pay
- Stripe global availability: https://stripe.com/global
- Stripe payment method integration options: https://docs.stripe.com/payments/payment-methods/integration-options
- Airwallex payment methods: https://www.airwallex.com/docs/payments/payment-methods/payment-methods-overview
- Paddle payment methods: https://www.paddle.com/help/start/intro-to-paddle/which-payment-methods-do-you-support
- Paddle WeChat Pay: https://developer.paddle.com/concepts/payment-methods/wechat/
- Adyen Alipay: https://docs.adyen.com/payment-methods/alipay/
