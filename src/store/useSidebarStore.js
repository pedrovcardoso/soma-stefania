import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSidebarStore = create(
  persist(
    (set) => ({
      isOpen: true,
      isCollapsed: false,
      sidebarWidth: 260,
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setSidebarOpen: (isOpen) => set({ isOpen }),
      setSidebarWidth: (width) => set({ sidebarWidth: width }),
    }),
    {
      name: 'soma-sidebar-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSidebarStore;