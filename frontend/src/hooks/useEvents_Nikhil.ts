import { useEffect, useCallback } from 'react';
import useEventStore from '../store/eventStore_Nikhil';
import type { EventFilters } from '../api/eventApi_Nikhil';

export function useEvents(filters?: EventFilters) {
  const { events, isLoading, pagination, fetchEvents } = useEventStore();

  const refetch = useCallback(
    (overrides?: EventFilters) => {
      fetchEvents({ ...filters, ...overrides });
    },
    [fetchEvents, filters]
  );

  useEffect(() => {
    fetchEvents(filters);
  }, [fetchEvents, filters]);

  return { events, isLoading, pagination, refetch };
}

export function useEvent(slug: string) {
  const { currentEvent, isLoading, fetchEventBySlug } = useEventStore();

  useEffect(() => {
    if (slug) {
      fetchEventBySlug(slug);
    }
  }, [slug, fetchEventBySlug]);

  return { event: currentEvent, isLoading };
}
