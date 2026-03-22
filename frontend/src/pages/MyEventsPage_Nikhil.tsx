import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Send,
  Calendar,
  MoreVertical,
  Ticket,
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  FileText,
} from 'lucide-react';
import useEventStore, { type EventType } from '../store/eventStore_Nikhil';
import { formatDate } from '../utils/formatDate_Sasi';
import { cn } from '../utils/cn_Pratham';
import { EVENT_STATUS } from '../utils/constants_Preetam';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import EmptyState from '../components/shared/EmptyState_Nikhil';
import Modal from '../components/shared/Modal_Pratham';
import Button from '../components/shared/Button_Preetam';
import { useToast } from '../components/shared/Toast_Sasi';

const TABS = [
  { key: 'all', label: 'All', icon: Calendar },
  { key: EVENT_STATUS.DRAFT, label: 'Draft', icon: FileText },
  { key: EVENT_STATUS.PENDING, label: 'Pending', icon: Clock },
  { key: EVENT_STATUS.APPROVED, label: 'Approved', icon: CheckCircle },
  { key: EVENT_STATUS.REJECTED, label: 'Rejected', icon: XCircle },
  { key: EVENT_STATUS.CANCELLED, label: 'Cancelled', icon: Ban },
] as const;

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600' },
  pending_approval: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700',
  },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-600' },
  completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
};

const MyEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    events,
    isLoading,
    pagination,
    fetchMyEvents,
    submitForApproval,
    deleteEvent,
  } = useEventStore();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventType | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const params: Record<string, unknown> = {};
    if (activeTab !== 'all') params.status = activeTab;
    fetchMyEvents(params as Parameters<typeof fetchMyEvents>[0]);
  }, [activeTab, fetchMyEvents]);

  const handleSubmitForApproval = async (id: string) => {
    try {
      await submitForApproval(id);
      toast.success('Event submitted for approval');
    } catch {
      toast.error('Failed to submit event');
    }
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent(eventToDelete.id);
      toast.success('Event deleted');
      setDeleteModalOpen(false);
      setEventToDelete(null);
    } catch {
      toast.error('Failed to delete event');
    }
  };

  const confirmDelete = (event: EventType) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your organized events
          </p>
        </div>
        <Link
          to="/events/create"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description={
            activeTab === 'all'
              ? "You haven't created any events yet. Get started by creating your first event!"
              : `No ${STATUS_BADGE[activeTab]?.label.toLowerCase() ?? ''} events.`
          }
          action={
            activeTab === 'all'
              ? {
                  label: 'Create Your First Event',
                  onClick: () => navigate('/events/create'),
                }
              : undefined
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Table header */}
          <div className="hidden border-b border-gray-100 bg-gray-50 px-6 py-3 sm:grid sm:grid-cols-12 sm:gap-4">
            <span className="col-span-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Event
            </span>
            <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Date
            </span>
            <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status
            </span>
            <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Tickets
            </span>
            <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">
              Actions
            </span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {events.map((event) => {
              const badge = STATUS_BADGE[event.status] ?? STATUS_BADGE.draft;
              const ticketCount = event._count?.tickets ?? 0;
              const rsvpCount = event._count?.rsvps ?? 0;

              return (
                <div
                  key={event.id}
                  className="flex flex-col gap-3 px-6 py-4 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4"
                >
                  {/* Event name + image */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      {event.cover_image ? (
                        <img
                          src={event.cover_image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500">
                          <Calendar className="h-5 w-5 text-white/60" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/events/${event.slug}`}
                        className="block truncate text-sm font-semibold text-gray-900 hover:text-orange-600"
                      >
                        {event.title}
                      </Link>
                      <p className="truncate text-xs text-gray-400">
                        {event.city ?? (event.is_virtual ? 'Online' : 'TBA')}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 text-sm text-gray-600">
                    {formatDate(event.start_date)}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                        badge.className
                      )}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Tickets */}
                  <div className="col-span-2 flex items-center gap-1 text-sm text-gray-600">
                    <Ticket className="h-4 w-4 text-gray-400" />
                    {ticketCount + rsvpCount} sold
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <Link
                      to={`/events/${event.slug}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/events/${event.id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    {event.status === EVENT_STATUS.DRAFT && (
                      <button
                        onClick={() => handleSubmitForApproval(event.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        title="Submit for Approval"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => confirmDelete(event)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Event"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{eventToDelete?.title}</span>? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyEventsPage;
