import React from 'react';
import { Ticket, Calendar, Bell, CheckCircle, type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import { getRelativeTime } from '../../utils/formatDate_Sasi';

export interface NotificationData {
  id: string;
  event_id?: string | null;
  event?: { id: string; slug: string | null; title: string } | null;
  type: 'ticket_confirmation' | 'event_reminder' | 'event_update' | 'approval' | string;
  title: string;
  message: string;
  is_read: boolean;
  sent_at: string;
}

interface NotificationItemProps {
  notification: NotificationData;
  onClick: (notification: NotificationData) => void;
}

const TYPE_ICONS: Record<string, { icon: LucideIcon; className: string }> = {
  ticket_confirmation: { icon: Ticket, className: 'bg-green-100 text-green-600' },
  event_reminder: { icon: Calendar, className: 'bg-blue-100 text-blue-600' },
  event_update: { icon: Bell, className: 'bg-orange-100 text-orange-600' },
  approval: { icon: CheckCircle, className: 'bg-purple-100 text-purple-600' },
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
}) => {
  const typeConfig = TYPE_ICONS[notification.type] ?? TYPE_ICONS.event_update;
  const Icon = typeConfig.icon;

  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      className={cn(
        'flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50',
        !notification.is_read && 'bg-orange-50/50'
      )}
    >
      {/* Type icon */}
      <div
        className={cn(
          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          typeConfig.className
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm',
              notification.is_read
                ? 'font-normal text-gray-700'
                : 'font-medium text-gray-900'
            )}
          >
            {notification.title}
          </p>

          {/* Unread indicator */}
          {!notification.is_read && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
          )}
        </div>

        <p className="line-clamp-1 text-xs text-gray-500">
          {notification.message}
        </p>

        <p className="mt-0.5 text-xs text-gray-400">
          {getRelativeTime(notification.sent_at)}
        </p>
      </div>
    </button>
  );
};

export default NotificationItem;
