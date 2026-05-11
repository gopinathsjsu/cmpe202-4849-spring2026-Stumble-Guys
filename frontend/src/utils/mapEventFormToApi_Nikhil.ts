import type { CreateEventData } from '../api/eventApi_Nikhil';
import type { EventFormData } from '../components/events/EventForm_Nikhil';

function toIso(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toISOString();
}

export function mapEventFormToApiPayload(data: EventFormData): CreateEventData {
  const tags = data.tags
    ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : undefined;

  const imageUrl = data.image_url?.trim();
  const payload: CreateEventData = {
    title: data.title,
    description: data.description,
    short_desc: data.short_description?.trim() || undefined,
    category_id: data.category_id,
    start_date: toIso(data.start_date),
    end_date: toIso(data.end_date),
    timezone: data.timezone,
    is_online: data.is_online,
    is_free: data.is_free,
    capacity: data.capacity,
    price: data.is_free ? 0 : data.price ?? 0,
    tags: tags && tags.length > 0 ? tags : undefined,
  };

  if (imageUrl) payload.image_url = imageUrl;

  if (data.is_online) {
    const url = data.virtual_url?.trim();
    if (url) payload.online_url = url;
  } else {
    payload.venue_name = data.venue_name?.trim() || undefined;
    payload.address = data.address?.trim() || undefined;
    payload.city = data.city?.trim() || undefined;
    payload.state = data.state?.trim() || undefined;
    payload.zip_code = data.zip_code?.trim() || undefined;
    payload.country = data.country?.trim() || undefined;
    const maps = data.google_maps_url?.trim();
    if (maps) payload.google_maps_url = maps;
  }

  return payload;
}
