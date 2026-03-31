import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Bot, Zap, MessageSquare, Cpu } from 'lucide-react';

const DigitalLifeCore = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div 
      ref={containerRef}
      style={{ y, opacity }}
      className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center perspective-1000"
    >
      {/* 1. The Core Aura (Back Layer) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: 360
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-blue-400/30 via-purple-400/30 to-cyan-400/30 blur-[60px]"
        />
      </div>

      {/* 2. The Glass Sphere (Middle Layer) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, type: "spring" }}
        className="relative z-10 w-64 h-64 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden"
        style={{
          boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 40px rgba(255, 255, 255, 0.2)"
        }}
      >
        {/* Inner Pulse */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 blur-xl opacity-60"
        />
        
        {/* Core Icon */}
        <div className="relative z-20">
          <Bot className="w-20 h-20 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        </div>

        {/* Scanning Line Effect */}
        <motion.div
          animate={{ top: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
          className="absolute left-0 w-full h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent skew-y-12"
        />
      </motion.div>

      {/* 3. Floating Glass Cards (Front Layer) */}
      <FloatingCard 
        icon={MessageSquare} 
        label="Natural Language" 
        value="Processing..." 
        delay={0.5} 
        className="absolute top-10 left-0"
      />
      <FloatingCard 
        icon={Zap} 
        label="Response Time" 
        value="< 50ms" 
        delay={0.7} 
        className="absolute bottom-20 right-0"
      />
      <FloatingCard 
        icon={Cpu} 
        label="Neural Engine" 
        value="Active" 
        delay={0.9} 
        className="absolute top-1/2 -right-12"
      />

      {/* Orbital Rings */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full animate-[spin_20s_linear_infinite] opacity-30">
          <circle cx="50%" cy="50%" r="45%" fill="none" stroke="url(#grad1)" strokeWidth="1" strokeDasharray="10 20" />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  );
};

const FloatingCard = ({ icon: Icon, label, value, delay, className }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`
        p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/40 shadow-lg flex items-center space-x-3 cursor-default
        hover:shadow-xl hover:bg-white/50 transition-all duration-300
        ${className}
      `}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/80 to-white/40 flex items-center justify-center shadow-inner">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</div>
        <div className="text-sm font-bold text-foreground">{value}</div>
      </div>
    </motion.div>
  );
};

export default DigitalLifeCore;
