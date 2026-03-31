import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Bot, Box, LineChart, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductsStore } from '@/stores/products';

const PRODUCT_STYLES: Record<string, { icon: any, color: string }> = {
  reeftotem: { icon: Bot, color: 'from-blue-500 to-blue-600' },
  openclaw: { icon: Box, color: 'from-purple-500 to-purple-600' },
  quant: { icon: LineChart, color: 'from-emerald-500 to-emerald-600' },
  default: { icon: Box, color: 'from-gray-500 to-gray-600' }
};

const Products = () => {
  const { products, fetchProducts, isLoading } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) {
    return <div className="min-h-screen pt-24 flex justify-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            产品中心
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            探索我们为您精心打造的 AI 产品矩阵，开启智能生活新篇章
          </p>
        </motion.div>

        <div className="space-y-32">
          {products.map((product, index) => {
            const style = PRODUCT_STYLES[product.slug] || PRODUCT_STYLES.default;
            const Icon = style.icon;
            const align = index % 2 === 0 ? 'left' : 'right';

            return (
              <div key={product.id} className={`flex flex-col ${align === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-center`}>
                {/* Image Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-1/2"
                >
                  <div className="relative rounded-[32px] overflow-hidden shadow-apple border border-black/5 group">
                    <div className="aspect-[4/3] bg-secondary/30 flex items-center justify-center">
                      {product.cover_image_url ? (
                        <img
                          src={product.cover_image_url}
                          alt={product.name}
                          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <Icon className="w-24 h-24 text-muted-foreground/20" />
                      )}
                    </div>
                    
                    {/* Floating Icon */}
                    <div className={`absolute top-6 right-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${style.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Content Section */}
                <motion.div
                  initial={{ opacity: 0, x: align === 'left' ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full lg:w-1/2"
                >
                  <div className="inline-block mb-4">
                    <span className={`text-sm font-semibold uppercase tracking-wide bg-gradient-to-r ${style.color} bg-clip-text text-transparent`}>
                      {product.short_desc || 'AI Product'}
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                    {product.name}
                  </h2>
                  
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {product.full_desc || product.short_desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {product.features?.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center shrink-0`}>
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <Link to="/downloads">
                      <Button size="lg" className="rounded-full px-8 shadow-md">
                        立即下载
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    {(product.docs_url || product.docs_content) && (
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="rounded-full px-8"
                        onClick={() => {
                          if (product.docs_url) window.open(product.docs_url, '_blank', 'noopener,noreferrer');
                          // TODO: Handle internal docs_content routing
                        }}
                      >
                        查看文档
                      </Button>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;
