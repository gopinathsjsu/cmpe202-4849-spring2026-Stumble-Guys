import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth_Preetam';
import useAuthStore from '../../store/authStore_Preetam';
import LoadingSpinner from '../shared/LoadingSpinner_Pratham';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const [profileReady, setProfileReady] = useState(
    () => !accessToken || !!user
  );

  useEffect(() => {
    if (!accessToken) {
      setProfileReady(true);
      return;
    }
    if (user) {
      setProfileReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await fetchProfile();
      } catch {
        // 401/refresh handled by axios + auth store
      } finally {
        if (!cancelled) setProfileReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken, user, fetchProfile]);

  if (isLoading || !profileReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
