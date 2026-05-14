# API 接口规范 (API Specification)

所有 API 均以 `/api/v1` 为前缀。
请求格式: `application/json`
响应格式: `application/json`

## 通用响应结构
```json
{
  "code": 200,          // 业务状态码 (200: 成功, 4xx: 客户端错误, 5xx: 服务端错误)
  "message": "success", // 提示信息
  "data": { ... }       // 业务数据
}
```

## 1. 认证模块 (Auth)

### 登录
*   **POST** `/api/v1/auth/login`
*   **Body**: `username` (email), `password`, optional `client_id`
*   **Response**: `access_token`, `token_type`, `session_id`, `account_id`, `expires_in`, `applications`
*   **说明**: 第一阶段统一账号中心入口。登录成功会创建 `account_sessions`，JWT 包含 `sid`, `client_id`, `token_use`, `account_version`。

### 获取当前账号上下文
*   **GET** `/api/v1/auth/me`
*   **Headers**: `Authorization: Bearer <token>`
*   **Response**: 当前账号、当前会话、可接入应用、默认 Billing owner、一致性契约。

### SSO 应用入口元数据
*   **GET** `/api/v1/auth/sso/applications`
*   **Response**: 官网账户钱包、OPC、星伴 Assistant、QuantAgent 的 `client_id`、入口地址、登录方式、token 存储建议和 entitlement 产品码。

### 会话管理
*   **GET** `/api/v1/auth/sessions`
*   **Auth**: User
*   **Response**: 当前账号的会话/设备列表。

*   **POST** `/api/v1/auth/logout`
*   **Auth**: User
*   **用途**: 撤销当前 `sid` 会话。

*   **DELETE** `/api/v1/auth/sessions/{session_id}`
*   **Auth**: User
*   **用途**: 撤销指定设备或应用会话。

### 刷新 Token (第二阶段)
*   **POST** `/api/v1/auth/refresh`
*   **状态**: 第一阶段不落地 refresh token 轮换；第二阶段和企业设备管理一起补。

## 2. 公共接口 (Public) - 无需认证

### 获取站点配置
*   **GET** `/api/v1/public/config`
*   **Response**: SiteConfig Object (Logo, Footer info)

### 获取首页数据
*   **GET** `/api/v1/public/home`
*   **Response**: { banners: [], stats: {} }

### 获取产品列表
*   **GET** `/api/v1/public/products`
*   **Response**: List[Product]

### 获取产品详情
*   **GET** `/api/v1/public/products/{slug}`

### 获取下载列表
*   **GET** `/api/v1/public/downloads`
*   **Query**: `product_id` (optional), `os_type` (optional)
*   **Response**: List[DownloadItem]

### 记录下载 (计数)
*   **POST** `/api/v1/public/downloads/{id}/count`

### 提交联系表单
*   **POST** `/api/v1/public/contact`
*   **Body**: `name`, `email`, `subject`, `message`

## 3. 管理接口 (Admin) - 需要 Admin 权限

### 仪表盘数据
*   **GET** `/api/v1/admin/stats/dashboard`
*   **Response**: { visits, downloads, messages_count, ... }

### 站点配置管理
*   **GET** `/api/v1/admin/config`
*   **PUT** `/api/v1/admin/config`

### 产品管理
*   **GET** `/api/v1/admin/products`
*   **POST** `/api/v1/admin/products`
*   **PUT** `/api/v1/admin/products/{id}`
*   **DELETE** `/api/v1/admin/products/{id}`

### 下载项管理
*   **GET** `/api/v1/admin/downloads`
*   **POST** `/api/v1/admin/downloads`
*   **PUT** `/api/v1/admin/downloads/{id}`
*   **DELETE** `/api/v1/admin/downloads/{id}`

### 媒体库 (文件上传)
*   **POST** `/api/v1/admin/upload`
*   **Body**: `file` (Multipart/form-data)
*   **Response**: { url: "...", id: "..." }

### 留言管理
*   **GET** `/api/v1/admin/messages`
*   **PUT** `/api/v1/admin/messages/{id}/read` (标记为已读)

### 用户管理
*   **GET** `/api/v1/admin/users`
*   **POST** `/api/v1/admin/users`
*   **PUT** `/api/v1/admin/users/{id}`
*   **DELETE** `/api/v1/admin/users/{id}`

