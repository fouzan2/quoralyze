import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,

        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: !!user,
              isLoading: false,
            },
            false,
            'auth/setUser'
          ),

        setLoading: (isLoading) =>
          set(
            { isLoading },
            false,
            'auth/setLoading'
          ),

        logout: () =>
          set(
            {
              user: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            'auth/logout'
          ),

        updateUser: (updates) => {
          const currentUser = get().user;
          if (currentUser) {
            set(
              {
                user: { ...currentUser, ...updates },
              },
              false,
              'auth/updateUser'
            );
          }
        },
      }),
      {
        name: 'quoralyze-auth',
        storage: createJSONStorage(() => {
          // Only use localStorage on the client side
          if (typeof window !== 'undefined') {
            return localStorage;
          }
          // Return a no-op storage for SSR
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        skipHydration: true,
      }
    ),
    { name: 'AuthStore' }
  )
); 