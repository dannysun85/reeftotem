# ReefTotem 统一账号中心第一阶段方案

更新日期：2026-05-15

## 1. 结论

ReefTotem 第一阶段采用统一账号中心，而不是让官网、OPC、星伴、QuantAgent 各自维护独立登录。

```text
Account Center
  -> 身份源头：用户、密码、会话、设备、应用入口

Billing Core
  -> 商业源头：钱包、订单、订阅、权益、账本、用量冻结/扣费

Applications
  -> OPC / 星伴 / QuantAgent 只消费身份和计费源头
```

统一登录不等于所有应用共享同一份前端 token。正确边界是：

- Account Center 负责“你是谁”。
- Billing Core 负责“你能用什么、还能花多少”。
- 每个应用只保留自己的短期登录态和业务缓存。

## 2. 第一阶段范围

第一阶段落地：

- 统一 `/api/v1/auth/login` 登录入口。
- 登录后创建 `account_sessions` 会话记录。
- JWT 增加 `sid`, `client_id`, `token_use`, `account_version` claims。
- `GET /api/v1/auth/me` 返回账号上下文、当前会话、应用入口、Billing owner 和一致性契约。
- `GET /api/v1/auth/sso/applications` 返回官网、OPC、星伴、QuantAgent 的接入元数据。
- `GET /api/v1/auth/sessions` 返回当前账号所有会话。
- `POST /api/v1/auth/logout` 撤销当前会话。
- `DELETE /api/v1/auth/sessions/{session_id}` 撤销指定设备/应用会话。
- 官网 `/billing` 继续作为个人钱包、充值、订阅、消费账单、权益查询入口。
- 各应用按 `GET /billing/me/portal` 和 usage `reserve -> commit/release` 接入计费。

第一阶段暂不做：

- 企业 SAML / 企业 IdP。
- 组织钱包和组织空间 owner。
- 复杂 OAuth consent 页面。
- Refresh token 轮换。
- 跨端推送强制退出。
- 企业管理员、成员邀请、席位分配。

这些放入第二阶段。

## 3. 第一阶段服务边界

```text
reeftotem.ai
  官网、下载中心、账户钱包、充值、订单、消费账单

/api/v1/auth/*
  统一账号中心 API

/api/v1/billing/*
  Billing Core API

opc.reeftotem.ai
  OPC Web App，第一阶段按个人账号接入

Xingban Assistant
  桌面端，第一阶段通过账号 token 读取权益和钱包

QuantAgent
  Web/Desktop/CLI 预留同一账号协议，第一阶段按个人账号接入
```

生产域名上建议最终拆出 `accounts.reeftotem.ai`。当前仓库第一阶段先以 `/api/v1/auth/*` 固化 API 契约，避免在官网里私自复制登录体系。

## 4. 数据模型

### 4.1 用户

`users` 仍是身份主表：

- `id`：稳定账号 ID，所有应用使用这个 ID。
- `email`：登录名，可变，不作为跨系统主键。
- `full_name`
- `role`
- `is_active`
- `last_login`

### 4.2 会话

新增 `account_sessions`：

- `id`：会话 ID，对应 JWT `sid`。
- `user_id`
- `client_id`：`website`, `opc`, `xingban`, `quantagent`。
- `device_label`
- `user_agent`
- `ip_address`
- `status`：`active`, `revoked`, `expired`。
- `created_at`
- `last_seen_at`
- `expires_at`
- `revoked_at`

会话状态用于：

- 当前设备退出。
- 指定设备撤销。
- 后台风险排查。
- 多应用登录状态对齐。

### 4.3 Token claims

第一阶段 access token claims：

```json
{
  "sub": "user_id",
  "sid": "account_session_id",
  "client_id": "website",
  "token_use": "access",
  "account_version": 1,
  "exp": 1770000000
}
```

约束：

- `sub` 是用户身份。
- `sid` 是会话可撤销边界。
- `client_id` 是应用来源。
- `account_version` 第一阶段固定为 1，后续用于密码变更、MFA 变更、封禁、权限变更后的缓存失效。
- 各应用不得把官网 token 直接转交给另一个应用长期使用。

