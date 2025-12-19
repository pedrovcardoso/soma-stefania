import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Gerador de ID curto e performático (Timestamp Base36 + Sufixo Aleatório)
// ~10 caracteres, colisão impossível para histórico de usuário único
const generateLogId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

const useHistoryStore = create(
  persist(
    (set, get) => ({
      recentAccesses: [], // LOG Completo (histórico cronológico)
      pinnedIds: [],      // Array separado de IDs fixados para lookup rápido O(1)

      addToHistory: (item) => {
        const allowedTypes = ['sei_detail', 'doc_detail'];
        if (!allowedTypes.includes(item.type)) return;

        // CRÍTICO: Criamos uma entrada de Log nova e única a cada acesso
        // Não verificamos duplicidade aqui para ser extremamente rápido
        const newLogEntry = {
          logId: generateLogId(), // ID do registro no histórico
          contentId: item.id,     // ID do conteúdo (ex: numero do SEI)
          type: item.type,
          title: item.title,
          description: item.description,
          timestamp: Date.now()
        };

        set((state) => ({
          recentAccesses: [newLogEntry, ...state.recentAccesses]
        }));
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

      clearHistory: () => set({ recentAccesses: [] }),
      
      removeFromHistory: (contentId) => {
          set((state) => ({
             recentAccesses: state.recentAccesses.filter(item => item.contentId !== contentId),
             pinnedIds: state.pinnedIds.filter(id => id !== contentId)
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