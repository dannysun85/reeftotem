import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Building2, Mail, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(formData.subject || 'ReefTotem 合作咨询');
    const body = encodeURIComponent(
      `姓名：${formData.name}\n邮箱：${formData.email}\n\n需求说明：\n${formData.message}`
    );
    return `mailto:contact@reeftotem.ai?subject=${subject}&body=${body}`;
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <section className="border-b border-border bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold text-primary">联系</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">告诉我们你想创建什么公司</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              如果你想了解 ReefTotem AI 公司操作系统、小助手、量化研究工具、私有化部署或音视频安全检测等应用场景，可以先把产品方向、目标流程和数据边界说明清楚。
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-card p-6">
              <MapPin className="mb-4 h-6 w-6 text-primary" />
              <h2 className="font-semibold text-foreground">公司地址</h2>
              <p className="mt-2 text-sm text-muted-foreground">深圳市前海深港合作区</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <Mail className="mb-4 h-6 w-6 text-primary" />
              <h2 className="font-semibold text-foreground">邮箱</h2>
              <p className="mt-2 text-sm text-muted-foreground">contact@reeftotem.ai</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <Building2 className="mb-4 h-6 w-6 text-primary" />
              <h2 className="font-semibold text-foreground">适合沟通的内容</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                产品控制台试用、小助手合作、量化研究工具、AI 公司创建、公司包、私有化部署、行业安全检测流程。
              </p>
            </div>
          </div>

          <form className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">生成邮件内容</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              当前官网不伪造“发送成功”。填写后会打开你的邮件客户端，把内容发送到 contact@reeftotem.ai。
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground">姓名</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="你的姓名"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground">邮箱</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  placeholder="name@example.com"
                />
              </label>
            </div>

            <label className="mt-5 block space-y-2">
              <span className="text-sm font-medium text-foreground">主题</span>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                placeholder="例如：想创建一个软件开发 AI 公司"
              />
            </label>

            <label className="mt-5 block space-y-2">
              <span className="text-sm font-medium text-foreground">需求说明</span>
              <textarea
                name="message"
                rows={7}
                value={formData.message}
                onChange={handleChange}
                className="w-full resize-none rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                placeholder="公司类型、员工角色、要接入的工具、数据安全边界、希望跑通的第一个项目..."
              />
            </label>

            <a href={mailto} className="mt-6 inline-block">
              <Button type="button" size="lg" className="rounded-md">
                生成邮件
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
