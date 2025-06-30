import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Form builder state
  formBuilderActive: boolean;
  
  // Modal states
  modals: {
    createForm: boolean;
    editForm: boolean;
    deleteForm: boolean;
    inviteTeamMember: boolean;
  };
  
  // Loading states
  loading: {
    global: boolean;
    forms: boolean;
    analytics: boolean;
  };
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Form builder actions
  setFormBuilderActive: (active: boolean) => void;
  
  // Modal actions
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  closeAllModals: () => void;
  
  // Loading actions
  setLoading: (key: keyof UIState['loading'], loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarOpen: true,
      sidebarCollapsed: false,
      
      formBuilderActive: false,
      
      modals: {
        createForm: false,
        editForm: false,
        deleteForm: false,
        inviteTeamMember: false,
      },
      
      loading: {
        global: false,
        forms: false,
        analytics: false,
      },

      setTheme: (theme) =>
        set({ theme }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (sidebarOpen) =>
        set({ sidebarOpen }),

      setSidebarCollapsed: (sidebarCollapsed) =>
        set({ sidebarCollapsed }),

      setFormBuilderActive: (formBuilderActive) =>
        set({ formBuilderActive }),

      openModal: (modal) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: true },
        })),

      closeModal: (modal) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: false },
        })),

      closeAllModals: () =>
        set({
          modals: {
            createForm: false,
            editForm: false,
            deleteForm: false,
            inviteTeamMember: false,
          },
        }),

      setLoading: (key, loading) =>
        set((state) => ({
          loading: { ...state.loading, [key]: loading },
        })),
    }),
    {
      name: 'quoralyze-ui',
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
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      skipHydration: true,
    }
  )
); 