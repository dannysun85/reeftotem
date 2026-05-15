import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Image, Users, Download, LogOut, Menu, X, Box, ReceiptText } from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardView from '@/components/admin/DashboardView';
import ContentView from '@/components/admin/ContentView';
import UserView from '@/components/admin/UserView';
import DownloadView from '@/components/admin/DownloadView';
import ProductsList from '@/components/admin/products/ProductsList';
import BillingCenterView from '@/components/admin/BillingCenterView';
import { useAuthStore } from '@/stores/authStore';

type Tab = 'dashboard' | 'content' | 'products' | 'billing' | 'users' | 'downloads';

type AdminTab = {
  id: Tab;
  label: string;
  icon: React.ElementType;
  badge: '真实数据' | '待接前台' | '已接前台' | 'API';
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuthStore();

  const tabs: AdminTab[] = [
    { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard, badge: '真实数据' },
    { id: 'content', label: '内容管理', icon: Image, badge: '待接前台' },
    { id: 'products', label: '产品管理', icon: Box, badge: '已接前台' },
    { id: 'billing', label: '计费中心', icon: ReceiptText, badge: 'API' },
    { id: 'downloads', label: '下载管理', icon: Download, badge: '已接前台' },
    { id: 'users', label: '用户管理', icon: Users, badge: 'API' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'content': return <ContentView />;
      case 'products': return <ProductsList />;
      case 'billing': return <BillingCenterView />;
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
        animate={{ width: isSidebarOpen ? 286 : 80 }}
        className="fixed top-0 left-0 bottom-0 z-40 bg-card border-r border-border flex flex-col transition-all duration-300 shadow-sm"
      >
        <div className="h-20 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="/favicon.svg" alt="ReefTotem" className="h-9 w-9 shrink-0 rounded-xl" />
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
              <span className={cn("flex min-w-0 flex-1 items-center justify-between gap-2 transition-opacity duration-200", !isSidebarOpen && "opacity-0 hidden")}>
                <span className="truncate font-medium whitespace-nowrap">{tab.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold leading-4",
                    tab.badge === '待接前台'
                      ? "bg-amber-100 text-amber-700"
                      : tab.badge === '真实数据' || tab.badge === '已接前台'
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                  )}
                >
                  {tab.badge}
                </span>
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
          isSidebarOpen ? "ml-[286px]" : "ml-[80px]"
        )}
      >
        {/* Top Header */}
        <header className="fixed top-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-border h-20 flex items-center justify-between px-8"
          style={{ left: isSidebarOpen ? 286 : 80, transition: 'left 300ms' }}
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
