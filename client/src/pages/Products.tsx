import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  MessageSquareText,
  Server,
  ShieldCheck,
} from 'lucide-react';

const PRODUCT_CONSOLE_URL = 'https://opc.reeftotem.ai/login';

const products = [
  {
    icon: BriefcaseBusiness,
    status: '正在部署',
    name: 'Hermes Company OS',
    desc: '面向 AI 公司的 SaaS 操作系统，覆盖账号、公司、员工、项目、Issue、Run、WorkProduct、OA、OKR、工作间和审核运营。',
    details: ['公司创建与资料维护', 'AI 员工组织架构', '项目立项到交付审核', 'Slack/钉钉等工作间适配'],
    image: '/images/product/work-board-projects.png',
  },
  {
    icon: Bot,
    status: '内部验证',
    name: 'ReefTotem 软件公司包',
    desc: '第一家验证公司，用于把当前产品的文档、代码、GitHub Issue、版本升级和交付审核跑成真实开发流程。',
    details: ['软件公司岗位模板', '开发与发布流程', 'CEO 管理岗汇报线', '交付物复盘与下一轮迭代'],
    image: '/images/product/employees-org-reporting.png',
  },
  {
    icon: ShieldCheck,
    status: '应用方向',
    name: '音视频安全检测能力',
    desc: 'ReefTotem 的行业应用方向之一，聚焦语音、视频、内容和风险检测能力。该方向会通过公司包或项目交付接入，而不是混入官网泛营销。',
    details: ['内容安全识别', '风险事件追踪', '企业流程接入', '私有化交付评估'],
    image: '/images/product/workroom-activity-feed.png',
  },
];

const flow = [
  { icon: ClipboardList, title: '项目立项', text: '用户提交目标、上下文、资料和验收口径，由公司管理岗接收。' },
  { icon: MessageSquareText, title: '内部协作', text: '管理岗拆任务，执行岗讨论方案、调用工具、记录失败与升级。' },
  { icon: FileText, title: '结果交付', text: 'Run 产生日志和 WorkProduct，用户审核后进入下一轮迭代或归档。' },
  { icon: Server, title: '持续部署', text: '代码、文档、版本日志与服务器部署流程保持同步。' },
];

const Products = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <section className="border-b border-border bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold text-primary">产品与流程</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">把 AI 员工放进真实公司流程里</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              ReefTotem 的产品边界已经收敛到公司运营系统：公司可以不同，行业可以不同，员工和制度可以通过公司包复制，但真实公司记忆、客户资料和代码上下文必须留在公司实例内。
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {products.map((product, index) => {
              const Icon = product.icon;
              const reverse = index % 2 === 1;
              return (
                <article key={product.name} className={`grid gap-8 rounded-lg border border-border bg-card p-6 shadow-sm lg:grid-cols-2 lg:items-center ${reverse ? 'lg:[&>div:first-child]:order-2' : ''}`}>
                  <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                      <Icon className="h-4 w-4" />
                      {product.status}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">{product.name}</h2>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">{product.desc}</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {product.details.map((detail) => (
                        <div key={detail} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border bg-background">
                    <img src={product.image} alt={product.name} className="aspect-[16/10] w-full object-cover object-left-top" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">标准业务链路</h2>
            <p className="mt-4 text-muted-foreground">
              这条链路用于软件公司，也能迁移到研究交付、运营服务、安全检测等不同公司类型。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {flow.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-border bg-background p-6">
                  <Icon className="mb-5 h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 rounded-lg border border-border bg-foreground p-8 text-background lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">先从软件公司完整跑通，再复制到其他行业公司。</h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-background/75">
                官网入口负责引导用户理解产品，控制台负责完成公司创建、员工招聘、项目立项和交付审核。Marketplace、品牌增长、泛渠道和更外延的生态能力会放到后续商业阶段。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={PRODUCT_CONSOLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-6 text-sm font-semibold text-foreground"
              >
                进入控制台
                <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                to="/downloads"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-background/30 px-6 text-sm font-semibold text-background"
              >
                查看文档入口
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
