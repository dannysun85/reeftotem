import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  ExternalLink,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';

const PRODUCT_CONSOLE_URL = 'https://opc.reeftotem.ai/login';

const products = [
  {
    icon: Building2,
    maturity: '已部署控制台',
    name: 'Hermes Company OS',
    category: 'AI 公司操作系统',
    desc: '为团队创建 AI 公司、配置数字员工、管理项目交付和审核结果的企业操作系统。',
    details: ['OPC 控制台', 'AI 公司与公司包', '数字员工组织', '交付审核与审计'],
    image: '/images/product/work-board-projects.png',
    action: '进入 OPC 控制台',
    href: PRODUCT_CONSOLE_URL,
  },
  {
    icon: MessageSquareText,
    maturity: '产品线规划',
    name: 'ReefTotem 小助手',
    category: '个人与企业助手',
    desc: '面向办公辅助、知识问答、任务提醒、资料整理和轻量流程协作的助手产品线。',
    details: ['资料问答', '任务提醒', '办公辅助', '企业流程入口'],
    image: '/images/brand/assistant-visual.svg',
  },
  {
    icon: BarChart3,
    maturity: '产品线规划',
    name: '量化交易软件',
    category: '量化研究与交易辅助',
    desc: '面向行情分析、策略研究、回测记录、风险监控和交易流程辅助。该方向坚持工具和风控边界，不做收益承诺。',
    details: ['行情与数据分析', '策略研究', '回测记录', '风险监控'],
    image: '/images/brand/quant-visual.svg',
  },
  {
    icon: ShieldCheck,
    maturity: '行业能力',
    name: '音视频与内容安全',
    category: '企业安全与风控',
    desc: '围绕音视频识别、内容风险、事件追踪和企业安全流程接入形成解决方案。',
    details: ['内容安全识别', '风险事件追踪', '企业流程接入', '私有化部署'],
    image: '/images/brand/security-visual.svg',
  },
  {
    icon: Bot,
    maturity: '平台能力',
    name: '数字员工与公司能力包',
    category: 'AI 组织能力',
    desc: '把岗位、制度、SOP、工具、验收标准和员工模板沉淀为可安装能力，同时保护真实公司记忆和客户数据。',
    details: ['岗位与制度模板', '工具技能组合', '员工模板', '脱敏后复用'],
    image: '/images/brand/reeftotem-corporate-visual.svg',
  },
];

const Products = () => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <section className="border-b border-border bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">产品矩阵</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              ReefTotem 的产品组合覆盖 AI 公司操作系统、小助手、量化研究工具、内容安全能力，以及支撑这些产品的数字员工和公司能力包。
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <article key={product.name} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                  <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
                    <div className="p-6 md:p-8">
                      <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
                        <span className="inline-flex items-center gap-2 font-medium text-primary">
                          <Icon className="h-4 w-4" />
                          {product.category}
                        </span>
                        <span className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                          {product.maturity}
                        </span>
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
                      {product.href && (
                        <a
                          href={product.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-semibold text-background"
                        >
                          {product.action}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="min-h-[280px] border-t border-border bg-background lg:border-l lg:border-t-0">
                      <img src={product.image} alt={product.name} className="h-full min-h-[280px] w-full object-cover" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-20">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">成熟度说明</h2>
            <p className="mt-4 text-muted-foreground leading-7">
              官网可以展示完整产品矩阵，但不能把规划中的产品包装成已经完整交付。每个产品都标注成熟度、适用范围和风险边界。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['已部署控制台', '已有线上入口，可进行真实功能验证。'],
              ['产品线规划', '已有方向和边界，继续补产品定义、页面和交付链路。'],
              ['行业能力', '以项目、私有部署或公司能力包方式进入客户流程。'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-lg border border-border bg-background p-5">
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 rounded-lg border border-border bg-foreground p-8 text-background lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">官网负责产品矩阵，OPC 负责公司操作系统。</h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-background/75">
                小助手、量化研究工具和内容安全能力后续需要补独立产品页；Hermes Company OS 的操作文档继续放在 OPC 和文档入口中。
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-background px-6 text-sm font-semibold text-foreground"
            >
              联系合作
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
