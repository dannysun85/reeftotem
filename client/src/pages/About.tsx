import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Timeline from '@/components/about/Timeline';
import TeamMember from '@/components/about/TeamMember';
import { useContentStore } from '@/stores/contentStore';

const About = () => {
  const { team, fetchAllContent, isLoading } = useContentStore();

  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Vision Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent z-0" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-foreground mb-8 tracking-tight"
          >
            我们的愿景
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light"
          >
            "赋予 AI 灵魂，连接虚拟与现实。我们相信，未来的 AI 不仅仅是工具，更是能够理解、共情、陪伴人类的伙伴。"
          </motion.p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground text-center mb-16"
          >
            发展历程
          </motion.h2>
          <Timeline />
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground text-center mb-16"
          >
            核心团队
          </motion.h2>
          
          {isLoading && team.length === 0 ? (
            <div className="text-center text-muted-foreground">Loading team members...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {team.map((member) => (
                <TeamMember 
                  key={member.id} 
                  name={member.title}
                  role={member.subtitle || ''}
                  image={member.image_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&auto=format&fit=crop&q=60'}
                  bio={member.content || ''}
                  socials={member.meta_data?.socials || {}}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
