import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  joinedAt: string;
};

export type SiteConfig = {
  logo: {
    url: string; // If empty, use default SVG
    alt: string;
  };
  banner: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    backgroundUrl: string; // If empty, use default particles/gradient
  };
  footer: {
    copyright: string;
    contactEmail: string;
  };
};

export type DashboardStats = {
  totalVisits: number;
  activeUsers: number;
  totalDownloads: number;
  revenue: number; // Just for show
};

type AdminState = {
  siteConfig: SiteConfig;
  users: User[];
  stats: DashboardStats;
  
  updateSiteConfig: (patch: Partial<SiteConfig>) => void;
  updateBanner: (patch: Partial<SiteConfig['banner']>) => void;
  updateLogo: (patch: Partial<SiteConfig['logo']>) => void;
  
  addUser: (user: Omit<User, 'id' | 'joinedAt'>) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  updateStats: (patch: Partial<DashboardStats>) => void;
};

const defaultSiteConfig: SiteConfig = {
  logo: {
    url: '',
    alt: 'ReefTotem',
  },
  banner: {
    title: '定义未来的智能数字生命',
    subtitle: 'ReefTotem 瑞孚图腾致力于打造具备情感与智慧的 AI 伴侣。通过先进的大模型技术与二次元美学，为您连接虚拟与现实的桥梁。',
    ctaText: '开始体验',
    ctaLink: '/products',
    backgroundUrl: '',
  },
  footer: {
    copyright: '© 2026 深圳前海瑞孚图腾科技有限公司 All rights reserved.',
    contactEmail: 'contact@reeftotem.ai',
  },
};

const defaultUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@reeftotem.ai', role: 'admin', status: 'active', joinedAt: '2026-01-01' },
  { id: '2', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joinedAt: '2026-02-15' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'inactive', joinedAt: '2026-02-20' },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      siteConfig: defaultSiteConfig,
      users: defaultUsers,
      stats: {
        totalVisits: 12543,
        activeUsers: 892,
        totalDownloads: 2096,
        revenue: 0,
      },

      updateSiteConfig: (patch) =>
        set((state) => ({ siteConfig: { ...state.siteConfig, ...patch } })),
      
      updateBanner: (patch) =>
        set((state) => ({
          siteConfig: {
            ...state.siteConfig,
            banner: { ...state.siteConfig.banner, ...patch },
          },
        })),

      updateLogo: (patch) =>
        set((state) => ({
          siteConfig: {
            ...state.siteConfig,
            logo: { ...state.siteConfig.logo, ...patch },
          },
        })),

      addUser: (user) =>
        set((state) => ({
          users: [
            ...state.users,
            {
              id: crypto.randomUUID(),
              joinedAt: new Date().toISOString().split('T')[0],
              ...user,
            },
          ],
        })),

      updateUser: (id, patch) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      updateStats: (patch) =>
        set((state) => ({ stats: { ...state.stats, ...patch } })),
    }),
    {
      name: 'reeftotem-admin',
      version: 1,
    }
  )
);
