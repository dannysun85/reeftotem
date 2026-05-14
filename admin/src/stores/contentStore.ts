import { create } from 'zustand';
import request from '@/api/request';
import { getErrorMessage } from '@/lib/errors';

export type SiteConfig = {
  logo: {
    url: string;
    alt: string;
  };
  banner: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    backgroundUrl: string;
  };
  footer: {
    copyright: string;
    contactEmail: string;
    contactPhone?: string;
    address?: string;
  };
};

export type ContentItem = {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  content?: string;
  image_url?: string;
  meta_data?: Record<string, unknown>;
  sort_order: number;
  is_active: boolean;
};

type ContentState = {
  siteConfig: SiteConfig | null;
  items: ContentItem[];
  isLoading: boolean;
  error: string | null;

  fetchConfig: () => Promise<void>;
  updateConfig: (config: SiteConfig) => Promise<void>;
  
  fetchItems: (type?: string) => Promise<void>;
  createItem: (item: Partial<ContentItem>) => Promise<void>;
  updateItem: (id: string, patch: Partial<ContentItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
};

export const useContentStore = create<ContentState>((set, get) => ({
  siteConfig: null,
  items: [],
  isLoading: false,
  error: null,

  fetchConfig: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await request.get<unknown, { value?: SiteConfig }>('/content/config/site_info');
      if (response && response.value) {
        set({ siteConfig: response.value, isLoading: false });
      }
    } catch (err: unknown) {
      set({ isLoading: false, error: getErrorMessage(err, 'Failed to fetch site config') });
    }
  },

  updateConfig: async (config) => {
    set({ isLoading: true, error: null });
    try {
      await request.put('/content/config/site_info', { value: config });
      set({ siteConfig: config, isLoading: false });
    } catch (err: unknown) {
      set({ isLoading: false, error: getErrorMessage(err, 'Failed to update site config') });
    }
  },

  fetchItems: async (type) => {
    set({ isLoading: true, error: null });
    try {
      const params: Record<string, string | number> = { limit: 100 };
      if (type) params.type = type;
      
      const response = await request.get<unknown, ContentItem[]>('/content/items', { params });
      if (Array.isArray(response)) {
        set({ items: response, isLoading: false });
      } else {
        set({ items: [], isLoading: false });
      }
    } catch (err: unknown) {
      set({ isLoading: false, error: getErrorMessage(err, 'Failed to fetch content items') });
    }
  },

  createItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      await request.post('/content/items', item);
      await get().fetchItems(item.type); // Refresh list
    } catch (err: unknown) {
      set({ isLoading: false, error: getErrorMessage(err, 'Failed to create item') });
    }
  },

  updateItem: async (id, patch) => {
    set({ isLoading: true, error: null });
    try {
      await request.put(`/content/items/${id}`, patch);
      // Optimistic update or refresh
      const currentItems = get().items;
      set({ 
        items: currentItems.map(i => i.id === id ? { ...i, ...patch } : i),
        isLoading: false 
      });
    } catch (err: unknown) {
      set({ isLoading: false, error: getErrorMessage(err, 'Failed to update item') });
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await request.delete(`/content/items/${id}`);
      set({ 
        items: get().items.filter(i => i.id !== id),
        isLoading: false 
      });
    } catch (err: unknown) {
      set({ isLoading: false, error: getErrorMessage(err, 'Failed to delete item') });
    }
  },
}));
