import React, { useState, useMemo } from 'react';
import { Search, Download, Users } from 'lucide-react';
import { cn } from '../../utils/cn_Pratham';
import { formatDate } from '../../utils/formatDate_Sasi';

interface Attendee {
  id: string;
  user_name: string;
  email: string;
  ticket_type: string;
  status: 'confirmed' | 'cancelled' | 'checked_in';
  date: string;
}

interface AttendeeListProps {
  attendees: Attendee[];
  isLoading?: boolean;
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
  checked_in: { label: 'Checked In', className: 'bg-blue-100 text-blue-700' },
};

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-24 rounded bg-gray-200" />
        </td>
      ))}
    </tr>
  );
}

const AttendeeList: React.FC<AttendeeListProps> = ({
  attendees,
  isLoading = false,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return attendees.filter((a) => {
      const matchesSearch =
        !search ||
        a.user_name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [attendees, search, statusFilter]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Users className="h-5 w-5 text-orange-500" />
          Attendees
          <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-sm font-normal text-gray-500">
            {attendees.length}
          </span>
        </h3>

        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-56 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search attendees..."
              className="block w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Ticket Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-500">
                  No attendees found
                </td>
              </tr>
            ) : (
              filtered.map((attendee) => {
                const status =
                  STATUS_STYLES[attendee.status] ?? STATUS_STYLES.confirmed;
                return (
                  <tr
                    key={attendee.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">
                      {attendee.user_name}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {attendee.email}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {attendee.ticket_type}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {formatDate(attendee.date)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-gray-100 sm:hidden">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2 px-5 py-4">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-3 w-48 rounded bg-gray-200" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-gray-200" />
                <div className="h-5 w-20 rounded-full bg-gray-200" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            No attendees found
          </div>
        ) : (
          filtered.map((attendee) => {
            const status =
              STATUS_STYLES[attendee.status] ?? STATUS_STYLES.confirmed;
            return (
              <div key={attendee.id} className="px-5 py-4">
                <p className="font-medium text-gray-900">
                  {attendee.user_name}
                </p>
                <p className="text-sm text-gray-500">{attendee.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                    {attendee.ticket_type}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 font-medium',
                      status.className
                    )}
                  >
                    {status.label}
                  </span>
                  <span className="text-gray-400">
                    {formatDate(attendee.date)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AttendeeList;
