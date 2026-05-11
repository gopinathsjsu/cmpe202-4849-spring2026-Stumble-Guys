import { create } from 'zustand';
import { notificationApi } from '../api/notificationApi_Sasi';

export interface Notification {
  id: string;
  user_id: string;
  event_id?: string | null;
  event?: { id: string; slug: string | null; title: string } | null;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  channel?: string;
  sent_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: (params?: {
    page?: number;
    limit?: number;
    is_read?: boolean;
  }) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  setUnreadCount: (count: number) => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (params) => {
    set({ isLoading: true });
    try {
      const data = await notificationApi.getNotifications(params);
      const notifications: Notification[] =
        data.data.notifications ?? data.data.data ?? data.data;
      const unreadCount = notifications.filter((n) => !n.is_read).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationApi.markAsRead(id);
      set((state) => {
        const notifications = state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        );
        return {
          notifications,
          unreadCount: notifications.filter((n) => !n.is_read).length,
        };
      });
    } catch (error) {
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationApi.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          is_read: true,
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      throw error;
    }
  },

  setUnreadCount: (count) => set({ unreadCount: count }),
}));

export default useNotificationStore;
