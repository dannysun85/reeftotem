import React from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { useDownloadsStore } from '@/stores/downloads';
import { Users, Download, Eye, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full flex items-center">
        <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
      </span>
    </div>
    <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-foreground mt-1 tracking-tight">{value}</p>
  </div>
);

const DashboardView = () => {
  const { stats, users } = useAdminStore();
  const { items: downloads } = useDownloadsStore();
  
  // Calculate total downloads from all items
  const realTotalDownloads = downloads.reduce((acc, item) => acc + (item.download_count || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">仪表盘</h2>
        <p className="text-muted-foreground">网站运营数据概览</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="总访问量" 
          value={stats.totalVisits.toLocaleString()} 
          icon={Eye} 
          color="from-blue-500 to-cyan-500" 
        />
        <StatCard 
          title="活跃用户" 
          value={users.length} 
          icon={Users} 
          color="from-purple-500 to-pink-500" 
        />
        <StatCard 
          title="总下载量" 
          value={realTotalDownloads.toLocaleString()} 
          icon={Download} 
          color="from-green-500 to-emerald-500" 
        />
        <StatCard 
          title="今日新增" 
          value="128" 
          icon={TrendingUp} 
          color="from-orange-500 to-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">下载排行</h3>
          <div className="space-y-4">
            {downloads.sort((a, b) => (b.download_count || 0) - (a.download_count || 0)).slice(0, 5).map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors">
                <div className="flex items-center space-x-4">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-primary text-white shadow-sm' : 'bg-secondary text-muted-foreground'}`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-foreground font-medium text-sm">{item.name}</p>
                    <p className="text-muted-foreground text-xs">{item.platform}</p>
                  </div>
                </div>
                <span className="text-primary font-mono font-bold">{item.download_count?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">最近注册用户</h3>
          <div className="space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-foreground">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">{user.name}</p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {user.status === 'active' ? '活跃' : '停用'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
