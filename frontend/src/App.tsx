import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout_Preetam';
import ProtectedRoute from './components/auth/ProtectedRoute_Preetam';
import RoleGuard from './components/auth/RoleGuard_Preetam';
import LoadingSpinner from './components/shared/LoadingSpinner_Pratham';
import { ROLES } from './utils/constants_Preetam';

const HomePage = lazy(() => import('./pages/HomePage_Nikhil'));
const LoginPage = lazy(() => import('./pages/LoginPage_Preetam'));
const RegisterPage = lazy(() => import('./pages/RegisterPage_Preetam'));
const EventListPage = lazy(() => import('./pages/EventListPage_Nikhil'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage_Nikhil'));
const CreateEventPage = lazy(() => import('./pages/CreateEventPage_Nikhil'));
const EditEventPage = lazy(() => import('./pages/EditEventPage_Nikhil'));
const TicketPurchasePage = lazy(() => import('./pages/TicketPurchasePage_Sasi'));
const MyEventsPage = lazy(() => import('./pages/MyEventsPage_Nikhil'));
const MyTicketsPage = lazy(() => import('./pages/MyTicketsPage_Sasi'));
const TicketDetailPage = lazy(() => import('./pages/TicketDetailPage_Sasi'));
const CalendarPage = lazy(() => import('./pages/CalendarPage_Sasi'));
const SearchPage = lazy(() => import('./pages/SearchPage_Pratham'));
const MapPage = lazy(() => import('./pages/MapPage_Pratham'));
const SavedEventsPage = lazy(() => import('./pages/SavedEventsPage_Pratham'));
const ProfilePage = lazy(() => import('./pages/ProfilePage_Preetam'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard_Preetam'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage_Preetam'));
const AdminEventsPage = lazy(() => import('./pages/AdminEventsPage_Nikhil'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage_Pratham'));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="events" element={<EventListPage />} />
          <Route path="events/:slug" element={<EventDetailPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="map" element={<MapPage />} />

          {/* Authenticated routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="events/:id/purchase" element={<TicketPurchasePage />} />
            <Route path="events/:id/edit" element={<EditEventPage />} />
            <Route path="my-tickets" element={<MyTicketsPage />} />
            <Route path="tickets/:id" element={<TicketDetailPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="saved" element={<SavedEventsPage />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* Organizer / Admin routes */}
            <Route
              element={
                <RoleGuard allowedRoles={[ROLES.ORGANIZER, ROLES.ADMIN]} />
              }
            >
              <Route path="events/create" element={<CreateEventPage />} />
              <Route path="my-events" element={<MyEventsPage />} />
            </Route>

            {/* Admin-only routes */}
            <Route
              element={<RoleGuard allowedRoles={[ROLES.ADMIN]} />}
            >
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/events" element={<AdminEventsPage />} />
            </Route>
          </Route>

          {/* 404 catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
