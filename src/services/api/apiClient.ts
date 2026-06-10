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
  baseURL: import.meta.env.VITE_OPEN_KM_URL || 'http://194.233.72.247:3003',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'oYySHtoeP8o1x66Gv8M951EVkxI0Z0YqD6qKK4D02QkiAqS5ivrdpsSR5Ud1bbFl',
  },
});

// Add interceptor to handle 304 Not Modified responses
// Some backends return 304 with cached data for performance - we treat them as valid responses
apiClient.interceptors.response.use(
  (response) => {
    // If backend returns 304 but includes data, still process it
    if (response.status === 304) {
      return { ...response, status: 200 };
    }
    return response;
  },
  (error) => {
    // If error is 304, convert to success response
    if (error.response?.status === 304) {
      return Promise.resolve({
        ...error.response,
        status: 200,
        statusText: 'OK',
        data: error.response.data || {}
      });
    }
    return Promise.reject(error);
  }
);

// apiClient.interceptors.request.use((config) => { ... add token ... })
// apiClient.interceptors.response.use(...)
