import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockInitialHistory } from '@/services/mockData';

const useHistoryStore = create(
    persist(
        (set, get) => ({
            historyItems: mockInitialHistory,

            // Adiciona um item ao histórico (ou atualiza o timestamp se já existir)
            addToHistory: (item) => {
                set((state) => {
                    const now = new Date().toISOString();
                    // Verifica duplicação baseada no ID ou Path (prefira ID se único)
                    const existingIndex = state.historyItems.findIndex(
                        (i) => i.id === item.id || (i.path && i.path === item.path)
                    );

                    let newHistory = [...state.historyItems];

                    if (existingIndex >= 0) {
                        // Se já existe, move para o topo e atualiza data
                        const existingItem = newHistory[existingIndex];
                        // Remove da posição antiga
                        newHistory.splice(existingIndex, 1);
                        // Adiciona no topo com nova data
                        newHistory.unshift({ ...existingItem, accessedAt: now });
                    } else {
                        // Se novo, adiciona no topo
                        newHistory.unshift({ ...item, accessedAt: now });
                    }

                    // Opcional: Limitar tamanho do histórico (ex: 100 itens)
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
                // period: 'all' | 'day' | 'week' | 'month'
                // Preserva pinned items
                set((state) => {
                    if (period === 'all') {
                        return { historyItems: state.historyItems.filter(i => i.pinned) };
                    }

                    // Implementar lógica de data se necessário, por enquanto limpa tudo não pinado
                    return { historyItems: state.historyItems.filter(i => i.pinned) };
                });
            },
        }),
        {
            name: 'stefania-history-storage', // Nome da chave no localStorage
            getStorage: () => localStorage,
        }
    )
);

export default useHistoryStore;
