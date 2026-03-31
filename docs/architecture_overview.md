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
*   **认证机制**: OAuth2 with Password Bearer (JWT)
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
*   **Auth Service**: 处理登录，刷新 Token，权限验证。
*   **Content Service**: 提供产品、下载、文案的 CRUD。
*   **File Service**: 处理文件上传（本地存储/S3），图片压缩。
*   **Stat Service**: 埋点数据收集与聚合。

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
│   ├── alembic/            # 数据库迁移脚本
│   └── requirements.txt
├── docker-compose.yml      # 容器编排
└── README.md
```
