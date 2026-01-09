import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import useHistoryStore from './useHistoryStore';

const useTabStore = create(
  persist(
    (set, get) => ({
      activeTabId: 'home',
      tabs: [],

      openTab: (newTab) => {
        const { tabs } = get();

        useHistoryStore.getState().addToHistory(newTab);

        if (newTab.id === 'home') {
          set({ activeTabId: 'home' });
          return;
        }

        const exists = tabs.find((t) => t.id === newTab.id);

        if (exists) {
          set({ activeTabId: newTab.id });
        } else {
          set({
            tabs: [...tabs, newTab],
            activeTabId: newTab.id,
          });
        }
      },

      switchTab: (tabId) => {
        set({ activeTabId: tabId });
      },

      closeTab: (tabId) => {
        const { tabs, activeTabId } = get();
        const newTabs = tabs.filter((t) => t.id !== tabId);

        let newActiveId = activeTabId;

        if (tabId === activeTabId) {
          if (newTabs.length === 0) {
            newActiveId = 'home';
          } else {
            const index = tabs.findIndex((t) => t.id === tabId);
            const newIndex = index > 0 ? index - 1 : 0;
            newActiveId = newTabs[newIndex].id;
          }
        }

        set({
          tabs: newTabs,
          activeTabId: newActiveId,
        });
      },

      closeAll: () => {
        set({
          tabs: [],
          activeTabId: 'home',
        });
      },

      reorderTabs: (newTabs) => {
        set({ tabs: newTabs });
      },
      updateTab: (id, updates) => {
        const { tabs } = get();
        const newTabs = tabs.map((t) => (t.id === id ? { ...t, ...updates } : t));
        set({ tabs: newTabs });
      },
      reloadTab: (id) => {
        const { tabs } = get();
        const newTabs = tabs.map((t) => (t.id === id ? { ...t, lastReload: Date.now() } : t));
        set({ tabs: newTabs });
      },
    }),
    {
      name: 'soma-tabs-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useTabStore;