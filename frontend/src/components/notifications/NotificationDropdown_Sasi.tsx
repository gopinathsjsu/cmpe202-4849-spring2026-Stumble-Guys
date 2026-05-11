import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import NotificationItem, { type NotificationData } from './NotificationItem_Sasi';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationData[];
  onRead: (notification: NotificationData) => void;
  onMarkAllRead: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onRead,
  onMarkAllRead,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayed = notifications.slice(0, 10);
  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:w-96"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
        {hasUnread && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[24rem] divide-y divide-gray-50 overflow-y-auto">
        {displayed.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-500">
            No notifications yet
          </div>
        ) : (
          displayed.map((n) => (
            <NotificationItem key={n.id} notification={n} onClick={onRead} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100">
        <Link
          to="/notifications"
          onClick={onClose}
          className="flex items-center justify-center gap-1 px-4 py-3 text-sm font-medium text-orange-600 transition-colors hover:bg-gray-50"
        >
          View all notifications
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
