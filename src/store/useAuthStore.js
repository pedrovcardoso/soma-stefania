import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      userEmail: null,
      unidades: [],
      selectedUnidade: null,

      setAuthData: (email, unidades) => set({ userEmail: email, unidades }),
      setSelectedUnidade: (unidade) => set({ selectedUnidade: unidade }),
      clearAuthData: () => set({ userEmail: null, unidades: [], selectedUnidade: null }),
    }),
    {
      name: 'soma-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
