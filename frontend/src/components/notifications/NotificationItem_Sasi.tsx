import React from 'react';
import type { NotificationType } from '../../store/notificationStore_Sasi';

type Props = {
  notification: NotificationType;
  onMarkRead: (id: string) => void;
};

const NotificationItem: React.FC<Props> = ({ notification, onMarkRead }) => {
  return (
    <div className="flex gap-3 rounded-lg px-3 py-2 hover:bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-medium text-gray-900">
            {notification.title}
          </div>
          {!notification.is_read && (
            <button
              type="button"
              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
              onClick={() => onMarkRead(notification.id)}
            >
              Mark read
            </button>
          )}
        </div>
        <div className="mt-0.5 text-xs text-gray-600">{notification.message}</div>
      </div>
      {!notification.is_read && (
        <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
      )}
    </div>
  );
};

export default NotificationItem;

