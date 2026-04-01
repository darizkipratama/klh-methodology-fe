import axios from 'axios';

/**
 * Base Axios instance configured with fundamental settings.
 * Interceptors can be attached here to automatically inject Auth tokens
 * or catch global unauthenticated errors.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// apiClient.interceptors.request.use((config) => { ... add token ... })
// apiClient.interceptors.response.use(...)
