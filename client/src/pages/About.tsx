import React from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle2, GitBranch, ShieldCheck, Users } from 'lucide-react';

const milestones = [
  {
    date: '2026',
    title: '企业 AI 公司操作系统',
    text: '围绕客户工作区、AI 公司、数字员工、公司包、项目交付和人工审核建立产品主线。',
  },
  {
    date: '2026',
    title: '第一家自运营软件公司',
    text: '用 ReefTotem 自己的软件开发公司验证文档读取、代码迭代、版本升级、部署和交付审核。',
  },
  {
    date: '2026',
    title: '独立域名与升级环境',
    text: '根域名承载公司官网，opc 子域名承载 ReefTotem AI 公司操作系统控制台，并沉淀可复用部署流程。',
  },
];

const principles = [
  { icon: Building2, title: '公司先于聊天', text: '用户创建的是公司，不是单个聊天机器人；员工聊天只是公司协作的一部分。' },
  { icon: Users, title: '员工必须有职责', text: '每个数字员工都要有岗位、人格、记忆、心跳、上下级和协作边界。' },
  { icon: GitBranch, title: '交付必须可追踪', text: 'Issue、Run、事件、工具调用和 WorkProduct 要能反向解释交付结果。' },
  { icon: ShieldCheck, title: '安全默认隔离', text: '真实公司记忆和客户上下文不进入外售包，只允许脱敏模板复用。' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <section className="border-b border-border bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">深圳前海瑞孚图腾科技有限公司</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              ReefTotem 专注于 AI 软件产品和企业自动化能力建设，产品方向包括 ReefTotem AI 公司操作系统、Reeftotem Assistant、量化研究工具、音视频与内容安全能力，以及支撑这些产品的数字员工和公司能力包。
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">公司定位</h2>
            <p className="mt-4 text-muted-foreground leading-7">
              ReefTotem 的官网承担公司介绍、产品矩阵、试用入口、部署咨询和用户文档入口。AI 公司操作系统是其中的核心产品之一，不等同于公司本身。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-border bg-card p-6">
                  <Icon className="mb-4 h-6 w-6 text-primary" />
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground">建设节点</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {milestones.map((item) => (
              <article key={item.title} className="rounded-lg border border-border bg-background p-6">
                <div className="text-sm font-semibold text-primary">{item.date}</div>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
              <CheckCircle2 className="h-4 w-4" />
              对外说明口径
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">ReefTotem 帮助企业运营 AI 公司，而不是把所有工作塞进一个聊天窗口。</h2>
            <p className="mt-4 max-w-4xl text-muted-foreground leading-7">
              用户通过平台创建客户工作区，安装公司包，招聘数字员工，接入通讯工作间，提交业务目标，并通过 WorkProduct 审核结果。后续商业化可以发展员工模板、公司制度包、行业公司包和部署服务，但不能牺牲公司实例的数据安全边界。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
