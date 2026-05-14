import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BrainCircuit, CalendarClock, Database, Download, MessageSquareText, ShieldCheck, type LucideIcon } from 'lucide-react';
import { ASSISTANT_DOWNLOAD_URL, ASSISTANT_VERSION } from '@/data/site';

const capabilities: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: '聊天入口', text: '用户通过自然语言发起提醒、记忆、资料整理和轻量自动化。', icon: MessageSquareText },
  { title: '长期记忆', text: '人格、偏好、任务上下文和历史记录形成持续的桌面伴侣体验。', icon: BrainCircuit },
  { title: '本地优先', text: '记忆、设置和活动记录优先保存在本机，外部 Provider 按授权接入。', icon: Database },
  { title: '可解释记录', text: '提醒创建、工具授权、失败恢复和执行结果进入 Activity。', icon: Activity },
];

const Assistant = () => {
  return (
    <div className="min-h-screen bg-[#07122F] text-white">
      <section className="brand-grid bg-[linear-gradient(180deg,#07122F_0%,#173157_62%,#F4F7FB_100%)] pt-36">
        <div className="section-shell grid gap-12 pb-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8 flex items-center gap-4">
              <img src="/images/brand/xingban-icon.png" alt="星伴 logo" className="h-20 w-20 rounded-[22px]" />
              <div>
                <div className="font-mono text-xl text-[#BEEB4D]">Xingban Assistant</div>
                <div className="mt-1 text-sm text-[#DDF9FF]/68">macOS · {ASSISTANT_VERSION}</div>
              </div>
            </div>
            <h1 className="text-[58px] font-semibold leading-[1.06] tracking-tight md:text-[84px]">
              桌面 AI 入口，不是另一个聊天网页
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-[#DDF9FF]/80">
              星伴是 ReefTotem 的个人桌面助手产品。她把聊天、记忆、提醒、工具调用和活动记录收进一个本地优先的桌面体验。
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href={ASSISTANT_DOWNLOAD_URL} download className="inline-flex h-16 items-center justify-center gap-3 rounded-full bg-[#22D5F5] px-8 text-lg font-semibold text-[#07122F]">
                下载星伴
                <Download className="h-5 w-5" />
              </a>
              <Link to="/downloads#install" className="inline-flex h-16 items-center justify-center gap-3 rounded-full bg-[#07122F]/75 px-8 text-lg font-semibold text-white ring-1 ring-white/20">
                安装说明
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="media-frame p-8">
              <img src="/images/product/xingban-desktop.png" alt="星伴 Assistant 真实桌面截图" className="rounded-[24px] bg-white object-cover object-top" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="brand-grid-light bg-[#F4F7FB] py-24 text-[#07122F]">
        <div className="section-shell">
          <div className="mb-12 max-w-4xl">
            <h2 className="text-5xl font-semibold tracking-tight">面向普通用户的能力闭环</h2>
            <p className="mt-5 text-lg leading-8 text-[#425271]">
              MCP、Workflow、Provider 都是底层能力。产品主路径是让人物根据聊天目标选择能力、解释风险并执行。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map(({ title, text, icon: Icon }) => (
              <article key={title} className="rounded-[24px] border border-[#07122F]/10 bg-white p-6 shadow-[0_16px_45px_rgba(7,18,47,0.07)]">
                <Icon className="mb-5 h-6 w-6 text-[#075DFF]" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#50617F]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 text-[#07122F]">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-5xl font-semibold tracking-tight">发布状态</h2>
            <p className="mt-5 text-lg leading-8 text-[#425271]">
              当前官网开放 macOS Apple Silicon DMG 下载。后续 Intel、Windows、Linux 和自动更新机制按真实产物继续补齐。
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ['当前版本', ASSISTANT_VERSION],
              ['当前平台', 'macOS Apple Silicon'],
              ['安装包', 'Xingban-Assistant-1.0.0-aarch64.dmg'],
              ['后续计划', '签名、公证、自动更新、更多平台'],
            ].map(([label, value]) => (
              <div key={label} className="grid rounded-[18px] border border-[#07122F]/10 bg-[#F4F7FB] px-5 py-4 md:grid-cols-[140px_1fr]">
                <div className="text-sm font-semibold text-[#075DFF]">{label}</div>
                <div className="font-medium">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#07122F] py-24 text-white">
        <div className="section-shell">
          <div className="grid gap-6 rounded-[30px] border border-white/10 bg-white/6 p-8 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm text-[#DDF9FF]/70">
                <CalendarClock className="h-4 w-4" />
                适合从个人提醒、知识整理和轻量办公协作开始
              </div>
              <h2 className="text-4xl font-semibold tracking-tight">从一个自然语言任务开始验证。</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#DDF9FF]/75">
                星伴下载入口已经放在官网；企业内部试用、团队版或定制 Provider 接入可以通过联系入口沟通。
              </p>
            </div>
            <Link to="/contact" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#07122F]">
              联系试用
              <ShieldCheck className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Assistant;
