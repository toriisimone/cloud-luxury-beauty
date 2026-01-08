import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Use production backend URL if VITE_API_URL is not set
const API_URL = import.meta.env.VITE_API_URL || 'https://cloud-luxury-backend-production.up.railway.app/api';

// Log API URL in development to help with debugging
if (import.meta.env.DEV) {
  console.log('[API] Using backend URL:', API_URL);
}

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for all requests
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and log errors
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Log API errors for debugging
    if (error.response) {
      console.error('[API] Request failed:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('[API] No response received:', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
      });
    } else {
      console.error('[API] Request setup error:', error.message);
    }
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
