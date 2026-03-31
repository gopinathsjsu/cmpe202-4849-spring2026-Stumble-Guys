import { create } from 'zustand';
import { searchApi, type SearchParams } from '../api/searchApi_Pratham';
import type { EventType } from './eventStore_Nikhil';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SearchState {
  results: EventType[];
  trending: EventType[];
  savedEvents: EventType[];
  isLoading: boolean;
  query: SearchParams;
  pagination: Pagination;

  search: (params: SearchParams) => Promise<void>;
  fetchTrending: () => Promise<void>;
  fetchSavedEvents: (params?: { page?: number; limit?: number }) => Promise<void>;
  saveEvent: (id: string) => Promise<void>;
  unsaveEvent: (id: string) => Promise<void>;
  setQuery: (query: Partial<SearchParams>) => void;
  clearResults: () => void;
}

const defaultPagination: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

const useSearchStore = create<SearchState>((set, get) => ({
  results: [],
  trending: [],
  savedEvents: [],
  isLoading: false,
  query: {},
  pagination: { ...defaultPagination },

  search: async (params) => {
    set({ isLoading: true });
    try {
      const mergedParams = { ...get().query, ...params };
      const data = await searchApi.searchEvents(mergedParams);
      set({
        results: data.data.events ?? data.data,
        pagination: data.data.pagination ?? defaultPagination,
        query: mergedParams,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchTrending: async () => {
    try {
      const data = await searchApi.getTrendingEvents();
      set({ trending: data.data });
    } catch (error) {
      throw error;
    }
  },

  fetchSavedEvents: async (params) => {
    set({ isLoading: true });
    try {
      const data = await searchApi.getSavedEvents(params);
      set({
        savedEvents: data.data.events ?? data.data,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  saveEvent: async (id) => {
    try {
      await searchApi.saveEvent(id);
      const { results, trending } = get();
      set({
        results: results.map((e) =>
          e.id === id ? { ...e, isSaved: true } : e
        ) as EventType[],
        trending: trending.map((e) =>
          e.id === id ? { ...e, isSaved: true } : e
        ) as EventType[],
      });
    } catch (error) {
      throw error;
    }
  },

  unsaveEvent: async (id) => {
    try {
      await searchApi.unsaveEvent(id);
      set((state) => ({
        savedEvents: state.savedEvents.filter((e) => e.id !== id),
        results: state.results.map((e) =>
          e.id === id ? { ...e, isSaved: false } : e
        ) as EventType[],
        trending: state.trending.map((e) =>
          e.id === id ? { ...e, isSaved: false } : e
        ) as EventType[],
      }));
    } catch (error) {
      throw error;
    }
  },

  setQuery: (query) => {
    set((state) => ({ query: { ...state.query, ...query } }));
  },

  clearResults: () => {
    set({
      results: [],
      query: {},
      pagination: { ...defaultPagination },
    });
  },
}));

export default useSearchStore;

// Trending events state management - Sprint 4
