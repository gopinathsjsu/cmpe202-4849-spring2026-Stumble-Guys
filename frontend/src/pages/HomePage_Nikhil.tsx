import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Music,
  Code,
  Briefcase,
  Dumbbell,
  Palette,
  UtensilsCrossed,
  Heart,
  FlaskConical,
  Users,
  Sparkles,
  MousePointerClick,
  Ticket,
  PartyPopper,
} from 'lucide-react';
import useEventStore, { type CategoryType } from '../store/eventStore_Nikhil';
import useSearchStore from '../store/searchStore_Pratham';
import TrendingSection from '../components/search/TrendingSection_Pratham';
import EventGrid from '../components/events/EventGrid_Nikhil';
import { APP_NAME } from '../utils/constants_Preetam';
import { useAuth } from '../hooks/useAuth_Preetam';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  music: Music,
  tech: Code,
  technology: Code,
  business: Briefcase,
  sports: Dumbbell,
  arts: Palette,
  'food & drink': UtensilsCrossed,
  food: UtensilsCrossed,
  health: Heart,
  science: FlaskConical,
  community: Users,
};

function getCategoryIcon(name: string): React.ElementType {
  const key = name.toLowerCase();
  return CATEGORY_ICONS[key] ?? Sparkles;
}

const STEPS = [
  {
    icon: MousePointerClick,
    title: 'Browse',
    description: 'Explore thousands of events by category, location, or date.',
  },
  {
    icon: Ticket,
    title: 'Book',
    description: 'Secure your spot with instant ticket purchase or free RSVP.',
  },
  {
    icon: PartyPopper,
    title: 'Enjoy',
    description: 'Show up, have an amazing time, and make new memories.',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isOrganizer, isAdmin } = useAuth();

  const { events, categories, isLoading, fetchEvents, fetchCategories } =
    useEventStore();
  const {
    trending,
    isLoading: trendingLoading,
    fetchTrending,
  } = useSearchStore();

  const [searchTerm, setSearchTerm] = React.useState('');

  useEffect(() => {
    fetchEvents({ status: 'approved', limit: 8 });
    fetchCategories();
    fetchTrending();
  }, [fetchEvents, fetchCategories, fetchTrending]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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

  const trendingCards = trending.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    start_date: e.start_date,
    venue_name: e.venue_name ?? '',
    is_free: e.is_free,
    price: 0,
    image_url: e.cover_image ?? undefined,
  }));

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-pink-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmg0djJoMnY0aC0ydjJoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover Events{' '}
              <span className="text-orange-200">Near You</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-orange-100 sm:text-xl">
              Find and attend the best local events — concerts, workshops,
              meetups, and more. Your next great experience is just a click
              away.
            </p>

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-10 flex max-w-xl items-center overflow-hidden rounded-full bg-white shadow-xl shadow-orange-900/20"
            >
              <div className="flex flex-1 items-center gap-2 px-5">
                <Search className="h-5 w-5 shrink-0 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events, categories, or cities..."
                  className="w-full py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="mr-2 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Search
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                Browse All Events
                <ArrowRight className="h-4 w-4" />
              </Link>
              {isAuthenticated && (isOrganizer || isAdmin) && (
                <Link
                  to="/events/create"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
                >
                  Create Event
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Browse by Category
          </h2>
          <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x">
            {categories.map((cat: CategoryType) => {
              const Icon = getCategoryIcon(cat.name);
              return (
                <Link
                  key={cat.id}
                  to={`/events?category=${cat.slug}`}
                  className="group flex w-32 shrink-0 snap-start flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-center text-sm font-medium text-gray-700 group-hover:text-orange-600">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Events
            </h2>
            <Link
              to="/events"
              className="flex items-center gap-1 text-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <EventGrid
            events={eventCards}
            isLoading={isLoading}
            emptyMessage="No upcoming events yet. Check back soon!"
          />
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <TrendingSection
          events={trendingCards}
          isLoading={trendingLoading}
        />
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-2xl font-bold text-gray-900">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm"
                >
                  <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="mb-4 mt-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                    <Icon className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Organizer CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex flex-col items-center px-8 py-14 text-center lg:flex-row lg:justify-between lg:px-16 lg:text-left">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold text-white">
                Are you an organizer?
              </h2>
              <p className="mt-3 text-gray-300">
                Create your first event on {APP_NAME} and reach thousands of
                potential attendees. It&apos;s free to get started.
              </p>
            </div>
            <Link
              to={isAuthenticated ? '/events/create' : '/register'}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 lg:mt-0"
            >
              {isAuthenticated ? 'Create Event' : 'Get Started'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
