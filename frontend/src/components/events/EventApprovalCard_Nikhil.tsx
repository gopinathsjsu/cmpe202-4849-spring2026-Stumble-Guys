import React, { useState } from 'react';
import { Calendar, MapPin, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import { formatDateTime } from '../../utils/formatDate_Sasi';

interface ApprovalEvent {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  venue_name?: string;
  city?: string;
  image_url?: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  organizer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface EventApprovalCardProps {
  event: ApprovalEvent;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon: React.ElementType }
> = {
  pending_approval: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-700',
    icon: XCircle,
  },
};

const EventApprovalCard: React.FC<EventApprovalCardProps> = ({
  event,
  onApprove,
  onReject,
}) => {
  const [notes, setNotes] = useState('');
  const statusInfo = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.pending_approval;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative h-48 w-full md:h-auto md:w-56">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500">
              <Calendar className="h-10 w-10 text-white/60" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
            <span
              className={cn(
                'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                statusInfo.className
              )}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {statusInfo.label}
            </span>
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-gray-500">
            {event.description}
          </p>

          <div className="mb-3 flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDateTime(event.start_date)}
            </span>
            {(event.venue_name || event.city) && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {[event.venue_name, event.city].filter(Boolean).join(', ')}
              </span>
            )}
          </div>

          {/* Organizer */}
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            {event.organizer.avatar_url ? (
              <img
                src={event.organizer.avatar_url}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                <User className="h-4 w-4 text-orange-600" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {event.organizer.first_name} {event.organizer.last_name}
              </p>
              <p className="text-xs text-gray-500">{event.organizer.email}</p>
            </div>
          </div>

          {event.status === 'pending_approval' && (
            <>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes (optional for approval, recommended for rejection)..."
                rows={2}
                className="mb-3 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onApprove(event.id, notes)}
                  className="flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onReject(event.id, notes)}
                  className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventApprovalCard;
