import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { auth } from '../../lib/firebase';

// ─── Axios Instance ───────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// ─── Request Interceptor: attach Firebase ID token ────────────────────────────
//
// Before every request we ask Firebase for the current ID token.
// Firebase automatically refreshes it when it's about to expire —
// so we always get a valid token without any manual refresh logic.

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(); // auto-refreshes if expired
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor: handle 401 ────────────────────────────────────────
//
// If the backend returns 401 (token rejected / expired on backend side),
// force-refresh the Firebase token once and retry the request.
// If it fails again, the error propagates to the caller.

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retried?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;
      const user = auth.currentUser;
      if (user) {
        const freshToken = await user.getIdToken(true); // force refresh
        originalRequest.headers.Authorization = `Bearer ${freshToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
