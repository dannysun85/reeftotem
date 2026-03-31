import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Box, Code, Cpu, MessageSquare, Shield, Zap, Globe, Smartphone } from 'lucide-react';
import { useContentStore } from '@/stores/contentStore';

const ICON_MAP: Record<string, any> = {
  Box, Code, Cpu, MessageSquare, Shield, Zap, Globe, Smartphone
};

const ProductShowcase = () => {
  const { features, sectionTitles, fetchAllContent, isLoading } = useContentStore();

  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  const sectionTitle = sectionTitles.find(t => t.meta_data?.section === 'product_showcase');

  if (isLoading && features.length === 0) {
    return (
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          Loading features...
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight"
          >
            {sectionTitle ? (
              <>
                <span>{sectionTitle.title.split(' ')[0]}</span>
                <span className="text-primary"> {sectionTitle.title.split(' ').slice(1).join(' ')}</span>
              </>
            ) : (
              <>
                <span>探索</span>
                <span className="text-primary"> 无限可能</span>
              </>
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            {sectionTitle?.subtitle || '融合前沿 AI 技术与极致交互设计，为您打造前所未有的智能体验'}
          </motion.p>
        </div>

        {features.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No features available. Please check the backend or network connection.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <GlassCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const GlassCard = ({ feature, index }: { feature: any, index: number }) => {
  const iconName = feature.meta_data?.icon || 'Box';
  const Icon = ICON_MAP[iconName] || Box;
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative rounded-[24px] bg-white/40 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.4),
              transparent 80%
            )
          `,
        }}
      />
      
      <div className="relative h-full p-8 flex flex-col">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-white to-white/50 flex items-center justify-center mb-6 shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-7 h-7 text-primary" />
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
          {feature.content}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductShowcase;
