import axios, { type AxiosError } from 'axios';

const TOKEN_KEY = 'todo_auth_token';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      const message =
        error.response.data?.message ??
        error.response.statusText ??
        `Request failed with status ${error.response.status}`;
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      return Promise.reject(new Error('No response from server. Check your connection.'));
    }
    return Promise.reject(new Error(error.message ?? 'An unexpected error occurred'));
  }
);

export default api;