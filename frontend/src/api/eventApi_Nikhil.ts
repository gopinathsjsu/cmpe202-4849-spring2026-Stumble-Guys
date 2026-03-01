import axiosClient from './axiosClient_Pratham';

export interface CreateEventData {
  title: string;
  description: string;
  category_id: string;
  venue_name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  start_date: string;
  end_date: string;
  is_free: boolean;
  max_attendees?: number;
  cover_image?: string;
  is_virtual?: boolean;
  virtual_url?: string;
}

export interface EventFilters {
  page?: number;
  limit?: number;
  category?: string;
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
