import React from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle2, GitBranch, ShieldCheck, Users } from 'lucide-react';

const milestones = [
  {
    date: '2026-05',
    title: '产品主线收敛',
    text: '明确 ReefTotem 的核心不是通用聊天助手，而是支持多类型 AI 公司运营的 SaaS 平台。',
  },
  {
    date: '2026-05',
    title: '软件公司验证',
    text: '以 ReefTotem 软件开发公司作为第一家自运营公司，跑通文档读取、代码迭代、版本更新和交付审核。',
  },
  {
    date: '2026-05',
    title: '独立服务器部署',
    text: '根域名承载公司官网，opc 子域名承载产品控制台，按升级环境方式沉淀部署流程。',
  },
];

const principles = [
  { icon: Building2, title: '公司先于聊天', text: '用户创建的是公司，不是单个聊天机器人；员工聊天只是公司协作的一部分。' },
  { icon: Users, title: '员工必须有职责', text: '每个 AI 员工要有岗位、人格、记忆、心跳、上下级和协作边界。' },
  { icon: GitBranch, title: '交付必须可追踪', text: 'Issue、Run、事件、工具调用和 WorkProduct 要能反向解释交付结果。' },
  { icon: ShieldCheck, title: '安全默认隔离', text: '真实公司记忆和客户上下文不进入外售包，只允许脱敏模板复用。' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <section className="border-b border-border bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold text-primary">公司说明</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">深圳前海瑞孚图腾科技有限公司</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              ReefTotem 现在聚焦一个清晰产品方向：为不同类型公司提供 AI 员工、公司制度、项目执行、通讯协作和交付审核的操作系统。软件开发公司只是第一家验证公司，后续还可以复制到研究交付、运营服务、内容交付和安全检测等公司类型。
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">我们不做空泛的 AI 概念页</h2>
            <p className="mt-4 text-muted-foreground leading-7">
              官网需要承担真实说明责任：产品入口在哪里、用户能创建什么、员工如何工作、交付如何审核、数据如何隔离、服务器如何部署。所有页面都围绕这些具体问题组织。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-border bg-card p-6">
                  <Icon className="mb-4 h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">当前建设节点</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {milestones.map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-background p-6">
                <div className="text-sm font-semibold text-primary">{item.date}</div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
              <CheckCircle2 className="h-4 w-4" />
              当前对外说明口径
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">ReefTotem 是 AI 公司运营平台，不是单点聊天产品。</h2>
            <p className="mt-4 max-w-4xl text-muted-foreground leading-7">
              用户通过平台购买或创建公司能力，安装公司包，招聘 AI 员工，接入通讯工作间，提交项目目标，并通过 WorkProduct 审核结果。后续商业化可以发展员工模板、公司制度包、行业公司包和部署服务，但不能牺牲公司实例的数据安全边界。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
