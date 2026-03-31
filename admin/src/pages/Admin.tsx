import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Image, Users, Download, Settings, LogOut, Menu, X, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardView from '@/components/admin/DashboardView';
import ContentView from '@/components/admin/ContentView';
import UserView from '@/components/admin/UserView';
import DownloadView from '@/components/admin/DownloadView';
import ProductsList from '@/components/admin/products/ProductsList';
import { useAuthStore } from '@/stores/authStore';

type Tab = 'dashboard' | 'content' | 'products' | 'users' | 'downloads' | 'settings';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuthStore();

  const tabs = [
    { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
    { id: 'content', label: '内容管理', icon: Image },
    { id: 'products', label: '产品管理', icon: Box },
    { id: 'downloads', label: '下载管理', icon: Download },
    { id: 'users', label: '用户管理', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'content': return <ContentView />;
      case 'products': return <ProductsList />;
      case 'users': return <UserView />;
      case 'downloads': return <DownloadView />;
      default: return <DashboardView />;
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-background flex font-sans text-foreground">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="fixed top-0 left-0 bottom-0 z-40 bg-card border-r border-border flex flex-col transition-all duration-300 shadow-sm"
      >
        <div className="h-20 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary shrink-0 flex items-center justify-center text-white font-bold">R</div>
            <span className={cn("font-bold text-foreground text-lg whitespace-nowrap transition-opacity duration-200", !isSidebarOpen && "opacity-0")}>
              ReefTotem Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                activeTab === tab.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <tab.icon className={cn("w-5 h-5 shrink-0", activeTab === tab.id && "text-primary")} />
              <span className={cn("font-medium whitespace-nowrap transition-opacity duration-200", !isSidebarOpen && "opacity-0 hidden")}>
                {tab.label}
              </span>
              
              {/* Tooltip for collapsed state */}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-foreground text-background text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {tab.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={cn("font-medium whitespace-nowrap transition-opacity duration-200", !isSidebarOpen && "opacity-0 hidden")}>
              退出登录
            </span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 min-h-screen transition-all duration-300 pt-20",
          isSidebarOpen ? "ml-[260px]" : "ml-[80px]"
        )}
      >
        {/* Top Header */}
        <header className="fixed top-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-border h-20 flex items-center justify-between px-8"
          style={{ left: isSidebarOpen ? 260 : 80, transition: 'left 300ms' }}
        >
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-sm font-bold text-foreground">Admin User</div>
              <div className="text-xs text-muted-foreground">Super Administrator</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground">A</div>
          </div>
        </header>

        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
