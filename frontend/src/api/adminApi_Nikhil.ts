import axiosClient from './axiosClient_Pratham';

export interface AdminDashboardStats {
  totalRegisteredUsers: number;
  totalActiveUsers: number;
  totalEventsCreated: number;
  totalRsvpsProcessed: number;
  pendingModerationCount: number;
  confirmedTickets: number;
  totalUsers?: number;
  totalEvents?: number;
  totalTickets?: number;
}

export interface AdminCategoryInput {
  name: string;
  icon?: string | null;
}

export const adminApi = {
  getDashboardStats: async () => {
    const response = await axiosClient.get('/admin/dashboard');
    return response.data as { success: boolean; data: AdminDashboardStats; message?: string };
  },

  createCategory: async (body: AdminCategoryInput) => {
    const response = await axiosClient.post('/admin/categories', body);
    return response.data;
  },

  updateCategory: async (id: string, body: AdminCategoryInput) => {
    const response = await axiosClient.put(`/admin/categories/${id}`, body);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await axiosClient.delete(`/admin/categories/${id}`);
    return response.data;
  },
};
