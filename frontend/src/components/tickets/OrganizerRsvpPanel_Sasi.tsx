import React, { useCallback, useEffect, useState } from 'react';
import { Users, Check, X, Loader2 } from 'lucide-react';
import { ticketApi } from '../../api/ticketApi_Sasi';
import { useToast } from '../shared/Toast_Sasi';
import { cn } from '../../utils/cn_Pratham';

export interface OrganizerRsvpRow {
  id: string;
  status: string;
  approval_status: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string | null;
  };
}

interface OrganizerRsvpPanelProps {
  eventId: string;
  onModerated?: () => void;
}

const OrganizerRsvpPanel: React.FC<OrganizerRsvpPanelProps> = ({
  eventId,
  onModerated,
}) => {
  const { toast } = useToast();
  const [rows, setRows] = useState<OrganizerRsvpRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ticketApi.getEventRsvps(eventId, { limit: 200 });
      const list = (res.data ?? []) as OrganizerRsvpRow[];
      setRows(Array.isArray(list) ? list : []);
    } catch {
      toast.error('Could not load RSVPs');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [eventId, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const pendingGoing = rows.filter(
    (r) => r.status === 'going' && r.approval_status === 'pending'
  );

  const act = async (
    rsvpId: string,
    action: 'approve' | 'reject'
  ) => {
    setBusyId(rsvpId);
    try {
      if (action === 'approve') {
        await ticketApi.approveEventRsvp(eventId, rsvpId);
        toast.success('RSVP approved');
      } else {
        await ticketApi.rejectEventRsvp(eventId, rsvpId);
        toast.success('RSVP declined');
      }
      await load();
      onModerated?.();
    } catch {
      toast.error(action === 'approve' ? 'Could not approve' : 'Could not decline');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-10 flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading RSVPs…
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-2xl border border-orange-100 bg-orange-50/40 p-6">
      <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-gray-900">
        <Users className="h-6 w-6 text-orange-500" />
        RSVP requests
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Approve guests who chose <span className="font-medium">Going</span> so they count toward
        attendance and see a confirmed spot. Pending requests:{' '}
        <span className="font-semibold text-orange-700">{pendingGoing.length}</span>
      </p>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">No RSVPs yet.</p>
      ) : (
        <ul className="divide-y divide-orange-100/80 rounded-xl border border-orange-100 bg-white">
          {rows.map((r) => {
            const name = r.user
              ? `${r.user.first_name} ${r.user.last_name}`.trim()
              : 'Guest';
            const email = r.user?.email ?? '';
            const isPendingGoing =
              r.status === 'going' && r.approval_status === 'pending';
            const approvalLabel =
              r.status !== 'going'
                ? '—'
                : r.approval_status === 'pending'
                  ? 'Pending'
                  : r.approval_status === 'approved'
                    ? 'Approved'
                    : r.approval_status === 'rejected'
                      ? 'Declined'
                      : r.approval_status;

            return (
              <li
                key={r.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{name}</p>
                  <p className="truncate text-sm text-gray-500">{email}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    RSVP:{' '}
                    <span className="capitalize">{r.status.replace('_', ' ')}</span>
                    {' · '}
                    <span
                      className={cn(
                        approvalLabel === 'Pending' && 'text-amber-700',
                        approvalLabel === 'Approved' && 'text-green-700',
                        approvalLabel === 'Declined' && 'text-red-600'
                      )}
                    >
                      {approvalLabel}
                    </span>
                  </p>
                </div>
                {isPendingGoing && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => act(r.id, 'approve')}
                      className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {busyId === r.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => act(r.id, 'reject')}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Decline
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default OrganizerRsvpPanel;
