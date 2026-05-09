import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  FileText,
  Globe2,
  LineChart,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const PRODUCT_CONSOLE_URL = 'https://opc.reeftotem.ai/login';

const productPortfolio = [
  {
    icon: Building2,
    title: 'Hermes Company OS',
    type: 'AI 公司操作系统',
    text: '面向企业和团队的 AI 公司运营控制台，用于创建客户工作区、AI 公司、数字员工、项目交付和审核流程。',
  },
  {
    icon: MessageSquareText,
    title: 'ReefTotem 小助手',
    type: '个人与企业助手',
    text: '面向日常办公、知识整理、任务提醒、资料问答和流程协作的小助手产品线。',
  },
  {
    icon: LineChart,
    title: '量化交易软件',
    type: '量化研究与交易辅助',
    text: '面向策略研究、行情分析、风险监控和交易流程辅助的软件方向，不承诺收益，强调工具与风控。',
  },
  {
    icon: ShieldCheck,
    title: '音视频与内容安全',
    type: '行业能力',
    text: '围绕音视频识别、内容安全、风险事件追踪和企业流程接入形成行业解决方案。',
  },
];

const companyCapabilities = [
  { icon: BrainCircuit, title: 'AI 产品研发', text: '围绕企业工作流、助手、量化研究和内容安全沉淀可复用软件能力。' },
  { icon: Bot, title: '数字员工与自动化', text: '把 AI 员工、技能、工具、审批和日志放进可管理的企业流程。' },
  { icon: BarChart3, title: '数据与决策工具', text: '用数据分析、风险监控和指标追踪支持业务判断，而不是只做展示页面。' },
  { icon: FileText, title: '交付与部署服务', text: '支持私有化部署、升级 runbook、使用文档和长期迭代维护。' },
];

const operatingPrinciples = [
  '公司官网服务于 ReefTotem 整体品牌，不等同于任何单一产品。',
  '产品介绍要覆盖产品矩阵、适用客户、使用入口、部署服务和支持方式。',
  'OPC 是 Hermes Company OS 的产品控制台，不应该占据公司官网首屏视觉中心。',
  '任何涉及交易的软件都以研究、工具、风控和流程辅助为边界，不做收益承诺。',
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border bg-white pt-28">
        <div className="container mx-auto px-4 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-5xl"
          >
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
              ReefTotem
            </h1>
            <p className="mt-5 max-w-3xl text-xl font-semibold leading-8 text-foreground">
              深圳前海瑞孚图腾科技有限公司
            </p>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-muted-foreground">
              ReefTotem 是一家面向 AI 软件产品、企业自动化、量化研究工具和行业安全能力的技术公司。Hermes Company OS 是我们的核心产品之一，但公司官网需要呈现完整产品矩阵和企业服务能力。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
              >
                查看产品矩阵
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={PRODUCT_CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-white px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                进入 OPC 控制台
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="mt-14 grid gap-4 md:grid-cols-4"
          >
            {productPortfolio.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-border bg-background p-5">
                  <Icon className="mb-4 h-6 w-6 text-primary" />
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.type}</div>
                  <h2 className="mt-2 text-lg font-semibold text-foreground">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </article>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">我们做什么</h2>
            <p className="mt-4 text-muted-foreground">
              官网首页优先表达公司能力和业务边界；具体产品的截图、流程和操作说明放到产品页与文档页。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {companyCapabilities.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <Icon className="mb-5 h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">产品组织原则</h2>
            <p className="mt-4 text-muted-foreground">
              ReefTotem 可以有多个产品和多个行业方向。官网要先建立公司可信度，再把访问者引导到适合的产品入口。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {operatingPrinciples.map((text) => (
              <div key={text} className="flex gap-3 rounded-lg border border-border bg-background p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 rounded-lg border border-border bg-foreground p-8 text-background md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm text-background/70">
                <Globe2 className="h-4 w-4" />
                公司官网、产品控制台和使用文档各自承担不同职责
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">从公司入口了解 ReefTotem，再进入具体产品。</h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-background/75">
                Hermes Company OS 通过 opc.reeftotem.ai 提供控制台入口；小助手、量化交易软件和行业安全能力会在产品矩阵中分别说明定位、边界和成熟度。
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
            >
              联系 ReefTotem
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
