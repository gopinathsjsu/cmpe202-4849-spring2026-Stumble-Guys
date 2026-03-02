import { create } from 'zustand';
import { eventApi, type EventFilters } from '../api/eventApi_Nikhil';

export interface EventType {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  organizer_id: string;
  venue_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  start_date: string;
  end_date: string;
  is_free: boolean;
  max_attendees: number | null;
  cover_image: string | null;
  status: string;
  is_virtual: boolean;
  virtual_url: string | null;
  created_at: string;
  updated_at: string;
  organizer?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  _count?: {
    tickets: number;
    rsvps: number;
  };
}

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface EventState {
  events: EventType[];
  currentEvent: EventType | null;
  categories: CategoryType[];
  isLoading: boolean;
  filters: EventFilters;
  pagination: Pagination;

  fetchEvents: (filters?: EventFilters) => Promise<void>;
  fetchEventBySlug: (slug: string) => Promise<void>;
  createEvent: (data: Parameters<typeof eventApi.createEvent>[0]) => Promise<EventType>;
  updateEvent: (id: string, data: Parameters<typeof eventApi.updateEvent>[1]) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchMyEvents: (params?: EventFilters) => Promise<void>;
  submitForApproval: (id: string) => Promise<void>;
  setFilters: (filters: Partial<EventFilters>) => void;
  clearFilters: () => void;
}

const defaultPagination: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

const useEventStore = create<EventState>((set, get) => ({
  events: [],
  currentEvent: null,
  categories: [],
  isLoading: false,
  filters: {},
  pagination: { ...defaultPagination },

  fetchEvents: async (filters) => {
    set({ isLoading: true });
    try {
      const mergedFilters = { ...get().filters, ...filters };
      const data = await eventApi.getEvents(mergedFilters);
      set({
        events: data.data.events,
        pagination: data.data.pagination ?? defaultPagination,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchEventBySlug: async (slug) => {
    set({ isLoading: true });
    try {
      const data = await eventApi.getEventBySlug(slug);
      set({ currentEvent: data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createEvent: async (eventData) => {
    set({ isLoading: true });
    try {
      const data = await eventApi.createEvent(eventData);
      set((state) => ({
        events: [data.data, ...state.events],
        isLoading: false,
      }));
      return data.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateEvent: async (id, eventData) => {
    set({ isLoading: true });
    try {
      const data = await eventApi.updateEvent(id, eventData);
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? data.data : e)),
        currentEvent:
          state.currentEvent?.id === id ? data.data : state.currentEvent,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    set({ isLoading: true });
    try {
      await eventApi.deleteEvent(id);
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
        currentEvent:
          state.currentEvent?.id === id ? null : state.currentEvent,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      const data = await eventApi.getCategories();
      set({ categories: data.data });
    } catch (error) {
      throw error;
    }
  },

  fetchMyEvents: async (params) => {
    set({ isLoading: true });
    try {
      const data = await eventApi.getMyEvents(params);
      set({
        events: data.data.events,
        pagination: data.data.pagination ?? defaultPagination,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  submitForApproval: async (id) => {
    try {
      const data = await eventApi.submitForApproval(id);
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? data.data : e)),
        currentEvent:
          state.currentEvent?.id === id ? data.data : state.currentEvent,
      }));
    } catch (error) {
      throw error;
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearFilters: () => {
    set({ filters: {}, pagination: { ...defaultPagination } });
  },
}));

export default useEventStore;
