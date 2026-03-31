# ReefTotem 官网重构方案

## 1. 概述
本项目旨在将 ReefTotem 官网从单一的静态 React 应用重构为包含前端（客户端）、后台管理端（Admin）和后端服务（API + 数据库）的全栈应用。

### 核心目标
1.  **架构分离**：将前台官网与后台管理系统彻底分离，Admin 作为独立模块或项目运行。
2.  **数据驱动**：所有前端展示内容（Banner、产品信息、下载项、团队介绍等）均通过 API 从数据库获取，不再硬编码。
3.  **安全管理**：实现标准的后台登录/注册功能，配合 JWT 认证保护管理接口。
4.  **现代化部署**：前后端分离部署，支持 Docker 化。

## 2. 技术栈选型

### 前端 (Client & Admin)
*   **框架**: React 18 + Vite
*   **语言**: TypeScript
*   **UI 库**: Tailwind CSS + Shadcn/UI (或当前自定义组件)
*   **状态管理**: Zustand
*   **路由**: React Router v6
*   **数据请求**: Axios / React Query

### 后端 (Server)
*   **运行时**: Node.js
*   **框架**: NestJS (推荐，企业级) 或 Express (轻量级)
    *   *本方案采用 Express + Prisma 以快速开发且保持类型安全。*
*   **数据库**: PostgreSQL (生产环境) / SQLite (开发环境)
*   **ORM**: Prisma
*   **认证**: JSON Web Token (JWT) + BCrypt

## 3. 系统架构

```
reeftotem/
├── apps/
│   ├── client/       # 原官网前端 (面向公众)
│   └── admin/        # 新建后台管理前端 (面向管理员)
├── server/           # Node.js 后端 API 服务
├── shared/           # (可选) 前后端共享类型定义
└── docs/             # 项目文档
```

或者（简化版，当前目录结构调整）：
```
reeftotem/
├── client/           # 移入原 src 代码，剔除 admin
├── admin/            # 新建 Vite 项目，复用原 admin 组件
├── server/           # 新建 Express 项目
└── package.json      # Root workspace config
```

## 4. 数据库设计 (Schema)

使用 Prisma Schema 定义数据模型。

### User (管理员)
*   `id`: UUID
*   `email`: String (Unique)
*   `password`: String (Hashed)
*   `name`: String
*   `role`: Enum (ADMIN, SUPER_ADMIN)
*   `createdAt`: DateTime

### SiteConfig (全局配置)
*   `id`: Int (Single row)
*   `bannerTitle`: String
*   `bannerSubtitle`: String
*   `bannerCtaText`: String
*   `bannerCtaLink`: String
*   `contactEmail`: String
*   `copyright`: String
*   `logoUrl`: String

### Product (产品)
*   `id`: UUID
*   `key`: String (Unique, e.g., 'reeftotem', 'openclaw')
*   `name`: String
*   `description`: String
*   `features`: JSON (Array of strings)
*   `iconUrl`: String
*   `sortOrder`: Int

### DownloadItem (下载项)
*   `id`: UUID
*   `name`: String
*   `version`: String
*   `platform`: String (e.g., 'Windows x64')
*   `os`: Enum (WINDOWS, MAC, LINUX, IOS, ANDROID)
*   `category`: String (Product Key)
*   `url`: String
*   `size`: String
*   `releaseDate`: DateTime
*   `downloadCount`: Int
*   `isVisible`: Boolean

### Media (图库/资源)
*   `id`: UUID
*   `filename`: String
*   `url`: String
*   `mimeType`: String
*   `uploadedAt`: DateTime

## 5. API 接口规划

### Auth
*   `POST /api/auth/login`: 登录获取 Token
*   `POST /api/auth/register`: 注册 (仅限 Super Admin 或初始化)
*   `GET /api/auth/me`: 获取当前用户信息

### Public (无需认证)
*   `GET /api/config`: 获取站点全局配置
*   `GET /api/products`: 获取产品列表
*   `GET /api/downloads`: 获取下载列表
*   `POST /api/downloads/:id/count`: 增加下载计数
*   `POST /api/contact`: 提交联系表单 (发送邮件/存库)

### Admin (需要 Bearer Token)
*   `PUT /api/config`: 更新站点配置
*   `POST/PUT/DELETE /api/products`: 管理产品
*   `POST/PUT/DELETE /api/downloads`: 管理下载项
*   `GET /api/stats`: 获取仪表盘数据
*   `POST /api/upload`: 上传文件到图库

## 6. 重构步骤 (Roadmap)

1.  **初始化后端**: 搭建 Express + Prisma 环境，定义 Schema，跑通数据库。
2.  **实现基础 API**: 完成 Auth 和 CRUD 接口。
3.  **拆分前端**:
    *   将原 `src` 移动到 `client` 目录，清理 Admin 相关路由和组件。
    *   初始化 `admin` 目录，迁移原 Admin 组件，对接真实登录接口。
4.  **对接数据**:
    *   Client 端替换 Zustand 静态数据为 API 请求。
    *   Admin 端替换 Zustand Store 为 React Query + Axios mutation。
5.  **图库功能**: 实现文件上传与管理。
6.  **部署与测试**: 联调所有功能。
