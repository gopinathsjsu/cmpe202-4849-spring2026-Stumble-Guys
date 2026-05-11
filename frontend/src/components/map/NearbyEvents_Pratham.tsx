import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import { formatDate } from '../../utils/formatDate_Sasi';
import { formatPrice } from '../../utils/formatCurrency_Sasi';
import { searchApi } from '../../api/searchApi_Pratham';

interface NearbyEvent {
  id: string;
  slug: string;
  title: string;
  start_date: string;
  venue_name: string;
  is_free: boolean;
  price: number;
  image_url?: string;
  latitude: number;
  longitude: number;
}

interface NearbyEventsProps {
  latitude?: number | null;
  longitude?: number | null;
  radius?: number;
  className?: string;
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

const NearbyEvents: React.FC<NearbyEventsProps> = ({
  latitude,
  longitude,
  radius = 25,
  className,
}) => {
  const [events, setEvents] = useState<NearbyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLat, setUserLat] = useState<number | null>(latitude ?? null);
  const [userLng, setUserLng] = useState<number | null>(longitude ?? null);
  const [locating, setLocating] = useState(false);

  const fetchNearby = useCallback(async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await searchApi.getNearbyEvents({ latitude: lat, longitude: lng, radius });
      setEvents(data.events ?? data ?? []);
    } catch {
      setError('Failed to load nearby events.');
    } finally {
      setIsLoading(false);
    }
  }, [radius]);

  useEffect(() => {
    if (userLat != null && userLng != null) {
      fetchNearby(userLat, userLng);
    }
  }, [userLat, userLng, fetchNearby]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setError('Unable to retrieve your location.');
        setLocating(false);
      }
    );
  };

  const hasLocation = userLat != null && userLng != null;

  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-bold text-gray-900">Nearby Events</h2>
          {hasLocation && (
            <span className="text-xs text-gray-400">within {radius} km</span>
          )}
        </div>
        <button
          onClick={handleUseLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 transition-colors hover:bg-orange-100 disabled:opacity-50"
        >
          {locating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Navigation className="h-3.5 w-3.5" />
          )}
          Use My Location
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {!hasLocation && !isLoading && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 py-12 text-center">
          <MapPin className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">
            Allow location access to discover events near you
          </p>
          <button
            onClick={handleUseLocation}
            disabled={locating}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {locating ? 'Getting Location...' : 'Enable Location'}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-white p-4">
              <div className="mb-3 h-36 rounded-lg bg-gray-200" />
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mb-1 h-3 w-1/2 rounded bg-gray-100" />
              <div className="h-3 w-1/3 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && hasLocation && events.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <MapPin className="h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">No events found nearby</p>
        </div>
      )}

      {!isLoading && events.length > 0 && hasLocation && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const distance = haversineDistance(
              userLat!,
              userLng!,
              event.latitude,
              event.longitude
            );
            return (
              <Link
                key={event.id}
                to={`/events/${event.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
              >
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-36 w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
                    <MapPin className="h-8 w-8 text-orange-300" />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500">{formatDate(event.start_date)}</p>
                  <p className="text-xs text-gray-400">{event.venue_name}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
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
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                      <Navigation className="h-3 w-3" />
                      {formatDistance(distance)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default NearbyEvents;
