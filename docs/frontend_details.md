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
*   基础配置：`baseURL = '/api/v1'`
*   请求拦截器：账户钱包第一阶段自动注入 `Authorization: Bearer <customer_token>`。
*   响应拦截器：处理全局错误提示。

### Admin Axios (`admin/src/api/request.ts`)
*   基础配置：`baseURL = '/api/v1'`
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

统一账号中心第一阶段新增账户上下文：

*   官网 `/billing` 未登录时只展示计费体系说明、登录入口和软件接入边界。
*   官网 `/billing` 登录后读取 `/api/v1/auth/me` 和 `/api/v1/billing/me/portal`，再展示钱包、订单、账本、权益、充值和应用入口。
*   后端登录响应包含 `session_id`、`account_id` 和可接入应用列表。
*   OPC、星伴 Assistant、QuantAgent 不直接复用官网 token 作为长期登录态，应分别按 `docs/integrations/*_account_center_phase1.md` 接入。

## 4. 关键功能实现逻辑

### 4.1 下载中心
当前官网发布版以真实静态 release 信息为准：星伴 macOS 安装包可下载，OPC 是线上控制台，QuantAgent 完成后再开放。

后台 `下载管理` 已连接 `/api/v1/downloads`，但前台下载页尚未完全改为 API 驱动。下一阶段如果要把后台下载管理变成前台唯一数据源，应补齐：

1.  前端读取 `/api/v1/downloads`。
2.  按产品、平台、可见状态和 `is_latest` 过滤。
3.  下载点击回写 `/api/v1/downloads/{id}/count`。
4.  后台保存后能在官网 `/downloads` 直接生效。

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

### 4.4 计费中心后台

后台 `仪表盘` 和 `BillingCenterView` 通过 `useBillingStore` 调用 `/api/v1/billing/admin-dashboard`。仪表盘不得使用本地假访问量、假用户或假增长率；没有真实数据时显示 0、空状态或数据质量提示。

页面分区：

*   KPI：近 30 天收入、钱包余额、活跃订阅、活跃用户。
*   图表：收入趋势、产品收入结构、支付通道、订单状态、订阅状态。
*   报表：收入日报/月报、余额负债、用户生命周期、订阅健康。
*   用户画像：按生命周期和风险状态管理用户，展示余额、累计付费、订阅数、订单数和运营备注。

图表第一期使用 SVG/CSS 实现，不新增 ECharts/Recharts 依赖。后续如果需要复杂筛选、导出或大屏，可再引入专门图表库。

### 4.5 Admin CMS 边界

`内容管理`、`产品管理`、`下载管理` 当前是后台 API 数据池，不等于已经完整控制官网前台。后台 UI 必须标注“前台待接”，直到官网首页、产品页、下载页实际改成读取这些 API。

## 5. UI/UX 规范
*   **字体**: 系统默认字体栈 (San Francisco, Inter, etc.)。
*   **主题**: 强制浅色模式 (Light Mode)，遵循 Apple Design 规范。
*   **交互**: 悬停微交互，页面切换过渡动画 (Framer Motion)。
*   **响应式**: Mobile First，适配 Desktop, Tablet, Mobile。
