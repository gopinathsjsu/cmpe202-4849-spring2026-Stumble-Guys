import { useEffect } from 'react';
import useNotificationStore from '../store/notificationStore_Sasi';

export function useNotifications(autoFetch: boolean = true) {
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const isLoading = useNotificationStore((s) => s.isLoading);
  const fetchMyNotifications = useNotificationStore((s) => s.fetchMyNotifications);
  const markRead = useNotificationStore((s) => s.markRead);

  useEffect(() => {
    if (autoFetch) {
      void fetchMyNotifications();
    }
  }, [autoFetch, fetchMyNotifications]);

  return { notifications, unreadCount, isLoading, fetchMyNotifications, markRead };
}

