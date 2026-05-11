import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
} from 'lucide-react';
import { cn } from '../utils/cn_Pratham';
import { formatDate, formatDateTime } from '../utils/formatDate_Sasi';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import useTicketStore from '../store/ticketStore_Sasi';

type ViewMode = 'month' | 'week';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  venue: string | null;
  slug: string;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getWeekDays(date: Date): Date[] {
  const days: Date[] = [];
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  for (let i = 0; i < 7; i++) {
    days.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { myTickets, isLoading, fetchMyTickets } = useTicketStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchMyTickets();
  }, [fetchMyTickets]);

  const events: CalendarEvent[] = useMemo(
    () =>
      myTickets
        .filter((t) => t.event)
        .map((t) => ({
          id: t.id,
          title: t.event!.title,
          start: new Date(t.event!.start_date),
          end: new Date(t.event!.end_date),
          status: t.status,
          venue: t.event!.venue_name,
          slug: t.event!.slug ?? '',
        })),
    [myTickets]
  );

  const navigate_ = useCallback(
    (direction: -1 | 1) => {
      setCurrentDate((prev) => {
        const next = new Date(prev);
        if (view === 'month') {
          next.setMonth(next.getMonth() + direction);
        } else {
          next.setDate(next.getDate() + direction * 7);
        }
        return next;
      });
      setSelectedDate(null);
    },
    [view]
  );

  const days =
    view === 'month'
      ? getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
      : getWeekDays(currentDate);

  const firstDayOffset =
    view === 'month' ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() : 0;

  const eventsForDate = (date: Date) =>
    events.filter((e) => isSameDay(e.start, date));

  const selectedEvents = selectedDate ? eventsForDate(selectedDate) : [];

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => e.start >= now && e.status !== 'cancelled')
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5);
  }, [events]);

  const today = new Date();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 flex items-center gap-2.5 text-2xl font-bold text-gray-900 sm:text-3xl">
        <CalendarIcon className="h-7 w-7 text-orange-500" />
        My Calendar
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Calendar */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Controls */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate_(-1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="min-w-[140px] text-center text-base font-semibold text-gray-900">
                  {view === 'month'
                    ? `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                    : `Week of ${formatDate(days[0])}`}
                </h2>
                <button
                  onClick={() => navigate_(1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="flex rounded-lg bg-gray-100 p-0.5">
                {(['month', 'week'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cn(
                      'rounded-md px-3 py-1 text-xs font-medium transition-all',
                      view === v
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {DAY_NAMES.map((day) => (
                <div
                  key={day}
                  className="px-2 py-2 text-center text-xs font-semibold text-gray-400"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {view === 'month' &&
                Array.from({ length: firstDayOffset }).map((_, i) => (
                  <div key={`pad-${i}`} className="min-h-[80px] border-b border-r border-gray-50 bg-gray-50/50" />
                ))}
              {days.map((day) => {
                const dayEvents = eventsForDate(day);
                const isToday = isSameDay(day, today);
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'min-h-[80px] border-b border-r border-gray-50 p-1.5 text-left transition-colors hover:bg-orange-50/50',
                      isSelected && 'bg-orange-50'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                        isToday
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-700'
                      )}
                    >
                      {day.getDate()}
                    </span>
                    <div className="mt-0.5 space-y-0.5">
                      {dayEvents.slice(0, 2).map((evt) => (
                        <div
                          key={evt.id}
                          className={cn(
                            'truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight',
                            evt.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : evt.status === 'cancelled'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-yellow-100 text-yellow-700'
                          )}
                        >
                          {evt.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="text-[10px] text-gray-400">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected date events */}
          {selectedDate && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Events on {formatDate(selectedDate)}
              </h3>
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-gray-400">No events on this date.</p>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map((evt) => (
                    <Link
                      key={evt.id}
                      to={`/events/${evt.slug}`}
                      className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                    >
                      <div
                        className={cn(
                          'h-3 w-3 shrink-0 rounded-full',
                          evt.status === 'confirmed'
                            ? 'bg-green-500'
                            : evt.status === 'cancelled'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {evt.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(evt.start)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: upcoming events */}
        <aside className="w-full lg:w-80">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
              <Clock className="h-4 w-4 text-orange-500" />
              Upcoming Events
            </h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-gray-400">No upcoming events.</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((evt) => (
                  <Link
                    key={evt.id}
                    to={`/events/${evt.slug}`}
                    className="group block rounded-lg border border-gray-100 p-3 transition-colors hover:border-orange-200 hover:bg-orange-50/50"
                  >
                    <p className="mb-1 truncate text-sm font-semibold text-gray-900 group-hover:text-orange-600">
                      {evt.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(evt.start)}
                      </span>
                      {evt.venue && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3" />
                          {evt.venue}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CalendarPage;
