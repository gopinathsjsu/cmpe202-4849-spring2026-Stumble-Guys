import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List } from 'lucide-react';
import useEventStore from '../store/eventStore_Nikhil';
import CategoryFilter from '../components/events/CategoryFilter_Nikhil';
import FilterPanel from '../components/search/FilterPanel_Pratham';
import EventGrid from '../components/events/EventGrid_Nikhil';
import Pagination from '../components/shared/Pagination_Pratham';
import { cn } from '../utils/cn_Pratham';

interface PanelFilters {
  category: string;
  dateRange: { start: string; end: string };
  isFree: 'all' | 'free' | 'paid';
  city: string;
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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category') ?? null
  );
  const [panelFilters, setPanelFilters] = useState<PanelFilters>({
    category: '',
    dateRange: { start: '', end: '' },
    isFree: 'all',
    city: searchParams.get('city') ?? '',
  });

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

      if (selectedCategory) params.category = selectedCategory;
      if (panelFilters.city) params.city = panelFilters.city;
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
    [selectedCategory, panelFilters, searchParams, fetchEvents]
  );

  useEffect(() => {
    loadEvents(1);
  }, [loadEvents]);

  const handleCategorySelect = (catId: string | null) => {
    setSelectedCategory(catId);
    const next = new URLSearchParams(searchParams);
    if (catId) next.set('category', catId);
    else next.delete('category');
    setSearchParams(next, { replace: true });
  };

  const handleFilterChange = (filters: PanelFilters) => {
    setPanelFilters(filters);
  };

  const handlePageChange = (page: number) => {
    loadEvents(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryNames = categories.map((c) => c.name);

  const eventCards = events.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    start_date: e.start_date,
    end_date: e.end_date,
    venue_name: e.venue_name ?? undefined,
    city: e.city ?? undefined,
    is_free: e.is_free,
    image_url: e.cover_image ?? undefined,
    is_online: e.is_virtual,
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
        <p className="mt-1 text-sm text-gray-500">
          {pagination.total > 0
            ? `${pagination.total} event${pagination.total !== 1 ? 's' : ''} found`
            : 'Discover amazing events near you'}
        </p>
      </div>

      {/* Category pills */}
      <div className="mb-6">
        <CategoryFilter
          categories={categories.map((c) => ({
            id: c.slug,
            name: c.name,
            slug: c.slug,
          }))}
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      {/* Content */}
      <div className="flex gap-8">
        {/* Filter sidebar */}
        <FilterPanel
          filters={panelFilters}
          categories={categoryNames}
          onFilterChange={handleFilterChange}
        />

        {/* Main grid */}
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
