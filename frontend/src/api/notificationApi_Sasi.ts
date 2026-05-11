import axiosClient from './axiosClient_Pratham';

export interface NotificationParams {
  page?: number;
  limit?: number;
  is_read?: boolean;
}

export const notificationApi = {
  getNotifications: async (params?: NotificationParams) => {
    const response = await axiosClient.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await axiosClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosClient.put('/notifications/read-all');
    return response.data;
  },
};
