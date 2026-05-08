import React from 'react';
import { motion } from 'framer-motion';

const events = [
  {
    year: '2026-05',
    title: '产品主线收敛',
    description: '明确 ReefTotem 是 AI 公司运营平台，优先跑通软件公司从立项到交付审核的流程。',
  },
  {
    year: '2026-05',
    title: '服务器部署',
    description: '根域名用于公司官网，opc 子域名用于 Hermes Company OS 产品控制台。',
  },
  {
    year: '2026-05',
    title: '自运营验证',
    description: 'ReefTotem 软件公司开始验证文档读取、代码迭代、Run 和 WorkProduct 审核。',
  },
  {
    year: 'Next',
    title: '行业公司复制',
    description: '在软件公司跑通后，再复制到研究交付、运营服务、内容交付和安全检测公司。',
  },
  {
    year: 'Later',
    title: '公司包商业化',
    description: '员工模板和公司制度包必须脱敏后进入售卖流程，不能携带公司机密。',
  },
];

const Timeline = () => {
  return (
    <div className="relative py-12">
      {/* Vertical Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border" />

      <div className="space-y-12">
        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between w-full ${
              index % 2 === 0 ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Content */}
            <div className="w-5/12">
              <div className={`p-6 rounded-[20px] bg-card border border-border shadow-sm hover:shadow-md transition-all ${
                index % 2 === 0 ? 'text-left' : 'text-right'
              }`}>
                <div className="text-primary font-bold text-xl mb-2">{event.year}</div>
                <h3 className="text-foreground font-bold text-lg mb-2">{event.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Dot */}
            <div className="w-4 h-4 rounded-full bg-background border-4 border-primary z-10 shadow-sm" />

            {/* Empty Space */}
            <div className="w-5/12" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
