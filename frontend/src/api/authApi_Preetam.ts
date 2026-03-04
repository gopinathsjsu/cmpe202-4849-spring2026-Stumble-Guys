import axiosClient from './axiosClient_Pratham';

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface UsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await axiosClient.post('/auth/login', data);
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosClient.post('/auth/refresh');
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await axiosClient.put('/auth/me', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData) => {
    const response = await axiosClient.put('/auth/me/password', data);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosClient.post('/auth/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getUsers: async (params?: UsersParams) => {
    const response = await axiosClient.get('/users', { params });
    return response.data;
  },

  updateUserRole: async (id: string, role: string) => {
    const response = await axiosClient.put(`/users/${id}/role`, { role });
    return response.data;
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    const response = await axiosClient.put(`/users/${id}/status`, {
      is_active: isActive,
    });
    return response.data;
  },
};