## 5. 登录工作流

### 5.1 官网账户钱包

```text
用户访问 /billing
  -> 未登录：调用 /auth/login
  -> 后端创建 account_sessions
  -> 返回 access_token + session_id + applications
  -> 官网读取 /auth/me
  -> 官网读取 /billing/me/portal
  -> 展示钱包、订阅、订单、账本、权益
```

第一阶段官网当前使用 bearer token。生产环境建议逐步迁移到 HttpOnly Cookie 或 BFF session，减少 token 暴露面。

### 5.2 从官网进入 OPC

```text
用户点击进入 OPC
  -> OPC 检查自身 session
  -> 没有 session 时跳转 Account Center
  -> Account Center 如果已有有效账号会话，直接签发 OPC 会话
  -> OPC 读取 /auth/me
  -> OPC 读取 /billing/me/entitlements
  -> OPC 根据 opc entitlement 或钱包余额放行
```

第一阶段 OPC 按 `owner_type=user` 读取权益。第二阶段企业空间改为 `owner_type=organization`。

### 5.3 星伴 Assistant 桌面端

```text
星伴点击登录
  -> 打开系统浏览器登录 Account Center
  -> 登录成功后通过 deep link 或设备码返回桌面端
  -> 桌面端把凭证存 macOS Keychain
  -> 启动时读取 /auth/me
  -> 读取 /billing/me/portal
  -> 云模型任务前 reserve
  -> 成功 commit，失败 release
```

第一阶段可以先用 bearer token 打通开发链路；正式桌面版必须使用系统 Keychain，不得把长期凭证保存在普通文件。

### 5.4 QuantAgent

```text
QuantAgent 登录
  -> Web 版本走浏览器登录
  -> Desktop/CLI 走设备码或系统浏览器登录
  -> 读取 /auth/me
  -> 读取 quantagent entitlement
  -> 策略研究 / 回测 / 证据报告 / 告警任务前 reserve
  -> 成功 commit，失败 release
```

第一阶段不做机构账号和组织额度池。机构版在第二阶段迁移到组织 owner。

## 6. 计费一致性工作流

所有应用都遵循：

```text
登录态只证明用户是谁
  -> 权益必须问 Billing Core
  -> 高成本任务必须实时 reserve
  -> 任务成功 commit
  -> 任务失败 release
  -> 账本只由 Billing Core 写
```

缓存规则：

- 账号资料可以缓存 5-15 分钟。
- 只读 entitlement 可以缓存 1-5 分钟。
- 高成本任务不能靠缓存，必须实时 `reserve`。
- 扣费请求必须带 `idempotency_key`。
- 支付成功、退款、后台确认入账以后，以 Billing Core 的订单和账本为准。

## 7. 退出和设备管理

第一阶段 API：

- 当前应用退出：`POST /api/v1/auth/logout`
- 查看会话：`GET /api/v1/auth/sessions`
- 撤销指定会话：`DELETE /api/v1/auth/sessions/{session_id}`

规则：

- 被撤销的 `sid` 不能再通过 `get_current_user`。
- 老 token 如果没有 `sid`，视为 legacy token，只能等待过期；后续生产应逐步淘汰。
- 密码修改、账号停用、风险封禁时，第二阶段要批量撤销该用户所有会话。

## 8. 应用接入参考

每个应用有单独接入文档：

- OPC：`docs/integrations/opc_account_center_phase1.md`
- 星伴 Assistant：`docs/integrations/xingban_account_center_phase1.md`
- QuantAgent：`docs/integrations/quantagent_account_center_phase1.md`

## 9. 第二阶段边界

第二阶段再做：

- `organizations`
- `organization_members`
- `organization_wallets`
- 企业 SAML / OIDC Federation
- 企业管理员邀请成员
- 席位分配
- 组织级 Billing owner
- 企业合同和发票
- 全端强制退出和 refresh token 轮换

第二阶段不应推翻第一阶段。它应该把第一阶段的 `owner_type=user` 扩展为 `owner_type=organization`，同时继续复用 Account Center 和 Billing Core。
