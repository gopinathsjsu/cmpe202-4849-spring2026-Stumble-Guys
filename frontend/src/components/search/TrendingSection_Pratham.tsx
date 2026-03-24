import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Eye, TrendingUp, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import { formatDate } from '../../utils/formatDate_Sasi';
import { formatPrice } from '../../utils/formatCurrency_Sasi';

interface TrendingEvent {
  id: string;
  slug: string;
  title: string;
  start_date: string;
  venue_name: string;
  is_free: boolean;
  price: number;
  image_url?: string;
  view_count?: number;
}

interface TrendingSectionProps {
  events: TrendingEvent[];
  isLoading: boolean;
  className?: string;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({
  events,
  isLoading,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Trending Events</h2>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          <button
            onClick={() => scroll('left')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-64 shrink-0 animate-pulse rounded-xl border border-gray-100 bg-white"
            >
              <div className="h-36 rounded-t-xl bg-gray-200" />
              <div className="flex flex-col gap-2 p-3">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scrollable cards */}
      {!isLoading && events.length > 0 && (
        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-1 flex gap-4 overflow-x-auto px-1 pb-2 snap-x"
        >
          {events.map((event, index) => (
            <Link
              key={event.id}
              to={`/events/${event.slug}`}
              className="group relative w-64 shrink-0 snap-start overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Rank badge */}
              <div className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900/80 text-xs font-bold text-white backdrop-blur-sm">
                {index + 1}
              </div>

              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="h-36 w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                  <Calendar className="h-8 w-8 text-orange-300" />
                </div>
              )}

              <div className="flex flex-col gap-1 p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-xs text-gray-500">{formatDate(event.start_date)}</p>
                <p className="text-xs text-gray-400">{event.venue_name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      event.is_free
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    )}
                  >
                    {formatPrice(event.price, event.is_free)}
                  </span>
                  {event.view_count != null && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Eye className="h-3 w-3" />
                      {event.view_count.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && events.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Flame className="h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">No trending events right now</p>
        </div>
      )}
    </section>
  );
};

export default TrendingSection;
