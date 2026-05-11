import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Globe, DollarSign } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import { formatDate } from '../../utils/formatDate_Sasi';
import { formatPrice } from '../../utils/formatCurrency_Sasi';

interface EventOrganizer {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

export interface EventCardData {
  id: string;
  slug: string;
  title: string;
  short_desc?: string;
  image_url?: string;
  start_date: string;
  end_date: string;
  venue_name?: string;
  city?: string;
  is_free: boolean;
  price?: number;
  is_online?: boolean;
  category?: { id: string; name: string };
  organizer: EventOrganizer;
}

interface EventCardProps {
  event: EventCardData;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const {
    slug,
    title,
    short_desc,
    image_url,
    start_date,
    venue_name,
    city,
    is_free,
    price,
    is_online,
    category,
    organizer,
  } = event;

  return (
    <Link
      to={`/events/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
            <Calendar className="h-12 w-12 text-white/60" />
          </div>
        )}

        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {category.name}
          </span>
        )}

        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-sm font-semibold backdrop-blur-sm">
          {is_free ? (
            <span className="text-green-600">Free</span>
          ) : (
            <>
              <DollarSign className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-gray-900">
                {formatPrice(price ?? 0, is_free)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(start_date)}
          </span>

          <span className="flex items-center gap-1">
            {is_online ? (
              <>
                <Globe className="h-3.5 w-3.5" />
                Online
              </>
            ) : (
              <>
                <MapPin className="h-3.5 w-3.5" />
                {city || venue_name || 'TBA'}
              </>
            )}
          </span>
        </div>

        <h3 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-orange-600">
          {title}
        </h3>

        {short_desc && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-500">
            {short_desc}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 border-t border-gray-100 pt-3">
          {organizer.avatar_url ? (
            <img
              src={organizer.avatar_url}
              alt={`${organizer.first_name} ${organizer.last_name}`}
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-medium text-orange-600">
              {organizer.first_name[0]}
            </div>
          )}
          <span className="text-xs text-gray-500">
            {organizer.first_name} {organizer.last_name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
