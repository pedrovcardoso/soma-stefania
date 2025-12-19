import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSidebarStore = create(
  persist(
    (set) => ({
      isOpen: true,
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      setSidebarOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'soma-sidebar-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSidebarStore;