# QuantAgent 接入统一账号中心第一阶段参考

更新日期：2026-05-15

## 1. 接入定位

QuantAgent 第一阶段按个人账号接入统一账号中心。

```text
client_id = "quantagent"
product_code = "quantagent"
surface = "web_desktop_cli"
billing owner = user
```

机构空间、组织额度池、企业合同和成员管理放到第二阶段。

## 2. 登录流程

Web 形态：

```text
用户打开 QuantAgent Web
  -> 检查本应用 session
  -> 无 session 时跳转账号中心
  -> 登录成功后读取 /api/v1/auth/me
  -> 读取 /api/v1/billing/me/portal
```

Desktop / CLI 形态：

```text
用户运行 QuantAgent
  -> 打开系统浏览器登录，或显示设备码
  -> 登录成功后把凭证存入系统安全存储
  -> 调用 /api/v1/auth/me
  -> 调用 /api/v1/billing/me/entitlements
```

CLI 不应要求用户手动复制长期 token 到配置文件。开发阶段可以临时支持短期 token，但生产必须改为设备码或系统浏览器登录。

## 3. 启动校验

QuantAgent 每次启动或进入研究工作区时：

1. 读取 `/api/v1/auth/me`。
2. 确认会话未被撤销。
3. 读取 `/api/v1/billing/me/entitlements`。
4. 检查 `quantagent.can_access`。
5. 如果没有订阅但钱包有余额，可以允许按任务扣费。
6. 如果钱包不足，跳转官网账户钱包。

## 4. 用量扣费

QuantAgent 的任务通常成本更高，必须以任务级 reservation 管理：

```text
POST /api/v1/billing/me/usage/reserve
  product_code = "quantagent"
  usage_key = "quantagent.strategy_research" |
              "quantagent.backtest" |
              "quantagent.evidence_report" |
              "quantagent.alert_run"
  amount_cents = 预估成本
  idempotency_key = research_run_id

任务成功：
POST /api/v1/billing/me/usage/commit

任务失败/风控拒绝/用户取消：
POST /api/v1/billing/me/usage/release
```

严禁：

- 研究任务跑完后才发现余额不足。
- AI 交易或策略结果直接绕过 Billing Core 扣费。
- 把收益分成和软件使用费混在第一阶段。

第一阶段 QuantAgent 只按软件能力、研究算力、证据报告和告警任务收费，不做收益分成。

## 5. 数据一致性

QuantAgent 可以缓存：

- 账号基础资料：5-15 分钟。
- `quantagent` entitlement 展示状态：1-5 分钟。
- 历史研究报告本地索引。

QuantAgent 不得缓存：

- 当前可扣余额。
- reservation 是否还有效。
- 后台退款或封禁后的可访问状态。

长任务应在关键阶段复核 reservation 或 heartbeat，避免长时间任务跨过会话撤销和余额变化。

## 6. 风控要求

QuantAgent 接入账号中心时必须保留：

- 研究任务 ID。
- 策略/回测输入摘要。
- 扣费 idempotency key。
- 任务成功/失败状态。
- Billing reservation ID。

这些字段用于后续对账、用户争议处理和策略成本分析。

## 7. 第二阶段升级点

第二阶段再增加：

- 机构组织空间。
- 组织钱包和额度池。
- 成员角色。
- 研究项目共享。
- 企业合同和对公付款。
- 管理员设置每日/每月成本上限。

升级方向是把 owner 从 `user` 扩展到 `organization`，不是让 QuantAgent 自己实现账号和计费。
