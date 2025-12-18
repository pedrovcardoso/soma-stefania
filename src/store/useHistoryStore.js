import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockInitialHistory } from '@/services/mockData';

const useHistoryStore = create(
    persist(
        (set, get) => ({
            historyItems: mockInitialHistory,

            addToHistory: (item) => {
                set((state) => {
                    const now = new Date().toISOString();
                    const existingIndex = state.historyItems.findIndex(
                        (i) => i.id === item.id || (i.path && i.path === item.path)
                    );

                    let newHistory = [...state.historyItems];

                    if (existingIndex >= 0) {
                        const existingItem = newHistory[existingIndex];
                        newHistory.splice(existingIndex, 1);
                        newHistory.unshift({ ...existingItem, accessedAt: now });
                    } else {
                        newHistory.unshift({ ...item, accessedAt: now });
                    }
                    if (newHistory.length > 100) {
                        newHistory = newHistory.slice(0, 100);
                    }

                    return { historyItems: newHistory };
                });
            },

            removeFromHistory: (id) => {
                set((state) => ({
                    historyItems: state.historyItems.filter((i) => i.id !== id),
                }));
            },

            togglePin: (id) => {
                set((state) => ({
                    historyItems: state.historyItems.map((item) =>
                        item.id === id ? { ...item, pinned: !item.pinned } : item
                    ),
                }));
            },

            toggleFavorite: (id) => {
                set((state) => ({
                    historyItems: state.historyItems.map((item) =>
                        item.id === id ? { ...item, favorited: !item.favorited } : item
                    ),
                }));
            },

            clearHistory: (period) => {
                set((state) => {
                    if (period === 'all') {
                        return { historyItems: state.historyItems.filter(i => i.pinned) };
                    }

                    return { historyItems: state.historyItems.filter(i => i.pinned) };
                });
            },
        }),
        {
            name: 'stefania-history-storage',
            getStorage: () => localStorage,
        }
    )
);

export default useHistoryStore;
