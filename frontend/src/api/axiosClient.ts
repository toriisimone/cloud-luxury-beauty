import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// CRITICAL: Always use this exact backend URL - no localhost, no old URLs, no environment variable overrides
const API_URL = 'https://cloud-luxury-backend-production.up.railway.app/api';

// ALWAYS log API URL to help with debugging (both dev and production)
console.log('[API CONFIG] ========== API CONFIGURATION ==========');
console.log('[API CONFIG] Backend base URL (HARDCODED):', API_URL);
console.log('[API CONFIG] VITE_API_URL env var (IGNORED):', import.meta.env.VITE_API_URL || 'NOT SET');
console.log('[API CONFIG] Using backend base URL:', API_URL);
console.log('[API CONFIG] Full products URL:', `${API_URL}/products`);
console.log('[API CONFIG] Full Skincare URL:', `${API_URL}/products?category=Skincare`);
console.log('[API CONFIG] Full categories URL:', `${API_URL}/categories`);
console.log('[API CONFIG] ========================================');

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for all requests
});

// Verify baseURL is set correctly
console.log('[API CONFIG] Axios client created with baseURL:', axiosClient.defaults.baseURL);
console.log('[API CONFIG] ✅ Verified: All API calls will use:', axiosClient.defaults.baseURL);

// Request interceptor to add auth token and log requests
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('[API REQUEST]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: fullUrl,
      params: config.params,
    });
    
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
  (response) => {
    console.log('[API RESPONSE]', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      dataKeys: Object.keys(response.data || {}),
      productCount: response.data?.products?.length || response.data?.count || 'N/A',
    });
    return response;
  },
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
