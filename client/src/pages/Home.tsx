import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GitBranch,
  MessageSquareText,
  Server,
  ShieldCheck,
  Users,
} from 'lucide-react';

const PRODUCT_CONSOLE_URL = 'https://opc.reeftotem.ai/login';

const workflow = [
  {
    title: '创建账号与公司',
    text: '从 SaaS 账号进入，选择公司类型，填写公司资料，安装适合行业的公司包。',
  },
  {
    title: '配置员工与组织',
    text: '添加管理岗和执行岗 AI 员工，定义职责边界、汇报关系、协作关系和工作习惯。',
  },
  {
    title: '提交项目目标',
    text: '用户不需要直接写 Issue，先通过项目立项把目标、资料、验收口径交给公司管理岗。',
  },
  {
    title: '拆解执行与交付',
    text: '公司内部再拆 Issue、Run、日志、WorkProduct，最后由用户审核结果并决定是否继续迭代。',
  },
];

const modules = [
  { icon: Building2, title: '公司主页', text: '展示当前公司状态、今日目标、阻塞、员工动态和需要人工处理的事项。' },
  { icon: BriefcaseBusiness, title: '工作台', text: '管理项目、Issue、Run、WorkProduct，让交付过程可追踪、可复盘。' },
  { icon: Users, title: 'AI 员工', text: '维护岗位、人格、记忆、心跳、职责域和人事关系，避免员工只是名字列表。' },
  { icon: MessageSquareText, title: '工作间', text: '把任务讨论、工具调用、失败升级、群策群力和外部 IM 投递放到同一条事件线上。' },
  { icon: ClipboardCheck, title: 'OA 与 OKR', text: '把审批、异常、预算、权限和 KR 证据接入真实运营，而不是停留在静态页面。' },
  { icon: ShieldCheck, title: '安全边界', text: '公司实例记忆不外售，员工模板和公司能力包必须脱敏后才能复用。' },
];

const screenshots = [
  {
    src: '/images/product/dashboard-company-home.png',
    title: '公司首页',
    text: '公司状态、运营队列、快捷入口、员工动态。',
  },
  {
    src: '/images/product/work-board-projects.png',
    title: '工作台',
    text: '项目、Issue、Run、交付物和版本推进。',
  },
  {
    src: '/images/product/employees-org-reporting.png',
    title: '员工组织',
    text: '管理岗、执行岗、汇报线和协作关系。',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-white pt-28">
        <div className="container mx-auto grid gap-12 px-4 pb-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-primary">
              <Server className="h-4 w-4" />
              Hermes Company OS 正在进入独立服务器部署
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
              <span className="block">ReefTotem AI</span>
              <span className="block">公司操作系统</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              ReefTotem 正在建设的不是一个泛聊天助手，而是让用户从零创建公司、招聘 AI 员工、提交项目目标、跟踪执行过程并审核交付结果的 SaaS 工作流平台。第一家验证公司是 ReefTotem 软件开发公司。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={PRODUCT_CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
              >
                进入产品控制台
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/products"
                className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-white px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                查看产品流程
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              {[
                ['产品入口', 'opc.reeftotem.ai'],
                ['当前主线', '公司运营闭环'],
                ['首个场景', '软件公司自动交付'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-border bg-background p-4">
                  <div className="text-muted-foreground">{label}</div>
                  <div className="mt-1 font-semibold text-foreground">{value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.45 }}>
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-apple">
              <img
                src="/images/product/dashboard-company-home.png"
                alt="Hermes Company OS 公司首页"
                className="aspect-[16/10] w-full object-cover object-left-top"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">真实公司运营需要的模块</h2>
            <p className="mt-4 text-muted-foreground">
              官网只呈现当前产品主线：SaaS 账号、公司创建、员工组织、项目立项、执行交付、人工审核和通讯工作间。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div key={module.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{module.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{module.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">从目标到交付的完整路径</h2>
            <p className="mt-4 text-muted-foreground">
              用户不应该一上来写 Issue。正确路径是先把业务目标交给公司管理岗，再由公司内部完成任务拆解和执行。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {workflow.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-border bg-background p-6">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">当前产品界面</h2>
              <p className="mt-4 max-w-3xl text-muted-foreground">
                这些截图来自正在本地验证的 Hermes Company OS，不使用与产品无关的营销素材。
              </p>
            </div>
            <Link to="/downloads" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
              查看使用入口
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {screenshots.map((item) => (
              <figure key={item.title} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <img src={item.src} alt={item.title} className="aspect-[16/10] w-full object-cover object-left-top" />
                <figcaption className="p-5">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-white py-20">
        <div className="container mx-auto grid gap-6 px-4 lg:grid-cols-3">
          {[
            { icon: MessageSquareText, title: '通讯适配', text: '软件公司优先接 Slack；后续通过统一 CompanyWorkroomProvider 支持钉钉、飞书、Teams。' },
            { icon: FileText, title: '部署与升级', text: '源码同步到服务器，Nginx 绑定 reeftotem.ai 与 opc.reeftotem.ai，版本升级按 runbook 执行。' },
            { icon: GitBranch, title: '自运营验证', text: 'ReefTotem 软件公司会继续读取项目文档、发起开发任务、产出交付物并接受人工审核。' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border border-border bg-background p-6">
                <Icon className="mb-4 h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border border-border bg-foreground p-8 text-background md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  官网内容已对齐当前产品主线
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">下一步是把产品控制台、官网和服务器部署连成一套可演示流程。</h2>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-background/75">
                  根域名用于公司官网，opc 子域名用于产品控制台。用户从官网了解产品，再进入控制台完成账号、公司、员工、项目和交付审核。
                </p>
              </div>
              <a
                href={PRODUCT_CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
              >
                打开控制台
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
