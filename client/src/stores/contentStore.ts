import { create } from 'zustand';
import request from '@/api/request';

export type ContentItem = {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  content?: string;
  image_url?: string;
  meta_data?: Record<string, any>;
  sort_order: number;
  is_active: boolean;
};

type ContentState = {
  features: ContentItem[];
  stats: ContentItem[];
  team: ContentItem[];
  milestones: ContentItem[];
  heroBadge: ContentItem | null;
  heroStats: ContentItem[];
  companyIntro: ContentItem | null;
  sectionTitles: ContentItem[];
  isLoading: boolean;
  error: string | null;
  fetchAllContent: () => Promise<void>;
};

export const useContentStore = create<ContentState>((set) => ({
  features: [],
  stats: [],
  team: [],
  milestones: [],
  heroBadge: null,
  heroStats: [],
  companyIntro: null,
  sectionTitles: [],
  isLoading: false,
  error: null,

  fetchAllContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await request.get('/content/items', {
        params: { is_active: true, limit: 100 }
      });
      
      if (Array.isArray(response)) {
        const items = response as ContentItem[];
        set({
          features: items.filter(i => i.type === 'feature').sort((a, b) => a.sort_order - b.sort_order),
          stats: items.filter(i => i.type === 'stat').sort((a, b) => a.sort_order - b.sort_order),
          team: items.filter(i => i.type === 'team').sort((a, b) => a.sort_order - b.sort_order),
          milestones: items.filter(i => i.type === 'milestone').sort((a, b) => a.sort_order - b.sort_order),
          heroBadge: items.find(i => i.type === 'hero_badge') || null,
          heroStats: items.filter(i => i.type === 'hero_stat').sort((a, b) => a.sort_order - b.sort_order),
          companyIntro: items.find(i => i.type === 'company_intro') || null,
          sectionTitles: items.filter(i => i.type === 'home_section_title'),
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err: any) {
      console.error('Failed to fetch content items', err);
      set({ isLoading: false, error: err.message || 'Failed to fetch content' });
    }
  },
}));
