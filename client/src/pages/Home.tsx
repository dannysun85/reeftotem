import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import {
  ASSISTANT_DOWNLOAD_URL,
  ASSISTANT_VERSION,
  deliveryProducts,
  productSystem,
} from '@/data/site';

const isExternal = (href: string) => href.startsWith('http');
const isDownload = (href: string) => href.startsWith('/downloads/');

const SmartLink = ({
  href,
  className,
  children,
  style,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => {
  if (isExternal(href) || isDownload(href)) {
    return (
      <a
        href={href}
        className={className}
        target={isExternal(href) ? '_blank' : undefined}
        rel={isExternal(href) ? 'noopener noreferrer' : undefined}
        download={isDownload(href) ? true : undefined}
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className} style={style}>
      {children}
    </Link>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-[#07122F] text-white">
      <section className="brand-grid relative overflow-hidden bg-[linear-gradient(180deg,#081734_0%,#1D2D49_58%,#E9EEF5_100%)] pt-32">
        <div className="absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_72%_22%,rgba(34,213,245,0.16),transparent_34%),radial-gradient(circle_at_12%_42%,rgba(7,93,255,0.18),transparent_30%)]" />
        <div className="section-shell relative grid min-h-[760px] gap-12 pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <h1 className="max-w-4xl text-[38px] font-semibold leading-[1.1] tracking-[-0.01em] text-white sm:text-[58px] md:text-[88px]">
              <span className="block">星伴 Assistant</span>
              <span className="block">1.0 现在可以</span>
              <span className="block">从官网下载</span>
            </h1>
            <p className="mt-7 max-w-2xl break-words text-lg leading-8 text-[#DDF9FF]/90 [overflow-wrap:anywhere] sm:text-[22px] sm:leading-9">
              下载中心作为当前官网的第一优先级动作：星伴先开放 macOS 安装包，QuantAgent 完成后沿同一入口发布。
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={ASSISTANT_DOWNLOAD_URL}
                download
                className="inline-flex h-16 items-center justify-center gap-3 rounded-full bg-[#22D5F5] px-8 text-lg font-semibold text-[#07122F] transition hover:bg-[#8EF2FF]"
              >
                下载 macOS 版
                <Download className="h-5 w-5" />
              </a>
              <Link
                to="/downloads#install"
                className="inline-flex h-16 items-center justify-center rounded-full bg-[#07122F]/75 px-8 text-lg font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/10"
              >
                查看安装与更新
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="relative"
          >
            <div className="rounded-[28px] border border-white/20 bg-white/10 p-4 shadow-[0_28px_100px_rgba(0,0,0,0.34)] backdrop-blur-sm sm:p-8 lg:rounded-[36px] lg:p-10">
              <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
                <img
                  src="/images/product/xingban-desktop.png"
                  alt="星伴 Assistant 桌面应用真实界面"
                  className="aspect-[1.85/1] w-full object-cover object-top"
                />
              </div>
            </div>
            <div className="absolute -bottom-5 left-[8%] z-10 flex min-w-[520px] items-center gap-4 rounded-[26px] border border-[#22D5F5]/35 bg-[#041127] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:gap-6 sm:p-6 max-md:static max-md:mt-5 max-md:min-w-0">
              <img src="/images/brand/xingban-icon.png" alt="星伴 logo" className="h-16 w-16 rounded-[18px] sm:h-24 sm:w-24 sm:rounded-[22px]" />
              <div>
                <div className="font-mono text-lg text-white sm:text-[26px]">Xingban Assistant</div>
                <div className="mt-2 font-mono text-sm text-[#BEEB4D] sm:text-[22px]">{ASSISTANT_VERSION} · aarch64.dmg</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="section-shell relative pb-20">
          <div className="rounded-[34px] border border-[#2F74FF]/20 bg-[#06142E] p-8 shadow-[0_24px_90px_rgba(7,18,47,0.34)] md:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.6fr] lg:items-end">
              <div>
                <h2 className="text-4xl font-semibold tracking-tight text-white">产品交付状态</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#DDF9FF]/80">
                  下载中心保持公司官网结构；产品以交付状态排列，避免把页面拆成单一产品页。
                </p>
              </div>
              <div className="h-px bg-white/12 lg:mb-8" />
            </div>
            <div className="mt-9 grid gap-5 lg:grid-cols-3">
              {deliveryProducts.map((item) => {
                const Icon = item.icon;
                return (
                  <SmartLink
                    key={item.name}
                    href={item.href}
                    className="group grid min-h-[132px] grid-cols-[88px_1fr] items-center gap-4 rounded-[22px] border bg-[#0B1D3D] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#112954] sm:grid-cols-[118px_1fr] sm:gap-5 sm:p-5"
                    style={{ borderColor: `${item.accent}70` } as React.CSSProperties}
                  >
                    <div
                      className="flex h-[76px] w-[88px] items-center justify-center overflow-hidden rounded-[18px] border bg-white/5 sm:h-[92px] sm:w-[118px]"
                      style={{ borderColor: `${item.accent}4F` }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className={
                          item.imageKind === 'icon'
                            ? 'h-[62px] w-[62px] rounded-[16px] sm:h-[74px] sm:w-[74px]'
                            : 'h-full w-full object-cover object-top'
                        }
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold" style={{ color: item.accent }}>
                        {item.status}
                      </div>
                      <h3 className="mt-1 text-[24px] font-semibold leading-tight text-white">{item.name}</h3>
                      <p className="mt-1 text-sm text-[#CFE0EF]">{item.desc}</p>
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#F4FBFF]">
                        {item.action}
                        <Icon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </SmartLink>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="brand-grid-light bg-[#F4F7FB] py-24 text-[#07122F]">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <h2 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl">一个品牌下的三套 AI 产品能力</h2>
              <p className="mt-6 max-w-2xl text-xl leading-8 text-[#354463]">
                企业自动化运营、个人桌面助理、策略研究与自动量化，统一在 ReefTotem 的工程标准下交付。
              </p>
            </div>
            <div className="rounded-[28px] border border-[#075DFF]/15 bg-white/75 p-6 shadow-[0_18px_60px_rgba(7,18,47,0.08)]">
              <img src="/images/brand/reeftotem-logo-color.png" alt="ReefTotem 官方 logo" className="h-20 w-auto" />
              <p className="mt-4 text-base leading-7 text-[#41506F]">
                官网顶部保持公司级导航，产品矩阵在正文中呈现，避免把官网拆成多个产品站点。
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-4">
            {productSystem.map((product) => {
              const Icon = product.icon;
              return (
                <SmartLink
                  key={product.name}
                  href={product.href}
                  className="group overflow-hidden rounded-[24px] border border-[#07122F]/10 bg-white shadow-[0_16px_45px_rgba(7,18,47,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(7,18,47,0.13)]"
                >
                  <div className="h-44 bg-[#07122F]">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover object-top" />
                  </div>
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-[#075DFF]">{product.status}</span>
                      <Icon className="h-5 w-5 text-[#22D5F5]" />
                    </div>
                    <h3 className="text-2xl font-semibold text-[#07122F]">{product.name}</h3>
                    <p className="mt-3 min-h-20 text-sm leading-6 text-[#50617F]">{product.desc}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#075DFF]">
                      {product.action}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </SmartLink>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#07122F] py-24 text-white">
        <div className="section-shell">
          <div className="grid gap-8 rounded-[34px] border border-white/10 bg-white/6 p-8 md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
                先下载星伴，再从同一个官网进入 OPC、QuantAgent 和技术文档。
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#DDF9FF]/75">
                ReefTotem 官网承担公司品牌、产品体系、下载入口和技术资料，不再使用陈旧的空洞介绍页。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={ASSISTANT_DOWNLOAD_URL}
                download
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#22D5F5] px-7 text-sm font-semibold text-[#07122F]"
              >
                下载星伴
                <Download className="h-4 w-4" />
              </a>
              <Link
                to="/products"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 px-7 text-sm font-semibold text-white"
              >
                查看产品体系
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
