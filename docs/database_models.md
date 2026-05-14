# 数据库模型设计 (Database Models)

基于 Python SQLAlchemy 的 ORM 模型设计。

## 1. User (管理员/用户)
统一账号中心的身份主表，用于官网、后台、OPC、星伴 Assistant、QuantAgent 登录和权限管理。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | 用户唯一标识 |
| `email` | String | Unique, Index | 登录邮箱 |
| `hashed_password` | String | Not Null | 加密后的密码 |
| `full_name` | String | Nullable | 真实姓名 |
| `role` | Enum | Default: 'user' | 角色: `super_admin`, `admin`, `editor` |
| `is_active` | Boolean | Default: True | 账户状态 |
| `created_at` | DateTime | Default: Now | 创建时间 |
| `last_login` | DateTime | Nullable | 最后登录时间 |

## 1.1 AccountSession (账号会话)
用于第一阶段统一账号中心的会话、设备、应用登录态管理。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | 会话 ID，对应 JWT `sid` |
| `user_id` | UUID | ForeignKey('users.id'), Index | 所属账号 |
| `client_id` | String | Index | `website`, `opc`, `xingban`, `quantagent` |
| `device_label` | String | Nullable | 设备或应用标识 |
| `user_agent` | String | Nullable | 登录设备 UA |
| `ip_address` | String | Nullable | 登录 IP |
| `status` | Enum | Default: `active` | `active`, `revoked`, `expired` |
| `created_at` | DateTime | Default: Now | 创建时间 |
| `last_seen_at` | DateTime | Default: Now | 最近使用时间 |
| `expires_at` | DateTime | Not Null | 过期时间 |
| `revoked_at` | DateTime | Nullable | 撤销时间 |

## 2. SiteConfig (系统配置)
单例表，存储全站通用配置。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key | 固定为 1 |
| `site_name` | String | Default: 'ReefTotem' | 网站名称 |
| `seo_title` | String | Nullable | SEO 标题 |
| `seo_keywords` | String | Nullable | SEO 关键词 |
| `seo_description` | String | Nullable | SEO 描述 |
| `logo_url` | String | Nullable | Logo 图片地址 |
| `favicon_url` | String | Nullable | Favicon 地址 |
| `contact_email` | String | Nullable | 联系邮箱 |
| `copyright_text` | String | Nullable | 版权文案 |
| `updated_at` | DateTime | OnUpdate: Now | 最后更新时间 |

## 3. Banner (首页轮播)
首页 Hero 区域的展示内容。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | |
| `title` | String | Not Null | 主标题 |
| `subtitle` | String | Nullable | 副标题 |
| `cta_text` | String | Nullable | 按钮文案 |
| `cta_link` | String | Nullable | 按钮链接 |
| `bg_image_url` | String | Nullable | 背景图 URL |
| `bg_video_url` | String | Nullable | 背景视频 URL |
| `is_active` | Boolean | Default: True | 是否启用 |
| `sort_order` | Integer | Default: 0 | 排序权重 |

## 4. Product (产品线)
核心产品定义 (如 ReefTotem, OpenClaw)。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | |
| `slug` | String | Unique, Index | URL 标识 (e.g., 'reeftotem') |
| `name` | String | Not Null | 产品名称 |
| `short_desc` | String | Nullable | 简短描述 |
| `full_desc` | Text | Nullable | 详细介绍 (Markdown/HTML) |
| `icon_url` | String | Nullable | 图标 URL |
| `cover_image_url` | String | Nullable | 封面图 URL |
| `features` | JSON | Nullable | 特性列表 `['Feature 1', 'Feature 2']` |
| `docs_url` | String | Nullable | 文档链接 (外部) |
| `docs_content` | Text | Nullable | 文档内容 (Markdown) |
| `is_published` | Boolean | Default: True | 是否发布 |
| `sort_order` | Integer | Default: 0 | 排序 |

## 5. DownloadItem (下载项)
具体的安装包版本。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | |
| `product_id` | UUID | ForeignKey('product.id') | 关联产品 |
| `version` | String | Not Null | 版本号 (e.g., '1.0.2') |
| `os_type` | Enum | Not Null | `windows`, `macos`, `linux`, `ios`, `android` |
| `arch` | String | Nullable | 架构 (e.g., 'x64', 'arm64') |
| `package_url` | String | Not Null | 下载链接 |
| `file_size` | Integer | Nullable | 文件大小 (Bytes) |
| `changelog` | Text | Nullable | 更新日志 |
| `download_count` | Integer | Default: 0 | 下载次数 |
| `is_latest` | Boolean | Default: False | 是否为该平台最新版 |
| `release_date` | DateTime | Default: Now | 发布日期 |

