# ReefTotem 全栈重构架构总览

## 1. 项目愿景
构建一个高性能、易维护、数据驱动的现代化官网与后台管理系统。实现内容动态化管理，前后端分离，并确保系统安全与可扩展性。

## 2. 技术栈选型

### 前端 (Frontend)
*   **核心框架**: React 18 + TypeScript + Vite
*   **UI 框架**: Tailwind CSS + Shadcn/UI (极简 Apple 风格)
*   **状态管理**: Zustand (全局状态) + TanStack Query (服务端状态/缓存)
*   **路由管理**: React Router v6
*   **HTTP 客户端**: Axios (封装拦截器，处理 JWT)
*   **构建工具**: Vite

### 后端 (Backend) - **Python**
*   **Web 框架**: **FastAPI** (高性能，自动生成 OpenAPI 文档，类型安全)
*   **语言版本**: Python 3.10+
*   **ORM**: **SQLAlchemy** (配合 Pydantic 进行数据验证)
*   **数据库**: PostgreSQL (生产环境) / SQLite (开发环境)
*   **认证机制**: 第一阶段统一账号中心，OAuth2 Password Bearer + JWT + `account_sessions`；后续升级 OIDC/PKCE 和企业 SAML。
*   **任务队列**: Celery + Redis (可选，用于邮件发送或耗时任务)

### 部署与运维 (DevOps)
*   **容器化**: Docker + Docker Compose
*   **反向代理**: Nginx
*   **CI/CD**: GitHub Actions (规划中)

## 3. 系统模块划分

### 3.1 客户端 (Client / Public)
面向普通访问者，追求极致性能与 SEO。
*   **首页 (Home)**: 动态 Banner，特性展示，动态数据统计。
*   **产品中心 (Products)**: 展示 ReefTotem, OpenClaw, ReefQuant 等产品详情。
*   **下载中心 (Downloads)**: 自动识别 OS，展示最新版本，历史版本列表。
*   **关于我们 (About)**: 团队介绍，发展历程。
*   **联系我们 (Contact)**: 留言表单（对接后端邮件服务）。

### 3.2 管理端 (Admin Console)
面向内部管理员，追求功能完备与操作效率。独立部署或独立路由。
*   **认证模块**: 登录，个人信息修改，密码重置。
*   **仪表盘 (Dashboard)**: 访问量统计，下载量趋势，新增用户。
*   **内容管理 (CMS)**:
    *   站点配置：Logo，SEO 标题，页脚文案。
    *   Banner 管理：首页轮播图/视频配置。
*   **产品管理**: 增删改查产品线（名称，图标，描述）。
*   **下载管理**: 版本发布，文件上传/外链，平台配置，灰度发布开关。
*   **用户管理**: 管理员账号管理，角色权限分配。
*   **图库管理 (Media)**: 统一管理上传的图片/文件。

### 3.3 后端服务 (API Server)
*   **Account Center / Auth Service**: 处理统一登录、账号上下文、应用入口元数据、会话/设备撤销和权限验证。OPC、星伴 Assistant、QuantAgent 不各自维护账号密码。
*   **Content Service**: 提供产品、下载、文案的 CRUD。
*   **File Service**: 处理文件上传（本地存储/S3），图片压缩。
*   **Stat Service**: 埋点数据收集与聚合。
*   **Billing Center**: 统一管理 OPC、星伴 Assistant、QuantAgent 的套餐、订单、支付通道、订阅权益、RFT Credits 钱包和不可变账本。支付通道采用适配器模式，国内优先微信支付/支付宝直连，海外保留 Stripe。

### 3.4 计费域 (Billing Center)
计费域不属于单一产品，必须作为公司级基础设施独立存在。

*   **Payment Routes**: 根据用户地区、签约主体和购买类型选择微信支付、支付宝、Stripe 或对公转账。
*   **Plan Catalog**: 维护星伴、OPC、QuantAgent 的月付、年付、企业合同和充值包。
*   **Entitlement Service**: 输出产品可用权限，不让产品系统直接判断支付状态。
*   **Credit Wallet**: 统一 RFT Credits 余额，按整数 `credit_cents` 记录。
*   **Ledger Service**: 所有充值、扣减、退款、过期和人工调整都写入不可变流水。
*   **Usage Metering**: 产品只上报用量事件，由 Pricing Engine 换算扣费。

### 3.5 统一账号中心 (Account Center)

统一账号中心是所有产品的身份源头。

*   **Account Identity**: `users.id` 是跨官网、后台、OPC、星伴、QuantAgent 的稳定账号 ID。
*   **Account Session**: `account_sessions` 记录每次登录、应用来源、设备、过期和撤销状态。
*   **Application Registry**: `GET /api/v1/auth/sso/applications` 输出官网账户钱包、OPC、星伴 Assistant、QuantAgent 的接入元数据。
*   **Account Context**: `GET /api/v1/auth/me` 输出当前账号、当前会话、可进入应用、Billing owner 和一致性契约。
*   **Session Revocation**: 当前设备退出和指定设备撤销必须进入 Account Center，不由各应用单独处理。
*   **Billing Link**: 账号中心只证明身份；产品是否可用、钱包余额和用量扣费必须读取 Billing Center。

第一阶段只处理个人账号。企业组织、SAML、组织钱包和席位分配放到第二阶段。

## 4. 目录结构规划

```
reeftotem/
├── client/                 # 前台 React 项目
│   ├── src/
│   │   ├── api/            # API 封装
│   │   ├── components/     # 公共组件
│   │   ├── pages/          # 页面路由
│   │   └── types/          # TS 类型定义
├── admin/                  # 后台 React 项目 (可与 client 复用组件库)
│   ├── src/
│   │   ├── features/       # 业务功能模块
│   │   └── layouts/        # 后台布局
├── server/                 # Python FastAPI 项目
│   ├── app/
│   │   ├── api/            # 路由定义 (endpoints)
│   │   ├── core/           # 核心配置 (config, security)
│   │   ├── crud/           # 数据库操作
│   │   ├── models/         # SQLAlchemy 模型
│   │   ├── schemas/        # Pydantic 验证模型
│   │   └── main.py         # 入口文件
│   ├── pyproject.toml      # uv 管理的 Python 3.12 依赖
│   ├── uv.lock             # 锁定依赖版本
│   └── .venv/              # 服务器和本地统一使用的 Python 3.12 虚拟环境
├── docker-compose.yml      # 容器编排
└── README.md
```
