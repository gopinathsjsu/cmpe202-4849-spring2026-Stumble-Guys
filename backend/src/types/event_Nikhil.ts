export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  short_desc?: string;
  category_id?: string;
  start_date: string;
  end_date: string;
  timezone?: string;
  venue_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  is_online?: boolean;
  online_url?: string;
  image_url?: string;
  capacity?: number;
  is_free?: boolean;
  price?: number;
  tags?: string[];
  schedule?: ScheduleItem[];
}

export type UpdateEventInput = Partial<CreateEventInput>;

export interface EventFilters {
  category_id?: string;
  city?: string;
  start_date?: string;
  end_date?: string;
  is_free?: boolean;
  status?: string;
  search?: string;
}

export interface EventResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_desc: string | null;
  start_date: Date;
  end_date: Date;
  timezone: string;
  venue_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  is_online: boolean;
  online_url: string | null;
  image_url: string | null;
  capacity: number | null;
  is_free: boolean;
  price: number | null;
  status: string;
  tags: string[];
  schedule: ScheduleItem[];
  created_at: Date;
  updated_at: Date;
  organizer: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}
