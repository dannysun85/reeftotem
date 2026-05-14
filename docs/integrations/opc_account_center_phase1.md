# OPC 接入统一账号中心第一阶段参考

更新日期：2026-05-15

## 1. 接入定位

OPC 第一阶段作为个人账号下的 Web App 接入统一账号中心。

```text
client_id = "opc"
product_code = "opc"
surface = "web"
billing owner = user
```

第二阶段再升级企业组织空间：

```text
billing owner = organization
```

## 2. 登录流程

```text
用户打开 https://opc.reeftotem.ai/login
  -> OPC 检查本应用 session
  -> 没有 session 时跳转账号中心
  -> 账号中心完成登录或复用已有登录态
  -> OPC 拿到自己的短期应用会话
  -> OPC 调用 /api/v1/auth/me
  -> OPC 调用 /api/v1/billing/me/entitlements
```

第一阶段当前后端已提供：

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/sso/applications`
- `GET /api/v1/auth/sessions`
- `POST /api/v1/auth/logout`
- `DELETE /api/v1/auth/sessions/{session_id}`

OPC 不应直接复用官网 localStorage token 作为长期登录态。Web App 正式形态应使用 HttpOnly Session Cookie 或 BFF session。

## 3. 启动校验

OPC 每次进入工作区前执行：

1. 读取 `/api/v1/auth/me`，确认账号有效、会话未撤销。
2. 读取 `/api/v1/billing/me/entitlements`。
3. 检查 `opc.can_access`。
4. 如果没有订阅但钱包有可用余额，可以允许进入受限试用或按任务扣费。
5. 如果账号停用、session revoked、钱包不足且无权益，跳转官网账户钱包。

## 4. 用量扣费

OPC 中这些任务必须走 Billing Core：

- 创建/运行 AI 公司工作流。
- 数字员工执行高成本任务。
- 外部工具调用。
- 生成报告、审计结果、交付物。
- 大模型长上下文任务。

标准流程：

```text
POST /api/v1/billing/me/usage/reserve
  product_code = "opc"
  usage_key = "opc.workflow_run" | "opc.agent_tool_call" | "opc.report_generation"
  amount_cents = 预估成本
  idempotency_key = task_id + step_id

任务成功：
POST /api/v1/billing/me/usage/commit

任务失败/取消/超时：
POST /api/v1/billing/me/usage/release
```

OPC 只能记录自己的任务状态，不直接改余额。

## 5. 数据一致性

OPC 本地可以缓存：

- 用户基础资料：5-15 分钟。
- `opc` entitlement：1-5 分钟。

不能缓存：

- 高成本任务扣费判断。
- 钱包最终余额。
- 订单支付状态。

任何支付、退款、后台确认入账以后，以 Billing Core 返回为准。

## 6. 第一阶段必须避免

- 不要自己维护 OPC 用户密码。
- 不要用 email 当跨系统主键。
- 不要在 OPC 数据库里保存“已付费”作为最终真相。
- 不要跳过 `reserve` 直接任务完成后扣费。
- 不要把企业组织模型提前混入第一阶段主链路。

## 7. 第二阶段升级点

企业阶段再增加：

- `organization_id`
- 企业成员和角色。
- 企业钱包。
- 企业订阅套餐。
- 对公转账合同开通。
- 企业 SAML / OIDC Federation。

升级时 OPC 的主要变化是 owner 从 `user` 变为 `organization`，不是重做登录系统。
