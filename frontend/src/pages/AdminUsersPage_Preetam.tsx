import React, { useEffect, useState, useCallback } from 'react';
import {
  Users,
  Search,
  ChevronDown,
  Shield,
  UserCheck,
  UserX,
} from 'lucide-react';
import { cn } from '../utils/cn_Pratham';
import { formatDate } from '../utils/formatDate_Sasi';
import Button from '../components/shared/Button_Preetam';
import Pagination from '../components/shared/Pagination_Pratham';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import { authApi, type UsersParams } from '../api/authApi_Preetam';
import { ROLES } from '../utils/constants_Preetam';

interface UserRecord {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  avatar_url: string | null;
  created_at: string;
}

const ROLE_TABS = [
  { key: '', label: 'All' },
  { key: ROLES.ADMIN, label: 'Admin' },
  { key: ROLES.ORGANIZER, label: 'Organizer' },
  { key: ROLES.ATTENDEE, label: 'Attendee' },
];

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  admin: { label: 'Admin', className: 'bg-red-100 text-red-700' },
  organizer: { label: 'Organizer', className: 'bg-purple-100 text-purple-700' },
  attendee: { label: 'Attendee', className: 'bg-blue-100 text-blue-700' },
};

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full bg-gray-200" /><div className="space-y-1"><div className="h-3.5 w-32 rounded bg-gray-200" /><div className="h-3 w-24 rounded bg-gray-100" /></div></div></td>
      <td className="px-4 py-3"><div className="h-3.5 w-40 rounded bg-gray-200" /></td>
      <td className="px-4 py-3"><div className="h-5 w-16 rounded-full bg-gray-200" /></td>
      <td className="px-4 py-3"><div className="h-5 w-14 rounded-full bg-gray-200" /></td>
      <td className="px-4 py-3"><div className="h-3.5 w-20 rounded bg-gray-200" /></td>
    </tr>
  );
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: UsersParams = { page, limit: 10 };
      if (roleFilter) params.role = roleFilter;
      if (searchQuery) params.search = searchQuery;
      const data = await authApi.getUsers(params);
      setUsers(data.data?.users ?? data.data ?? []);
      setTotalPages(data.data?.pagination?.totalPages ?? 1);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, [page, roleFilter, searchQuery]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = useCallback(
    async (userId: string, newRole: string) => {
      setUpdatingId(userId);
      try {
        await authApi.updateUserRole(userId, newRole);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      } catch {
        // silent
      } finally {
        setUpdatingId(null);
      }
    },
    []
  );

  const handleToggleStatus = useCallback(
    async (userId: string, currentActive: boolean) => {
      setUpdatingId(userId);
      try {
        await authApi.updateUserStatus(userId, !currentActive);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, is_active: !currentActive } : u
          )
        );
      } catch {
        // silent
      } finally {
        setUpdatingId(null);
      }
    },
    []
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-gray-900 sm:text-3xl">
          <Users className="h-7 w-7 text-orange-500" />
          User Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage users, assign roles, and control access.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Role tabs */}
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setRoleFilter(tab.key);
                setPage(1);
              }}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                roleFilter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Joined
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}

              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    <p className="text-sm text-gray-500">No users found.</p>
                  </td>
                </tr>
              )}

              {!isLoading &&
                users.map((user) => {
                  const badge = ROLE_BADGE[user.role] ?? ROLE_BADGE.attendee;
                  const isUpdating = updatingId === user.id;
                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-gray-50/50"
                    >
                      {/* User */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt=""
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                              {user.first_name[0]}
                              {user.last_name[0]}
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                            badge.className
                          )}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                            user.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              user.is_active ? 'bg-green-500' : 'bg-gray-400'
                            )}
                          />
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Role dropdown */}
                          <div className="relative">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(user.id, e.target.value)
                              }
                              disabled={isUpdating}
                              className="appearance-none rounded-lg border border-gray-200 bg-white py-1 pl-2 pr-7 text-xs font-medium text-gray-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50"
                            >
                              <option value="admin">Admin</option>
                              <option value="organizer">Organizer</option>
                              <option value="attendee">Attendee</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                          </div>

                          {/* Toggle active */}
                          <button
                            onClick={() =>
                              handleToggleStatus(user.id, user.is_active)
                            }
                            disabled={isUpdating}
                            className={cn(
                              'flex h-7 w-7 items-center justify-center rounded-lg border transition-colors disabled:opacity-50',
                              user.is_active
                                ? 'border-red-200 text-red-500 hover:bg-red-50'
                                : 'border-green-200 text-green-500 hover:bg-green-50'
                            )}
                            title={user.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {user.is_active ? (
                              <UserX className="h-3.5 w-3.5" />
                            ) : (
                              <UserCheck className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
