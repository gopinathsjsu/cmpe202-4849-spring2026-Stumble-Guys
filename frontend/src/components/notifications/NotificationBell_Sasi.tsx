import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications_Sasi';
import NotificationDropdown from './NotificationDropdown_Sasi';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markRead } = useNotifications(true);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2">
          <NotificationDropdown
            notifications={notifications}
            onMarkRead={(id) => void markRead(id)}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

