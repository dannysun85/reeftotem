import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { X, Save } from 'lucide-react';
import { Product, useProductsStore } from '@/stores/productsStore';

interface ProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ product, isOpen, onClose }) => {
  const { createProduct, updateProduct, isLoading } = useProductsStore();
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    short_desc: '',
    full_desc: '',
    icon_url: '',
    cover_image_url: '',
    features: [],
    sort_order: 0,
    is_published: true,
    docs_url: '',
    docs_content: '',
  });

  const [featuresInput, setFeaturesInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData(product);
      setFeaturesInput(product.features?.join('\n') || '');
    } else {
      setFormData({
        name: '',
        slug: '',
        short_desc: '',
        full_desc: '',
        icon_url: '',
        cover_image_url: '',
        features: [],
        sort_order: 0,
        is_published: true,
        docs_url: '',
        docs_content: '',
      });
      setFeaturesInput('');
    }
  }, [product]);

  const handleChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeaturesChange = (value: string) => {
    setFeaturesInput(value);
    setFormData((prev) => ({
      ...prev,
      features: value.split('\n').filter(line => line.trim() !== ''),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      await updateProduct(product.id, formData);
    } else {
      await createProduct(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-background rounded-2xl w-full max-w-2xl p-6 shadow-xl border border-border my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{product ? '编辑产品' : '新建产品'}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">产品名称 *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL 路径) *</label>
              <input
                required
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="e.g. reeftotem-ai"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">简短描述</label>
            <input
              type="text"
              value={formData.short_desc || ''}
              onChange={(e) => handleChange('short_desc', e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">详细介绍</label>
            <textarea
              value={formData.full_desc || ''}
              onChange={(e) => handleChange('full_desc', e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">图标 URL</label>
              <input
                type="text"
                value={formData.icon_url || ''}
                onChange={(e) => handleChange('icon_url', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">封面图 URL</label>
              <input
                type="text"
                value={formData.cover_image_url || ''}
                onChange={(e) => handleChange('cover_image_url', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">产品特性 (每行一个)</label>
            <textarea
              value={featuresInput}
              onChange={(e) => handleFeaturesChange(e.target.value)}
              placeholder="- 特性 1\n- 特性 2"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 h-24 font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">文档链接</label>
              <input
                type="text"
                value={formData.docs_url || ''}
                onChange={(e) => handleChange('docs_url', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">排序</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => handleChange('sort_order', parseInt(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">状态</label>
                <select
                  value={formData.is_published ? 'published' : 'draft'}
                  onChange={(e) => handleChange('is_published', e.target.value === 'published')}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2"
                >
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 gap-3">
            <Button type="button" variant="outline" onClick={onClose}>取消</Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductDialog;
