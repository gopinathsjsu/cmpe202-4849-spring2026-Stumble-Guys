import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

/* -----------------------------------------------------------------------
   Mocks
   ----------------------------------------------------------------------- */

vi.mock('../src/utils/cn_Pratham', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

vi.mock('../src/utils/formatDate_Sasi', () => ({
  formatDate: (d: string) => new Date(d).toLocaleDateString(),
}));

vi.mock('../src/utils/formatCurrency_Sasi', () => ({
  formatPrice: (price: number, isFree: boolean) =>
    isFree ? 'Free' : `$${price.toFixed(2)}`,
}));

import SearchBar from '../src/components/search/SearchBar_Pratham';
import FilterPanel from '../src/components/search/FilterPanel_Pratham';
import SearchResults from '../src/components/search/SearchResults_Pratham';

/* -----------------------------------------------------------------------
   Fixtures
   ----------------------------------------------------------------------- */

const searchResults = [
  {
    id: 'evt-1',
    slug: 'tech-conference-2026',
    title: 'Tech Conference 2026',
    start_date: '2026-06-15T09:00:00Z',
    venue_name: 'Convention Center',
    city: 'San Jose',
    is_free: false,
    price: 49.99,
    image_url: 'https://example.com/tech.jpg',
    category: 'Technology',
  },
  {
    id: 'evt-2',
    slug: 'free-yoga-class',
    title: 'Free Yoga Class',
    start_date: '2026-07-01T08:00:00Z',
    venue_name: 'City Park',
    city: 'Austin',
    is_free: true,
    price: 0,
    category: 'Health',
  },
  {
    id: 'evt-3',
    slug: 'jazz-night',
    title: 'Jazz Night',
    start_date: '2026-08-10T20:00:00Z',
    venue_name: 'Blue Note Club',
    city: 'New York',
    is_free: false,
    price: 35,
    category: 'Music',
  },
];

/* -----------------------------------------------------------------------
   SearchBar
   ----------------------------------------------------------------------- */

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with placeholder text', () => {
    render(
      <SearchBar value="" onChange={vi.fn()} onSubmit={vi.fn()} />
    );

    expect(
      screen.getByPlaceholderText('Search events, venues, cities...')
    ).toBeInTheDocument();
  });

  it('renders with a custom placeholder', () => {
    render(
      <SearchBar
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        placeholder="Find something..."
      />
    );

    expect(screen.getByPlaceholderText('Find something...')).toBeInTheDocument();
  });

  it('renders a search submit button', () => {
    render(
      <SearchBar value="" onChange={vi.fn()} onSubmit={vi.fn()} />
    );

    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('calls onSubmit when the form is submitted', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onSubmit = vi.fn();
    render(
      <SearchBar value="" onChange={vi.fn()} onSubmit={onSubmit} />
    );

    const input = screen.getByPlaceholderText('Search events, venues, cities...');
    await user.type(input, 'music');
    await user.click(screen.getByText('Search'));

    expect(onSubmit).toHaveBeenCalledWith('music');
  });

  it('debounces the onChange callback', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onChange = vi.fn();
    render(
      <SearchBar
        value=""
        onChange={onChange}
        onSubmit={vi.fn()}
        debounceMs={300}
      />
    );

    const input = screen.getByPlaceholderText('Search events, venues, cities...');
    await user.type(input, 'tes');

    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(onChange).toHaveBeenCalledWith('tes');
  });

  it('shows the clear button when input has value', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <SearchBar value="" onChange={vi.fn()} onSubmit={vi.fn()} />
    );

    const input = screen.getByPlaceholderText('Search events, venues, cities...');
    await user.type(input, 'hello');

    const clearButtons = screen.getAllByRole('button');
    const clearBtn = clearButtons.find((b) => b.querySelector('.lucide-x'));
    expect(clearBtn).toBeDefined();
  });

  it('clears the input when the clear button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onChange = vi.fn();
    render(
      <SearchBar value="" onChange={onChange} onSubmit={vi.fn()} />
    );

    const input = screen.getByPlaceholderText(
      'Search events, venues, cities...'
    ) as HTMLInputElement;
    await user.type(input, 'hello');

    const clearBtn = screen
      .getAllByRole('button')
      .find((b) => b.querySelector('.lucide-x'));
    if (clearBtn) {
      await user.click(clearBtn);
    }

    expect(input.value).toBe('');
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('renders suggestions when provided and input has value', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <SearchBar
        value=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        suggestions={['Music Festival', 'Music Concert', 'Art Show']}
      />
    );

    const input = screen.getByPlaceholderText('Search events, venues, cities...');
    await user.type(input, 'Music');

    await waitFor(() => {
      expect(screen.getByText('Music Festival')).toBeInTheDocument();
      expect(screen.getByText('Music Concert')).toBeInTheDocument();
    });
  });
});

/* -----------------------------------------------------------------------
   FilterPanel
   ----------------------------------------------------------------------- */

describe('FilterPanel', () => {
  const defaultFilters = {
    categoryIds: [] as string[],
    dateRange: { start: '', end: '' },
    isFree: 'all' as const,
    city: '',
  };

  const categories = [
    { id: '1', name: 'Music' },
    { id: '2', name: 'Technology' },
    { id: '3', name: 'Food' },
    { id: '4', name: 'Sports' },
  ];

  it('renders filter sections', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        categories={categories}
        onFilterChange={vi.fn()}
      />
    );

    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('renders category options', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        categories={categories}
        onFilterChange={vi.fn()}
      />
    );

    expect(screen.getByText('Music')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Sports')).toBeInTheDocument();
  });

  it('renders price filter options (All, Free, Paid)', () => {
    render(
      <FilterPanel
        filters={defaultFilters}
        categories={categories}
        onFilterChange={vi.fn()}
      />
    );

    expect(screen.getByText('All Prices')).toBeInTheDocument();
    expect(screen.getByText('Free Only')).toBeInTheDocument();
    expect(screen.getByText('Paid Only')).toBeInTheDocument();
  });
});

/* -----------------------------------------------------------------------
   SearchResults
   ----------------------------------------------------------------------- */

describe('SearchResults', () => {
  it('renders a list of search result items', () => {
    render(
      <MemoryRouter>
        <SearchResults
          events={searchResults}
          totalCount={3}
          isLoading={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Tech Conference 2026')).toBeInTheDocument();
    expect(screen.getByText('Free Yoga Class')).toBeInTheDocument();
    expect(screen.getByText('Jazz Night')).toBeInTheDocument();
  });

  it('displays the total result count', () => {
    render(
      <MemoryRouter>
        <SearchResults
          events={searchResults}
          totalCount={3}
          isLoading={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/3 events/i)).toBeInTheDocument();
  });

  it('shows empty state when no results', () => {
    render(
      <MemoryRouter>
        <SearchResults events={[]} totalCount={0} isLoading={false} />
      </MemoryRouter>
    );

    expect(screen.getByText(/no events found/i)).toBeInTheDocument();
  });

  it('renders venue and city for each result', () => {
    render(
      <MemoryRouter>
        <SearchResults
          events={searchResults}
          totalCount={3}
          isLoading={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/San Jose/i)).toBeInTheDocument();
    expect(screen.getByText(/Austin/i)).toBeInTheDocument();
    expect(screen.getByText(/New York/i)).toBeInTheDocument();
  });
});
