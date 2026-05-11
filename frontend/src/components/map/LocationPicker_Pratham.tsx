import React, { useState, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { cn } from '../../utils/cn_Pratham';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

interface LatLng {
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  value?: LatLng | null;
  onChange: (latitude: number, longitude: number) => void;
  className?: string;
}

const DEFAULT_CENTER: [number, number] = [37.3382, -121.8863];
const DEFAULT_ZOOM = 13;

const draggableIcon = L.divIcon({
  className: 'location-picker-marker',
  html: `
    <div style="
      display:flex;align-items:center;justify-content:center;
      width:36px;height:36px;background:#f97316;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg) translate(-50%, -50%);
      box-shadow:0 3px 10px rgba(0,0,0,.3);border:3px solid #fff;
    ">
      <div style="
        width:10px;height:10px;background:#fff;border-radius:50%;
        transform:rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      onChange(lat, lng);
    },
    [onChange]
  );

  const handleMarkerDrag = useCallback(
    (e: L.DragEndEvent) => {
      const marker = e.target as L.Marker;
      const pos = marker.getLatLng();
      onChange(pos.lat, pos.lng);
    },
    [onChange]
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        onChange(lat, lng);
      }
    } catch {
      // Geocoding failed silently
    } finally {
      setIsSearching(false);
    }
  };

  const mapCenter: [number, number] = value
    ? [value.latitude, value.longitude]
    : DEFAULT_CENTER;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <form onSubmit={handleSearch} className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location..."
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute inset-y-0 right-0 flex items-center rounded-r-lg bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Go'}
        </button>
      </form>

      <div className="relative h-80 w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <MapContainer
          center={mapCenter}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom
          className="h-full w-full z-0"
          key={`${mapCenter[0]}-${mapCenter[1]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onClick={handleMapClick} />
          {value && (
            <Marker
              position={[value.latitude, value.longitude]}
              icon={draggableIcon}
              draggable
              eventHandlers={{ dragend: handleMarkerDrag }}
            />
          )}
        </MapContainer>
      </div>

      {value ? (
        <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm">
          <MapPin className="h-4 w-4 text-orange-500" />
          <span className="text-gray-700">
            <span className="font-medium">Lat:</span> {value.latitude.toFixed(6)},{' '}
            <span className="font-medium">Lng:</span> {value.longitude.toFixed(6)}
          </span>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-400">
          Click on the map or search to select a location
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
