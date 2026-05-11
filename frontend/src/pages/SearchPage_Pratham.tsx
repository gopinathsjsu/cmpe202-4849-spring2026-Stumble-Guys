import React, { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import SearchBar from '../components/search/SearchBar_Pratham';
import SearchResults from '../components/search/SearchResults_Pratham';
import Pagination from '../components/shared/Pagination_Pratham';
import useSearchStore from '../store/searchStore_Pratham';
import useEventStore from '../store/eventStore_Nikhil';

const SORT_MAP: Record<string, { sort_by?: string; sort_order?: 'asc' | 'desc' }> = {
  relevance: {},
  date: { sort_by: 'start_date', sort_order: 'asc' },
  price: { sort_by: 'price', sort_order: 'asc' },
};

function categoryIdsFromParam(raw: string): string[] {
  if (!raw) return [];
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    results,
    isLoading,
    pagination,
    search,
    clearResults,
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
  }, [fetchCategories]);

  useEffect(() => {
    if (!qParam.trim()) {
      clearResults();
      return;
    }
    const params: Record<string, unknown> = { q: qParam || undefined, page: pageParam };
    const catIds = categoryIdsFromParam(categoryParam);
    params.category = catIds.length ? catIds.join(',') : undefined;
    params.city = cityParam || undefined;
    params.is_free = isFreeParam === 'free' ? true : isFreeParam === 'paid' ? false : undefined;
    params.start_date = startParam || undefined;
    params.end_date = endParam || undefined;
    params.sort_by = searchParams.get('sort_by') || undefined;
    params.sort_order = (searchParams.get('sort_order') as 'asc' | 'desc' | null) || undefined;

    search(params as Parameters<typeof search>[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam, categoryParam, cityParam, isFreeParam, startParam, endParam, pageParam, searchParams, clearResults]);

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
        <div className="min-w-0 flex-1">
          {qParam.trim() ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
