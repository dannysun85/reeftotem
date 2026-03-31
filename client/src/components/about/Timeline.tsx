import React from 'react';
import { motion } from 'framer-motion';

const events = [
  {
    year: '2016',
    title: '公司成立',
    description: 'ReefTotem 在深圳成立，确立了"让 AI 更有温度"的核心愿景。',
  },
  {
    year: '2023 Q3',
    title: '获得天使轮融资',
    description: '获得顶级风投机构数千万美元投资，加速核心技术研发。',
  },
  {
    year: '2024 Q1',
    title: '发布 AI 助手 Beta 版',
    description: '首款二次元 AI 伴侣内测上线，获得首批 10 万种子用户。',
  },
  {
    year: '2024 Q3',
    title: 'Agent 服务商业化',
    description: '推出面向企业的智能 Agent 解决方案，赋能千行百业。',
  },
  {
    year: '2025',
    title: '全球化战略',
    description: '开启海外市场拓展，致力于成为全球领先的 AI 交互平台。',
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
