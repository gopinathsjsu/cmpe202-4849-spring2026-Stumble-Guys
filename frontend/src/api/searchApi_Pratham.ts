import axiosClient from './axiosClient_Pratham';

export interface SearchParams {
  q?: string;
  category?: string;
  city?: string;
  start_date?: string;
  end_date?: string;
  is_free?: boolean;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface NearbyParams {
  latitude: number;
  longitude: number;
  radius?: number;
  page?: number;
  limit?: number;
}

export interface MapParams {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface SavedEventsParams {
  page?: number;
  limit?: number;
}

export const searchApi = {
  searchEvents: async (params: SearchParams) => {
    const response = await axiosClient.get('/search', { params });
    return response.data;
  },

  getNearbyEvents: async (params: NearbyParams) => {
    const response = await axiosClient.get('/events/nearby', { params });
    return response.data;
  },

  getMapEvents: async (params: MapParams) => {
    const response = await axiosClient.get('/events/map', { params });
    return response.data;
  },

  getTrendingEvents: async () => {
    const response = await axiosClient.get('/events/trending');
    return response.data;
  },

  saveEvent: async (eventId: string) => {
    const response = await axiosClient.post(`/events/${eventId}/save`);
    return response.data;
  },

  unsaveEvent: async (eventId: string) => {
    const response = await axiosClient.delete(`/events/${eventId}/save`);
    return response.data;
  },

  getSavedEvents: async (params?: SavedEventsParams) => {
    const response = await axiosClient.get('/events/saved', { params });
    return response.data;
  },

  getEventStats: async (eventId: string) => {
    const response = await axiosClient.get(`/events/${eventId}/stats`);
    return response.data;
  },
};
