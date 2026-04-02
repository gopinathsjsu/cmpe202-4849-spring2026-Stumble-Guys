import React, { useEffect, useState, useCallback } from 'react';
import { Shield, CheckCircle, Clock, XCircle, Inbox } from 'lucide-react';
import { eventApi, type EventFilters } from '../api/eventApi_Nikhil';
import EventApprovalCard from '../components/events/EventApprovalCard_Nikhil';
import RoleGuard from '../components/auth/RoleGuard_Preetam';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import EmptyState from '../components/shared/EmptyState_Nikhil';
import Pagination from '../components/shared/Pagination_Pratham';
import { useToast } from '../components/shared/Toast_Sasi';
import { cn } from '../utils/cn_Pratham';
import { ROLES, EVENT_STATUS } from '../utils/constants_Preetam';

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

const TABS = [
  {
    key: EVENT_STATUS.PENDING,
    label: 'Pending',
    icon: Clock,
  },
  {
    key: EVENT_STATUS.APPROVED,
    label: 'Approved',
    icon: CheckCircle,
  },
  {
    key: EVENT_STATUS.REJECTED,
    label: 'Rejected',
    icon: XCircle,
  },
] as const;

const AdminEventsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(EVENT_STATUS.PENDING);
  const [events, setEvents] = useState<ApprovalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const loadEvents = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const params: EventFilters = { status: activeTab, page, limit: 20 };
        const response = await eventApi.getPendingEvents(params);
        const data = response.data;
        setEvents(data.events ?? data ?? []);
        if (data.pagination) {
          setPagination({
            page: data.pagination.page,
            totalPages: data.pagination.totalPages,
            total: data.pagination.total,
          });
        }
      } catch {
        toast.error('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    },
    [activeTab, toast]
  );

  useEffect(() => {
    loadEvents(1);
  }, [loadEvents]);

  const handleApprove = async (id: string, notes: string) => {
    try {
      await eventApi.approveEvent(id, notes || undefined);
      toast.success('Event approved');
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      toast.error('Failed to approve event');
    }
  };

  const handleReject = async (id: string, notes: string) => {
    if (!notes.trim()) {
      toast.warning('Please provide a reason for rejection');
      return;
    }
    try {
      await eventApi.rejectEvent(id, notes);
      toast.success('Event rejected');
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      toast.error('Failed to reject event');
    }
  };

  return (
    <RoleGuard allowedRoles={[ROLES.ADMIN]} redirectTo="/">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
            <Shield className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Event Moderation
            </h1>
            <p className="text-sm text-gray-500">
              Review, approve, or reject submitted events
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-1 rounded-xl bg-gray-100 p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.key === EVENT_STATUS.PENDING && pagination.total > 0 && activeTab === tab.key && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                    {pagination.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={`No ${activeTab === EVENT_STATUS.PENDING ? 'pending' : activeTab === EVENT_STATUS.APPROVED ? 'approved' : 'rejected'} events`}
            description={
              activeTab === EVENT_STATUS.PENDING
                ? 'All caught up! There are no events waiting for review.'
                : `No events with ${activeTab.replace('_', ' ')} status.`
            }
          />
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <EventApprovalCard
                key={event.id}
                event={event}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}

            {pagination.totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => loadEvents(page)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </RoleGuard>
  );
};

export default AdminEventsPage;
