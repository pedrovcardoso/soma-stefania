import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useHistoryStore = create(
  persist(
    (set, get) => ({
      recentAccesses: [],
      pinnedIds: [],

      addToHistory: (item) => {
        const allowedTypes = ['sei_detail', 'doc_detail'];
        if (!allowedTypes.includes(item.type)) return;

        let description = item.description;
        if (description && description.length > 200) {
          description = description.substring(0, 197) + '...';
        }

        const newLogEntry = {
          contentId: item.id,
          type: item.type,
          title: item.title,
          description: description,
          timestamp: Date.now()
        };

        set((state) => ({
          recentAccesses: [newLogEntry, ...state.recentAccesses]
        }));
      },

      updateHistoryEntry: (contentId, data) => {
        set((state) => {
          const index = state.recentAccesses.findIndex(item => item.contentId === contentId);
          if (index === -1) return {};

          const maxSearchDepth = 5;
          const targetIndex = index < maxSearchDepth ? index : -1;

          if (targetIndex === -1) return {};

          const newRecent = [...state.recentAccesses];

          let newData = { ...data };
          if (newData.description && newData.description.length > 200) {
            newData.description = newData.description.substring(0, 197) + '...';
          }

          newRecent[targetIndex] = { ...newRecent[targetIndex], ...newData };
          return { recentAccesses: newRecent };
        });
      },

      togglePin: (contentId) => {
        set((state) => {
          const isPinned = state.pinnedIds.includes(contentId);
          return {
            pinnedIds: isPinned
              ? state.pinnedIds.filter(id => id !== contentId)
              : [...state.pinnedIds, contentId]
          };
        });
      },

      clearHistory: () => {
        set((state) => ({
          recentAccesses: state.recentAccesses.filter(item => state.pinnedIds.includes(item.contentId))
        }));
      },

      removeFromHistory: (timestamp) => {
        set((state) => ({
          recentAccesses: state.recentAccesses.filter(item => item.timestamp !== timestamp)
        }));
      }
    }),
    {
      name: 'soma-history-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useHistoryStore;