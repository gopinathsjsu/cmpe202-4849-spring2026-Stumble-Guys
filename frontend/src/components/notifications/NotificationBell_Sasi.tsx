import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import NotificationDropdown from './NotificationDropdown_Sasi';
import type { NotificationData } from './NotificationItem_Sasi';

interface NotificationBellProps {
  notifications: NotificationData[];
  onRead: (notification: NotificationData) => void;
  onMarkAllRead: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onRead,
  onMarkAllRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell
          className={cn(
            'h-5 w-5',
            unreadCount > 0 && 'animate-[wiggle_0.5s_ease-in-out]'
          )}
        />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        onRead={onRead}
        onMarkAllRead={onMarkAllRead}
      />
    </div>
  );
};

export default NotificationBell;