## 4. 计费接口 (Billing)

计费接口服务 OPC、星伴 Assistant 和 QuantAgent。支付通道不能写死在产品系统里，产品系统只读取 entitlement 和上报 usage。

### 支付通道路由
*   **GET** `/api/v1/billing/payment-routes`
*   **Response**: 国内/海外推荐支付通道、能力和限制。

### 公开套餐
*   **GET** `/api/v1/billing/plans`
*   **Query**: `product_code` optional
*   **Response**: List[BillingPlan]

### 官网账户钱包
*   **POST** `/api/v1/billing/checkout`
*   **Auth**: User
*   **Body**:
    *   `order_type`: `subscription` 或 `top_up`
    *   `provider`: `manual` / `wechat_pay` / `alipay` / `stripe` / `bank_transfer`
    *   `plan_code`: 订阅订单必填
    *   `amount_cents`, `credit_amount_cents`: 充值订单使用
    *   `meta_data`: optional
*   **Response**: `{ order, payment_action }`

*   **GET** `/api/v1/billing/me/portal`
*   **Auth**: User
*   **Response**: 当前用户的钱包、产品权益、订阅、最近订单、最近账本。

*   **GET** `/api/v1/billing/me/orders`
*   **GET** `/api/v1/billing/me/ledger`
*   **GET** `/api/v1/billing/me/subscriptions`
*   **GET** `/api/v1/billing/me/entitlements`
*   **Auth**: User

*   **POST** `/api/v1/billing/me/orders/{order_no}/mock-pay`
*   **Auth**: User
*   **用途**: 仅用于 `manual` 开发/手动通道订单的模拟支付确认；生产环境由支付回调或后台确认替代。

### 软件用量扣费
*   **POST** `/api/v1/billing/me/usage/reserve`
*   **POST** `/api/v1/billing/me/usage/commit`
*   **POST** `/api/v1/billing/me/usage/release`
*   **Auth**: User
*   **用途**: 星伴等用户侧软件在高成本任务前冻结额度，任务成功后扣费，失败后释放。

*   **POST** `/api/v1/billing/usage/reserve`
*   **POST** `/api/v1/billing/usage/commit`
*   **POST** `/api/v1/billing/usage/release`
*   **Auth**: Admin
*   **用途**: OPC、QuantAgent 或后台服务为指定 owner 执行用量冻结、扣费和释放。

### 管理后台计费总览
*   **GET** `/api/v1/billing/admin-dashboard`
*   **Auth**: Admin
*   **Response**:
    *   `metrics`: 近 30 天收入、钱包余额、活跃订阅、活跃用户。
    *   `revenue_series`: 近 6 个月收入趋势。
    *   `order_status_breakdown`: 订单状态分布。
    *   `product_revenue`: 产品收入结构。
    *   `provider_mix`: 支付通道结构。
    *   `subscription_status`: 订阅状态分布。
    *   `user_segments`: 用户生命周期分层。
    *   `user_profiles`: 用户画像卡片，包含账号状态、风险等级、余额、订阅、累计付费和运营备注。
    *   `reports`: 收入、余额负债、用户生命周期、订阅健康报表入口。
    *   `recent_orders`: 最近订单。
    *   `data_quality`: 数据缺口提示。

### 创建计费产品
*   **POST** `/api/v1/billing/products`
*   **Auth**: Admin
*   **Body**: `code`, `name`, `description`, `is_active`

### 创建/更新套餐
*   **POST** `/api/v1/billing/plans`
*   **PUT** `/api/v1/billing/plans/{plan_code}`
*   **Auth**: Admin

### 钱包与账本
*   **GET** `/api/v1/billing/wallets/{owner_type}/{owner_id}`
*   **GET** `/api/v1/billing/wallets/{wallet_id}/ledger`
*   **Auth**: Admin

### 管理员确认入账
*   **POST** `/api/v1/billing/orders/{order_no}/mark-paid`
*   **Auth**: Admin
*   **用途**: 对公转账、手动收款、支付回调未上线前的人工确认入账。会写入钱包账本，并让订阅权益生效。

### 待接真实支付回调
*   **POST** `/api/v1/billing/webhooks/stripe`
*   **POST** `/api/v1/billing/webhooks/wechat`
*   **POST** `/api/v1/billing/webhooks/alipay`
