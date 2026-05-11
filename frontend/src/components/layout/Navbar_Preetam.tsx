import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  User,
  Users,
  Menu,
  X,
  LogOut,
  Calendar,
  Ticket,
  LayoutDashboard,
  Search,
  MapPin,
  UserCheck,
  Layers,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth_Preetam';
import useNotificationStore from '../../store/notificationStore_Sasi';
import { cn } from '../../utils/cn_Pratham';
import Button from '../shared/Button_Preetam';

const navLinks = [
  { label: 'Browse Events', path: '/events', icon: Calendar },
  { label: 'Map', path: '/map', icon: MapPin },
  { label: 'Search', path: '/search', icon: Search },
];

const organizerNavLinks = [
  { label: 'Dashboard', path: '/organizer', icon: LayoutDashboard },
  { label: 'RSVP queue', path: '/organizer/rsvps', icon: UserCheck },
  { label: 'My Events', path: '/my-events', icon: Calendar },
];

const adminNavLinks = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Review', path: '/admin/events', icon: Shield },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Categories', path: '/admin/categories', icon: Layers },
];

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isOrganizer, logout } = useAuth();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    // Populate unread badge. Best-effort; avoid breaking navigation on failures.
    fetchNotifications({ page: 1, limit: 25 }).catch(() => undefined);
  }, [isAuthenticated, fetchNotifications]);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/login');
  };

  const userMenuItems = [
    { label: 'Profile', path: '/profile', icon: User },
    ...(isOrganizer
      ? [
          { label: 'Dashboard', path: '/organizer', icon: LayoutDashboard },
          { label: 'RSVP queue', path: '/organizer/rsvps', icon: UserCheck },
        ]
      : []),
    ...(isOrganizer ? [{ label: 'My Events', path: '/my-events', icon: Calendar }] : []),
    ...(!isOrganizer && !isAdmin
      ? [{ label: 'My Tickets', path: '/my-tickets', icon: Ticket }]
      : []),
    ...(isAdmin
      ? [
          { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { label: 'Review', path: '/admin/events', icon: Shield },
          { label: 'Users', path: '/admin/users', icon: Users },
          { label: 'Categories', path: '/admin/categories', icon: Layers },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to={
            isAuthenticated && isAdmin
              ? '/admin'
              : isAuthenticated && isOrganizer
                ? '/organizer'
                : '/'
          }
          className="flex items-center gap-2"
        >
          <Calendar className="h-7 w-7 text-orange-500" />
          <span className="text-xl font-bold text-gray-900">EventHub</span>
        </Link>

        {/* Desktop Nav */}
        {isOrganizer ? (
          <nav className="hidden items-center gap-1 md:flex">
            {organizerNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/events/create"
              className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Create Event
            </Link>
          </nav>
        ) : isAdmin ? (
          <nav className="hidden items-center gap-1 md:flex">
            {adminNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : (
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Desktop Right */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <Link
                to="/notifications"
                className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                    {user?.first_name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                    <div className="border-b px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <item.icon className="h-4 w-4 text-gray-400" />
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="rounded-lg p-2 text-gray-600 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          {isOrganizer ? (
            <nav className="space-y-1 px-4 py-3">
              {organizerNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              <Link
                to="/events/create"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg bg-orange-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <Calendar className="h-4 w-4" />
                Create Event
              </Link>
            </nav>
          ) : isAdmin ? (
            <nav className="space-y-1 px-4 py-3">
              {adminNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : (
            <nav className="space-y-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="border-t px-4 py-3">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to="/notifications"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  <Bell className="h-4 w-4" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                {userMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Log in
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
