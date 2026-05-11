import { useEffect, useRef, useCallback, useState } from 'react';
import useSearchStore from '../store/searchStore_Pratham';
import type { SearchParams } from '../api/searchApi_Pratham';

export function useSearch(initialQuery?: SearchParams) {
  const {
    results,
    isLoading,
    query,
    pagination,
    search: storeSearch,
    setQuery,
  } = useSearchStore();

  const [searchTerm, setSearchTerm] = useState(initialQuery?.q ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialized = useRef(false);

  const search = useCallback(
    (params: SearchParams) => {
      storeSearch(params);
    },
    [storeSearch]
  );

  useEffect(() => {
    if (initialQuery && !initialized.current) {
      initialized.current = true;
      storeSearch(initialQuery);
    }
  }, [initialQuery, storeSearch]);

  useEffect(() => {
    if (!initialized.current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      storeSearch({ ...query, q: searchTerm });
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, storeSearch, query]);

  const setQueryWrapper = useCallback(
    (term: string) => {
      initialized.current = true;
      setSearchTerm(term);
      setQuery({ q: term });
    },
    [setQuery]
  );

  return {
    results,
    isLoading,
    search,
    query,
    pagination,
    setQuery: setQueryWrapper,
  };
}
