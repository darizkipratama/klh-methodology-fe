import { apiClient } from './api/apiClient';
import type { UserResponse } from '../domain/models/User';

export const userService = {
  getUsers: async (page = 1, limit = 10, search = ''): Promise<UserResponse> => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get<UserResponse>(`/v1/users?page=${page}&limit=${limit}${search ? `&username=${encodeURIComponent(search)}` : ''}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },
  toggleUserStatus: async (id: string, isActive: boolean): Promise<unknown> => {
    const token = localStorage.getItem('token');
    const response = await apiClient.patch(`/v1/users/${id}/status`, { isActive }, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  }
};
