/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import type { User } from '../models/User';
import { authService } from '../../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (status: boolean) => void;
  clearError: () => void;
}

/**
 * Global store for Authentication State management.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.data.token);
      // Ensure user defaults role if backend doesn't return one for testing purposes
      const userWithRole = { ...data.data.user, role: data.data.user.role || 'external' };
      
      set({ 
        user: userWithRole, 
        token: data.data.token, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || err.message || 'Login failed. Please check your credentials.' 
      });
      throw err;
    }
  },

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  setLoading: (status) => set({ isLoading: status }),
  clearError: () => set({ error: null })
}));
