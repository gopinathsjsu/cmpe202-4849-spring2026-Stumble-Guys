import React, { useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import SearchBar from '../components/search/SearchBar_Pratham';
import FilterPanel from '../components/search/FilterPanel_Pratham';
import SearchResults from '../components/search/SearchResults_Pratham';
import TrendingSection from '../components/search/TrendingSection_Pratham';
import Pagination from '../components/shared/Pagination_Pratham';
import useSearchStore from '../store/searchStore_Pratham';
import useEventStore from '../store/eventStore_Nikhil';

const SORT_MAP: Record<string, { sort_by?: string; sort_order?: 'asc' | 'desc' }> = {
  relevance: {},
  date: { sort_by: 'start_date', sort_order: 'asc' },
  price: { sort_by: 'price', sort_order: 'asc' },
};

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    results,
    trending,
    isLoading,
    pagination,
    search,
    fetchTrending,
  } = useSearchStore();

  const { categories, fetchCategories } = useEventStore();

  const qParam = searchParams.get('q') ?? '';
  const categoryParam = searchParams.get('category') ?? '';
  const cityParam = searchParams.get('city') ?? '';
  const isFreeParam = searchParams.get('is_free') ?? 'all';
  const startParam = searchParams.get('start_date') ?? '';
  const endParam = searchParams.get('end_date') ?? '';
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10);

  useEffect(() => {
    fetchCategories();
    fetchTrending();
  }, [fetchCategories, fetchTrending]);

  useEffect(() => {
    const params: Record<string, unknown> = { q: qParam, page: pageParam };
    if (categoryParam) params.category = categoryParam;
    if (cityParam) params.city = cityParam;
    if (isFreeParam === 'free') params.is_free = true;
    else if (isFreeParam === 'paid') params.is_free = false;
    if (startParam) params.start_date = startParam;
    if (endParam) params.end_date = endParam;

    search(params as Parameters<typeof search>[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam, categoryParam, cityParam, isFreeParam, startParam, endParam, pageParam]);

  const updateParam = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v);
        else next.delete(k);
      });
      if (!updates.page) next.delete('page');
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleSearchSubmit = useCallback(
    (value: string) => updateParam({ q: value }),
    [updateParam]
  );

  const handleSearchChange = useCallback(
    (value: string) => updateParam({ q: value }),
    [updateParam]
  );

  const handleFilterChange = useCallback(
    (filters: {
      category: string;
      dateRange: { start: string; end: string };
      isFree: 'all' | 'free' | 'paid';
      city: string;
    }) => {
      updateParam({
        category: filters.category,
        start_date: filters.dateRange.start,
        end_date: filters.dateRange.end,
        is_free: filters.isFree === 'all' ? '' : filters.isFree,
        city: filters.city,
      });
    },
    [updateParam]
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      const sortConfig = SORT_MAP[sort] ?? {};
      const next = new URLSearchParams(searchParams.toString());
      if (sortConfig.sort_by) {
        next.set('sort_by', sortConfig.sort_by);
        next.set('sort_order', sortConfig.sort_order ?? 'asc');
      } else {
        next.delete('sort_by');
        next.delete('sort_order');
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handlePageChange = useCallback(
    (page: number) => updateParam({ page: String(page) }),
    [updateParam]
  );

  const categoryNames = useMemo(
    () => categories.map((c) => c.name),
    [categories]
  );

  const hasQuery = qParam || categoryParam || cityParam || isFreeParam !== 'all';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Search className="h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Find Events</h1>
        </div>
        <SearchBar
          value={qParam}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          className="max-w-2xl"
        />
      </div>

      <div className="flex gap-8">
        {/* Filter sidebar (desktop) / toggle (mobile) */}
        <FilterPanel
          filters={{
            category: categoryParam,
            dateRange: { start: startParam, end: endParam },
            isFree: (isFreeParam as 'all' | 'free' | 'paid') || 'all',
            city: cityParam,
          }}
          categories={categoryNames}
          onFilterChange={handleFilterChange}
        />

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {!hasQuery && !isLoading ? (
            <TrendingSection events={trending as never[]} isLoading={false} />
          ) : (
            <>
              <SearchResults
                results={results as never[]}
                isLoading={isLoading}
                query={qParam}
                totalResults={pagination.total}
                onSortChange={handleSortChange as never}
              />
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

// Error boundary and cross-browser input fixes - Sprint 5
