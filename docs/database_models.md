# 数据库模型设计 (Database Models)

基于 Python SQLAlchemy 的 ORM 模型设计。

## 1. User (管理员/用户)
用于后台登录和权限管理。

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
