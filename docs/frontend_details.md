# 前端实现细节 (Frontend Implementation)

## 1. 目录结构分离
我们将现有的单体 React 项目拆分为两个独立的应用，或在一个 Monorepo 中管理。

```
/
├── apps/
│   ├── client/ (前台官网)
│   └── admin/  (后台管理)
├── packages/
│   └── ui/     (共享组件库 - 可选)
```

## 2. API 客户端封装 (Axios)
所有 HTTP 请求通过封装的 Axios 实例发出。

### Client Axios (`client/src/api/request.ts`)
*   基础配置：`baseURL = '/api/v1/public'`
*   拦截器：处理全局错误提示。

### Admin Axios (`admin/src/api/request.ts`)
*   基础配置：`baseURL = '/api/v1/admin'`
*   请求拦截器：自动在 Header 中注入 `Authorization: Bearer <token>`。
*   响应拦截器：
    *   401 Unauthorized -> 自动跳转登录页或尝试刷新 Token。
    *   403 Forbidden -> 提示无权限。

## 3. 状态管理 (Zustand + React Query)

### 服务端状态 (Server State) - 使用 React Query
*   **优势**：自动缓存、后台自动更新、Loading/Error 状态管理。
*   **场景**：获取产品列表、获取下载记录、获取用户信息。
*   **示例**:
    ```typescript
    const { data: products, isLoading } = useQuery({
      queryKey: ['products'],
      queryFn: api.getProducts
    });
    ```

### 客户端状态 (Client State) - 使用 Zustand
*   **场景**：用户登录态 (AuthStore)、UI 状态 (SidebarOpen)、当前选中的主题。
*   **AuthStore**:
    *   `user`: UserInfo | null
    *   `token`: string | null
    *   `login(token)`: 存储 token 到 localStorage，设置 user。
    *   `logout()`: 清除 token，重置 user。

## 4. 关键功能实现逻辑

### 4.1 下载中心 (自动 OS 识别)
1.  **前端**: `useOS()` Hook 检测 `navigator.userAgent`。
2.  **API**: 调用 `/api/v1/public/downloads` 获取所有下载项。
3.  **渲染**:
    *   根据 `useOS` 返回的类型 (e.g., 'mac') 过滤 API 返回的数据。
    *   将匹配 OS 的最新版作为 "推荐下载"。
    *   其他版本放入 "更多版本" 折叠面板。

### 4.2 图片/文件上传
1.  **组件**: 使用 Dropzone 或 `<input type="file" />`。
2.  **上传**:
    *   前端构建 `FormData`，append('file', file)。
    *   调用 `POST /api/v1/admin/upload`。
    *   显示上传进度条 (Axios `onUploadProgress`)。
3.  **回显**: 后端返回 `url`，前端展示图片预览。

### 4.3 路由鉴权 (Admin)
使用 React Router 的 `RequireAuth` 高阶组件。
```tsx
<Route element={<RequireAuth />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/products" element={<ProductList />} />
</Route>
```
`RequireAuth` 逻辑：检查 AuthStore 中是否有 Token，无则 Redirect 到 `/login`。

## 5. UI/UX 规范
*   **字体**: 系统默认字体栈 (San Francisco, Inter, etc.)。
*   **主题**: 强制浅色模式 (Light Mode)，遵循 Apple Design 规范。
*   **交互**: 悬停微交互，页面切换过渡动画 (Framer Motion)。
*   **响应式**: Mobile First，适配 Desktop, Tablet, Mobile。
