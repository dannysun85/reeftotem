import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ChevronDown, Monitor, Smartphone, Globe, Box, LineChart, Bot } from 'lucide-react';
import { useDownloadsStore, DownloadItem } from '@/stores/downloads';
import { Button } from '@/components/common/Button';
import { useOS } from '@/hooks/useOS';
import { cn } from '@/lib/utils';

// Helper to format bytes
const formatSize = (bytes: number) => {
  if (!bytes) return 'Unknown size';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Helper to map category to display info
const SOFTWARE_INFO = {
  reeftotem: {
    title: 'ReefTotem',
    subtitle: 'AI 二次元助手',
    icon: Bot,
    color: 'bg-blue-500',
  },
  openclaw: {
    title: 'OpenClaw',
    subtitle: '智能 Agent 系统',
    icon: Box,
    color: 'bg-purple-500',
  },
  quant: {
    title: 'ReefQuant',
    subtitle: '专业量化交易终端',
    icon: LineChart,
    color: 'bg-emerald-500',
  },
  other: {
    title: 'Other Tools',
    subtitle: '其他工具',
    icon: Globe,
    color: 'bg-gray-500',
  },
};

const Downloads = () => {
  const { items, incrementDownload, fetchItems, isLoading } = useDownloadsStore();
  const currentOS = useOS();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, DownloadItem[]> = {
      reeftotem: [],
      openclaw: [],
      quant: [],
      other: [],
    };

    items.forEach((item) => {
      // Assuming item.category is derived from product_id or stored in a way we can map
      // For now, let's assume item.category field exists or we infer it.
      // Since API doesn't return category directly yet (it's in Product), we might need to fetch products or adjust API.
      // For MVP, let's assume API returns a category field (we added it to DownloadItem schema but maybe not filled).
      // Or we map product_id to category if possible.
      // Let's rely on 'category' being passed through if the backend joins it, or just default to 'other'.
      const category = (item as any).category || 'other'; 
      if (groups[category]) {
        groups[category].push(item);
      } else {
        if (!groups['other']) groups['other'] = [];
        groups['other'].push(item);
      }
    });

    return groups;
  }, [items]);

  const toggleExpand = (category: string) => {
    setExpandedItems(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const renderSoftwareSection = (category: string, items: DownloadItem[]) => {
    if (items.length === 0) return null;

    const info = SOFTWARE_INFO[category as keyof typeof SOFTWARE_INFO] || SOFTWARE_INFO.other;
    const Icon = info.icon;

    // Find best match for current OS
    const recommendedItem = items.find(item => item.os_type === currentOS) || items[0];
    const otherItems = items.filter(item => item.id !== recommendedItem.id);
    const isExpanded = expandedItems[category];

    return (
      <motion.div
        key={category}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card border border-border/50 rounded-3xl p-8 shadow-apple mb-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className={cn("w-24 h-24 rounded-[22px] flex items-center justify-center text-white shadow-lg shrink-0", info.color)}>
            <Icon className="w-12 h-12" />
          </div>
          
          <div className="flex-grow">
            <h2 className="text-3xl font-bold text-foreground mb-2">{info.title}</h2>
            <p className="text-lg text-muted-foreground">{info.subtitle}</p>
          </div>

          <div className="w-full md:w-auto flex flex-col items-center gap-3">
            <Button
              size="lg"
              className="w-full md:w-48 rounded-full font-semibold shadow-md bg-primary hover:bg-primary/90 text-white text-lg h-12"
              onClick={() => {
                incrementDownload(recommendedItem.id);
                if (recommendedItem.package_url) window.open(recommendedItem.package_url, '_blank', 'noopener,noreferrer');
              }}
            >
              获取
            </Button>
            <div className="text-xs text-muted-foreground text-center">
              <p>适用于 {recommendedItem.platform}</p>
              <p className="mt-0.5 text-[10px] opacity-70">v{recommendedItem.version} • {recommendedItem.file_size}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {/* <div className="bg-secondary/50 rounded-2xl p-6 mb-6 border border-border/50">
          <p className="text-foreground/80 leading-relaxed">
            {recommendedItem.description || '体验最新版本的软件，享受更流畅的操作与更强大的功能。'}
          </p>
        </div> */}

        {/* Other Versions Toggle */}
        {otherItems.length > 0 && (
          <div className="border-t border-border pt-6">
            <button 
              onClick={() => toggleExpand(category)}
              className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              查看其他版本与平台
              <ChevronDown className={cn("ml-1 w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {otherItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/50">
                        <div className="flex items-center gap-3">
                          {item.os_type === 'windows' && <Monitor className="w-5 h-5 text-blue-500" />}
                          {item.os_type === 'mac' && <Monitor className="w-5 h-5 text-gray-500" />}
                          {item.os_type === 'android' && <Smartphone className="w-5 h-5 text-green-500" />}
                          {item.os_type === 'ios' && <Smartphone className="w-5 h-5 text-gray-900 dark:text-gray-100" />}
                          
                          <div>
                            <div className="text-sm font-medium text-foreground">{item.platform}</div>
                            <div className="text-xs text-muted-foreground">v{item.version} • {item.file_size}</div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="rounded-full bg-white dark:bg-gray-800 shadow-sm text-primary"
                          onClick={() => {
                            incrementDownload(item.id);
                            if (item.package_url) window.open(item.package_url, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    );
  };

  if (isLoading) {
    return <div className="min-h-screen pt-24 flex justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            下载中心
          </h1>
          <p className="text-xl text-muted-foreground">
            为您检测到的操作系统：
            <span className="text-foreground font-medium ml-2 capitalize">
              {currentOS === 'ios' ? 'iOS' : currentOS === 'mac' ? 'macOS' : currentOS}
            </span>
          </p>
        </motion.div>

        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">暂无可用下载</div>
        ) : (
          <div className="space-y-4">
            {renderSoftwareSection('reeftotem', groupedItems['reeftotem'])}
            {renderSoftwareSection('openclaw', groupedItems['openclaw'])}
            {renderSoftwareSection('quant', groupedItems['quant'])}
            {renderSoftwareSection('other', groupedItems['other'])}
          </div>
        )}
      </div>
    </div>
  );
};

export default Downloads;
