# 数据库设计文档 (Database Schema)

基于 Prisma ORM 的数据模型设计。

```prisma
datasource db {
  provider = "sqlite" // 开发阶段使用 SQLite，生产可切换 PostgreSQL
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 用户表 (管理员)
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // BCrypt hash
  name      String?
  role      String   @default("user") // "admin", "super_admin", "user"
  status    String   @default("active") // "active", "inactive"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 站点全局配置 (单例表)
model SiteConfig {
  id            Int      @id @default(1)
  // Banner
  bannerTitle   String
  bannerSubtitle String
  bannerCtaText String
  bannerCtaLink String
  bannerBgUrl   String?
  // Logo
  logoUrl       String?
  logoAlt       String?
  // Footer
  contactEmail  String
  copyright     String
  
  updatedAt     DateTime @updatedAt
}

// 产品表
model Product {
  id          String   @id @default(uuid())
  key         String   @unique // e.g. "reeftotem", "openclaw"
  title       String
  subtitle    String?
  description String
  iconUrl     String?
  imageUrl    String?
  features    String   // JSON string: ["feature1", "feature2"]
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  downloads   DownloadItem[]
}

// 下载项表
model DownloadItem {
  id            String   @id @default(uuid())
  name          String   // e.g. "ReefTotem for Windows"
  version       String
  platform      String   // Display name: "Windows x64"
  os            String   // Enum-like: "windows", "mac", "linux", "ios", "android"
  url           String   // Download link
  size          String?
  description   String?
  downloadCount Int      @default(0)
  releaseDate   DateTime @default(now())
  isVisible     Boolean  @default(true)
  
  // 关联产品
  productKey    String?
  product       Product? @relation(fields: [productKey], references: [key])
  
  // 如果不关联特定产品，属于 "other"
  category      String?  // Legacy field support: "reeftotem", "openclaw", "quant"

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// 访问统计 (简单版)
model VisitStat {
  id        String   @id @default(uuid())
  date      DateTime @default(now()) // 记录日期 (YYYY-MM-DD)
  count     Int      @default(0)
  
  @@unique([date])
}

// 媒体资源 (图库)
model Media {
  id        String   @id @default(uuid())
  filename  String
  url       String
  mimeType  String
  size      Int
  createdAt DateTime @default(now())
}
```

## Billing Center Schema Extension

当前后端以 SQLAlchemy 模型为准，计费域已经在 `server/app/models/billing.py` 落地。旧 Prisma 片段只保留为早期结构草图，后续迁移文档应以 SQLAlchemy/Alembic 为准。

计费域新增表：

```text
billing_products
billing_plans
credit_wallets
credit_ledger_entries
payment_orders
billing_subscriptions
usage_reservations
```

设计约束：

* `payment_orders` 记录外部支付通道订单，支持 `stripe`, `wechat_pay`, `alipay`, `bank_transfer`, `manual`。
* `credit_wallets` 记录用户、团队或企业的 RFT Credits 余额。
* `credit_ledger_entries` 是不可变流水，所有充值、扣减、退款、过期和人工调整都必须写入该表。
* `usage_reservations` 记录高成本任务的冻结额度，任务成功后转扣费，失败、取消或超时后释放。
* 产品系统不能直接改余额，只能通过 Billing Center 的 usage reserve/commit/release 接口。
* Stripe、微信支付、支付宝都只是 Payment Adapter，不是业务源头。

## Account Center Schema Extension

第一阶段统一账号中心新增表：

```text
account_sessions
```

设计约束：

* `users` 是唯一账号身份源头，OPC、星伴 Assistant、QuantAgent 不再各自维护用户密码。
* `account_sessions` 是登录会话源头，JWT `sid` 必须能映射到一条 active session。
* 应用可以拥有自己的短期 session，但不能把官网 token 复制成长期登录态。
* 被撤销或过期的 session 不能继续访问需要登录的 API。
* 企业组织、SAML、组织钱包放到第二阶段，不混入第一阶段个人账号链路。
