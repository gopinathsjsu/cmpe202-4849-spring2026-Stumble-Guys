import { useCallback } from 'react';
import useAuthStore from '../store/authStore_Preetam';
import { ROLES } from '../utils/constants_Preetam';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
  } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      await storeLogin(email, password);
    },
    [storeLogin]
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      role?: 'attendee' | 'organizer';
    }) => {
      await storeRegister(data);
    },
    [storeRegister]
  );

  const logout = useCallback(async () => {
    await storeLogout();
  }, [storeLogout]);

  const isAdmin = user?.role === ROLES.ADMIN;
  const isOrganizer = user?.role === ROLES.ORGANIZER;

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    isAdmin,
    isOrganizer,
  };
}
