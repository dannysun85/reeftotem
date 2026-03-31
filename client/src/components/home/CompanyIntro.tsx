import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { ArrowRight } from 'lucide-react';
import { useContentStore } from '@/stores/contentStore';
import { useSiteStore } from '@/stores/siteStore';

const CompanyIntro = () => {
  const { companyIntro, stats, fetchAllContent } = useContentStore();

  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  if (!companyIntro) return null;

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-[32px] overflow-hidden shadow-apple border border-white/50 group">
              <div 
                className="aspect-video bg-gray-100 flex items-center justify-center bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${companyIntro.image_url || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop'}')` }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-apple hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-xl">AI</span>
                  </div>
                  <div>
                    <div className="text-foreground font-bold">{companyIntro.subtitle || '核心技术驱动'}</div>
                    <div className="text-xs text-muted-foreground">{companyIntro.meta_data?.floating_text || '自主研发大模型架构'}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              {companyIntro.title.split(' ').map((part, i) => (
                <span key={i} className={i === 1 ? "text-primary ml-2" : ""}>{part}</span>
              ))}
            </h2>
            
            <div className="text-muted-foreground text-lg mb-8 leading-relaxed whitespace-pre-line">
              {companyIntro.content}
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
              {stats.map((stat, index) => (
                <React.Fragment key={stat.id}>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-foreground">{stat.content}</span>
                    <span className="text-sm text-muted-foreground font-medium">{stat.title}</span>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="w-px h-12 bg-border hidden sm:block" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <Button variant="outline" className="mt-10 group rounded-full px-8" onClick={() => window.location.href='/about'}>
              了解更多
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;
