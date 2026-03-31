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
*   **Body**: `username` (email), `password`
*   **Response**: `access_token`, `token_type`

### 获取当前用户信息
*   **GET** `/api/v1/auth/me`
*   **Headers**: `Authorization: Bearer <token>`
*   **Response**: User Object

### 刷新 Token (可选)
*   **POST** `/api/v1/auth/refresh`

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
