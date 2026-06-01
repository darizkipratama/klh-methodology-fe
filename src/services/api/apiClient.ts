import axios from 'axios';

/**
 * Base Axios instance configured with fundamental settings.
 * Interceptors can be attached here to automatically inject Auth tokens
 * or catch global unauthenticated errors.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://194.233.72.247:15005/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const openKmClient = axios.create({
  baseURL: import.meta.env.VITE_OPEN_KM_URL || 'http://194.233.72.247:8080',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'oYySHtoeP8o1x66Gv8M951EVkxI0Z0YqD6qKK4D02QkiAqS5ivrdpsSR5Ud1bbFl',
  },
});

// apiClient.interceptors.request.use((config) => { ... add token ... })
// apiClient.interceptors.response.use(...)
