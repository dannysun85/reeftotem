import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, MapPin, Send, type LucideIcon } from 'lucide-react';

const contactItems: Array<{ icon: LucideIcon; text: string }> = [
  { icon: MapPin, text: '深圳市前海深港合作区' },
  { icon: Mail, text: 'contact@reeftotem.ai' },
  { icon: Building2, text: 'AI 软件系统、企业自动化、量化系统与部署咨询' },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(formData.subject || 'ReefTotem 合作咨询');
    const body = encodeURIComponent(`姓名：${formData.name}\n邮箱：${formData.email}\n\n需求说明：\n${formData.message}`);
    return `mailto:contact@reeftotem.ai?subject=${subject}&body=${body}`;
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#07122F] text-white">
      <section className="brand-grid bg-[linear-gradient(180deg,#07122F_0%,#1B3155_64%,#F4F7FB_100%)] pt-36">
        <div className="section-shell grid gap-12 pb-24 lg:grid-cols-[0.85fr_1.15fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-[56px] font-semibold leading-tight tracking-tight md:text-[84px]">联系 ReefTotem</h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-[#DDF9FF]/80">
              如果你想了解星伴下载、OPC 企业平台、QuantAgent 内测或私有化部署，可以先把产品方向、目标流程和数据边界说明清楚。
            </p>
            <div className="mt-10 grid gap-4">
              {contactItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4 rounded-[20px] border border-white/10 bg-white/6 p-5">
                  <Icon className="h-5 w-5 text-[#22D5F5]" />
                  <span className="text-sm text-[#DDF9FF]/80">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[30px] border border-white/12 bg-[#07122F]/86 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-9"
          >
            <h2 className="text-3xl font-semibold">生成邮件内容</h2>
            <p className="mt-3 text-sm leading-6 text-[#DDF9FF]/70">
              当前官网不伪造“发送成功”。填写后会打开你的邮件客户端，把内容发送到 contact@reeftotem.ai。
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#DDF9FF]">姓名</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-[16px] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none focus:border-[#22D5F5]"
                  placeholder="你的姓名"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#DDF9FF]">邮箱</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-[16px] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none focus:border-[#22D5F5]"
                  placeholder="name@example.com"
                />
              </label>
            </div>

            <label className="mt-5 block space-y-2">
              <span className="text-sm font-medium text-[#DDF9FF]">主题</span>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-[16px] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none focus:border-[#22D5F5]"
                placeholder="例如：星伴团队试用 / OPC 企业平台演示 / QuantAgent 内测"
              />
            </label>

            <label className="mt-5 block space-y-2">
              <span className="text-sm font-medium text-[#DDF9FF]">需求说明</span>
              <textarea
                name="message"
                rows={7}
                value={formData.message}
                onChange={handleChange}
                className="w-full resize-none rounded-[16px] border border-white/12 bg-white/8 px-4 py-3 text-sm text-white outline-none focus:border-[#22D5F5]"
                placeholder="产品方向、目标流程、数据边界、希望跑通的第一个场景..."
              />
            </label>

            <a
              href={mailto}
              className="mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#22D5F5] px-7 text-sm font-semibold text-[#07122F]"
            >
              生成邮件
              <Send className="h-4 w-4" />
            </a>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
