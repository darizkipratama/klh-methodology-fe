import { openKmClient } from './api/apiClient';
import type { PublicMethodology, OpenKmMetadata } from '../domain/models/Public';

export const openkmService = {
  getMethodology: async (folderId: string, statusId: string): Promise<PublicMethodology[]> => {
    const response = await openKmClient.get<PublicMethodology[]>(`/documents/list/${folderId}/category/${statusId}/status`);
    return response.data;    
  },
  getMethodologyDetail: async (nodeId: string): Promise<OpenKmMetadata[]> => {
    const response = await openKmClient.get<OpenKmMetadata[]>(`/documents/single/${nodeId}/metadata`);
    return response.data;
  },
  downloadMethodology: async (nodeId: string): Promise<Blob> => {
    const response = await openKmClient.get(`/documents/single/${nodeId}/download`, { responseType: 'blob' });
    return response.data;
  }
};
