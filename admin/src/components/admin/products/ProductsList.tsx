import React, { useState } from 'react';
import { useProductsStore, Product } from '@/stores/productsStore';
import { Button } from '@/components/common/Button';
import { Edit2, Trash2, Plus, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';
import ProductDialog from './ProductDialog';

const ProductsList = () => {
  const { products, fetchProducts, deleteProduct, updateProduct, isLoading } = useProductsStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个产品吗？删除后将无法恢复。')) {
      await deleteProduct(id);
    }
  };

  const handleTogglePublish = async (product: Product) => {
    await updateProduct(product.id, { is_published: !product.is_published });
  };

  const sortedProducts = [...products].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">产品列表</h3>
        <Button onClick={() => { setSelectedProduct(null); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          添加新产品
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading && products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">加载中...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border">
            暂无产品数据，点击上方按钮添加
          </div>
        ) : (
          sortedProducts.map((product) => (
            <div 
              key={product.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-background rounded-xl border border-border hover:shadow-md transition-shadow gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                {product.icon_url ? (
                  <img src={product.icon_url} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-secondary" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {product.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground text-lg">{product.name}</span>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full font-mono">
                      /{product.slug}
                    </span>
                    {!product.is_published && (
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs">未发布</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{product.short_desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                {product.docs_url && (
                   <a href={product.docs_url} target="_blank" rel="noreferrer" className="p-2 text-muted-foreground hover:text-primary transition-colors">
                     <ExternalLink className="w-4 h-4" />
                   </a>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTogglePublish(product)}
                  title={product.is_published ? "下架" : "发布"}
                >
                  {product.is_published ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSelectedProduct(product); setIsDialogOpen(true); }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {isDialogOpen && (
        <ProductDialog
          product={selectedProduct}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductsList;
