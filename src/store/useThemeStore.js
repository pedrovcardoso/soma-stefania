import { create } from 'zustand'

const defaultTheme = {
  '--color-primary': '#003399',
  '--color-secondary': '#0066CC',
  '--color-accent': '#0099FF',
  '--color-background': '#FFFFFF',
  '--color-surface': '#F5F5F5',
  '--color-text': '#1A1A1A',
  '--color-text-secondary': '#666666',
  '--color-border': '#E0E0E0',
  '--color-error': '#DC3545',
  '--color-success': '#28A745',
  '--color-warning': '#FFC107',
  '--font-primary': 'Inter, system-ui, sans-serif',
  '--font-mono': 'Courier New, monospace',
}

const applyTheme = (theme) => {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

const useThemeStore = create((set) => ({
  currentTheme: defaultTheme,

  setTheme: (theme) => {
    set({ currentTheme: theme })
    applyTheme(theme)
  },

  updateThemeProperty: (property, value) => {
    set((state) => {
      const newTheme = { ...state.currentTheme, [property]: value }
      applyTheme(newTheme)
      return { currentTheme: newTheme }
    })
  },

  resetTheme: () => {
    set({ currentTheme: defaultTheme })
    applyTheme(defaultTheme)
  },

  exportTheme: () => {
    const store = useThemeStore.getState()
    return JSON.stringify(store.currentTheme, null, 2)
  },

  importTheme: (themeJson) => {
    try {
      const theme = JSON.parse(themeJson)
      const store = useThemeStore.getState()
      store.setTheme(theme)
    } catch (error) {
      console.error('Failed to import theme:', error)
    }
  },
}))

export default useThemeStore

