import { create } from 'zustand';
import request from '@/api/request';
import { getErrorMessage } from '@/lib/errors';

export type User = {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at?: string;
};

type UsersState = {
  users: User[];
  isLoading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  createUser: (user: Partial<User> & { password?: string }) => Promise<void>;
  updateUser: (id: string, patch: Partial<User> & { password?: string }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
};

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await request.get<unknown, User[]>('/users/');
      if (Array.isArray(response)) {
        set({ users: response, isLoading: false });
      } else {
        set({ users: [], isLoading: false });
      }
    } catch (err: unknown) {
      set({ isLoading: false, error: getErrorMessage(err, 'Failed to fetch users') });
    }
  },

  createUser: async (user) => {
    set({ isLoading: true, error: null });
    try {
      await request.post('/users/', user);
      await get().fetchUsers();
    } catch (err: unknown) {
      set({ isLoading: false, error: getErrorMessage(err, 'Failed to create user') });
    }
  },

  updateUser: async (id, patch) => {
    set({ isLoading: true, error: null });
    try {
      await request.put(`/users/${id}`, patch);
      await get().fetchUsers();
    } catch (err: unknown) {
      set({ isLoading: false, error: getErrorMessage(err, 'Failed to update user') });
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await request.delete(`/users/${id}`);
      await get().fetchUsers();
    } catch (err: unknown) {
      set({ isLoading: false, error: getErrorMessage(err, 'Failed to delete user') });
    }
  },
}));
