import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Calendar, MapPin } from 'lucide-react';
import { cn } from '../utils/cn_Pratham';
import { formatDate } from '../utils/formatDate_Sasi';
import { formatPrice } from '../utils/formatCurrency_Sasi';
import EmptyState from '../components/shared/EmptyState_Nikhil';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import useSearchStore from '../store/searchStore_Pratham';

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-100" />
        <div className="h-3 w-1/3 rounded bg-gray-100" />
      </div>
    </div>
  );
}

const SavedEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedEvents, isLoading, fetchSavedEvents, unsaveEvent } =
    useSearchStore();

  useEffect(() => {
    fetchSavedEvents();
  }, [fetchSavedEvents]);

  const handleUnsave = useCallback(
    async (e: React.MouseEvent, eventId: string) => {
      e.preventDefault();
      e.stopPropagation();
      await unsaveEvent(eventId);
    },
    [unsaveEvent]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-gray-900 sm:text-3xl">
          <Heart className="h-7 w-7 fill-red-500 text-red-500" />
          Saved Events
        </h1>
        <p className="text-sm text-gray-500">
          Events you&apos;ve bookmarked for later.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && savedEvents.length === 0 && (
        <EmptyState
          icon={Heart}
          title="No saved events"
          description="Browse events to save some! They'll show up here for easy access."
          action={{
            label: 'Browse Events',
            onClick: () => navigate('/events'),
          }}
        />
      )}

      {/* Grid */}
      {!isLoading && savedEvents.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => navigate(`/events/${event.slug}`)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Remove button */}
              <button
                onClick={(e) => handleUnsave(e, event.id)}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-transform hover:scale-110"
                title="Remove from saved"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                {event.cover_image ? (
                  <img
                    src={event.cover_image}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
                    <Calendar className="h-12 w-12 text-white/60" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {event.category && (
                  <span className="mb-2 inline-block rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-600">
                    {event.category.name}
                  </span>
                )}
                <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-orange-600">
                  {event.title}
                </h3>
                <div className="space-y-1 text-xs text-gray-500">
                  <p className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(event.start_date)}
                  </p>
                  {(event.venue_name || event.city) && (
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.venue_name}
                      {event.city && `, ${event.city}`}
                    </p>
                  )}
                </div>
                <div className="mt-3">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      event.is_free
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    )}
                  >
                    {formatPrice(0, event.is_free)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedEventsPage;
