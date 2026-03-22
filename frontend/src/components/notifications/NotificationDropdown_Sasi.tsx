import React from 'react';
import NotificationItem from './NotificationItem_Sasi';
import type { NotificationType } from '../../store/notificationStore_Sasi';

type Props = {
  notifications: NotificationType[];
  onMarkRead: (id: string) => void;
};

const NotificationDropdown: React.FC<Props> = ({ notifications, onMarkRead }) => {
  return (
    <div className="w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="border-b px-4 py-3">
        <div className="text-sm font-semibold text-gray-900">Notifications</div>
      </div>
      <div className="max-h-80 overflow-auto py-2">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-sm text-gray-500">No notifications</div>
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;

