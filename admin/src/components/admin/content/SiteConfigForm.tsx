import React, { useEffect, useState } from 'react';
import { useContentStore, SiteConfig } from '@/stores/contentStore';
import { Button } from '@/components/common/Button';
import { Save, RefreshCw } from 'lucide-react';

const SiteConfigForm = () => {
  const { siteConfig, fetchConfig, updateConfig, isLoading } = useContentStore();
  const [formData, setFormData] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (siteConfig) {
      setFormData(siteConfig);
    }
  }, [siteConfig]);

  const handleChange = (section: keyof SiteConfig, field: string, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      updateConfig(formData);
    }
  };

  if (!formData) return <div>Loading config...</div>;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">全局站点配置</h3>
        <Button variant="outline" size="sm" onClick={() => fetchConfig()} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Banner Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg border-b pb-2">首页 Banner</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">标题</label>
              <input
                type="text"
                value={formData.banner.title}
                onChange={(e) => handleChange('banner', 'title', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">副标题</label>
              <textarea
                value={formData.banner.subtitle}
                onChange={(e) => handleChange('banner', 'subtitle', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">按钮文本</label>
                <input
                  type="text"
                  value={formData.banner.ctaText}
                  onChange={(e) => handleChange('banner', 'ctaText', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">按钮链接</label>
                <input
                  type="text"
                  value={formData.banner.ctaLink}
                  onChange={(e) => handleChange('banner', 'ctaLink', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg border-b pb-2">页脚信息</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">版权信息</label>
              <input
                type="text"
                value={formData.footer.copyright}
                onChange={(e) => handleChange('footer', 'copyright', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">联系邮箱</label>
              <input
                type="text"
                value={formData.footer.contactEmail}
                onChange={(e) => handleChange('footer', 'contactEmail', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">联系电话</label>
              <input
                type="text"
                value={formData.footer.contactPhone || ''}
                onChange={(e) => handleChange('footer', 'contactPhone', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">地址</label>
              <input
                type="text"
                value={formData.footer.address || ''}
                onChange={(e) => handleChange('footer', 'address', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? '保存中...' : '保存配置'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SiteConfigForm;
