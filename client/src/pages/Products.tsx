import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { usePublicCatalog } from '@/api/publicCatalog';

const fallbackProductDetails = [
  {
    slug: 'opc',
    title: 'OPC 企业平台',
    points: ['AI 公司创建', '数字员工组织', '项目交付记录', 'WorkProduct 审核'],
  },
  {
    slug: 'xingban-assistant',
    title: '星伴 Assistant',
    points: ['桌面常驻入口', '聊天与记忆', '提醒与轻量自动化', 'macOS 1.0.0 下载'],
  },
  {
    slug: 'quantagent',
    title: 'QuantAgent',
    points: ['策略 Alpha 深研', '证据门禁', '风险约束', '后续官网下载'],
  },
];

const Products = () => {
  const { productSystem, isApiBacked } = usePublicCatalog();
  const productDetails = productSystem.slice(0, 3).map((product) => ({
    title: product.name,
    points: product.features?.slice(0, 4) || fallbackProductDetails.find((item) => item.slug === product.slug)?.points || [
      product.category,
      product.status,
      '后台产品目录',
      '前台自动同步',
    ],
  }));

  return (
    <div className="min-h-screen bg-[#07122F] text-white">
      <section className="brand-grid relative overflow-hidden bg-[linear-gradient(180deg,#07122F_0%,#10264C_62%,#F4F7FB_100%)] pt-36">
        <div className="section-shell pb-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl">
            <h1 className="text-[54px] font-semibold leading-tight tracking-tight md:text-[82px]">
              一个品牌下的三套 AI 产品能力
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-[#DDF9FF]/80">
              产品入口不拆在顶部导航里，而是在产品体系页用成熟度、截图和交付状态清楚说明；{isApiBacked ? '本页已接入后台产品 API。' : '后台 API 不可用时使用静态降级目录。'}
            </p>
          </motion.div>
        </div>

        <div className="section-shell pb-24">
          <div className="grid gap-6 lg:grid-cols-3">
            {productDetails.map((item) => (
              <article key={item.title} className="rounded-[26px] border border-white/15 bg-[#07122F]/80 p-7 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold">{item.title}</h2>
                <div className="mt-6 grid gap-3">
                  {item.points.map((point) => (
                    <div key={point} className="flex items-center gap-3 text-[#DDF9FF]/80">
                      <CheckCircle2 className="h-4 w-4 text-[#22D5F5]" />
                      <span className="text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="brand-grid-light bg-[#F4F7FB] py-24 text-[#07122F]">
        <div className="section-shell">
          <div className="grid gap-8">
            {productSystem.map((product, index) => {
              const Icon = product.icon;
              const external = product.href.startsWith('http');
              const download = product.href.startsWith('/downloads/');
              const content = (
                <article className="grid overflow-hidden rounded-[30px] border border-[#07122F]/10 bg-white shadow-[0_18px_55px_rgba(7,18,47,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="p-8 md:p-10">
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#075DFF]/8 px-4 py-2 text-sm font-semibold text-[#075DFF]">
                        <Icon className="h-4 w-4" />
                        {product.category}
                      </span>
                      <span className="rounded-full border border-[#07122F]/10 px-4 py-2 text-sm font-semibold text-[#50617F]">
                        {product.status}
                      </span>
                    </div>
                    <h2 className="text-4xl font-semibold tracking-tight text-[#07122F]">{product.name}</h2>
                    <p className="mt-5 max-w-2xl text-lg leading-8 text-[#435372]">{product.desc}</p>
                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#075DFF]">
                      {product.action}
                      {external ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                    </div>
                  </div>
                  <div className={`min-h-[340px] bg-[#07122F] ${index % 2 === 1 ? 'lg:order-first' : ''}`}>
                    <img src={product.image} alt={product.name} className="h-full min-h-[340px] w-full object-cover object-top" />
                  </div>
                </article>
              );

              if (external || download) {
                return (
                  <a
                    key={product.name}
                    href={product.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    download={download ? true : undefined}
                    className="block transition hover:-translate-y-1"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link key={product.name} to={product.href} className="block transition hover:-translate-y-1">
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
