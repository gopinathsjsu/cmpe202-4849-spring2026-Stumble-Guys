import { create } from 'zustand';
import { notificationApi } from '../api/notificationApi_Sasi';

export interface NotificationType {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  sent_at: string;
  event_id?: string | null;
}

interface NotificationState {
  notifications: NotificationType[];
  unreadCount: number;
  isLoading: boolean;
  fetchMyNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  setNotifications: (notifications: NotificationType[]) => void;
}

function calcUnread(notifications: NotificationType[]) {
  return notifications.reduce((count, n) => count + (n.is_read ? 0 : 1), 0);
}

const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  setNotifications: (notifications) => {
    set({ notifications, unreadCount: calcUnread(notifications) });
  },

  fetchMyNotifications: async () => {
    set({ isLoading: true });
    try {
      const data = await notificationApi.listMine();
      const notifications: NotificationType[] = data.data ?? data;
      set({
        notifications,
        unreadCount: calcUnread(notifications),
        isLoading: false,
      });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  markRead: async (id) => {
    await notificationApi.markRead(id);
    const updated = get().notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
    set({ notifications: updated, unreadCount: calcUnread(updated) });
  },
}));

export default useNotificationStore;

