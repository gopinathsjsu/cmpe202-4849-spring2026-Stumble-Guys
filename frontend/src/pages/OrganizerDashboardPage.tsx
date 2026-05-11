import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  AlertCircle,
  LayoutDashboard,
  Bell,
} from 'lucide-react';
import { eventApi } from '../api/eventApi_Nikhil';
import { formatDateTime } from '../utils/formatDate_Sasi';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import { cn } from '../utils/cn_Pratham';

interface DashboardData {
  metrics: {
    totalActiveEvents: number;
    pendingAdminApproval: number;
    totalApprovedAttendees: number;
    pendingRsvpRequests: number;
  };
  upcomingEvents: Array<{
    id: string;
    title: string;
    slug: string;
    start_date: string;
    city: string | null;
    venue_name: string | null;
    is_free: boolean;
  }>;
  recentNotifications: Array<{
    id: string;
    title: string;
    message: string;
    sent_at: string;
    is_read: boolean;
    type: string;
  }>;
}

const OrganizerDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await eventApi.getOrganizerDashboard();
        if (!cancelled) setData(res.data as DashboardData);
      } catch (err: unknown) {
        if (!cancelled) {
          const msg =
            (err as { response?: { data?: { error?: { message?: string } } } })?.response
              ?.data?.error?.message ?? 'Could not load dashboard';
          setError(msg);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const { metrics, upcomingEvents, recentNotifications } = data;

  const cards = [
    {
      label: 'Active events',
      value: metrics.totalActiveEvents,
      sub: 'Approved & not ended',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Pending admin approval',
      value: metrics.pendingAdminApproval,
      sub: 'Awaiting platform review',
      icon: Clock,
      color: 'bg-amber-50 text-amber-800',
    },
    {
      label: 'Confirmed attendees',
      value: metrics.totalApprovedAttendees,
      sub: 'Tickets + approved RSVPs',
      icon: Users,
      color: 'bg-green-50 text-green-800',
    },
    {
      label: 'RSVPs to review',
      value: metrics.pendingRsvpRequests,
      sub: 'Free events — Going',
      icon: AlertCircle,
      color: 'bg-orange-50 text-orange-800',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
          <LayoutDashboard className="h-8 w-8 text-orange-500" />
          Organizer dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your events, attendance, and actions that need attention.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className={cn('mb-3 inline-flex rounded-lg p-2', c.color)}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-sm font-medium text-gray-900">{c.label}</p>
              <p className="mt-0.5 text-xs text-gray-500">{c.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming events</h2>
            <Link
              to="/my-events"
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              All events
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-500">No upcoming approved events.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="flex flex-col gap-1 py-3 first:pt-0">
                  <Link
                    to={`/events/${e.slug}`}
                    className="font-medium text-gray-900 hover:text-orange-600"
                  >
                    {e.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(e.start_date)}
                    {e.city ? ` · ${e.city}` : ''}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      to={`/organizer/events/${e.id}/guestlist`}
                      className="text-xs font-medium text-orange-600 hover:text-orange-700"
                    >
                      Guest list
                    </Link>
                    <span className="text-xs text-gray-300">|</span>
                    <span className="text-xs text-gray-500">
                      Updates available on event page
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Bell className="h-5 w-5 text-orange-500" />
              Recent activity
            </h2>
            <Link
              to="/notifications"
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              View all
            </Link>
          </div>
          {recentNotifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentNotifications.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    'rounded-lg border border-gray-100 px-3 py-2 text-sm',
                    !n.is_read && 'bg-orange-50/50'
                  )}
                >
                  <p className="font-medium text-gray-900">{n.title}</p>
                  <p className="text-gray-600">{n.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {formatDateTime(n.sent_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {metrics.pendingRsvpRequests > 0 && (
        <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50/40 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                People are waiting for RSVP approval
              </p>
              <p className="text-sm text-gray-600">
                {metrics.pendingRsvpRequests} pending request
                {metrics.pendingRsvpRequests !== 1 ? 's' : ''} across your free
                events.
              </p>
            </div>
            <Link
              to="/organizer/rsvps"
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Review queue
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboardPage;
