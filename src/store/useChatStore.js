import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DB_NAME = 'stefania-chat-db';
const STORE_NAME = 'messages';
const MAX_SESSIONS = 50;

const openDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = () => reject(request.error);
  });

export const idbSaveMessages = async (chatId, messages) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(messages, chatId);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
};

export const idbLoadMessages = async (chatId) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(chatId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
};

export const idbDeleteMessages = async (chatId) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(chatId);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
};

const generateSessionName = () =>
  `Chat de ${new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}`;

export const useChatStore = create(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      currentMessages: [],
      isTemporary: false,
      isSidebarOpen: true,
      isLoadingMessages: false,

      setMessages: (messages) => set({ currentMessages: messages }),

      ensureSession: () => {
        const { sessions, currentSessionId, isTemporary, currentMessages } = get();
        // If we have an ID but it's not in the persistent list AND we're not in a valid state, reset to a clean slate
        const sessionExists = sessions.find(s => s.id === currentSessionId);
        if (!currentSessionId || (!sessionExists && !isTemporary && currentMessages.length === 0)) {
          set({ currentSessionId: crypto.randomUUID(), currentMessages: [], isTemporary: false });
        }
      },

      createSession: () => {
        set({ currentSessionId: crypto.randomUUID(), currentMessages: [], isTemporary: false });
        return get().currentSessionId;
      },

      createTemporarySession: () => {
        set({ currentSessionId: crypto.randomUUID(), currentMessages: [], isTemporary: true });
        return get().currentSessionId;
      },

      setCurrentSession: async (id) => {
        const { sessions } = get();
        const session = sessions.find((s) => s.id === id);
        
        set({ 
          isLoadingMessages: true, 
          currentSessionId: id, 
          isTemporary: false // Persistent sessions are never temporary
        });
        
        try {
          const msgs = await idbLoadMessages(id);
          set({ currentMessages: msgs, isLoadingMessages: false });
        } catch (e) {
          set({ currentMessages: [], isLoadingMessages: false });
        }
      },

      getCurrentSession: () => {
        const { sessions, currentSessionId } = get();
        return sessions.find((s) => s.id === currentSessionId) || null;
      },

      addMessage: async (msg) => {
        const { currentSessionId, isTemporary, sessions, currentMessages } = get();
        const newMessages = [...currentMessages, msg];
        set({ currentMessages: newMessages });

        if (!isTemporary) {
          let updatedSessions = [...sessions];
          let sessionIndex = sessions.findIndex(s => s.id === currentSessionId);
          
          const previewLimit = 100;
          const previewText = msg.content.slice(0, previewLimit);

          if (sessionIndex === -1) {
            const timestamp = new Date();
            const dateStr = timestamp.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
            const newSession = {
              id: currentSessionId,
              name: `Seção ${dateStr}`,
              preview: previewText,
              updatedAt: timestamp.getTime()
            };
            updatedSessions = [newSession, ...sessions].slice(0, MAX_SESSIONS);
          } else {
            const updatedSession = { 
              ...sessions[sessionIndex], 
              preview: previewText, 
              updatedAt: Date.now() 
            };
            // Move to top of history
            updatedSessions = [updatedSession, ...sessions.filter(s => s.id !== currentSessionId)].slice(0, MAX_SESSIONS);
          }

          set({ sessions: updatedSessions });
          await idbSaveMessages(currentSessionId, newMessages);
        }
      },

      setTemporary: (val) => {
        const { currentMessages } = get();
        if (currentMessages.length === 0) {
          set({ isTemporary: val });
        }
      },

      renameSession: (id, name) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, name: name.trim() || 'Chat sem nome', updatedAt: Date.now() } : s
          ),
        }));
      },

      deleteSession: (id) => {
        idbDeleteMessages(id).catch(() => {});
        set((state) => {
          const remaining = state.sessions.filter((s) => s.id !== id);
          if (state.currentSessionId !== id) {
            return { sessions: remaining };
          }
          // If we deleted the active chat, go to a clean "New Chat" state
          return { 
            sessions: remaining, 
            currentSessionId: crypto.randomUUID(), 
            currentMessages: [], 
            isTemporary: false 
          };
        });
      },

      clearCurrentSession: (id) => {
        idbDeleteMessages(id).catch(() => {});
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, preview: '', messageCount: 0, updatedAt: Date.now() } : s
          ),
        }));
      },

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    }),
    {
      name: 'stefania-chat-storage',
      version: 2,
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
