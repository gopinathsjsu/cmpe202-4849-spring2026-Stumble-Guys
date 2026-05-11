import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useEventStore from '../store/eventStore_Nikhil';
import CategoryFilter from '../components/events/CategoryFilter_Nikhil';
import FilterPanel, {
  type BrowsePanelFilters,
} from '../components/search/FilterPanel_Pratham';
import EventGrid from '../components/events/EventGrid_Nikhil';
import Pagination from '../components/shared/Pagination_Pratham';

function parseCategoryIdsFromSearchParams(searchParams: URLSearchParams): string[] {
  const multi = searchParams.get('categories');
  if (multi) return multi.split(',').map((s) => s.trim()).filter(Boolean);
  const one = searchParams.get('category');
  if (one) return one.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

const EventListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    events,
    categories,
    isLoading,
    pagination,
    fetchEvents,
    fetchCategories,
  } = useEventStore();

  const [panelFilters, setPanelFilters] = useState<BrowsePanelFilters>(() => ({
    categoryIds: parseCategoryIdsFromSearchParams(searchParams),
    dateRange: { start: '', end: '' },
    isFree: 'all',
    city: searchParams.get('city') ?? '',
  }));

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const loadEvents = useCallback(
    (page = 1) => {
      const params: Record<string, unknown> = {
        status: 'approved',
        page,
        limit: 12,
      };

      const ids = panelFilters.categoryIds;
      if (ids.length === 1) {
        params.category = ids[0];
      } else if (ids.length > 1) {
        params.category_ids = ids.join(',');
      }

      if (panelFilters.city.trim()) params.city = panelFilters.city.trim();
      if (panelFilters.dateRange.start)
        params.start_date = panelFilters.dateRange.start;
      if (panelFilters.dateRange.end)
        params.end_date = panelFilters.dateRange.end;
      if (panelFilters.isFree === 'free') params.is_free = true;
      if (panelFilters.isFree === 'paid') params.is_free = false;

      const search = searchParams.get('search');
      if (search) params.search = search;

      fetchEvents(params as Parameters<typeof fetchEvents>[0]);
    },
    [panelFilters, searchParams, fetchEvents]
  );

  useEffect(() => {
    loadEvents(1);
  }, [loadEvents]);

  const writeBrowseParams = useCallback(
    (filters: BrowsePanelFilters) => {
      const next = new URLSearchParams(searchParams);
      const ids = filters.categoryIds;
      if (ids.length === 0) {
        next.delete('category');
        next.delete('categories');
      } else if (ids.length === 1) {
        next.set('category', ids[0]);
        next.delete('categories');
      } else {
        next.delete('category');
        next.set('categories', ids.join(','));
      }
      if (filters.city.trim()) next.set('city', filters.city.trim());
      else next.delete('city');
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleCategoryPillSelect = (catId: string | null) => {
    setPanelFilters((p) => {
      const nextFilters = { ...p, categoryIds: catId ? [catId] : [] };
      writeBrowseParams(nextFilters);
      return nextFilters;
    });
  };

  const handlePanelFilterChange = (filters: BrowsePanelFilters) => {
    setPanelFilters(filters);
    writeBrowseParams(filters);
  };

  const handlePageChange = (page: number) => {
    loadEvents(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
    [categories]
  );

  const pillSelectedId =
    panelFilters.categoryIds.length === 1 ? panelFilters.categoryIds[0] : null;

  const eventCards = events.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    start_date: e.start_date,
    end_date: e.end_date,
    venue_name: e.venue_name ?? undefined,
    city: e.city ?? undefined,
    is_free: e.is_free,
    price: Number(e.price ?? 0),
    image_url: e.image_url ?? e.cover_image ?? undefined,
    is_online: e.is_online ?? e.is_virtual,
    category: e.category ? { id: e.category.id, name: e.category.name } : undefined,
    organizer: {
      id: e.organizer?.id ?? e.organizer_id,
      first_name: e.organizer?.first_name ?? 'Event',
      last_name: e.organizer?.last_name ?? 'Organizer',
      avatar_url: e.organizer?.avatar_url ?? undefined,
    },
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Events</h1>
        <p className="mt-1 text-sm text-gray-500">
          {pagination.total > 0
            ? `${pagination.total} event${pagination.total !== 1 ? 's' : ''} found`
            : 'Discover amazing events near you'}
        </p>
      </div>

      <div className="mb-6">
        <CategoryFilter
          categories={categoryOptions}
          selectedCategory={pillSelectedId}
          onSelect={handleCategoryPillSelect}
        />
      </div>

      <div className="flex gap-8">
        <FilterPanel
          filters={panelFilters}
          categories={categoryOptions}
          onFilterChange={handlePanelFilterChange}
        />

        <div className="min-w-0 flex-1">
          <EventGrid
            events={eventCards}
            isLoading={isLoading}
            emptyMessage="No events match your criteria. Try adjusting your filters."
          />

          {pagination.totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventListPage;
