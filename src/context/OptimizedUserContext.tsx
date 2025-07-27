import React, { createContext, useContext, useMemo, useCallback } from 'react';

// ✅ Split contexts to reduce re-render scope
const UserDataContext = createContext<any>(null);
const UserActionsContext = createContext<any>(null);

interface UserData {
  user: any;
  loading: boolean;
}

interface UserActions {
  setUser: (user: any) => void;
  setLoading: (loading: boolean) => void;
}

export const OptimizedUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // ✅ Memoize user data to prevent unnecessary re-renders
  const userData = useMemo<UserData>(() => ({
    user,
    loading,
  }), [user, loading]);

  // ✅ Memoize actions to prevent re-creation
  const userActions = useMemo<UserActions>(() => ({
    setUser: useCallback((newUser: any) => setUser(newUser), []),
    setLoading: useCallback((newLoading: boolean) => setLoading(newLoading), []),
  }), []);

  return (
    <UserDataContext.Provider value={userData}>
      <UserActionsContext.Provider value={userActions}>
        {children}
      </UserActionsContext.Provider>
    </UserDataContext.Provider>
  );
};

// ✅ Separate hooks for data and actions
export const useUserData = (): UserData => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within OptimizedUserProvider');
  }
  return context;
};

export const useUserActions = (): UserActions => {
  const context = useContext(UserActionsContext);
  if (!context) {
    throw new Error('useUserActions must be used within OptimizedUserProvider');
  }
  return context;
}; 