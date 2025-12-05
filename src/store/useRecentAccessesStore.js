import { create } from 'zustand'
import { mockRecentAccesses } from '@/services/mockData'

const useRecentAccessesStore = create((set) => ({
  recentAccesses: mockRecentAccesses,

  togglePin: (accessId) => {
    set((state) => ({
      recentAccesses: state.recentAccesses.map((access) =>
        access.id === accessId
          ? { ...access, pinned: !access.pinned }
          : access
      ).sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return new Date(b.accessedAt) - new Date(a.accessedAt)
      }),
    }))
  },
}))

export default useRecentAccessesStore

