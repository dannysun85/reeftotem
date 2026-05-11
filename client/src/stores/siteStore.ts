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

type SiteConfigResponse = {
  value?: SiteConfig;
};

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const defaultSiteConfig: SiteConfig = {
  logo: {
    url: '',
    alt: 'ReefTotem',
  },
  banner: {
    title: 'ReefTotem',
    subtitle: '深圳前海瑞孚图腾科技有限公司，建设 AI 软件产品、企业自动化、量化研究工具和行业安全能力。',
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
          const response = await request.get(`/content/config/site_info?t=${Date.now()}`) as SiteConfigResponse;
          if (response && response.value) {
            set({ siteConfig: response.value, isLoading: false });
          } else {
             set({ isLoading: false });
          }
        } catch (err: unknown) {
          console.error('Failed to fetch site config', err);
          set({ isLoading: false, error: errorMessage(err, 'Failed to fetch config') });
        }
      },
    }),
    {
      name: 'reeftotem-site-config',
      version: 2, // Increment version to invalidate old cache
    }
  )
);
