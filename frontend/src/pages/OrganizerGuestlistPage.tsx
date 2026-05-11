import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Users, Download, Search } from 'lucide-react';
import { eventApi } from '../api/eventApi_Nikhil';
import { formatDateTime } from '../utils/formatDate_Sasi';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import { useToast } from '../components/shared/Toast_Sasi';

interface GuestlistPayload {
  event: {
    id: string;
    title: string;
    slug: string;
    start_date: string;
  };
  tickets: Array<{
    id: string;
    purchase_date: string;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      bio: string | null;
      phone: string | null;
    };
    ticket_type: { name: string };
  }>;
  rsvps: Array<{
    id: string;
    updated_at: string;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      bio: string | null;
      phone: string | null;
    };
  }>;
}

function escapeCsv(v: string) {
  return `"${String(v).replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, rows: string[][]) {
  const body = rows.map((r) => r.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob([body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const OrganizerGuestlistPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [data, setData] = useState<GuestlistPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(search.trim()), 300);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await eventApi.getEventGuestlist(eventId, {
          search: debounced || undefined,
        });
        if (!cancelled) setData(res.data as GuestlistPayload);
      } catch {
        if (!cancelled) {
          toast.error('Could not load guest list');
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [eventId, debounced, toast]);

  const merged = useMemo(() => {
    if (!data) return [];
    const ticketRows = data.tickets.map((t) => ({
      kind: 'ticket' as const,
      id: t.id,
      name: `${t.user.first_name} ${t.user.last_name}`.trim(),
      email: t.user.email,
      phone: t.user.phone ?? '',
      detail: t.ticket_type?.name ?? 'Ticket',
      date: t.purchase_date,
    }));
    const rsvpRows = data.rsvps.map((r) => ({
      kind: 'rsvp' as const,
      id: r.id,
      name: `${r.user.first_name} ${r.user.last_name}`.trim(),
      email: r.user.email,
      phone: r.user.phone ?? '',
      detail: 'Free RSVP (approved)',
      date: r.updated_at,
    }));
    return [...ticketRows, ...rsvpRows].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
    );
  }, [data]);

  const exportCsv = () => {
    if (!data) return;
    const rows: string[][] = [
      ['Type', 'Name', 'Email', 'Phone', 'Detail', 'Date'],
      ...merged.map((m) => [
        m.kind,
        m.name,
        m.email,
        m.phone,
        m.detail,
        m.date,
      ]),
    ];
    const safe = data.event.title.replace(/[^\w\s-]+/g, '').replace(/\s+/g, '-');
    downloadCsv(`${safe || 'guestlist'}.csv`, rows);
    toast.success('Download started');
  };

  if (!eventId) {
    return <div className="p-8 text-center text-gray-500">Missing event.</div>;
  }

  if (loading && !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-red-600">Guest list unavailable.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <Users className="h-8 w-8 text-orange-500" />
            Guest list
          </h1>
          <p className="mt-1 text-lg font-medium text-gray-800">{data.event.title}</p>
          <p className="text-sm text-gray-500">
            {formatDateTime(data.event.start_date)} ·{' '}
            <Link
              to={`/events/${data.event.slug}`}
              className="text-orange-600 hover:text-orange-700"
            >
              View event
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <Link
            to="/my-events"
            className="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            My events
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>
        <p className="text-sm text-gray-500">
          {merged.length} guest{merged.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="hidden border-b border-gray-100 bg-gray-50 px-6 py-3 sm:grid sm:grid-cols-12 sm:gap-4">
          <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Type
          </span>
          <span className="col-span-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Name
          </span>
          <span className="col-span-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Email
          </span>
          <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Detail
          </span>
          <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Date
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {merged.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">
              No guests match this search.
            </div>
          ) : (
            merged.map((m) => (
              <div
                key={`${m.kind}-${m.id}`}
                className="grid grid-cols-1 gap-2 px-6 py-3 sm:grid-cols-12 sm:items-center sm:gap-4"
              >
                <div className="col-span-2 text-sm capitalize text-gray-600">
                  {m.kind}
                </div>
                <div className="col-span-3 text-sm font-medium text-gray-900">
                  {m.name}
                </div>
                <div className="col-span-3 truncate text-sm text-gray-600">
                  {m.email}
                </div>
                <div className="col-span-2 text-sm text-gray-600">{m.detail}</div>
                <div className="col-span-2 text-sm text-gray-500">
                  {formatDateTime(m.date)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerGuestlistPage;
