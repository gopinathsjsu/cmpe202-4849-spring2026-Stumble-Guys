import React from 'react';
import L from 'leaflet';
import { Marker, Tooltip } from 'react-leaflet';

interface MapMarkerEvent {
  title: string;
  is_free: boolean;
  price: number;
}

interface MapMarkerProps {
  event: MapMarkerEvent;
  position: [number, number];
  onClick?: () => void;
}

function buildMarkerIcon(isFree: boolean, price: number): L.DivIcon {
  const label = isFree ? 'Free' : `$${price}`;
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        position:relative;display:inline-flex;align-items:center;
        justify-content:center;background:#f97316;color:#fff;
        font-weight:700;font-size:11px;padding:3px 10px;
        border-radius:9999px;white-space:nowrap;
        box-shadow:0 2px 8px rgba(0,0,0,.3);border:2px solid #fff;
      ">
        ${label}
        <span style="
          position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);
          width:0;height:0;border-left:7px solid transparent;
          border-right:7px solid transparent;border-top:7px solid #f97316;
        "></span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

const MapMarker: React.FC<MapMarkerProps> = ({ event, position, onClick }) => {
  const icon = buildMarkerIcon(event.is_free, event.price);

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={onClick ? { click: onClick } : undefined}
    >
      <Tooltip
        direction="top"
        offset={[0, -12]}
        className="!rounded-lg !border-none !bg-gray-900 !px-3 !py-1.5 !text-xs !font-medium !text-white !shadow-lg"
      >
        {event.title}
      </Tooltip>
    </Marker>
  );
};

export default MapMarker;
