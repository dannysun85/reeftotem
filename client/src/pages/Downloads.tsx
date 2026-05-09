import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, FileText, Github, Server, ShieldCheck } from 'lucide-react';

const PRODUCT_CONSOLE_URL = 'https://opc.reeftotem.ai/login';

const entries = [
  {
    icon: ExternalLink,
    title: 'Hermes Company OS 控制台',
    desc: '用于 SaaS 账号、公司创建、员工组织、项目立项、Run、WorkProduct 和审核。',
    action: '打开 opc.reeftotem.ai',
    href: PRODUCT_CONSOLE_URL,
  },
  {
    icon: BookOpen,
    title: '产品使用手册',
    desc: '从注册账号、创建客户工作区、选择公司包，到提交项目目标、查看工作间、审核交付物。',
    action: '查看产品流程',
    href: '/products',
  },
  {
    icon: Server,
    title: '部署与升级 Runbook',
    desc: '记录服务器初始化、源码同步、Nginx 域名绑定、环境变量、备份、验证和回滚方式。',
    action: '联系获取部署说明',
    href: '/contact',
  },
  {
    icon: ShieldCheck,
    title: '安全与数据边界',
    desc: '公司实例、员工记忆、客户资料、代码上下文和可售模板之间必须隔离，避免把公司机密放入外售资产。',
    action: '查看公司说明',
    href: '/about',
  },
];

const Downloads = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <section className="border-b border-border bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">文档与入口</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              这里提供产品控制台、使用说明、部署 runbook 和安全边界说明。小助手、量化交易软件或行业 SDK 的下载入口会在真实发布后进入该页面。
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-5 md:grid-cols-2">
            {entries.map((entry) => {
              const Icon = entry.icon;
              const isExternal = entry.href.startsWith('http');
              return (
                <a
                  key={entry.title}
                  href={entry.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
                >
                  <Icon className="mb-5 h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">{entry.title}</h2>
                  <p className="mt-3 min-h-20 text-sm leading-6 text-muted-foreground">{entry.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    {entry.action}
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-20">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">对外文档会按产品流程组织</h2>
            <p className="mt-4 text-muted-foreground leading-7">
              不是堆 API 文档，而是让用户知道如何从官网进入控制台，再完成一家公司从创建到交付审核的完整操作。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['账号与权限', '注册、登录、租户、公司成员、审批权限。'],
              ['公司创建', '公司名称、行业方向、公司包、基本制度。'],
              ['员工组织', '管理岗、执行岗、人格、记忆、心跳、汇报线。'],
              ['项目交付', '立项、Issue、Run、日志、WorkProduct、验收。'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-lg border border-border bg-background p-5">
                <FileText className="mb-4 h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border border-border bg-card p-8">
            <Github className="mb-4 h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">源码同步与版本升级</h2>
            <p className="mt-4 max-w-4xl text-sm leading-6 text-muted-foreground">
              产品控制台部署采用服务器目录、环境变量文件、Docker Compose、Nginx 站点配置、备份和 smoke test 的升级流程。官网源码以当前仓库作为发布源，构建产物发布到服务器站点目录。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Downloads;
