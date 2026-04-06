import { apiClient } from './api/apiClient';
import type { AuthResponse } from '../domain/models/User';

/**
 * Auth Service responsible for managing authentication calls to the backend.
 */
export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/login', { 
      email, 
      password 
    });
    return response.data;
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      await apiClient.get('/v1/auth/verify');
      return true;
    } catch {
      return false;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: async (payload: any): Promise<any> => {
    const response = await apiClient.post('/v1/auth/register', payload);
    return response.data;
  }
};
