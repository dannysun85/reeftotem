import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import request from '@/api/request';

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
    contactPhone?: string;
    address?: string;
  };
};

type SiteState = {
  siteConfig: SiteConfig;
  isLoading: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
};

const defaultSiteConfig: SiteConfig = {
  logo: {
    url: '',
    alt: 'ReefTotem',
  },
  banner: {
    title: 'ReefTotem AI 公司操作系统',
    subtitle: '深圳前海瑞孚图腾科技有限公司正在建设面向真实公司运营的 AI 员工协作与交付平台。',
    ctaText: '进入控制台',
    ctaLink: '/products',
    backgroundUrl: '',
  },
  footer: {
    copyright: '© 2026 深圳前海瑞孚图腾科技有限公司 All rights reserved.',
    contactEmail: 'contact@reeftotem.ai',
    address: '深圳市前海深港合作区',
  },
};

export const useSiteStore = create<SiteState>()(
  persist(
    (set) => ({
      siteConfig: defaultSiteConfig,
      isLoading: false,
      error: null,
      fetchConfig: async () => {
        set({ isLoading: true, error: null });
        try {
          // Add timestamp to prevent caching
          const response: any = await request.get(`/content/config/site_info?t=${Date.now()}`);
          if (response && response.value) {
            set({ siteConfig: response.value, isLoading: false });
          } else {
             set({ isLoading: false });
          }
        } catch (err: any) {
          console.error('Failed to fetch site config', err);
          set({ isLoading: false, error: err.message || 'Failed to fetch config' });
        }
      },
    }),
    {
      name: 'reeftotem-site-config',
      version: 2, // Increment version to invalidate old cache
    }
  )
);
