import React, { useState } from 'react';
import { useContentStore, ContentItem } from '@/stores/contentStore';
import { Button } from '@/components/common/Button';
import { Edit2, Trash2, Plus, MoveUp, MoveDown, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import ContentItemDialog from './ContentItemDialog';

interface ContentItemListProps {
  type: string;
  title: string;
}

const ContentItemList: React.FC<ContentItemListProps> = ({ type, title }) => {
  const { items, fetchItems, deleteItem, updateItem, isLoading } = useContentStore();
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  React.useEffect(() => {
    fetchItems(type);
  }, [type, fetchItems]);

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个项目吗？')) {
      await deleteItem(id);
    }
  };

  const handleToggleActive = async (item: ContentItem) => {
    await updateItem(item.id, { is_active: !item.is_active });
  };

  const filteredItems = items.filter(i => i.type === type).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">{title}</h3>
        <Button onClick={() => { setSelectedItem(null); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          添加新项
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading && filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">加载中...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border">
            暂无内容，点击上方按钮添加
          </div>
        ) : (
          filteredItems.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-foreground truncate">{item.title}</span>
                  {!item.is_active && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs">已禁用</span>
                  )}
                  <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
                    排序: {item.sort_order}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.content || item.subtitle}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleActive(item)}
                  title={item.is_active ? "禁用" : "启用"}
                >
                  {item.is_active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSelectedItem(item); setIsDialogOpen(true); }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {isDialogOpen && (
        <ContentItemDialog
          type={type}
          item={selectedItem}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default ContentItemList;
