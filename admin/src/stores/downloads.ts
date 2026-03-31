import { create } from 'zustand';
import request from '@/api/request';

export type DownloadItem = {
  id: string;
  name: string;
  version: string;
  platform: string;
  os_type: string;
  package_url: string;
  file_size: string;
  release_date: string;
  category: string;
  description?: string;
  changelog?: string;
  download_count: number;
  is_latest: boolean;
  is_visible: boolean;
};

type DownloadsState = {
  items: DownloadItem[];
  isLoading: boolean;
  error: string | null;
  
  fetchItems: () => Promise<void>;
  createItem: (item: Partial<DownloadItem>) => Promise<void>;
  updateItem: (id: string, patch: Partial<DownloadItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
};

export const useDownloadsStore = create<DownloadsState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await request.get('/downloads');
      if (Array.isArray(data)) {
        set({ items: data as any, isLoading: false });
      } else {
        set({ items: [], isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to fetch downloads' });
    }
  },

  createItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      await request.post('/downloads', item);
      await get().fetchItems();
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to create download' });
    }
  },

  updateItem: async (id, patch) => {
    set({ isLoading: true, error: null });
    try {
      await request.put(`/downloads/${id}`, patch);
      await get().fetchItems();
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to update download' });
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await request.delete(`/downloads/${id}`);
      await get().fetchItems();
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to delete download' });
    }
  },
}));