## 6. MediaFile (媒体库)
统一管理上传的文件。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | |
| `filename` | String | Not Null | 原始文件名 |
| `storage_path` | String | Not Null | 存储路径/S3 Key |
| `public_url` | String | Not Null | 访问 URL |
| `mime_type` | String | Not Null | 文件类型 |
| `size` | Integer | Not Null | 文件大小 |
| `uploaded_by` | UUID | ForeignKey('user.id') | 上传者 |
| `created_at` | DateTime | Default: Now | 上传时间 |

## 7. ContactMessage (联系留言)
存储用户提交的表单。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | |
| `name` | String | Not Null | 姓名 |
| `email` | String | Not Null | 邮箱 |
| `subject` | String | Nullable | 主题 |
| `message` | Text | Not Null | 内容 |
| `ip_address` | String | Nullable | 来源 IP |
| `is_read` | Boolean | Default: False | 是否已读 |
| `created_at` | DateTime | Default: Now | 提交时间 |

## 8. BillingProduct (计费产品)
公司级计费产品定义，不等同于官网展示产品。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | 计费产品 ID |
| `code` | String | Unique, Index | `opc`, `xingban`, `quantagent` |
| `name` | String | Not Null | 产品名称 |
| `description` | String | Nullable | 计费说明 |
| `is_active` | Boolean | Default: True | 是否启用 |
| `created_at` | DateTime | Default: Now | 创建时间 |
| `updated_at` | DateTime | OnUpdate: Now | 更新时间 |

## 9. BillingPlan (套餐)
套餐和价格版本。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | 套餐 ID |
| `product_code` | String | ForeignKey | 所属计费产品 |
| `code` | String | Unique, Index | 套餐编码 |
| `name` | String | Not Null | 套餐名称 |
| `cycle` | Enum | Not Null | `free`, `month`, `year`, `usage`, `custom` |
| `currency` | String | Default: CNY | 币种 |
| `price_cents` | Integer | Not Null | 价格，单位为分 |
| `included_credit_cents` | Integer | Default: 0 | 每周期赠送 RFT Credits，单位为分 |
| `seat_limit` | Integer | Default: 1 | 席位数量 |
| `features` | JSON | Nullable | 权益列表 |
| `is_public` | Boolean | Default: True | 是否公开展示 |
| `is_active` | Boolean | Default: True | 是否启用 |

## 10. CreditWallet / CreditLedgerEntry (额度钱包与不可变账本)
RFT Credits 不直接存在产品系统里，必须经由钱包和账本。

| 表 | 关键字段 | 说明 |
| :--- | :--- | :--- |
| `credit_wallets` | `owner_type`, `owner_id`, `balance_cents`, `reserved_cents` | 用户、团队或企业的钱包余额 |
| `credit_ledger_entries` | `wallet_id`, `direction`, `reason`, `amount_cents`, `balance_after_cents`, `idempotency_key` | 充值、扣减、退款、过期、调整流水 |
| `usage_reservations` | `owner_type`, `owner_id`, `wallet_id`, `product_code`, `usage_key`, `amount_cents`, `status`, `idempotency_key` | 模型调用、自动化任务、回测等高成本任务的冻结额度 |

规则：

*   余额只能通过 ledger 变化。
*   支付回调必须使用 `idempotency_key` 防重复入账。
*   高成本任务先写 `usage_reservations` 并增加 `reserved_cents`，成功后写 debit ledger，失败后写 release ledger。
*   退款、撤销、过期只能写反向流水，不能删除原始流水。

## 11. PaymentOrder / BillingSubscription (订单与订阅)

| 表 | 关键字段 | 说明 |
| :--- | :--- | :--- |
| `payment_orders` | `order_no`, `provider`, `order_type`, `status`, `amount_cents`, `credit_amount_cents` | 一次性购买、充值、人工调整订单 |
| `billing_subscriptions` | `owner_type`, `owner_id`, `product_code`, `plan_code`, `status`, `provider`, `current_period_end` | 产品订阅状态 |

支付通道是适配器，不是业务源头。业务源头是订单、订阅和 ledger。
