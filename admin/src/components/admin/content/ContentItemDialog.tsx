import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { X, Save } from 'lucide-react';
import { ContentItem, useContentStore } from '@/stores/contentStore';

interface ContentItemDialogProps {
  type: string;
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ContentItemDialog: React.FC<ContentItemDialogProps> = ({ type, item, isOpen, onClose }) => {
  const { createItem, updateItem, isLoading } = useContentStore();
  const [formData, setFormData] = useState<Partial<ContentItem>>({
    type,
    title: '',
    subtitle: '',
    content: '',
    sort_order: 0,
    is_active: true,
    meta_data: {},
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        type,
        title: '',
        subtitle: '',
        content: '',
        sort_order: 0,
        is_active: true,
        meta_data: {},
      });
    }
  }, [item, type]);

  const handleChange = (field: keyof ContentItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMetaChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      meta_data: { ...prev.meta_data, [key]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      await updateItem(item.id, formData);
    } else {
      await createItem(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-2xl w-full max-w-lg p-6 shadow-xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">{item ? '编辑项目' : '新建项目'}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">标题</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">副标题</label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">内容详情</label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">排序权重</label>
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
                value={formData.is_active ? 'active' : 'inactive'}
                onChange={(e) => handleChange('is_active', e.target.value === 'active')}
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
              >
                <option value="active">启用</option>
                <option value="inactive">禁用</option>
              </select>
            </div>
          </div>

          {/* Conditional Fields based on type */}
          {type === 'feature' && (
            <div className="space-y-2 border-t pt-4">
              <h4 className="font-medium text-sm">图标配置</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">图标名称 (Lucide)</label>
                  <input
                    type="text"
                    value={formData.meta_data?.icon || ''}
                    onChange={(e) => handleMetaChange('icon', e.target.value)}
                    placeholder="e.g. Zap"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">颜色类名 (Tailwind)</label>
                  <input
                    type="text"
                    value={formData.meta_data?.color || ''}
                    onChange={(e) => handleMetaChange('color', e.target.value)}
                    placeholder="e.g. text-blue-500"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

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

export default ContentItemDialog;
