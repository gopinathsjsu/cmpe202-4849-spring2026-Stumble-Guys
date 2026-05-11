import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Layers,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { cn } from '../utils/cn_Pratham';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import { adminApi, type AdminDashboardStats } from '../api/adminApi_Nikhil';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminApi.getDashboardStats();
        if (!cancelled) setStats(res.data);
      } catch {
        if (!cancelled) setError('Could not load platform metrics.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-red-600 sm:px-6 lg:px-8">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const pending = stats.pendingModerationCount ?? 0;
  const metricCards = [
    {
      label: 'Active users',
      value: stats.totalActiveUsers?.toLocaleString() ?? '—',
      sub: `${stats.totalRegisteredUsers?.toLocaleString() ?? '—'} registered total`,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Events created',
      value: stats.totalEventsCreated?.toLocaleString() ?? '—',
      sub: 'All time',
      icon: CalendarDays,
      color: 'bg-violet-500',
    },
    {
      label: 'RSVPs processed',
      value: stats.totalRsvpsProcessed?.toLocaleString() ?? '—',
      sub: 'Free event responses',
      icon: UserCheck,
      color: 'bg-emerald-500',
    },
    {
      label: 'Tickets confirmed',
      value: stats.confirmedTickets?.toLocaleString() ?? '—',
      sub: 'Paid checkouts',
      icon: Activity,
      color: 'bg-amber-500',
    },
  ];

  const quickLinks = [
    {
      to: '/admin/events',
      title: 'Review',
      desc: 'Approve or reject pending events.',
      icon: CalendarDays,
      badge: pending > 0 ? pending : undefined,
      accent: 'from-orange-500/10 to-amber-500/5 border-orange-200',
    },
    {
      to: '/admin/users',
      title: 'Users',
      desc: 'Roles, suspend, or remove accounts.',
      icon: Users,
      accent: 'from-blue-500/10 to-sky-500/5 border-blue-200',
    },
    {
      to: '/admin/categories',
      title: 'Categories',
      desc: 'Create and edit event categories.',
      icon: Layers,
      accent: 'from-purple-500/10 to-violet-500/5 border-purple-200',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-gray-900 sm:text-3xl">
          <ShieldCheck className="h-7 w-7 text-orange-500" />
          Admin dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Platform metrics and admin tools.
        </p>
      </div>

      {pending > 0 && (
        <div className="mb-8 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">Pending review</p>
            <p className="text-sm text-amber-900/85">
              {pending} event{pending === 1 ? '' : 's'} waiting for you. Approve to publish; reject with a reason.
            </p>
            <Link
              to="/admin/events"
              className="mt-2 inline-flex text-sm font-medium text-orange-700 underline hover:text-orange-800"
            >
              Go to review
            </Link>
          </div>
        </div>
      )}

      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div
                className={cn(
                  'mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-white',
                  card.color
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs font-medium text-gray-900">{card.label}</p>
              <p className="mt-1 text-xs text-gray-500">{card.sub}</p>
            </div>
          );
        })}
      </div>

      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">
        Shortcuts
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'group relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 shadow-sm transition-all hover:shadow-md',
                item.accent
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/80 shadow-sm">
                  <Icon className="h-5 w-5 text-gray-700" />
                </div>
                {item.badge !== undefined && (
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900 group-hover:text-orange-700">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-orange-600">
                Open
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
