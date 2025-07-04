import axios, { AxiosInstance } from 'axios';
import { baseURL } from '@/app/api/index';
import { refreshAuthToken } from '@/app/api/auth/[...nextauth]/auth';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const attachAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config) => {
      return config;
    },
    (error) => Promise.reject(error)
  );
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('refreshToken')
          : null;
      if (refreshToken) {
        const tokens = await refreshAuthToken(refreshToken);
        if (tokens?.accessToken) {
          setAuthToken(tokens.accessToken);
          originalRequest.headers[
            'Authorization'
          ] = `Bearer ${tokens.accessToken}`;
          return apiClient(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
