import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutGrid,
  List,
  ArrowUpDown,
  SearchX,
  Calendar,
  MapPin,
} from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import { formatDate } from '../../utils/formatDate_Sasi';
import { formatPrice } from '../../utils/formatCurrency_Sasi';

interface SearchEvent {
  id: string;
  slug: string;
  title: string;
  start_date: string;
  venue_name: string;
  city?: string;
  is_free: boolean;
  price: number;
  image_url?: string;
  category?: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'relevance' | 'date' | 'price';

interface SearchResultsProps {
  results: SearchEvent[];
  isLoading: boolean;
  query: string;
  totalResults: number;
  onSortChange?: (sort: SortOption) => void;
  className?: string;
}

function SkeletonCard({ view }: { view: ViewMode }) {
  if (view === 'list') {
    return (
      <div className="flex animate-pulse gap-4 rounded-xl border border-gray-100 bg-white p-4">
        <div className="h-24 w-32 shrink-0 rounded-lg bg-gray-200" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-100" />
          <div className="h-3 w-1/3 rounded bg-gray-100" />
        </div>
      </div>
    );
  }
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white">
      <div className="h-40 rounded-t-xl bg-gray-200" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-100" />
        <div className="h-3 w-1/3 rounded bg-gray-100" />
      </div>
    </div>
  );
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  query,
  totalResults,
  onSortChange,
  className,
}) => {
  const [view, setView] = useState<ViewMode>('grid');
  const [sort, setSort] = useState<SortOption>('relevance');

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    onSortChange?.(newSort);
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {query ? (
            <h2 className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">{totalResults}</span>{' '}
              {totalResults === 1 ? 'event' : 'events'} found for{' '}
              <span className="font-semibold text-orange-600">&lsquo;{query}&rsquo;</span>
            </h2>
          ) : (
            <h2 className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">{totalResults}</span>{' '}
              {totalResults === 1 ? 'event' : 'events'} found
            </h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-8 text-xs font-medium text-gray-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="price">Price</option>
            </select>
            <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>

          {/* View toggle */}
          <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
            <button
              onClick={() => setView('grid')}
              className={cn(
                'rounded-md p-1.5 transition-colors',
                view === 'grid'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn(
                'rounded-md p-1.5 transition-colors',
                view === 'list'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className={cn(
            view === 'grid'
              ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col gap-3'
          )}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} view={view} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && results.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <SearchX className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">No events found</h3>
          <p className="max-w-sm text-sm text-gray-500">
            {query
              ? `We couldn't find any events matching "${query}". Try adjusting your search or filters.`
              : 'Try searching for an event or adjusting your filters.'}
          </p>
        </div>
      )}

      {/* Grid view */}
      {!isLoading && results.length > 0 && view === 'grid' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                  <Calendar className="h-10 w-10 text-orange-300" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-1.5 p-4">
                {event.category && (
                  <span className="self-start rounded bg-orange-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-600">
                    {event.category}
                  </span>
                )}
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {event.title}
                </h3>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {formatDate(event.start_date)}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />
                  {event.venue_name}
                  {event.city && `, ${event.city}`}
                </p>
                <div className="mt-auto pt-2">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      event.is_free
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    )}
                  >
                    {formatPrice(event.price, event.is_free)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* List view */}
      {!isLoading && results.length > 0 && view === 'list' && (
        <div className="flex flex-col gap-3">
          {results.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.slug}`}
              className="group flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="h-24 w-32 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-orange-50">
                  <Calendar className="h-6 w-6 text-orange-300" />
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {event.category && (
                  <span className="self-start rounded bg-orange-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-600">
                    {event.category}
                  </span>
                )}
                <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {event.title}
                </h3>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {formatDate(event.start_date)}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />
                  {event.venue_name}
                  {event.city && `, ${event.city}`}
                </p>
                <div className="mt-auto">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      event.is_free
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    )}
                  >
                    {formatPrice(event.price, event.is_free)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
