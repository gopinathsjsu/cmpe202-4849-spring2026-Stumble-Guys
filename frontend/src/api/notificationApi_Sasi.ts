import axiosClient from './axiosClient_Pratham';

export const notificationApi = {
  listMine: async () => {
    const response = await axiosClient.get('/notifications');
    return response.data;
  },

  markRead: async (id: string) => {
    const response = await axiosClient.patch(`/notifications/${id}/read`);
    return response.data;
  },
};

