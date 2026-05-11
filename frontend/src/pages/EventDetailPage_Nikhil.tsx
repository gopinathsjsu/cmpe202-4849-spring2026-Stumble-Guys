import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  ExternalLink,
  Users,
  Tag,
  ChevronLeft,
  Heart,
} from 'lucide-react';
import useEventStore, { type EventType } from '../store/eventStore_Nikhil';
import { useTicketTypes } from '../hooks/useTickets_Sasi';
import { useAuth } from '../hooks/useAuth_Preetam';
import { formatDate, formatDateTime, formatDateRange } from '../utils/formatDate_Sasi';
import { formatPrice } from '../utils/formatCurrency_Sasi';
import { cn } from '../utils/cn_Pratham';
import { EVENT_STATUS } from '../utils/constants_Preetam';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import Button from '../components/shared/Button_Preetam';
import EventSchedule from '../components/events/EventSchedule_Nikhil';
import TicketSelector, {
  type TicketCartLine,
} from '../components/tickets/TicketSelector_Sasi';
import RSVPButton from '../components/tickets/RSVPButton_Sasi';
import OrganizerRsvpPanel from '../components/tickets/OrganizerRsvpPanel_Sasi';
import { ticketApi } from '../api/ticketApi_Sasi';
import { eventApi } from '../api/eventApi_Nikhil';
import EventMap from '../components/map/EventMap_Pratham';
import GoogleCalendarActions from '../components/calendar/GoogleCalendarActions_Preetam';
import EventGrid from '../components/events/EventGrid_Nikhil';
import { useToast } from '../components/shared/Toast_Sasi';

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending_approval: 'bg-yellow-100 text-yellow-700',
  draft: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user, isOrganizer } = useAuth();

  const { currentEvent, isLoading, fetchEventBySlug, events, fetchEvents } =
    useEventStore();
  const { ticketTypes, isLoading: ticketsLoading } = useTicketTypes(
    currentEvent?.id ?? ''
  );

  const [rsvpStatus, setRsvpStatus] = useState<
    'going' | 'maybe' | 'not_going' | null
  >(null);
  const [rsvpApprovalStatus, setRsvpApprovalStatus] = useState<string | null>(
    null
  );

  const [updates, setUpdates] = useState<
    Array<{
      id: string;
      message: string;
      created_at: string;
      author?: { first_name: string; last_name: string; role: string };
    }>
  >([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [newUpdate, setNewUpdate] = useState('');

  useEffect(() => {
    if (slug) fetchEventBySlug(slug);
  }, [slug, fetchEventBySlug]);

  useEffect(() => {
    let cancelled = false;
    async function loadUpdates() {
      if (!currentEvent?.id) return;
      setUpdatesLoading(true);
      try {
        const res = await eventApi.getEventUpdates(currentEvent.id);
        const rows = (res?.data ?? []) as typeof updates;
        if (!cancelled) setUpdates(rows);
      } catch {
        if (!cancelled) setUpdates([]);
      } finally {
        if (!cancelled) setUpdatesLoading(false);
      }
    }
    loadUpdates();
    return () => {
      cancelled = true;
    };
  }, [currentEvent?.id]);

  useEffect(() => {
    if (currentEvent?.category_id) {
      fetchEvents({
        category: currentEvent.category_id,
        status: 'approved',
        limit: 4,
      });
    }
  }, [currentEvent?.category_id, fetchEvents]);

  useEffect(() => {
    let cancelled = false;
    async function loadRsvp() {
      if (
        !isAuthenticated ||
        isOrganizer ||
        !currentEvent?.id ||
        !currentEvent.is_free
      ) {
        if (!cancelled) {
          setRsvpStatus(null);
          setRsvpApprovalStatus(null);
        }
        return;
      }
      try {
        const res = await ticketApi.getMyRsvpForEvent(currentEvent.id);
        const row = res.data as {
          status?: string;
          approval_status?: string;
        } | null;
        if (cancelled) return;
        if (row?.status === 'going' || row?.status === 'maybe' || row?.status === 'not_going') {
          setRsvpStatus(row.status);
          setRsvpApprovalStatus(row.approval_status ?? null);
        } else {
          setRsvpStatus(null);
          setRsvpApprovalStatus(null);
        }
      } catch {
        if (!cancelled) {
          setRsvpStatus(null);
          setRsvpApprovalStatus(null);
        }
      }
    }
    loadRsvp();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isOrganizer, currentEvent?.id, currentEvent?.is_free]);

  const handleTicketCheckout = (lines: TicketCartLine[]) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!currentEvent?.slug) return;
    navigate(`/events/${currentEvent.slug}/purchase`, { state: { cart: lines } });
  };

  const handleRsvpChange = async (_eventId: string, status: string | null) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!currentEvent?.id) return;
    try {
      if (status === null) {
        await ticketApi.removeRsvp(currentEvent.id);
        setRsvpStatus(null);
        setRsvpApprovalStatus(null);
        toast.success('RSVP removed');
        return;
      }
      const res = rsvpStatus
        ? await ticketApi.updateRsvp(currentEvent.id, status)
        : await ticketApi.createRsvp(currentEvent.id, status);
      const row = res.data as { approval_status?: string } | undefined;
      setRsvpStatus(status as typeof rsvpStatus);
      setRsvpApprovalStatus(row?.approval_status ?? null);
      if (status === 'going') {
        toast.success(
          row?.approval_status === 'pending'
            ? 'RSVP saved — pending organizer approval'
            : 'RSVP saved'
        );
      } else {
        toast.success('RSVP saved');
      }
      if (slug) fetchEventBySlug(slug);
    } catch {
      toast.error('Could not update RSVP');
    }
  };

  if (isLoading || !currentEvent) {
    return <LoadingSpinner fullPage />;
  }

  const event = currentEvent;
  const isOwner = user?.id === event.organizer_id;
  const hasLocation = event.latitude && event.longitude;
  const eventImage = event.image_url ?? event.cover_image;
  const eventPrice = Number(event.price ?? 0);
  const isOnline = event.is_online ?? event.is_virtual;
  const isConfirmedAttendee =
    !isOrganizer &&
    isAuthenticated &&
    (event.is_free
      ? rsvpStatus === 'going' &&
        (rsvpApprovalStatus === 'approved' || rsvpApprovalStatus === 'not_required')
      : true);

  const similarEvents = events
    .filter((e) => e.id !== event.id)
    .slice(0, 4)
    .map((e) => ({
      id: e.id,
      slug: e.slug,
      title: e.title,
      start_date: e.start_date,
      end_date: e.end_date,
      venue_name: e.venue_name ?? undefined,
      city: e.city ?? undefined,
      is_free: e.is_free,
      price: Number(e.price ?? 0),
      image_url: e.image_url ?? e.cover_image ?? undefined,
      is_online: e.is_online ?? e.is_virtual,
      category: e.category ? { id: e.category.id, name: e.category.name } : undefined,
      organizer: {
        id: e.organizer?.id ?? e.organizer_id,
        first_name: e.organizer?.first_name ?? 'Event',
        last_name: e.organizer?.last_name ?? 'Organizer',
        avatar_url: e.organizer?.avatar_url ?? undefined,
      },
    }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Hero image */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            {eventImage ? (
              <img
                src={eventImage}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
                <Calendar className="h-20 w-20 text-white/40" />
              </div>
            )}

            {/* Floating badges */}
            <div className="absolute left-4 top-4 flex gap-2">
              {event.category && (
                <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {event.category.name}
                </span>
              )}
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold capitalize backdrop-blur-sm',
                  STATUS_COLORS[event.status] ?? 'bg-gray-100 text-gray-700'
                )}
              >
                {event.status.replace('_', ' ')}
              </span>
            </div>

            {/* Price badge */}
            <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-4 py-2 text-sm font-bold backdrop-blur-sm">
              {event.is_free ? (
                <span className="text-green-600">Free</span>
              ) : (
                <span className="text-gray-900">
                  {formatPrice(eventPrice, event.is_free)}
                </span>
              )}
            </div>
          </div>

          {/* Title + actions */}
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <div className="flex gap-2">
              {/* Organizer editing disabled. Admin edit stays accessible via admin-only route. */}
            </div>
          </div>

          {/* Info blocks */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {/* Date & Time */}
            <div className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                <Calendar className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDateRange(event.start_date, event.end_date)}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDateTime(event.start_date)}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                {isOnline ? (
                  <Globe className="h-6 w-6 text-blue-500" />
                ) : (
                  <MapPin className="h-6 w-6 text-blue-500" />
                )}
              </div>
              <div>
                {isOnline ? (
                  <>
                    <p className="text-sm font-semibold text-gray-900">
                      Online Event
                    </p>
                    {(event.online_url ?? event.virtual_url) && (
                      <a
                        href={event.online_url ?? event.virtual_url ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                      >
                        Join Link <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-900">
                      {event.venue_name ?? 'Venue TBA'}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {[event.address, event.city, event.state, event.country]
                        .filter(Boolean)
                        .join(', ') || 'Address TBA'}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Attendees */}
            {event._count && (
              <div className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  {(() => {
                    const booked = event._count.tickets + event._count.rsvps;
                    const capacity = event.capacity ?? event.max_attendees ?? null;
                    const spotsLeft = capacity != null ? Math.max(0, capacity - booked) : null;

                    return (
                      <>
                        <p className="text-sm font-semibold text-gray-900">
                          {booked} booked
                          {spotsLeft != null ? ` • ${spotsLeft} spots left` : ''}
                        </p>
                        {capacity != null && (
                          <p className="mt-0.5 text-sm text-gray-500">
                            Capacity: {capacity}
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Category */}
            {event.category && (
              <div className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <Tag className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {event.category.name}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">Category</p>
                </div>
              </div>
            )}
          </div>

          {isOwner &&
            event.is_free &&
            event.status === EVENT_STATUS.APPROVED && (
              <OrganizerRsvpPanel
                eventId={event.id}
                onModerated={() => slug && fetchEventBySlug(slug)}
              />
            )}

          {/* Updates */}
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Updates</h2>

            {isOwner && (
              <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Post an update for attendees
                </label>
                <textarea
                  value={newUpdate}
                  onChange={(e) => setNewUpdate(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  placeholder="Share important info (schedule change, parking, instructions, etc.)"
                />
                <div className="mt-3 flex justify-end">
                  <Button
                    size="sm"
                    onClick={async () => {
                      const msg = newUpdate.trim();
                      if (!msg) return;
                      try {
                        await eventApi.createEventUpdate(event.id, msg);
                        setNewUpdate('');
                        const res = await eventApi.getEventUpdates(event.id);
                        setUpdates((res?.data ?? []) as typeof updates);
                        toast.success('Update posted');
                      } catch {
                        toast.error('Failed to post update');
                      }
                    }}
                  >
                    Post update
                  </Button>
                </div>
              </div>
            )}

            {!isOwner && !isConfirmedAttendee ? (
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
                Updates are visible only to confirmed attendees.
              </div>
            ) : updatesLoading ? (
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
                Loading updates…
              </div>
            ) : updates.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
                No updates yet.
              </div>
            ) : (
              <div className="space-y-3">
                {updates.map((u) => (
                  <div
                    key={u.id}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {u.author
                          ? `${u.author.first_name} ${u.author.last_name}`.trim()
                          : 'Organizer'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(u.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-gray-700">
                      {u.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              About This Event
            </h2>
            <div className="prose prose-sm max-w-full overflow-hidden break-words text-gray-600">
              {event.description.split('\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Map */}
          {!isOnline && (hasLocation || event.google_maps_url) && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Location
              </h2>
              {event.google_maps_url ? (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <iframe
                    title="Event Location"
                    src={(() => {
                      const url = event.google_maps_url!;
                      // Already an embed URL
                      if (url.includes('google.com/maps/embed')) return url;
                      if (url.includes('output=embed')) return url;
                      // Extract query from place URL: google.com/maps/place/Name/@lat,lng,...
                      const placeMatch = url.match(/\/maps\/place\/([^/@]+)/);
                      if (placeMatch) {
                        const place = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
                        return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
                      }
                      // Extract q= param from standard URL
                      const qMatch = url.match(/[?&]q=([^&]+)/);
                      if (qMatch) {
                        return `https://maps.google.com/maps?q=${qMatch[1]}&output=embed`;
                      }
                      // Fallback: append output=embed
                      const sep = url.includes('?') ? '&' : '?';
                      return `${url}${sep}output=embed`;
                    })()}
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <a
                      href={event.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              ) : hasLocation ? (
                <div className="h-64 overflow-hidden rounded-xl border border-gray-200">
                  <EventMap
                    events={[
                      {
                        id: event.id,
                        slug: event.slug || '',
                        title: event.title,
                        latitude: Number(event.latitude),
                        longitude: Number(event.longitude),
                        start_date: event.start_date,
                        venue_name: event.venue_name || '',
                        is_free: event.is_free,
                        price: eventPrice,
                      },
                    ]}
                    center={[Number(event.latitude), Number(event.longitude)]}
                    zoom={15}
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* Schedule */}
          {(event as EventType & { schedule?: Array<{ time: string; title: string; description?: string; speaker?: string }> }).schedule &&
            ((event as EventType & { schedule?: Array<{ time: string; title: string; description?: string; speaker?: string }> }).schedule!.length > 0) && (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Schedule
                </h2>
                <EventSchedule
                  schedule={
                    (event as EventType & { schedule?: Array<{ time: string; title: string; description?: string; speaker?: string }> }).schedule!
                  }
                />
              </div>
            )}

          {/* Organizer */}
          {event.organizer && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Organizer
              </h2>
              <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5">
                {event.organizer.avatar_url ? (
                  <img
                    src={event.organizer.avatar_url}
                    alt=""
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500">
                    <span className="text-lg font-bold text-white">
                      {event.organizer.first_name[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {event.organizer.first_name} {event.organizer.last_name}
                  </p>
                  <p className="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-96">
          <div className="sticky top-24 space-y-6">
            {/* Ticket Section */}
            {event.status === EVENT_STATUS.APPROVED && !isOrganizer && (
              <>
                {event.is_free ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <Heart className="h-5 w-5 text-orange-500" />
                      Free Event — RSVP Now
                    </h3>
                    <RSVPButton
                      eventId={event.id}
                      currentStatus={rsvpStatus}
                      approvalStatus={rsvpApprovalStatus}
                      onStatusChange={handleRsvpChange}
                    />
                  </div>
                ) : (
                  !ticketsLoading &&
                  ticketTypes.length > 0 && (
                    <TicketSelector
                      ticketTypes={ticketTypes.map((t) => ({
                        id: t.id,
                        name: t.name,
                        price: Number(t.price),
                        quantity: t.quantity,
                        sold_count: t.sold_count,
                        description: t.description,
                      }))}
                      onCheckout={handleTicketCheckout}
                    />
                  )
                )}
              </>
            )}

            {event.status === EVENT_STATUS.APPROVED && isOrganizer && (
              <div className="rounded-xl border border-amber-100 bg-amber-50/80 p-6 shadow-sm">
                <h3 className="mb-2 text-sm font-semibold text-amber-900">
                  Organizer view
                </h3>
                <p className="text-sm text-amber-900/80">
                  Ticket checkout and guest RSVP are disabled for organizer accounts. Use{' '}
                  <Link to="/my-events" className="font-medium underline hover:no-underline">
                    My Events
                  </Link>{' '}
                  or your dashboard to manage listings, guest lists, and RSVP approvals.
                </p>
                {isOwner && event.is_free && (
                  <Link
                    to={`/organizer/events/${event.id}/guestlist`}
                    className="mt-4 inline-flex text-sm font-medium text-orange-700 underline hover:text-orange-800"
                  >
                    Open guest list
                  </Link>
                )}
              </div>
            )}

            {/* Quick info card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Event Details
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Date</dt>
                  <dd className="font-medium text-gray-900">
                    {formatDate(event.start_date)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Time</dt>
                  <dd className="font-medium text-gray-900">
                    {formatDateTime(event.start_date)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Price</dt>
                  <dd className="font-medium text-gray-900">
                    {event.is_free ? 'Free' : formatPrice(eventPrice, false)}
                  </dd>
                </div>
                {(event.capacity ?? event.max_attendees) != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Capacity</dt>
                    <dd className="font-medium text-gray-900">
                      {event.capacity ?? event.max_attendees}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Format</dt>
                  <dd className="font-medium text-gray-900">
                    {isOnline ? 'Online' : 'In Person'}
                  </dd>
                </div>
              </dl>
            </div>

            {event.status === EVENT_STATUS.APPROVED && (
              <GoogleCalendarActions
                eventId={event.id}
                title={event.title}
                description={event.description}
                startDate={event.start_date}
                endDate={event.end_date}
                location={[event.venue_name, event.address, event.city]
                  .filter(Boolean)
                  .join(', ')}
              />
            )}
          </div>
        </aside>
      </div>

      {/* Similar Events */}
      {similarEvents.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Similar Events
          </h2>
          <EventGrid events={similarEvents} />
        </section>
      )}
    </div>
  );
};

export default EventDetailPage;
