import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth_Preetam';
import Button from '../shared/Button_Preetam';

interface RoleGuardProps {
  allowedRoles: string[];
  children?: React.ReactNode;
  redirectTo?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  redirectTo,
}) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-4">
          <ShieldX className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Access Denied
        </h1>
        <p className="mb-6 max-w-sm text-sm text-gray-500">
          You don&apos;t have permission to access this page. Please contact an
          administrator if you believe this is a mistake.
        </p>
        <Button
          variant="primary"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleGuard;
