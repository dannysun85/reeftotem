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
  createProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await request.get('/products');
      if (Array.isArray(response)) {
        set({ products: response, isLoading: false });
      } else {
        set({ products: [], isLoading: false });
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to fetch products' });
    }
  },

  createProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      await request.post('/products', product);
      await get().fetchProducts();
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to create product' });
    }
  },

  updateProduct: async (id, patch) => {
    set({ isLoading: true, error: null });
    try {
      await request.put(`/products/${id}`, patch);
      await get().fetchProducts();
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to update product' });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await request.delete(`/products/${id}`);
      await get().fetchProducts();
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to delete product' });
    }
  },
}));
