import { create } from 'zustand'

const applyTheme = (themeName) => {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  root.setAttribute('data-theme', themeName)
}

const useThemeStore = create((set) => ({
  theme: 'light',

  setTheme: (themeName) => {
    set({ theme: themeName })
    applyTheme(themeName)
  },

  resetTheme: () => {
    set({ theme: 'light' })
    applyTheme('light')
  },
}))

export default useThemeStore

