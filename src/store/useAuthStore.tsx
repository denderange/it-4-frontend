import axios from 'axios';
import { create } from 'zustand';

const baseURL = import.meta.env.VITE_PUBLIC_API_URL;
axios.defaults.withCredentials = true;

interface User {
  id: number;
  name?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isBlocked: boolean;
}

interface LoginResponse {
  user: User;
  message: string;
}

interface AuthState {
  user: any;
  isLoading: boolean;
  error: string | null;
  message: string | null;
  signup: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<LoginResponse | void>;
  fetchUser: () => void;
  logout: () => Promise<any>;
  isFetchingUser: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  message: null,
  isFetchingUser: true,

  signup: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${baseURL}/api/auth/signup`, {
        username,
        email,
        password,
      });

      set({
        user: response.data.user,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response.data.message || 'Error signing up',
      });

      console.log(error);
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.post(`${baseURL}/api/auth/login`, {
        email,
        password,
      });

      const { user, message } = response.data;

      set({ user, message, isLoading: false });

      return { user, message };
    } catch (error: any) {
      set({ error: error.response.data.message, isLoading: false });

      console.log(error);
    }
  },

  fetchUser: async () => {
    set({ isFetchingUser: true, error: null });

    try {
      const response = await axios.get(`${baseURL}/api/fetch-user`);

      set({
        user: response.data.user,
        isFetchingUser: false,
      });
    } catch (error) {
      set({ error: null, isFetchingUser: false, user: null });
      console.log(error);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.post(`${baseURL}/api/logout`);
      const { message } = response.data;
      set({ message, isLoading: false, user: null, error: null });

      return { message };
    } catch (error: any) {
      set({ error: error.response.data.message, isLoading: false });
      console.log(error);
    }
  },
}));
