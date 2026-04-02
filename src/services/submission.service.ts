import { apiClient } from './api/apiClient';
import type { SubmissionResponse } from '../domain/models/Submission';

export const submissionService = {
  getSubmissions: async (page = 1, limit = 10): Promise<SubmissionResponse> => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get<SubmissionResponse>(`/v1/submissions?page=${page}&limit=${limit}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },
  getSubmissionById: async (id: string): Promise<import('../domain/models/Submission').SingleSubmissionResponse> => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get<import('../domain/models/Submission').SingleSubmissionResponse>(`/v1/submissions/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addComment: async (id: string, comment: string): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await apiClient.post(`/v1/submissions/${id}/comments`, { comment }, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return response.data;
  }
};
