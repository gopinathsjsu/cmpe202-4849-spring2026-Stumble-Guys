import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Loader2,
  Calendar,
  SlidersHorizontal,
  X,
  List,
} from 'lucide-react';
import { cn } from '../utils/cn_Pratham';
import { formatDate } from '../utils/formatDate_Sasi';
import { formatPrice } from '../utils/formatCurrency_Sasi';
import EventMap from '../components/map/EventMap_Pratham';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import { searchApi, type MapParams } from '../api/searchApi_Pratham';

interface MapEvent {
  id: string;
  slug: string;
  title: string;
  latitude: number;
  longitude: number;
  start_date: string;
  venue_name: string;
  is_free: boolean;
  price: number;
  image_url?: string;
  category?: string;
}

const MapPage: React.FC = () => {
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [bounds, setBounds] = useState<MapParams | null>(null);

  const fetchMapEvents = useCallback(async (b: MapParams) => {
    setIsLoading(true);
    try {
      const data = await searchApi.getMapEvents(b);
      setEvents(data.data ?? data ?? []);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBoundsChange = useCallback(
    (b: { north: number; south: number; east: number; west: number }) => {
      setBounds(b);
      fetchMapEvents(b);
    },
    [fetchMapEvents]
  );

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false)
    );
  }, []);

  useEffect(() => {
    handleLocate();
  }, [handleLocate]);

  const filteredEvents = categoryFilter
    ? events.filter((e) => e.category === categoryFilter)
    : events;

  const categories = [...new Set(events.map((e) => e.category).filter(Boolean))];

  return (
    <div className="relative flex h-[calc(100vh-64px)] flex-col lg:flex-row">
      {/* Map */}
      <div className="relative flex-1">
        <EventMap
          events={filteredEvents}
          center={userLocation ?? undefined}
          onBoundsChange={handleBoundsChange}
          className="h-full rounded-none"
        />

        {/* Floating controls */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          <button
            onClick={handleLocate}
            disabled={locating}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {locating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4 text-orange-500" />
            )}
            My Location
          </button>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setCategoryFilter('')}
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium shadow-sm transition-colors',
                  !categoryFilter
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat === categoryFilter ? '' : cat!)}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium shadow-sm transition-colors',
                    cat === categoryFilter
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toggle sidebar on mobile */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg lg:hidden"
        >
          {showSidebar ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
        </button>

        {isLoading && (
          <div className="absolute right-4 top-4 z-10">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>

      {/* Sidebar event list */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 z-20 max-h-[50vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl transition-transform lg:relative lg:bottom-auto lg:z-auto lg:max-h-none lg:w-96 lg:rounded-none lg:shadow-none lg:border-l lg:border-gray-200',
          showSidebar
            ? 'translate-y-0'
            : 'translate-y-full lg:translate-y-0'
        )}
      >
        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <MapPin className="h-4 w-4 text-orange-500" />
            Events in this area
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {filteredEvents.length}
            </span>
          </h2>
        </div>

        {filteredEvents.length === 0 && !isLoading && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <MapPin className="h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">
              No events in this area. Try panning the map.
            </p>
          </div>
        )}

        <div className="divide-y divide-gray-50">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.slug}`}
              onMouseEnter={() => setSelectedEvent(event)}
              onMouseLeave={() => setSelectedEvent(null)}
              className={cn(
                'flex gap-3 p-4 transition-colors hover:bg-orange-50/50',
                selectedEvent?.id === event.id && 'bg-orange-50/50'
              )}
            >
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-orange-50">
                  <Calendar className="h-5 w-5 text-orange-300" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-gray-900">
                  {event.title}
                </h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {formatDate(event.start_date)}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3 w-3" />
                  {event.venue_name}
                </p>
                <span
                  className={cn(
                    'mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    event.is_free
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  )}
                >
                  {formatPrice(event.price, event.is_free)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapPage;

// Error boundary wrapper for map rendering failures - Sprint 5
