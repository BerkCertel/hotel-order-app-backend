import axiosClient from '@/lib/axios';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const authService = {
  // Login
  login: async (data: LoginData) => {
    const response = await axiosClient.post('/auth/login', data);
    return response.data;
  },

  // Register
  register: async (data: RegisterData) => {
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getUser: async () => {
    const response = await axiosClient.get('/auth/user');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await axiosClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string) => {
    const response = await axiosClient.post(`/auth/reset-password/${token}`, { newPassword });
    return response.data;
  },
};
