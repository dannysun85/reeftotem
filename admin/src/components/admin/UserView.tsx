import React, { useState, useEffect } from 'react';
import { useUsersStore, User } from '@/stores/usersStore';
import { Button } from '@/components/common/Button';
import { Plus, Trash2, Edit2, UserCheck, UserX } from 'lucide-react';

const UserView = () => {
  const { users, fetchUsers, createUser, updateUser, deleteUser, isLoading } = useUsersStore();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<User> & { password?: string }>({});

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAdd = () => {
    setIsEditing('new');
    setForm({ email: '', full_name: '', is_active: true, is_superuser: false, password: '' });
  };

  const handleEdit = (user: User) => {
    setIsEditing(user.id);
    setForm(user);
  };

  const handleSave = async () => {
    if (isEditing === 'new') {
      if (!form.email || !form.password) return alert('邮箱和密码必填');
      await createUser(form);
    } else if (isEditing) {
      await updateUser(isEditing, form);
    }
    setIsEditing(null);
    setForm({});
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除该用户吗？')) {
      await deleteUser(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">用户管理</h2>
          <p className="text-muted-foreground">管理注册用户与管理员权限</p>
        </div>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          新增用户
        </Button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-[24px] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-foreground mb-6">
              {isEditing === 'new' ? '新增用户' : '编辑用户'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">姓名</label>
                <input
                  type="text"
                  value={form.full_name || ''}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">邮箱</label>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  密码 {isEditing !== 'new' && '(留空不修改)'}
                </label>
                <input
                  type="password"
                  value={form.password || ''}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">角色</label>
                  <select
                    value={form.is_superuser ? 'admin' : 'user'}
                    onChange={(e) => setForm({ ...form, is_superuser: e.target.value === 'admin' })}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="user">普通用户</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">状态</label>
                  <select
                    value={form.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setForm({ ...form, is_active: e.target.value === 'active' })}
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="active">活跃</option>
                    <option value="inactive">停用</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(null)}>取消</Button>
                <Button size="sm" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? '保存中...' : '保存'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-secondary text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">用户</th>
              <th className="px-6 py-4 font-medium">角色</th>
              <th className="px-6 py-4 font-medium">状态</th>
              <th className="px-6 py-4 font-medium">注册时间</th>
              <th className="px-6 py-4 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-bold text-xs mr-3">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-foreground font-medium text-sm">{user.full_name || 'N/A'}</div>
                      <div className="text-muted-foreground text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded border ${
                    user.is_superuser 
                      ? 'border-primary/20 text-primary bg-primary/5' 
                      : 'border-border text-muted-foreground bg-secondary'
                  }`}>
                    {user.is_superuser ? '管理员' : '用户'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm">
                    {user.is_active ? (
                      <>
                        <UserCheck className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-green-500">活跃</span>
                      </>
                    ) : (
                      <>
                        <UserX className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-red-500">停用</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground text-sm font-mono">
                  {new Date(user.created_at || '').toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleEdit(user)}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserView;
