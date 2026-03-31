import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { useSiteStore } from '@/stores/siteStore';
import { useContentStore } from '@/stores/contentStore';
import { Link } from 'react-router-dom';
import DigitalLifeCore from '@/components/home/DigitalLifeCore';

const HeroSection = () => {
  const { siteConfig, fetchConfig } = useSiteStore();
  const { heroBadge, heroStats, fetchAllContent } = useContentStore();
  const { banner } = siteConfig;

  useEffect(() => {
    fetchConfig();
    fetchAllContent();
  }, [fetchConfig, fetchAllContent]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        {banner.backgroundUrl ? (
          <div 
            className="absolute inset-0 bg-cover bg-center z-[-1] opacity-50"
            style={{ backgroundImage: `url(${banner.backgroundUrl})` }}
          />
        ) : (
          <>
             {/* Main Gradient */}
             <div className="absolute top-[-30%] left-[-20%] w-[100%] h-[100%] bg-blue-100/30 rounded-full blur-[150px] animate-pulse" />
             <div className="absolute bottom-[-30%] right-[-20%] w-[100%] h-[100%] bg-purple-100/30 rounded-full blur-[150px] animate-pulse delay-1000" />
             
             {/* Subtle Grid Pattern */}
             <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center lg:text-left relative z-20"
        >
          {heroBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-8"
            >
               <span className="px-4 py-1.5 rounded-full border border-primary/20 bg-white/60 backdrop-blur-md text-primary text-xs font-semibold uppercase tracking-wide shadow-sm">
                 {heroBadge.title}
               </span>
            </motion.div>
          )}

          <h1 className="text-5xl md:text-7xl font-sans font-bold leading-tight mb-8 tracking-tight text-foreground drop-shadow-sm">
            <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {banner.title.split(' ')[0]}
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              {banner.title.split(' ').slice(1).join(' ') || '智能数字生命'}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
            {banner.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to={banner.ctaLink || "/downloads"}>
              <Button size="lg" className="w-full sm:w-auto px-10 h-14 rounded-full text-lg font-medium shadow-lg hover:shadow-primary/25 hover:-translate-y-1 hover:brightness-110 transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 border-none">
                {banner.ctaText || "前往下载"}
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 rounded-full border border-gray-200 bg-white/50 backdrop-blur-md hover:bg-white hover:text-primary transition-all duration-300 text-lg">
                产品介绍
              </Button>
            </Link>
          </div>

          <div className="mt-20 flex items-center justify-center lg:justify-start space-x-12 pt-8 border-t border-gray-200/50">
            {heroStats.map((stat) => (
              <div key={stat.id} className="flex flex-col">
                <span className="text-3xl font-bold text-foreground mb-1 tracking-tight">{stat.content}</span>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visual Content - Digital Life Core */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:block perspective-1000"
        >
          <DigitalLifeCore />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
