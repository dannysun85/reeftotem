import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Download, ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import {
  formatReleaseDate,
  getAssistantDownloadHref,
  getOpcHref,
  recordDownloadClick,
  usePublicCatalog,
} from '@/api/publicCatalog';

const docs = [
  ['安装与更新', '下载 DMG 后拖入 Applications。后续版本会沿同一下载中心发布，并保留版本说明。'],
  ['产品体系', 'OPC、星伴、QuantAgent 都属于公司产品矩阵，顶部导航不拆成多个产品站点。'],
  ['安全边界', '企业数据、个人记忆、量化研究结果和下载产物需要在不同产品边界内说明。'],
  ['发布策略', '当前开放星伴 macOS Apple Silicon 版本；QuantAgent 完成后从同一入口发布。'],
];

const Downloads = () => {
  const { deliveryProducts, assistantDownload, isApiBacked } = usePublicCatalog();
  const assistantHref = getAssistantDownloadHref(assistantDownload);
  const opcHref = getOpcHref(deliveryProducts.find((item) => item.slug === 'opc'));
  const assistantVersion = assistantDownload.packageUrl ? assistantDownload.desc : '1.0.0 · aarch64.dmg';

  return (
    <div className="min-h-screen bg-[#07122F] text-white">
      <section className="brand-grid bg-[linear-gradient(180deg,#07122F_0%,#20314E_62%,#E9EEF5_100%)] pt-36">
        <div className="section-shell grid gap-12 pb-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-[38px] font-semibold leading-[1.1] tracking-tight sm:text-[58px] md:text-[86px]">
              <span className="block">星伴 Assistant</span>
              <span className="block">{assistantDownload.status} 官网下载</span>
            </h1>
            <p className="mt-7 max-w-2xl break-words text-lg leading-8 text-[#DDF9FF]/80 [overflow-wrap:anywhere] sm:text-xl sm:leading-9">
              下载中心是公司产品交付入口。当前开放星伴 macOS Apple Silicon 安装包，OPC 提供线上控制台，QuantAgent 完成后从同一入口发布。{isApiBacked ? '本页已接入后台下载 API。' : ''}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={assistantHref}
                download
                onClick={() => void recordDownloadClick(assistantDownload.downloadId)}
                className="inline-flex h-16 items-center justify-center gap-3 rounded-full bg-[#22D5F5] px-8 text-lg font-semibold text-[#07122F]"
              >
                下载 macOS 版
                <Download className="h-5 w-5" />
              </a>
              <a
                href={opcHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-16 items-center justify-center gap-3 rounded-full bg-[#07122F]/70 px-8 text-lg font-semibold text-white ring-1 ring-white/20"
              >
                进入 OPC
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-[0_28px_100px_rgba(0,0,0,0.32)] sm:p-8 lg:rounded-[36px]">
              <div className="overflow-hidden rounded-[28px] bg-white">
                <img src="/images/product/xingban-desktop.png" alt="星伴 Assistant 真实截图" className="aspect-[1.85/1] w-full object-cover object-top" />
              </div>
              <div className="mt-6 grid gap-4 rounded-[24px] bg-[#041127] p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                <img src="/images/brand/xingban-icon.png" alt="星伴图标" className="h-20 w-20 rounded-[20px]" />
                <div>
                  <div className="font-mono text-2xl">Xingban Assistant</div>
                  <div className="mt-1 font-mono text-[#BEEB4D]">{assistantVersion}</div>
                </div>
                <a
                  href={assistantHref}
                  download
                  onClick={() => void recordDownloadClick(assistantDownload.downloadId)}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#07122F]"
                >
                  下载
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="section-shell pb-20">
          <div className="rounded-[34px] border border-white/10 bg-[#07122F]/95 p-8 md:p-12">
            <h2 className="text-4xl font-semibold">产品交付状态</h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#DDF9FF]/75">
              下载中心保持公司官网结构；产品以交付状态排列，用户可以清楚判断哪个产品可下载、哪个产品可演示、哪个产品即将开放。
            </p>
            <div className="mt-8 h-px bg-white/12" />
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {deliveryProducts.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  download={item.href.startsWith('/downloads/') ? true : undefined}
                  onClick={() => void recordDownloadClick(item.downloadId)}
                  className="grid min-h-[128px] grid-cols-[88px_1fr] items-center gap-4 rounded-[22px] border border-white/10 bg-[#0C1E3F] p-4 transition hover:-translate-y-0.5 hover:bg-[#122A55] sm:grid-cols-[116px_1fr] sm:gap-5 sm:p-5"
                >
                  <div className="flex h-[76px] w-[88px] items-center justify-center overflow-hidden rounded-[18px] bg-white/5 sm:h-[90px] sm:w-[116px]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={item.imageKind === 'icon' ? 'h-[62px] w-[62px] rounded-[16px] sm:h-[72px] sm:w-[72px]' : 'h-full w-full object-cover object-top'}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: item.accent }}>
                      {item.status}
                    </div>
                    <div className="mt-1 text-[23px] font-semibold">{item.name}</div>
                    <div className="mt-1 text-sm text-[#DDF9FF]/70">{item.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="install" className="brand-grid-light bg-[#F4F7FB] py-24 text-[#07122F]">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <h2 className="text-5xl font-semibold tracking-tight">安装与版本说明</h2>
            <p className="mt-6 text-lg leading-8 text-[#425271]">
              当前下载文件为本地 release 产物 `Xingban-Assistant-1.0.0-aarch64.dmg`。官网只展示真实可下载文件，不再保留“等待发布”的旧文案。
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ['平台', 'macOS Apple Silicon'],
              ['版本', assistantDownload.status],
              ['格式', 'DMG'],
              ['文件名', assistantHref.replace('/downloads/', '')],
              ['发布日期', formatReleaseDate(assistantDownload.releaseDate)],
              ['下载次数', assistantDownload.downloadCount === undefined ? '后台统计接入后显示' : `${assistantDownload.downloadCount}`],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[120px_1fr] rounded-[18px] border border-[#07122F]/10 bg-white px-5 py-4">
                <div className="text-sm font-semibold text-[#075DFF]">{label}</div>
                <div className="font-medium text-[#07122F]">{value}</div>
              </div>
            ))}
            <a
              href={assistantHref}
              download
              onClick={() => void recordDownloadClick(assistantDownload.downloadId)}
              className="mt-2 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#07122F] px-7 text-sm font-semibold text-white"
            >
              立即下载星伴
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="docs" className="bg-white py-24 text-[#07122F]">
        <div className="section-shell">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-5xl font-semibold tracking-tight">技术文档与发布规则</h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#425271]">
                官网文档用于说明产品边界、下载策略、部署入口和安全原则；深入操作文档后续按产品继续拆分。
              </p>
            </div>
            <Link to="/contact" className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[#07122F]/12 px-7 text-sm font-semibold">
              获取部署沟通
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {docs.map(([title, text]) => (
              <article key={title} className="rounded-[24px] border border-[#07122F]/10 bg-[#F4F7FB] p-6">
                <FileText className="mb-5 h-6 w-6 text-[#075DFF]" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#50617F]">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-[28px] border border-[#07122F]/10 bg-[#07122F] p-8 text-white md:p-10">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 h-7 w-7 text-[#22D5F5]" />
              <div>
                <h3 className="text-2xl font-semibold">真实发布，不制造虚假下载状态</h3>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-[#DDF9FF]/75">
                  星伴当前可下载；OPC 是线上控制台；QuantAgent 仍按完成状态发布。官网文案和下载入口必须与真实产物一致。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#07122F] py-24 text-white">
        <div className="section-shell">
          <div className="grid gap-6 md:grid-cols-3">
            {['官网导航保持公司级结构', '下载入口直接指向真实 DMG', 'QuantAgent 完成后同入口发布'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/6 p-5">
                <CheckCircle2 className="h-5 w-5 text-[#22D5F5]" />
                <span className="text-sm font-semibold text-[#DDF9FF]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Downloads;
