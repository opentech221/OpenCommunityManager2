import React from 'react';
import type { ReactNode } from 'react';
import { useAuthState } from '../hooks/useAuth';
import { AuthContext } from '../hooks/useAuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthState();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
