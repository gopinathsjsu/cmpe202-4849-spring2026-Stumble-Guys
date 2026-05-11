import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, CalendarCheck, CalendarX, Ban, Heart } from 'lucide-react';
import { cn } from '../utils/cn_Pratham';
import EmptyState from '../components/shared/EmptyState_Nikhil';
import TicketCard from '../components/tickets/TicketCard_Sasi';
import useTicketStore from '../store/ticketStore_Sasi';
import { formatDateTime } from '../utils/formatDate_Sasi';

const TABS = [
  { key: 'upcoming', label: 'Upcoming', icon: CalendarCheck },
  { key: 'past', label: 'Past', icon: CalendarX },
  { key: 'cancelled', label: 'Cancelled', icon: Ban },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function rsvpBadge(r: { status: string; approval_status?: string }) {
  if (r.status === 'going') {
    if (r.approval_status === 'pending') {
      return { label: 'Going · Pending', className: 'bg-amber-100 text-amber-900' };
    }
    if (r.approval_status === 'rejected') {
      return { label: 'Going · Declined', className: 'bg-red-100 text-red-800' };
    }
    if (
      r.approval_status === 'approved' ||
      r.approval_status === 'not_required' ||
      r.approval_status == null
    ) {
      return { label: 'Going · Confirmed', className: 'bg-green-100 text-green-800' };
    }
  }
  return {
    label: r.status.replace('_', ' '),
    className: 'bg-amber-100 text-amber-800 capitalize',
  };
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row">
        <div className="h-32 w-full bg-gray-200 sm:h-auto sm:w-32" />
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-100" />
          <div className="h-4 w-1/3 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

const MyTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const { myTickets, myRsvps, isLoading, fetchMyTickets, fetchMyRsvps } =
    useTicketStore();
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');

  useEffect(() => {
    fetchMyTickets();
    fetchMyRsvps();
  }, [fetchMyTickets, fetchMyRsvps]);

  const now = new Date().toISOString();

  const filteredTickets = myTickets.filter((ticket) => {
    if (activeTab === 'cancelled') return ticket.status === 'cancelled';
    if (activeTab === 'past') {
      return (
        ticket.status !== 'cancelled' &&
        (ticket.event?.end_date ?? ticket.event?.start_date ?? '') < now
      );
    }
    return (
      ticket.status !== 'cancelled' &&
      (ticket.event?.end_date ?? ticket.event?.start_date ?? '') >= now
    );
  });

  const filteredRsvps = myRsvps.filter((r) => {
    if (!r.event) return false;
    const end = r.event.end_date ?? r.event.start_date;
    if (activeTab === 'cancelled') return false;
    if (activeTab === 'past') return end < now;
    return end >= now;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-gray-900 sm:text-3xl">
          <Ticket className="h-7 w-7 text-orange-500" />
          My Tickets
        </h1>
        <p className="text-sm text-gray-500">
          Purchased tickets and free event RSVPs in one place.
        </p>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all',
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab !== 'cancelled' && filteredRsvps.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Heart className="h-5 w-5 text-orange-500" />
            Free RSVPs
          </h2>
          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
            {filteredRsvps.map((r) => {
              const badge = rsvpBadge(r);
              return (
              <Link
                key={r.id}
                to={r.event ? `/events/${r.event.slug}` : '/events'}
                className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">
                      {r.event?.title ?? 'Event'}
                    </h3>
                    {r.event?.start_date && (
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDateTime(r.event.start_date)}
                      </p>
                    )}
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  {r.status === 'going' &&
                  (r.approval_status === 'approved' ||
                    r.approval_status === 'not_required' ||
                    r.approval_status == null)
                    ? 'Free RSVP — spot confirmed'
                    : r.status === 'going' && r.approval_status === 'pending'
                      ? 'Awaiting organizer approval for your spot'
                      : 'RSVP — no ticket purchase'}
                </p>
              </Link>
            );
            })}
          </div>
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold text-gray-900">Purchased tickets</h2>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!isLoading && filteredTickets.length === 0 && (
        <EmptyState
          icon={Ticket}
          title="No tickets here"
          description={
            activeTab === 'upcoming'
              ? "You don't have any upcoming tickets. Browse events to get started!"
              : activeTab === 'past'
                ? "You haven't attended any events yet."
                : "You don't have any cancelled tickets."
          }
          action={
            activeTab === 'upcoming'
              ? { label: 'Browse Events', onClick: () => navigate('/events') }
              : undefined
          }
        />
      )}

      {!isLoading && filteredTickets.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={{
                id: ticket.id,
                ticket_number: ticket.ticket_number ?? ticket.qr_code ?? ticket.id.slice(0, 8),
                event: {
                  id: ticket.event?.id ?? ticket.event_id,
                  title: ticket.event?.title ?? 'Event',
                  start_date: ticket.event?.start_date ?? ticket.created_at,
                  image_url: ticket.event?.image_url ?? ticket.event?.cover_image ?? undefined,
                },
                ticket_type: ticket.ticket_type?.name ?? 'General',
                status: ticket.status as 'confirmed' | 'cancelled' | 'checked_in',
                purchase_date: ticket.purchase_date ?? ticket.created_at,
                amount_paid: Number(ticket.amount_paid ?? ticket.ticket_type?.price ?? 0),
                payment_status: ticket.payment_status,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
