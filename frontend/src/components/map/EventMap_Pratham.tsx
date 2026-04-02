import React, { useCallback, useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { cn } from '../../utils/cn_Pratham';
import { formatDate } from '../../utils/formatDate_Sasi';
import { formatPrice } from '../../utils/formatCurrency_Sasi';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

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
}

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface EventMapProps {
  events: MapEvent[];
  center?: [number, number];
  zoom?: number;
  onBoundsChange?: (bounds: Bounds) => void;
  className?: string;
}

const DEFAULT_CENTER: [number, number] = [37.3382, -121.8863];
const DEFAULT_ZOOM = 11;

function createEventIcon(isFree: boolean, price: number) {
  const label = isFree ? 'Free' : `$${price}`;
  return L.divIcon({
    className: 'custom-event-marker',
    html: `
      <div style="
        display:flex;align-items:center;justify-content:center;
        background:#f97316;color:#fff;font-weight:600;font-size:12px;
        padding:4px 8px;border-radius:9999px;white-space:nowrap;
        box-shadow:0 2px 6px rgba(0,0,0,.25);border:2px solid #fff;
        transform:translate(-50%,-100%);
      ">
        ${label}
        <div style="
          position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);
          width:0;height:0;border-left:6px solid transparent;
          border-right:6px solid transparent;border-top:6px solid #f97316;
        "></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function BoundsWatcher({ onBoundsChange }: { onBoundsChange: (bounds: Bounds) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const b = map.getBounds();
      onBoundsChange({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    },
    zoomend: () => {
      const b = map.getBounds();
      onBoundsChange({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    },
  });

  useEffect(() => {
    const b = map.getBounds();
    onBoundsChange({
      north: b.getNorth(),
      south: b.getSouth(),
      east: b.getEast(),
      west: b.getWest(),
    });
  }, [map, onBoundsChange]);

  return null;
}

const EventMap: React.FC<EventMapProps> = ({
  events,
  center,
  zoom = DEFAULT_ZOOM,
  onBoundsChange,
  className,
}) => {
  const mapCenter = center ?? DEFAULT_CENTER;

  const handleBoundsChange = useCallback(
    (bounds: Bounds) => {
      onBoundsChange?.(bounds);
    },
    [onBoundsChange]
  );

  const validEvents = useMemo(
    () => events.filter((e) => e.latitude != null && e.longitude != null),
    [events]
  );

  return (
    <div className={cn('relative h-full w-full min-h-[300px] rounded-xl overflow-hidden', className)}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {onBoundsChange && <BoundsWatcher onBoundsChange={handleBoundsChange} />}

        {validEvents.map((event) => (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={createEventIcon(event.is_free, event.price)}
          >
            <Popup maxWidth={280} className="event-popup">
              <div className="flex flex-col gap-2 p-1">
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-28 w-full rounded-lg object-cover"
                  />
                )}
                <Link
                  to={`/events/${event.slug}`}
                  className="text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2"
                >
                  {event.title}
                </Link>
                <p className="text-xs text-gray-500">{formatDate(event.start_date)}</p>
                <p className="text-xs text-gray-500">{event.venue_name}</p>
                <span
                  className={cn(
                    'inline-block self-start rounded-full px-2 py-0.5 text-xs font-semibold',
                    event.is_free
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  )}
                >
                  {formatPrice(event.price, event.is_free)}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default EventMap;

// Map bounds change handler - Sprint 4
