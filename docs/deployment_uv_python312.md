# ReefTotem 发布运行规范：uv + Python 3.12

更新日期：2026-05-15

## 1. 发布判断

当前代码可以先发布一个验证版，方便 OPC、星伴 Assistant、QuantAgent 接入统一账号中心和 Billing Core 做联调。

发布目标不是“最终商业收款完成”，而是先让这些能力在真实域名下可验证：

- 官网新版页面。
- 官网首页、产品体系页、下载中心读取 `/api/v1/products/` 和 `/api/v1/downloads/`，API 不可用时降级到静态目录。
- `/billing` 账户钱包。
- `/api/v1/auth/*` 统一账号中心第一阶段。
- `/api/v1/billing/*` 订单、钱包、权益、用量冻结/扣费/释放。
- 后台计费中心。

真实微信支付、支付宝、Stripe webhook 仍然是后续支付适配器工作。

## 2. 服务器 Python 约束

服务器后端必须使用：

```text
uv
server/.venv
Python 3.12
```

仓库已固化：

- `server/.python-version`
- `server/pyproject.toml`
- `server/uv.lock`

服务器不得再直接使用系统 Python 跑后端，也不要用全局 pip 安装依赖。

## 3. 后端部署命令

在服务器项目目录执行：

```bash
cd /opt/reeftotem/server
uv sync --frozen --python 3.12
.venv/bin/python --version
.venv/bin/python -m py_compile app/main.py
.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
```

如果需要初始化基础数据：

```bash
cd /opt/reeftotem/server
uv run python -m app.initial_data
```

如果只需要同步官网产品与下载目录：

```bash
cd /opt/reeftotem/server
.venv/bin/python -m app.catalog_data
```

## 4. systemd 示例

```ini
[Unit]
Description=ReefTotem FastAPI backend
After=network.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/opt/reeftotem/server
Environment=PYTHONUNBUFFERED=1
EnvironmentFile=-/opt/reeftotem/server/.env
ExecStart=/opt/reeftotem/server/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

更新后：

```bash
sudo systemctl daemon-reload
sudo systemctl restart reeftotem-api
sudo systemctl status reeftotem-api --no-pager
```

## 5. 前端发布命令

官网：

```bash
cd /opt/reeftotem/client
npm ci
npm run build
```

后台：

```bash
cd /opt/reeftotem/admin
npm ci
npm run build
```

Nginx 应把：

- `reeftotem.ai` 指向 `client/dist`
- `admin.reeftotem.ai` 指向 `admin/dist`
- `/api/` 反代到 `127.0.0.1:8000`

## 6. 发布后验证

发布后至少验证：

```bash
curl -I https://reeftotem.ai/
curl -I https://reeftotem.ai/billing
curl https://reeftotem.ai/api/v1/health
curl https://reeftotem.ai/api/v1/auth/sso/applications
curl https://reeftotem.ai/api/v1/billing/payment-routes
curl -I https://admin.reeftotem.ai/
curl https://admin.reeftotem.ai/api/v1/health
```

浏览器验证：

- 首页可打开。
- 下载中心可下载星伴 DMG。
- `/products` 不再展示旧 Hermes 产品目录。
- `/downloads` 展示后台下载 API 中的星伴安装包，并且点击下载会回写下载次数。
- `/billing` 可打开账户钱包。
- 登录后能读取 `/auth/me` 和 `/billing/me/portal`。
- 后台计费中心可打开。

## 7. 当前线上发布状态

更新时间：2026-05-15 02:24 CST

当前线上验证版已经发布到：

- DNS：`reeftotem.ai -> 43.160.233.128`
- DNS：`admin.reeftotem.ai -> 43.160.233.128`
- SSH：`ubuntu@43.160.233.128`
- 官网静态目录：`/var/www/reeftotem-site/current`
- 后台静态目录：`/var/www/reeftotem-admin/current`
- 后端目录：`/opt/reeftotem/server`
- 后端服务：`reeftotem-api`
- Python：`/opt/reeftotem/server/.venv/bin/python`，版本 `3.12.3`
- API 反代：`https://reeftotem.ai/api/ -> http://127.0.0.1:8000`
- 后台域名：`https://admin.reeftotem.ai/`
- 后台 API 反代：`https://admin.reeftotem.ai/api/ -> http://127.0.0.1:8000`
- 后台 TLS：Let’s Encrypt 证书已签发，证书到期日 `2026-08-12`

服务器 `.env` 必须保留并只允许受限访问，里面包含：

- `REEFTOTEM_ENV=production`
- `REEFTOTEM_ADMIN_EMAIL`
- `REEFTOTEM_ADMIN_PASSWORD`
- `SECRET_KEY`

初始后台凭据另存于服务器 `/opt/reeftotem/admin-initial-credentials.txt`，文件权限为 `600`，不要提交到仓库。

`admin.reeftotem.ai` 已在 GoDaddy 新增 A 记录并完成 TLS 签发。若个别本地网络仍短暂无法解析，优先检查本地 DNS 缓存；权威 DNS、Google DNS 和 Cloudflare DNS 已返回 `43.160.233.128`。
