import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarDays,
  Ticket,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Activity,
  BarChart3,
} from 'lucide-react';
import { cn } from '../utils/cn_Pratham';
import { formatCurrency } from '../utils/formatCurrency_Sasi';
import { getRelativeTime } from '../utils/formatDate_Sasi';
import LoadingSpinner from '../components/shared/LoadingSpinner_Pratham';
import { eventApi } from '../api/eventApi_Nikhil';

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  ticketsSold: number;
  revenue: number;
  userGrowth: number;
  eventGrowth: number;
  ticketGrowth: number;
  revenueGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'event_created' | 'ticket_purchased' | 'event_approved';
  message: string;
  timestamp: string;
}

const STAT_CARDS: {
  key: keyof Pick<DashboardStats, 'totalUsers' | 'totalEvents' | 'ticketsSold' | 'revenue'>;
  growthKey: keyof Pick<DashboardStats, 'userGrowth' | 'eventGrowth' | 'ticketGrowth' | 'revenueGrowth'>;
  label: string;
  icon: React.ElementType;
  color: string;
  format?: (v: number) => string;
}[] = [
  {
    key: 'totalUsers',
    growthKey: 'userGrowth',
    label: 'Total Users',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    key: 'totalEvents',
    growthKey: 'eventGrowth',
    label: 'Total Events',
    icon: CalendarDays,
    color: 'bg-purple-500',
  },
  {
    key: 'ticketsSold',
    growthKey: 'ticketGrowth',
    label: 'Tickets Sold',
    icon: Ticket,
    color: 'bg-green-500',
  },
  {
    key: 'revenue',
    growthKey: 'revenueGrowth',
    label: 'Revenue',
    icon: DollarSign,
    color: 'bg-orange-500',
    format: (v) => formatCurrency(v),
  },
];

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  user_registered: Users,
  event_created: CalendarDays,
  ticket_purchased: Ticket,
  event_approved: ShieldCheck,
};

const MOCK_STATS: DashboardStats = {
  totalUsers: 2_450,
  totalEvents: 186,
  ticketsSold: 8_320,
  revenue: 142_580,
  userGrowth: 12.5,
  eventGrowth: 8.3,
  ticketGrowth: 23.1,
  revenueGrowth: 18.7,
};

const MOCK_ACTIVITY: RecentActivity[] = [
  { id: '1', type: 'user_registered', message: 'New user John Doe registered', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: '2', type: 'event_created', message: 'Tech Meetup 2026 was created', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: '3', type: 'ticket_purchased', message: '5 tickets purchased for Summer Festival', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: '4', type: 'event_approved', message: 'Art Gallery Opening was approved', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: '5', type: 'ticket_purchased', message: '2 tickets purchased for Jazz Night', timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString() },
];

const MOCK_CHART_DATA = [65, 45, 80, 55, 90, 70, 95, 85, 60, 75, 88, 100];
const CHART_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [activity, setActivity] = useState<RecentActivity[]>(MOCK_ACTIVITY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await eventApi.getDashboardStats();
        if (data?.data) {
          setStats({ ...MOCK_STATS, ...data.data });
          if (data.data.recentActivity) setActivity(data.data.recentActivity);
        }
      } catch {
        // fall back to mock data
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const maxChartVal = Math.max(...MOCK_CHART_DATA);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-gray-900 sm:text-3xl">
          <ShieldCheck className="h-7 w-7 text-orange-500" />
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of your platform&apos;s performance and activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key];
          const growth = stats[card.growthKey];
          const isPositive = growth >= 0;
          return (
            <div
              key={card.key}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg text-white',
                    card.color
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                    isPositive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(growth)}%
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">
                  {card.format ? card.format(value) : value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick actions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to="/admin/users"
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-orange-600">
                  Manage Users
                </h3>
                <p className="text-xs text-gray-500">
                  View, edit roles &amp; manage users
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-500" />
            </Link>
            <Link
              to="/admin/events"
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <CalendarDays className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-orange-600">
                  Moderate Events
                </h3>
                <p className="text-xs text-gray-500">
                  Approve, reject &amp; manage events
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-500" />
            </Link>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              <h3 className="text-sm font-bold text-gray-900">
                Monthly Revenue
              </h3>
            </div>
            <div className="flex items-end gap-2" style={{ height: 180 }}>
              {MOCK_CHART_DATA.map((val, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-orange-500 to-orange-400 transition-all hover:from-orange-600 hover:to-orange-500"
                    style={{
                      height: `${(val / maxChartVal) * 150}px`,
                    }}
                  />
                  <span className="text-[10px] text-gray-400">
                    {CHART_LABELS[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — recent activity */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
              <Activity className="h-5 w-5 text-orange-500" />
              <h3 className="text-sm font-bold text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {activity.map((item) => {
                const Icon = ACTIVITY_ICONS[item.type] ?? Activity;
                return (
                  <div key={item.id} className="flex gap-3 px-5 py-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Icon className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700">{item.message}</p>
                      <p className="text-xs text-gray-400">
                        {getRelativeTime(item.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
