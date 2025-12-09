import { create } from 'zustand'
import useHistoryStore from './useHistoryStore'

const useTabStore = create((set) => ({
  tabs: [],
  activeTabId: null,

  addTab: (tab) => {
    set((state) => {
      const existingTab = state.tabs.find((t) => t.id === tab.id)
      if (existingTab) {
        return { activeTabId: tab.id }
      }
      const historyItem = {
        id: tab.id,
        process: tab.title, // Adapting structure to match history item expectations
        title: tab.title,
        path: tab.path,
        pinned: false,
        favorited: false,
        // accessedAt is handled by store
      };

      // Auto-log to history
      useHistoryStore.getState().addToHistory(historyItem);

      return {
        tabs: [...state.tabs, tab],
        activeTabId: tab.id,
      }
    })
  },

  closeTab: (tabId) => {
    set((state) => {
      const filteredTabs = state.tabs.filter((t) => t.id !== tabId)
      const wasActive = state.activeTabId === tabId
      let newActiveId = state.activeTabId

      if (wasActive && filteredTabs.length > 0) {
        const closedIndex = state.tabs.findIndex((t) => t.id === tabId)
        if (closedIndex > 0) {
          newActiveId = state.tabs[closedIndex - 1].id
        } else {
          newActiveId = filteredTabs[0].id
        }
      }

      return {
        tabs: filteredTabs,
        activeTabId: filteredTabs.length > 0 ? newActiveId : null,
      }
    })
  },

  switchTab: (tabId) => {
    set({ activeTabId: tabId })
  },

  clearAllTabs: () => {
    set({ tabs: [], activeTabId: null })
  },

  reorderTabs: (newTabs) => {
    set({ tabs: newTabs })
  },
}))

export default useTabStore

