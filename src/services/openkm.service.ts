import { openKmClient } from './api/apiClient';
import type { PublicMethodology } from '../domain/models/Public';

export const openkmService = {
  getMethodology: async (folderId: string, statusId: string): Promise<PublicMethodology[]> => {
    const response = await openKmClient.get<PublicMethodology[]>(`/documents/list/${folderId}/category/${statusId}/status`);
    return response.data;    
  }
};
