import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api';

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  walletAddress: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  reputation: number;
  isPublic: boolean;
  role: string;
  createdAt: string;
  _count?: { proposals: number; votes: number };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      setAuth: (user, accessToken) => set({ user, accessToken }),

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } finally {
          set({ user: null, accessToken: null });
        }
      },

      fetchMe: async () => {
        const { accessToken } = get();
        if (!accessToken) return;
        try {
          const { data } = await api.get('/users/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          set({ user: data });
        } catch {
          set({ user: null, accessToken: null });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);
