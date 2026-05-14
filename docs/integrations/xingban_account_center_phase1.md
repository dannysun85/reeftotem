# 星伴 Assistant 接入统一账号中心第一阶段参考

更新日期：2026-05-15

## 1. 接入定位

星伴 Assistant 第一阶段是桌面端个人账号应用。

```text
client_id = "xingban"
product_code = "xingban"
surface = "desktop"
billing owner = user
credential storage = macOS Keychain
```

官网负责下载和账户钱包，星伴负责桌面体验和模型任务，不负责支付系统。

## 2. 登录流程

推荐正式流程：

```text
用户在星伴点击登录
  -> 星伴打开系统浏览器
  -> 用户在账号中心完成登录
  -> 账号中心通过 deep link reeftotem-xingban://auth 返回授权结果
  -> 星伴把凭证存入 macOS Keychain
  -> 星伴调用 /api/v1/auth/me
  -> 星伴调用 /api/v1/billing/me/portal
```

如果 deep link 暂未完成，可以用设备码作为过渡：

```text
星伴显示设备码
  -> 用户在官网输入设备码
  -> 星伴轮询登录结果
```

第一阶段后端已经提供账号上下文和应用元数据；deep link/device code 是星伴客户端侧后续实现点。

## 3. 启动校验

星伴启动时：

1. 从 Keychain 读取凭证。
2. 调用 `/api/v1/auth/me`。
3. 如果会话被撤销、过期或账号停用，清理本地凭证并要求重新登录。
4. 调用 `/api/v1/billing/me/portal`。
5. 检查 `xingban.can_access` 或钱包可用余额。

允许离线的范围：

- 本地 UI。
- 本地历史记录。
- 不产生云成本的本地功能。

必须联网校验的范围：

- 云模型调用。
- 同步。
- 付费能力。
- 高成本工具调用。

## 4. 用量扣费

星伴模型任务必须使用 reservation：

```text
POST /api/v1/billing/me/usage/reserve
  product_code = "xingban"
  usage_key = "assistant.model_tokens" | "assistant.voice_task" | "assistant.automation_run"
  amount_cents = 预估成本
  idempotency_key = local_task_id

任务成功：
POST /api/v1/billing/me/usage/commit
  amount_cents = 实际成本

任务失败/取消/超时：
POST /api/v1/billing/me/usage/release
```

如果实际成本低于预估，`commit` 可以只扣实际金额，剩余冻结额度释放。

## 5. 本地凭证安全

星伴不得：

- 把长期凭证写入普通 JSON 文件。
- 把 token 打进日志。
- 把官网 localStorage token 复制到桌面端。
- 在账号退出后保留云模型可用状态。

星伴必须：

- 使用 macOS Keychain。
- 明确当前登录账号。
- 支持退出当前账号。
- 支持会话撤销后自动重新登录。

## 6. 数据一致性

星伴可以缓存：

- 账号展示名：5-15 分钟。
- entitlement 展示状态：1-5 分钟。

星伴不能缓存：

- 钱包最终余额。
- 高成本任务扣费判断。
- 订阅是否已支付。

所有扣费以 Billing Core ledger 为准。

## 7. 第二阶段升级点

第二阶段可增加：

- 团队版星伴。
- 企业 Provider 配置。
- 企业组织钱包。
- 管理员统一下发策略。
- 设备管理和远程退出。

这些不能改变第一阶段原则：星伴只消费 Account Center 和 Billing Core，不自建支付和账号系统。
