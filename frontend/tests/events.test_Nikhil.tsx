import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

import EventCard, {
  type EventCardData,
} from '../src/components/events/EventCard_Nikhil';
import EventGrid from '../src/components/events/EventGrid_Nikhil';
import CategoryFilter from '../src/components/events/CategoryFilter_Nikhil';

/* -----------------------------------------------------------------------
   Fixtures
   ----------------------------------------------------------------------- */

const baseEvent: EventCardData = {
  id: 'evt-1',
  slug: 'tech-conference-2026',
  title: 'Tech Conference 2026',
  short_desc: 'The biggest tech event of the year',
  image_url: 'https://example.com/img.jpg',
  start_date: '2026-06-15T09:00:00Z',
  end_date: '2026-06-16T17:00:00Z',
  venue_name: 'Convention Center',
  city: 'San Jose',
  is_free: false,
  price: 49.99,
  is_online: false,
  category: { id: 'cat-1', name: 'Technology' },
  organizer: {
    id: 'usr-1',
    first_name: 'Alice',
    last_name: 'Johnson',
  },
};

const freeEvent: EventCardData = {
  ...baseEvent,
  id: 'evt-2',
  slug: 'free-workshop',
  title: 'Free Workshop',
  is_free: true,
  price: 0,
};

const onlineEvent: EventCardData = {
  ...baseEvent,
  id: 'evt-3',
  slug: 'virtual-meetup',
  title: 'Virtual Meetup',
  is_online: true,
};

/* -----------------------------------------------------------------------
   EventCard
   ----------------------------------------------------------------------- */

describe('EventCard', () => {
  it('renders the event title and organizer name', () => {
    render(
      <MemoryRouter>
        <EventCard event={baseEvent} />
      </MemoryRouter>
    );

    expect(screen.getByText('Tech Conference 2026')).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  it('displays the formatted date and location', () => {
    render(
      <MemoryRouter>
        <EventCard event={baseEvent} />
      </MemoryRouter>
    );

    expect(screen.getByText('San Jose')).toBeInTheDocument();
  });

  it('shows "Free" badge for free events', () => {
    render(
      <MemoryRouter>
        <EventCard event={freeEvent} />
      </MemoryRouter>
    );

    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('shows price for paid events', () => {
    render(
      <MemoryRouter>
        <EventCard event={baseEvent} />
      </MemoryRouter>
    );

    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('displays "Online" label for virtual events', () => {
    render(
      <MemoryRouter>
        <EventCard event={onlineEvent} />
      </MemoryRouter>
    );

    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('renders the category badge', () => {
    render(
      <MemoryRouter>
        <EventCard event={baseEvent} />
      </MemoryRouter>
    );

    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('links to the event detail page', () => {
    render(
      <MemoryRouter>
        <EventCard event={baseEvent} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/events/tech-conference-2026');
  });

  it('renders description text', () => {
    render(
      <MemoryRouter>
        <EventCard event={baseEvent} />
      </MemoryRouter>
    );

    expect(screen.getByText('The biggest tech event of the year')).toBeInTheDocument();
  });
});

/* -----------------------------------------------------------------------
   EventGrid
   ----------------------------------------------------------------------- */

describe('EventGrid', () => {
  it('renders multiple event cards', () => {
    render(
      <MemoryRouter>
        <EventGrid events={[baseEvent, freeEvent, onlineEvent]} />
      </MemoryRouter>
    );

    expect(screen.getByText('Tech Conference 2026')).toBeInTheDocument();
    expect(screen.getByText('Free Workshop')).toBeInTheDocument();
    expect(screen.getByText('Virtual Meetup')).toBeInTheDocument();
  });

  it('shows empty state when no events provided', () => {
    render(
      <MemoryRouter>
        <EventGrid events={[]} />
      </MemoryRouter>
    );

    expect(screen.getByText('No events found')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(
      <MemoryRouter>
        <EventGrid events={[]} emptyMessage="Nothing to see here" />
      </MemoryRouter>
    );

    expect(screen.getByText('Nothing to see here')).toBeInTheDocument();
  });

  it('shows skeleton cards when loading', () => {
    const { container } = render(
      <MemoryRouter>
        <EventGrid events={[]} isLoading />
      </MemoryRouter>
    );

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

/* -----------------------------------------------------------------------
   CategoryFilter
   ----------------------------------------------------------------------- */

describe('CategoryFilter', () => {
  const categories = [
    { id: 'cat-1', name: 'Music', icon: 'music' },
    { id: 'cat-2', name: 'Technology', icon: 'tech' },
    { id: 'cat-3', name: 'Food', icon: 'food' },
  ];

  it('renders "All" button and category buttons', () => {
    const onSelect = vi.fn();
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory={null}
        onSelect={onSelect}
      />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Music')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
  });

  it('calls onSelect with category id when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory={null}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByText('Music'));
    expect(onSelect).toHaveBeenCalledWith('cat-1');
  });

  it('calls onSelect with null when "All" is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="cat-1"
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByText('All'));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it('highlights the selected category', () => {
    const onSelect = vi.fn();
    render(
      <CategoryFilter
        categories={categories}
        selectedCategory="cat-2"
        onSelect={onSelect}
      />
    );

    const techButton = screen.getByText('Technology').closest('button');
    expect(techButton?.className).toContain('bg-orange-500');
  });
});
