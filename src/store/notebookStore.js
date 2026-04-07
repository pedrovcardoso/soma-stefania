import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNotebookStore = create(
  persist(
    (set, get) => ({
      notebooks: [],
      currentNotebookId: null,

      createNotebook: (name = null) => {
        const id = Date.now().toString();
        const notebookName = name || `Sessão de ${new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}`;
        const newNotebook = {
          id,
          name: notebookName,
          sources: [],
          editorContent: '',
          chatMessages: [],
          updatedAt: Date.now()
        };

        set((state) => ({
          notebooks: [newNotebook, ...state.notebooks],
          currentNotebookId: id
        }));

        return id;
      },

      setCurrentNotebook: (id) => {
        set({ currentNotebookId: id });
      },

      getCurrentNotebook: () => {
        const state = get();
        return state.notebooks.find((n) => n.id === state.currentNotebookId) || null;
      },

      updateCurrentNotebook: (updates) => {
        set((state) => {
          if (!state.currentNotebookId) return state;
          
          const updatedNotebooks = state.notebooks.map((n) => {
            if (n.id === state.currentNotebookId) {
              return { ...n, ...updates, updatedAt: Date.now() };
            }
            return n;
          });

          return { notebooks: updatedNotebooks };
        });
      },

      deleteNotebook: (id) => {
        set((state) => {
          const newNotebooks = state.notebooks.filter((n) => n.id !== id);
          return {
            notebooks: newNotebooks,
            currentNotebookId: state.currentNotebookId === id 
              ? (newNotebooks.length > 0 ? newNotebooks[0].id : null) 
              : state.currentNotebookId
          };
        });
      },

      addSourceToCurrent: (source) => {
        const current = get().getCurrentNotebook();
        if (!current) return;

        const exists = current.sources.some(s => s.documento === source.documento && s.url === source.url);
        if (exists) return;

        const newSource = { ...source, isActive: true, addedAt: Date.now() };
        get().updateCurrentNotebook({ sources: [...current.sources, newSource] });
      },

      removeSourceFromCurrent: (sourceId) => {
        const current = get().getCurrentNotebook();
        if (!current) return;

        get().updateCurrentNotebook({
          sources: current.sources.filter((s) => (s.documento || s.url) !== sourceId)
        });
      },

      toggleSourceActive: (sourceId) => {
        const current = get().getCurrentNotebook();
        if (!current) return;

        get().updateCurrentNotebook({
          sources: current.sources.map((s) => {
            const currentId = s.documento || s.url;
            return currentId === sourceId ? { ...s, isActive: !s.isActive } : s;
          })
        });
      },

      updateEditorContent: (content) => {
        get().updateCurrentNotebook({ editorContent: content });
      }
    }),
    {
      name: 'stefania-notebook-storage',
      version: 1,
    }
  )
);
