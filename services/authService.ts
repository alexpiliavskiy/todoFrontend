import type { AuthToken, LoginCredentials, RegisterCredentials, User } from '@/types';
import api from './api/axios';

export async function loginService(credentials: LoginCredentials): Promise<AuthToken> {
  const { data } = await api.post<AuthToken>('/auth/login', credentials);
  return data;
}

export async function registerService(credentials: RegisterCredentials): Promise<AuthToken> {
  const { data } = await api.post<AuthToken>('/auth/register', credentials);
  return data;
}

export async function getMeService(_token: string): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}