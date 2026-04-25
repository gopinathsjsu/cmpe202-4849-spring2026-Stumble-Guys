import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Share2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Users,
  Tag,
  ChevronLeft,
  Heart,
} from 'lucide-react';
import useEventStore, { type EventType } from '../store/eventStore_Nikhil';
import useSearchStore from '../store/searchStore_Pratham';
import { useTicketTypes } from '../hooks/useTickets_Sasi';
import { useAuth } from '../hooks/useAuth_Preetam';
import { formatDate, formatDateTime, formatDateRange } from '../utils/formatDate_Sasi';
import { formatPrice } from '../utils/formatCurrency_Sasi';
import { cn } from '../utils/cn_Pratham';
import { EVENT_STATUS } from '../utils/constants_Preetam';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import Button from '../components/shared/Button_Preetam';
import EventSchedule from '../components/events/EventSchedule_Nikhil';
import TicketSelector from '../components/tickets/TicketSelector_Sasi';
import RSVPButton from '../components/tickets/RSVPButton_Sasi';
import EventMap from '../components/map/EventMap_Pratham';
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
  const { isAuthenticated, user } = useAuth();

  const { currentEvent, isLoading, fetchEventBySlug, events, fetchEvents } =
    useEventStore();
  const { saveEvent, unsaveEvent } = useSearchStore();
  const { ticketTypes, isLoading: ticketsLoading } = useTicketTypes(
    currentEvent?.id ?? ''
  );

  const [isSaved, setIsSaved] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<
    'going' | 'maybe' | 'not_going' | null
  >(null);

  useEffect(() => {
    if (slug) fetchEventBySlug(slug);
  }, [slug, fetchEventBySlug]);

  useEffect(() => {
    if (currentEvent?.category_id) {
      fetchEvents({
        category: currentEvent.category_id,
        status: 'approved',
        limit: 4,
      });
    }
  }, [currentEvent?.category_id, fetchEvents]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      if (isSaved) {
        await unsaveEvent(currentEvent!.id);
        setIsSaved(false);
        toast.success('Event removed from saved');
      } else {
        await saveEvent(currentEvent!.id);
        setIsSaved(true);
        toast.success('Event saved');
      }
    } catch {
      toast.error('Failed to update saved status');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: currentEvent?.title,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  const handleTicketSelect = (typeId: string, quantity: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toast.success(`${quantity} ticket(s) added`);
  };

  const handleRsvpChange = (_eventId: string, status: string | null) => {
    setRsvpStatus(status as typeof rsvpStatus);
  };

  if (isLoading || !currentEvent) {
    return <LoadingSpinner fullPage />;
  }

  const event = currentEvent;
  const isOwner = user?.id === event.organizer_id;
  const hasLocation = event.latitude && event.longitude;

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
      image_url: e.cover_image ?? undefined,
      is_online: e.is_virtual,
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
        aria-label="Go back"
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
            {event.cover_image ? (
              <img
                src={event.cover_image}
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
                  {formatPrice(0, event.is_free)}
                </span>
              )}
            </div>
          </div>

          {/* Title + actions */}
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                  isSaved
                    ? 'border-orange-200 bg-orange-50 text-orange-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              {isOwner && (
                <Link
                  to={`/events/${event.id}/edit`}
                  className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                >
                  Edit Event
                </Link>
              )}
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
                {event.is_virtual ? (
                  <Globe className="h-6 w-6 text-blue-500" />
                ) : (
                  <MapPin className="h-6 w-6 text-blue-500" />
                )}
              </div>
              <div>
                {event.is_virtual ? (
                  <>
                    <p className="text-sm font-semibold text-gray-900">
                      Online Event
                    </p>
                    {event.virtual_url && (
                      <a
                        href={event.virtual_url}
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
                  <p className="text-sm font-semibold text-gray-900">
                    {event._count.tickets + event._count.rsvps} Attending
                  </p>
                  {event.max_attendees && (
                    <p className="mt-0.5 text-sm text-gray-500">
                      {event.max_attendees} max capacity
                    </p>
                  )}
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

          {/* Description */}
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-gray-900" id="about">
              About This Event
            </h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              {event.description.split('\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Map */}
          {!event.is_virtual && hasLocation && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Location
              </h2>
              <div className="h-64 overflow-hidden rounded-xl border border-gray-200">
                <EventMap
                  events={[
                    {
                      id: event.id,
                      slug: event.slug || '',
                      title: event.title,
                      latitude: event.latitude!,
                      longitude: event.longitude!,
                      start_date: event.start_date,
                      venue_name: event.venue_name || '',
                      is_free: event.is_free,
                      price: 0,
                    },
                  ]}
                  center={[event.latitude!, event.longitude!]}
                  zoom={15}
                />
              </div>
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
            {event.status === EVENT_STATUS.APPROVED && (
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
                      onStatusChange={handleRsvpChange}
                    />
                  </div>
                ) : (
                  !ticketsLoading &&
                  ticketTypes.length > 0 && (
                    <TicketSelector
                      ticketTypes={ticketTypes}
                      onSelect={handleTicketSelect}
                    />
                  )
                )}
              </>
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
                    {event.is_free ? 'Free' : formatPrice(0, false)}
                  </dd>
                </div>
                {event.max_attendees && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Capacity</dt>
                    <dd className="font-medium text-gray-900">
                      {event.max_attendees}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Format</dt>
                  <dd className="font-medium text-gray-900">
                    {event.is_virtual ? 'Online' : 'In Person'}
                  </dd>
                </div>
              </dl>
            </div>
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
