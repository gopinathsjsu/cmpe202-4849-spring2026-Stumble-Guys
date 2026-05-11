import axiosClient from './axiosClient_Pratham';

export interface CreateEventData {
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
  google_maps_url?: string;
  is_online?: boolean;
  online_url?: string;
  image_url?: string;
  capacity?: number;
  is_free?: boolean;
  price?: number;
  tags?: string[];
}

export interface EventFilters {
  page?: number;
  limit?: number;
  category?: string;
  /** Comma-separated category UUIDs for multi-filter */
  category_ids?: string;
  city?: string;
  status?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
  is_free?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export const eventApi = {
  uploadEventImage: async (file: File) => {
    const form = new FormData();
    form.append('image', file);
    const response = await axiosClient.post('/uploads/event-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  createEvent: async (data: CreateEventData) => {
    const response = await axiosClient.post('/events', data);
    return response.data;
  },

  getEvents: async (params?: EventFilters) => {
    const response = await axiosClient.get('/events', { params });
    return response.data;
  },

  getEventBySlug: async (slug: string) => {
    const response = await axiosClient.get(`/events/${slug}`);
    return response.data;
  },

  getEventUpdates: async (eventId: string) => {
    const response = await axiosClient.get(`/events/${eventId}/updates`);
    return response.data;
  },

  createEventUpdate: async (eventId: string, message: string) => {
    const response = await axiosClient.post(`/events/${eventId}/updates`, { message });
    return response.data;
  },

  updateEvent: async (id: string, data: Partial<CreateEventData>) => {
    const response = await axiosClient.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string) => {
    const response = await axiosClient.delete(`/events/${id}`);
    return response.data;
  },

  getMyEvents: async (params?: EventFilters) => {
    const response = await axiosClient.get('/events/my', { params });
    return response.data;
  },

  submitForApproval: async (id: string) => {
    const response = await axiosClient.post(`/events/${id}/submit`);
    return response.data;
  },

  getAttendees: async (id: string) => {
    const response = await axiosClient.get(`/events/${id}/attendees`);
    return response.data;
  },

  getOrganizerDashboard: async () => {
    const response = await axiosClient.get('/organizer/dashboard');
    return response.data;
  },

  getOrganizerPendingRsvps: async () => {
    const response = await axiosClient.get('/organizer/pending-rsvps');
    return response.data;
  },

  getEventGuestlist: async (eventId: string, params?: { search?: string }) => {
    const response = await axiosClient.get(`/events/${eventId}/guestlist`, { params });
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosClient.get('/categories');
    return response.data;
  },

  getPendingEvents: async (params?: EventFilters) => {
    const response = await axiosClient.get('/admin/events/pending', { params });
    return response.data;
  },

  approveEvent: async (id: string, notes?: string) => {
    const response = await axiosClient.put(`/admin/events/${id}/approve`, {
      notes,
    });
    return response.data;
  },

  rejectEvent: async (id: string, notes: string) => {
    const response = await axiosClient.put(`/admin/events/${id}/reject`, {
      notes,
    });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await axiosClient.get('/admin/dashboard');
    return response.data;
  },
};
