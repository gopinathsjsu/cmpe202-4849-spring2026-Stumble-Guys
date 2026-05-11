import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications_Sasi';
import NotificationItem, {
  type NotificationData,
} from '../components/notifications/NotificationItem_Sasi';
import Button from '../components/shared/Button_Preetam';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, isLoading, markAsRead, markAllAsRead, refetch } =
    useNotifications();

  useEffect(() => {
    // Ensure we load a fuller list for the page.
    refetch({ page: 1, limit: 50 });
  }, [refetch]);

  const handleClick = async (n: NotificationData) => {
    if (!n.is_read) {
      await markAsRead(n.id);
    }
    const slug = n.event?.slug;
    if (slug) {
      navigate(`/events/${slug}`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-500" />
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={markAllAsRead}
          className="gap-1.5"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {isLoading && notifications.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-500">
            Loading notifications…
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-500">
            No notifications yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n as unknown as NotificationData}
                onClick={handleClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

