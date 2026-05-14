import React from 'react';
import { motion } from 'framer-motion';
import { Building2, GitBranch, ShieldCheck, Users, type LucideIcon } from 'lucide-react';

const principles: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: '产品真实', text: '官网只展示真实 logo、真实截图和真实下载状态。', icon: Building2 },
  { title: '公司级导航', text: '顶部入口保持公司官网结构，产品在正文体系中表达。', icon: GitBranch },
  { title: '交付可追踪', text: '下载、控制台、文档、部署和回滚都需要可验证路径。', icon: Users },
  { title: '边界清晰', text: '个人助手、企业平台、量化系统和安全能力不混成一个笼统概念。', icon: ShieldCheck },
];

const About = () => {
  return (
    <div className="min-h-screen bg-[#07122F] text-white">
      <section className="brand-grid bg-[linear-gradient(180deg,#07122F_0%,#173157_62%,#F4F7FB_100%)] pt-36">
        <div className="section-shell grid gap-12 pb-24 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-[52px] font-semibold leading-tight tracking-tight md:text-[78px]">
              深圳前海瑞孚图腾科技有限公司
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-[#DDF9FF]/80">
              ReefTotem 专注于 AI 软件系统交付，当前产品线包括 OPC 企业平台、星伴 Assistant 和 QuantAgent 自动量化系统。
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="rounded-[34px] border border-white/12 bg-white/8 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <img src="/images/brand/reeftotem-logo-white.png" alt="ReefTotem 官方 logo" className="h-24 w-auto" />
              <p className="mt-8 text-lg leading-8 text-[#DDF9FF]/80">
                公司官网承担品牌、产品体系、下载入口、技术文档和联系入口，不再使用旧版空泛宣传结构。
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="brand-grid-light bg-[#F4F7FB] py-24 text-[#07122F]">
        <div className="section-shell">
          <div className="mb-12 max-w-4xl">
            <h2 className="text-5xl font-semibold tracking-tight">官网重构原则</h2>
            <p className="mt-5 text-lg leading-8 text-[#425271]">
              这次官网不是换一层皮，而是把公司真实产品、下载能力和工程交付状态放到第一层。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {principles.map(({ title, text, icon: Icon }) => (
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
        <div className="section-shell">
          <div className="rounded-[30px] border border-[#07122F]/10 bg-[#07122F] p-8 text-white md:p-12">
            <h2 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
              ReefTotem 帮助 AI 从演示工具进入真实软件系统。
            </h2>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-[#DDF9FF]/75">
              当前阶段的核心不是堆砌概念，而是让用户看到真实产品界面、真实下载入口、真实控制台和清晰的后续发布路线。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
