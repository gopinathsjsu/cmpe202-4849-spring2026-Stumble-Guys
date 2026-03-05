import { create } from 'zustand';
import { authApi } from '../api/authApi_Preetam';

export interface UserType {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  is_verified: boolean;
  created_at: string;
}

interface AuthState {
  user: UserType | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: UserType | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    bio?: string;
  }) => Promise<void>;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: (token) => {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
    set({ accessToken: token, isAuthenticated: !!token });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await authApi.login({ email, password });
      const { user, accessToken } = data.data;
      localStorage.setItem('accessToken', accessToken);
      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (registerData) => {
    set({ isLoading: true });
    try {
      const data = await authApi.register(registerData);
      const { user, accessToken } = data.data;
      localStorage.setItem('accessToken', accessToken);
      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Proceed with local logout even if API call fails
    }
    get().clearAuth();
  },

  refreshToken: async () => {
    try {
      const data = await authApi.refreshToken();
      const { accessToken } = data.data;
      localStorage.setItem('accessToken', accessToken);
      set({ accessToken, isAuthenticated: true });
      return accessToken;
    } catch (error) {
      get().clearAuth();
      throw error;
    }
  },

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const data = await authApi.getProfile();
      set({ user: data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      const data = await authApi.updateProfile(profileData);
      set({ user: data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken');
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));

export default useAuthStore;
