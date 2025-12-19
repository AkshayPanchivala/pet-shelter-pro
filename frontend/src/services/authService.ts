import api from './api';
import { User } from '../types';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Register new user
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

// Get current user
export const getCurrentUser = async (): Promise<{ user: User }> => {
  const response = await api.get<{ user: User }>('/auth/me');
  return response.data;
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout');
};

// Forgot password
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(`/auth/reset-password/${token}`, { password });
  return response.data;
};
