import React, { useState } from 'react';
import { useDownloadsStore, DownloadItem } from '@/stores/downloads';
import { Button } from '@/components/common/Button';
import { Plus, Trash2, Edit2, Download, Package } from 'lucide-react';

const DownloadView = () => {
  const { items, createItem, updateItem, deleteItem } = useDownloadsStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<DownloadItem>>({});

  React.useEffect(() => {
    useDownloadsStore.getState().fetchItems();
  }, []);

  const handleAdd = () => {
    setIsEditing('new');
    setForm({
      name: '',
      version: '',
      platform: '',
      os_type: 'windows',
      category: 'reeftotem',
      package_url: '',
      file_size: '',
      release_date: new Date().toISOString().split('T')[0],
      description: '',
      is_visible: true,
      is_latest: true,
    });
  };

  const handleEdit = (item: DownloadItem) => {
    setIsEditing(item.id);
    setForm(item);
  };

  const handleSave = async () => {
    if (!form.name || !form.package_url) return alert('名称和下载链接必填');
    
    if (isEditing === 'new') {
      await createItem(form);
    } else if (isEditing) {
      await updateItem(isEditing, form);
    }
    setIsEditing(null);
    setForm({});
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除该下载项吗？')) {
      await deleteItem(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">下载管理</h2>
          <p className="text-muted-foreground">发布新版本与管理安装包</p>
        </div>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          发布新版本
        </Button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-[24px] p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-foreground mb-6">
              {isEditing === 'new' ? '发布新版本' : '编辑下载项'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">软件名称</label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">版本号</label>
                <input
                  type="text"
                  value={form.version || ''}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">所属软件</label>
                <select
                  value={form.category || 'reeftotem'}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="reeftotem">ReefTotem</option>
                  <option value="openclaw">OpenClaw</option>
                  <option value="quant">量化软件</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">操作系统</label>
                <select
                  value={form.os_type || 'windows'}
                  onChange={(e) => setForm({ ...form, os_type: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="windows">Windows</option>
                  <option value="mac">macOS</option>
                  <option value="linux">Linux</option>
                  <option value="ios">iOS</option>
                  <option value="android">Android</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">平台显示名称</label>
                <input
                  type="text"
                  value={form.platform || ''}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">下载链接</label>
                <input
                  type="text"
                  value={form.package_url || ''}
                  onChange={(e) => setForm({ ...form, package_url: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">文件大小 (文本)</label>
                <input
                  type="text"
                  value={form.file_size || ''}
                  onChange={(e) => setForm({ ...form, file_size: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">发布日期</label>
                <input
                  type="date"
                  value={form.release_date ? form.release_date.split('T')[0] : ''}
                  onChange={(e) => setForm({ ...form, release_date: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">描述</label>
                <textarea
                  rows={3}
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-6">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(null)}>取消</Button>
              <Button size="sm" onClick={handleSave}>保存</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-[24px] p-6 flex items-center justify-between hover:shadow-sm transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-md">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center">
                  {item.name}
                  <span className="ml-3 text-xs font-normal text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    v{item.version}
                  </span>
                  <span className="ml-2 text-xs font-normal text-muted-foreground border border-border px-2 py-0.5 rounded uppercase">
                    {item.os_type}
                  </span>
                  <span className="ml-2 text-xs font-normal text-foreground border border-border px-2 py-0.5 rounded uppercase bg-secondary">
                    {item.category}
                  </span>
                </h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                  <span>{item.platform}</span>
                  <span>•</span>
                  <span>{item.file_size}</span>
                  <span>•</span>
                  <span>{new Date(item.release_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right hidden md:block">
                <div className="text-2xl font-bold text-foreground flex items-center justify-end">
                  <Download className="w-4 h-4 mr-2 text-muted-foreground" />
                  {item.download_count?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Downloads</div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(item)}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-secondary/30 rounded-[24px] border border-border border-dashed">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无下载项，点击右上角添加</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadView;
