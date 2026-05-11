import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  Database,
  Download,
  Lock,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
} from 'lucide-react';

const ASSISTANT_VERSION = '0.9.22';

const heroStats = [
  ['当前基线', ASSISTANT_VERSION],
  ['发布状态', '官网资料完成，公开下载待签名验证'],
  ['1.0 门槛', '签名、公证、更新回滚、新用户 smoke'],
];

const capabilities = [
  {
    icon: MessageSquareText,
    title: '用户只需要聊天',
    text: '提醒、记忆、资料整理、Workflow 和工具调用都从自然语言发起，普通用户不需要学习 Cron、MCP 或 DAG。',
  },
  {
    icon: BrainCircuit,
    title: '人格、情绪和长期记忆',
    text: '人物主题影响说话方式、system prompt、能力边界和长期记忆，让助手不是一次性问答窗口。',
  },
  {
    icon: Bot,
    title: 'Live2D 桌面常驻',
    text: '角色可以常驻桌面，以短气泡、主窗口和 Activity 记录配合工作，不把复杂后台暴露给用户。',
  },
  {
    icon: Activity,
    title: '可解释行动记录',
    text: '记忆写入、提醒创建、工具授权、失败恢复、撤销和 trace 都进入 Activity，便于复盘和恢复。',
  },
];

const closedLoop = [
  ['说出目标', '用户直接说“明天 9 点提醒我看日报”或“记住我不喜欢太正式的语气”。'],
  ['人物判断', '角色判断是否需要记忆、提醒、知识库、Workflow、Provider 或工具。'],
  ['请求授权', '高风险动作先解释原因、影响和恢复路径，再请求用户确认。'],
  ['执行回报', '执行结果回到 Chat，同时在 Activity 中留下可追踪、可撤销的记录。'],
];

const releaseMatrix = [
  ['macOS', 'Apple Silicon', 'DMG', '待 Developer ID 签名、公证、updater smoke'],
  ['macOS', 'Intel', 'DMG', '待 Developer ID 签名、公证、updater smoke'],
  ['Windows', 'x64', 'Setup', '待 Windows release smoke'],
  ['Linux', 'x64', 'AppImage', '待 Linux release smoke'],
];

const Assistant = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <section className="border-b border-border bg-white py-16">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              桌面 AI 伴侣
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Reeftotem Assistant
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              一个本地优先的 Live2D 桌面 AI 伴侣。她有长期记忆、人格主题、情绪反馈、日历提醒、知识库和可审计行动记录，目标是让用户只通过聊天就能让人物完成日常任务。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/downloads"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
              >
                查看下载状态
                <Download className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-white px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                申请试用沟通
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-lg border border-border bg-background shadow-apple"
          >
            <img
              src="/images/brand/assistant-visual.svg"
              alt="Reeftotem Assistant desktop AI companion product visual"
              className="aspect-[16/11] w-full object-cover"
            />
            <div className="grid border-t border-border bg-card sm:grid-cols-3">
              {heroStats.map(([label, value]) => (
                <div key={label} className="border-b border-border p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <div className="text-xs font-semibold text-muted-foreground">{label}</div>
                  <div className="mt-1 text-sm font-semibold leading-5 text-foreground">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              面向普通用户的能力闭环
            </h2>
            <p className="mt-4 text-muted-foreground leading-7">
              MCP、Cron、Workflow、A2A 和 Provider 都是底层能力。产品主路径不是让用户自己配置后台，而是让人物根据聊天目标自主选择能力、解释风险并执行。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <Icon className="mb-5 h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              不是后台配置页，而是人物自己做决策
            </h2>
            <p className="mt-4 text-muted-foreground leading-7">
              自动化和工具市场保留为诊断和权限层，普通用户入口收敛到 Chat、Activity、Memory 和 Settings 中最少必要的恢复操作。
            </p>
          </div>
          <div className="grid gap-4">
            {closedLoop.map(([title, text], index) => (
              <article key={title} className="grid gap-4 rounded-lg border border-border bg-background p-5 sm:grid-cols-[auto_1fr]">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-3">
          <article className="rounded-lg border border-border bg-card p-6">
            <Database className="mb-5 h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">本地优先</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              记忆、设置、审计和角色上下文优先保存在本机。外部模型、MiniMax 多模态能力或本地 Ollama 都通过 Provider 配置进入。
            </p>
          </article>
          <article className="rounded-lg border border-border bg-card p-6">
            <Workflow className="mb-5 h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">稳定模板优先</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Workflow 不猜复杂 DAG。当前以每日总结、翻译校对、代码审查等高置信模板为主，低置信目标会先追问。
            </p>
          </article>
          <article className="rounded-lg border border-border bg-card p-6">
            <ShieldCheck className="mb-5 h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">风险先解释</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              写文件、调用外部工具、生成媒体和敏感动作需要授权。失败时给出原因、替代路径、重试和撤销入口。
            </p>
          </article>
        </div>
      </section>

      <section className="border-y border-border bg-white py-20" id="release-plan">
        <div className="container mx-auto px-4">
          <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                下载与发布状态
              </h2>
              <p className="mt-4 text-muted-foreground leading-7">
                当前官网以 {ASSISTANT_VERSION} 作为推广资料和下载矩阵基线。公开稳定下载必须等待签名、公证、updater 安装/回滚和新用户空白状态 smoke 全部通过。
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-5">
              <div className="flex items-start gap-3">
                <Lock className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">公开下载暂不开放</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    未签名、未公证或未完成 updater smoke 的产物不会作为稳定版发布。需要试用或合作时请先通过联系入口沟通。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[0.8fr_0.8fr_0.7fr_1.7fr] border-b border-border bg-background px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <div>平台</div>
                <div>架构</div>
                <div>格式</div>
                <div>状态</div>
              </div>
              {releaseMatrix.map(([platform, arch, format, status]) => (
                <div
                  key={`${platform}-${arch}`}
                  className="grid grid-cols-[0.8fr_0.8fr_0.7fr_1.7fr] items-center border-b border-border px-5 py-4 text-sm last:border-b-0"
                >
                  <div className="font-semibold text-foreground">{platform}</div>
                  <div className="text-muted-foreground">{arch}</div>
                  <div className="text-muted-foreground">{format}</div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 rounded-lg border border-border bg-foreground p-8 text-background md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm text-background/70">
                <CalendarClock className="h-4 w-4" />
                适合先从个人提醒、知识整理和轻量办公协作试用
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                从一个自然语言任务开始验证，而不是先学习后台配置。
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-background/75">
                如果你的目标是个人桌面伴侣、企业内部助手或 AI 公司入口，可以先描述第一个要跑通的工作流和数据边界。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
              >
                联系试用
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/downloads"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/30 px-6 text-sm font-semibold text-background"
              >
                版本入口
                <Wrench className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Assistant;
