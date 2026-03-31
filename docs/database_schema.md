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
