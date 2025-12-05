import { create } from 'zustand'

const useSidebarStore = create((set) => ({
  sidebarWidth: 256,
  
  setSidebarWidth: (width) => {
    set({ sidebarWidth: Math.max(180, Math.min(500, width)) })
  },
}))

export default useSidebarStore

