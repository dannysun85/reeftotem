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
} from 'lucide-react';

const PRODUCT_CONSOLE_URL = 'https://opc.reeftotem.ai/login';

const productPortfolio = [
  {
    icon: Building2,
    title: 'Hermes Company OS',
    type: '企业 AI 组织',
    text: '创建 AI 公司、数字员工、项目交付和审核流程的企业操作系统。',
  },
  {
    icon: MessageSquareText,
    title: 'ReefTotem 小助手',
    type: '个人与企业助手',
    text: '面向知识整理、任务提醒、资料问答和日常办公协作的助手产品。',
  },
  {
    icon: LineChart,
    title: '量化交易软件',
    type: '量化研究工具',
    text: '面向行情分析、策略研究、回测记录和风险监控的工具软件。',
  },
  {
    icon: ShieldCheck,
    title: '内容安全能力',
    type: '行业解决方案',
    text: '围绕音视频识别、内容风险和企业安全流程形成可部署能力。',
  },
];

const capabilities = [
  { icon: BrainCircuit, title: 'AI 产品研发', text: '把模型能力转化为可部署的软件产品和业务流程。' },
  { icon: Bot, title: '企业自动化', text: '用数字员工、工具、审批和日志提升团队执行效率。' },
  { icon: BarChart3, title: '数据与风控', text: '围绕研究、监控、指标和审计构建可验证的决策工具。' },
  { icon: FileText, title: '交付与服务', text: '提供私有化部署、版本升级、文档和长期维护支持。' },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-white pt-28">
        <div className="container mx-auto grid gap-14 px-4 pb-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
              让 AI 软件进入真实工作
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              ReefTotem 是深圳前海瑞孚图腾科技有限公司旗下的 AI 软件品牌，面向企业与个人构建智能助手、AI 公司操作系统、量化研究工具与内容安全能力。我们关注可部署、可验证、可持续迭代的软件交付。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
              >
                查看产品矩阵
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-white px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                联系合作
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="overflow-hidden rounded-lg border border-border bg-background shadow-apple"
          >
            <img
              src="/images/brand/reeftotem-corporate-gpt.png"
              alt="ReefTotem AI software product portfolio visual generated from the brand direction"
              className="aspect-[16/10] w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">产品矩阵</h2>
              <p className="mt-4 text-muted-foreground">
                官网呈现 ReefTotem 的完整业务组合。每条产品线都有自己的成熟度、边界和交付方式。
              </p>
            </div>
            <a
              href={PRODUCT_CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
            >
              打开 OPC 控制台
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productPortfolio.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <Icon className="mb-5 h-6 w-6 text-primary" />
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.type}</div>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">能力方向</h2>
            <p className="mt-4 text-muted-foreground">
              ReefTotem 的交付不只是一组页面，而是围绕产品、数据、自动化和部署服务形成长期能力。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-border bg-background p-6">
                  <Icon className="mb-5 h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 rounded-lg border border-border bg-foreground p-8 text-background md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm text-background/70">
                <Globe2 className="h-4 w-4" />
                官网、产品控制台、使用文档分工明确
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">先了解 ReefTotem，再进入具体产品。</h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-background/75">
                Hermes Company OS 使用 OPC 控制台；小助手、量化研究工具和内容安全能力会在产品矩阵中分别说明定位、成熟度和交付边界。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
              >
                查看产品
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-background/30 px-6 text-sm font-semibold text-background"
              >
                联系我们
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
