import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Globe,
  Tag,
  Eye,
} from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import { formatDateTime, formatDateRange } from '../../utils/formatDate_Sasi';
import { formatPrice } from '../../utils/formatCurrency_Sasi';
import Modal from '../shared/Modal_Pratham';
import { useToastStore } from '../shared/Toast_Sasi';

export interface ApprovalEventDetail {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  venue_name?: string;
  city?: string;
  address?: string | null;
  state?: string | null;
  zip_code?: string | null;
  country?: string | null;
  image_url?: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  short_desc?: string | null;
  capacity?: number;
  is_free?: boolean;
  price?: number | string;
  is_online?: boolean;
  online_url?: string | null;
  timezone?: string | null;
  tags?: string[];
  organizer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
  category?: { id: string; name: string; slug: string } | null;
  approval_notes?: string | null;
}

interface EventApprovalCardProps {
  event: ApprovalEventDetail;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
  onDelete?: (id: string) => void;
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
  onDelete,
}) => {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const statusInfo = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.pending_approval;
  const StatusIcon = statusInfo.icon;
  const priceNum = Number(event.price ?? 0);
  const locationLine = [
    event.venue_name,
    event.address,
    [event.city, event.state, event.zip_code].filter(Boolean).join(', '),
    event.country,
  ]
    .filter(Boolean)
    .join(' · ');

  const handleRejectSubmit = () => {
    const reason = rejectReason.trim();
    if (!reason) {
      useToastStore.getState().addToast('error', 'Reason for rejection is required');
      return;
    }
    onReject(event.id, reason);
    setReviewOpen(false);
    setRejectReason('');
  };

  const handleApproveSubmit = () => {
    onApprove(event.id, approvalNote.trim());
    setReviewOpen(false);
    setApprovalNote('');
  };

  const handleDelete = () => {
    if (!onDelete) return;
    const ok = window.confirm('Delete this event? This will cancel it for attendees.');
    if (!ok) return;
    onDelete(event.id);
    setReviewOpen(false);
  };

  const ReviewBody = (
    <div className="space-y-5">
      {event.image_url && (
        <img
          src={event.image_url}
          alt=""
          className="h-44 w-full rounded-lg object-cover"
        />
      )}
      <div>
        <h4 className="text-lg font-bold text-gray-900">{event.title}</h4>
        {event.short_desc && (
          <p className="mt-1 text-sm font-medium text-gray-700">{event.short_desc}</p>
        )}
      </div>
      <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
        <div className="flex gap-2 rounded-lg bg-gray-50 p-3">
          <Calendar className="h-4 w-4 shrink-0 text-orange-500" />
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Schedule</p>
            <p>{formatDateRange(event.start_date, event.end_date)}</p>
            <p className="text-xs text-gray-500">{formatDateTime(event.start_date)}</p>
            {event.timezone && (
              <p className="text-xs text-gray-500">Timezone: {event.timezone}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2 rounded-lg bg-gray-50 p-3">
          {event.is_online ? (
            <Globe className="h-4 w-4 shrink-0 text-blue-500" />
          ) : (
            <MapPin className="h-4 w-4 shrink-0 text-blue-500" />
          )}
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Location</p>
            {event.is_online ? (
              <>
                <p>Online</p>
                {event.online_url && (
                  <a
                    href={event.online_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-600 underline"
                  >
                    Join link
                  </a>
                )}
              </>
            ) : (
              <p>{locationLine || '—'}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2 rounded-lg bg-gray-50 p-3">
          <Users className="h-4 w-4 shrink-0 text-purple-500" />
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Capacity</p>
            <p>{event.capacity ?? '—'}</p>
          </div>
        </div>
        <div className="flex gap-2 rounded-lg bg-gray-50 p-3">
          <Tag className="h-4 w-4 shrink-0 text-emerald-500" />
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Pricing</p>
            <p>
              {event.is_free
                ? 'Free'
                : formatPrice(priceNum, false)}
            </p>
          </div>
        </div>
      </div>
      {event.category && (
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">Category:</span> {event.category.name}
        </p>
      )}
      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {event.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div>
        <p className="text-xs font-semibold uppercase text-gray-500">Description</p>
        <div className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
          {event.description}
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
        {event.organizer.avatar_url ? (
          <img
            src={event.organizer.avatar_url}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
            <User className="h-5 w-5 text-orange-600" />
          </div>
        )}
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500">Organizer</p>
          <p className="text-sm font-medium text-gray-900">
            {event.organizer.first_name} {event.organizer.last_name}
          </p>
          <p className="text-xs text-gray-500">{event.organizer.email}</p>
        </div>
      </div>
      {event.approval_notes && event.status !== 'pending_approval' && (
        <div className="rounded-lg border border-gray-200 bg-amber-50/50 p-3 text-sm text-gray-800">
          <span className="font-medium">Admin notes: </span>
          {event.approval_notes}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row">
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
              {event.short_desc || event.description}
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
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Cap {event.capacity ?? '—'}
              </span>
            </div>

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

            <button
              type="button"
              onClick={() => {
                setApprovalNote('');
                setRejectReason('');
                setReviewOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              {event.status === 'pending_approval'
                ? 'Review & moderate'
                : 'View as attendee would'}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Review"
        size="xl"
      >
        <div className="flex flex-col gap-0">
          <div className="pb-2">{ReviewBody}</div>
          {event.status === 'pending_approval' && (
            <div className="sticky bottom-0 z-10 -mx-6 mt-2 space-y-4 border-t border-gray-200 bg-white/95 px-6 py-4 shadow-[0_-6px_16px_-4px_rgba(0,0,0,0.08)] backdrop-blur-sm supports-[backdrop-filter]:bg-white/90">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Optional note on approval
                </label>
                <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="Internal or organizer-visible note (optional)"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-red-800">
                  Reason for rejection <span className="text-red-600">(required to reject)</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="Explain what the organizer must fix before resubmitting."
                />
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleRejectSubmit}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Reject event
                </button>
                <button
                  type="button"
                  onClick={handleApproveSubmit}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Approve &amp; publish
                </button>
              </div>
            </div>
          )}
          {event.status !== 'pending_approval' && onDelete && (
            <div className="sticky bottom-0 z-10 -mx-6 mt-2 flex justify-end border-t border-gray-200 bg-white/95 px-6 py-4 shadow-[0_-6px_16px_-4px_rgba(0,0,0,0.08)] backdrop-blur-sm supports-[backdrop-filter]:bg-white/90">
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete event
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default EventApprovalCard;
