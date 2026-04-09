import { apiClient } from './api/apiClient';
import type { MetadataListResponse, MetadataCreateResponse, MetadataCreatePayload } from '../domain/models/Metadata';

export const metadataService = {
  getMetadata: async (): Promise<MetadataListResponse> => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get<MetadataListResponse>('/v1/metadata', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },
  
  createMetadata: async (payload: MetadataCreatePayload): Promise<MetadataCreateResponse> => {
    const token = localStorage.getItem('token');
    const response = await apiClient.post<MetadataCreateResponse>('/v1/metadata', payload, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  }
};
