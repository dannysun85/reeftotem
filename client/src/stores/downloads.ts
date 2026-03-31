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
  incrementDownload: (id: string) => Promise<void>;
};

export const useDownloadsStore = create<DownloadsState>((set) => ({
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
      console.error('Fetch downloads error:', err);
      set({ isLoading: false, error: err.message || 'Failed to fetch downloads' });
    }
  },

  incrementDownload: async (id) => {
    try {
      await request.post(`/downloads/${id}/count`);
      set((state) => ({
        items: state.items.map((it) =>
          it.id === id ? { ...it, download_count: it.download_count + 1 } : it
        ),
      }));
    } catch (err) {
      console.error('Failed to increment download count', err);
    }
  },
}));
