import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, Loader2, Check, X } from 'lucide-react';
import { eventApi } from '../api/eventApi_Nikhil';
import { ticketApi } from '../api/ticketApi_Sasi';
import { formatDateTime } from '../utils/formatDate_Sasi';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import Modal from '../components/shared/Modal_Pratham';
import Button from '../components/shared/Button_Preetam';
import { useToast } from '../components/shared/Toast_Sasi';
import { cn } from '../utils/cn_Pratham';

interface PendingRow {
  id: string;
  created_at: string;
  event: { id: string; title: string; slug: string };
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    bio: string | null;
    phone: string | null;
    avatar_url: string | null;
    created_at: string;
    is_verified: boolean;
  };
}

const OrganizerRsvpQueuePage: React.FC = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<PendingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [profileRow, setProfileRow] = useState<PendingRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await eventApi.getOrganizerPendingRsvps();
      const raw = res?.data;
      const list = (Array.isArray(raw) ? raw : []) as PendingRow[];
      setRows(list);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response
          ?.data?.error?.message ?? 'Could not load RSVP queue';
      toast.error(msg);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (row: PendingRow, action: 'approve' | 'reject') => {
    setBusyId(row.id);
    try {
      if (action === 'approve') {
        await ticketApi.approveEventRsvp(row.event.id, row.id);
        toast.success('RSVP approved');
      } else {
        await ticketApi.rejectEventRsvp(row.event.id, row.id);
        toast.success('RSVP declined');
      }
      setProfileRow(null);
      await load();
    } catch {
      toast.error(action === 'approve' ? 'Could not approve' : 'Could not decline');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <UserCheck className="h-8 w-8 text-orange-500" />
            RSVP approvals
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Guests who chose <strong>Going</strong> on free events — approve them to
            confirm their spot.
          </p>
        </div>
        <Link
          to="/organizer"
          className="text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          Back to dashboard
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-600">
          <p className="font-medium text-gray-800">No pending RSVP requests</p>
          <p className="mt-2 text-sm text-gray-500">
            Guests who tap <strong>Going</strong> on your <strong>free</strong> events appear here
            until you approve them. After pulling latest seed data, run{' '}
            <code className="rounded bg-gray-100 px-1 text-xs">npm run prisma:seed</code> in{' '}
            <code className="rounded bg-gray-100 px-1 text-xs">eventhub/backend</code>.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="hidden border-b border-gray-100 bg-gray-50 px-6 py-3 sm:grid sm:grid-cols-12 sm:gap-4">
            <span className="col-span-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Event
            </span>
            <span className="col-span-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Guest
            </span>
            <span className="col-span-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Requested
            </span>
            <span className="col-span-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
              Actions
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {rows.map((row) => (
              <div
                key={row.id}
                className="flex flex-col gap-3 px-6 py-4 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4"
              >
                <div className="col-span-3">
                  <Link
                    to={`/events/${row.event.slug}`}
                    className="font-medium text-gray-900 hover:text-orange-600"
                  >
                    {row.event.title}
                  </Link>
                </div>
                <div className="col-span-3">
                  <button
                    type="button"
                    onClick={() => setProfileRow(row)}
                    className="text-left text-sm font-medium text-orange-600 hover:text-orange-700"
                  >
                    {row.user.first_name} {row.user.last_name}
                  </button>
                  <p className="truncate text-xs text-gray-500">{row.user.email}</p>
                </div>
                <div className="col-span-2 text-sm text-gray-600">
                  {formatDateTime(row.created_at)}
                </div>
                <div className="col-span-4 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => act(row, 'approve')}
                    className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {busyId === row.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => act(row, 'reject')}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfileRow(row)}
                    className="text-sm font-medium text-gray-600 underline hover:text-gray-900"
                  >
                    Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={!!profileRow}
        onClose={() => setProfileRow(null)}
        title="Guest profile"
        size="lg"
      >
        {profileRow && (
          <div className="space-y-4">
            <div className="flex gap-4">
              {profileRow.user.avatar_url ? (
                <img
                  src={profileRow.user.avatar_url}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                  {profileRow.user.first_name[0]}
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {profileRow.user.first_name} {profileRow.user.last_name}
                </p>
                <p className="text-sm text-gray-500">{profileRow.user.email}</p>
                <p className="mt-1 text-xs text-gray-400">
                  Member since {formatDateTime(profileRow.user.created_at)}
                  {profileRow.user.is_verified ? ' · Verified' : ''}
                </p>
              </div>
            </div>
            {profileRow.user.phone && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Phone:</span> {profileRow.user.phone}
              </p>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Bio
              </p>
              <p className="text-sm text-gray-700">
                {profileRow.user.bio || 'No bio provided.'}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Event:</span>{' '}
              <Link
                to={`/events/${profileRow.event.slug}`}
                className="text-orange-600 hover:text-orange-700"
              >
                {profileRow.event.title}
              </Link>
            </p>
            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button variant="secondary" onClick={() => setProfileRow(null)}>
                Close
              </Button>
              <button
                type="button"
                disabled={busyId === profileRow.id}
                onClick={() => act(profileRow, 'reject')}
                className={cn(
                  'rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50',
                  busyId === profileRow.id && 'opacity-50'
                )}
              >
                Decline
              </button>
              <button
                type="button"
                disabled={busyId === profileRow.id}
                onClick={() => act(profileRow, 'approve')}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrganizerRsvpQueuePage;
