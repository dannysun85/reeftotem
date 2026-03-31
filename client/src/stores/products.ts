import { create } from 'zustand';
import request from '@/api/request';

export type Product = {
  id: string;
  slug: string;
  name: string;
  short_desc?: string;
  full_desc?: string;
  icon_url?: string;
  cover_image_url?: string;
  features?: string[];
  is_published: boolean;
  sort_order: number;
  docs_url?: string;
  docs_content?: string;
};

type ProductsState = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
};

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await request.get('/products');
      if (Array.isArray(data)) {
        set({ products: data as any, isLoading: false });
      } else {
        console.warn('Expected array from /products, got:', data);
        set({ products: [], isLoading: false });
      }
    } catch (err: any) {
      console.error('Fetch products error:', err);
      set({ isLoading: false, error: err.message || 'Failed to fetch products' });
    }
  },
}));
