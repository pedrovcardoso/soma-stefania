import { create } from 'zustand'

const applyTheme = (themeName) => {
  if (typeof window === 'undefined') return
  const root = document.documentElement
  root.setAttribute('data-theme', themeName)
}

const applyTypography = (fontFamily, fontSizeScale) => {
  if (typeof window === 'undefined') return
  const root = document.documentElement

  // Map friendly names to actual font stacks
  const fontStacks = {
    'Inter': 'var(--font-inter), sans-serif',
    'Roboto': 'var(--font-roboto), sans-serif',
    'Segoe UI': '"Segoe UI", system-ui, -apple-system, sans-serif',
    'Serif': 'Georgia, Cambria, "Times New Roman", Times, serif',
    'Mono': 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  }

  const family = fontStacks[fontFamily] || fontStacks['Segoe UI']

  root.style.setProperty('--font-primary', family)
  root.style.setProperty('--font-size-scale', fontSizeScale)
}

const useThemeStore = create((set, get) => ({
  theme: 'light',
  fontFamily: 'Segoe UI',
  fontSizeScale: 1, // 1 = 100% (Normal)

  setTheme: (themeName) => {
    set({ theme: themeName })
    applyTheme(themeName)
  },

  setFontFamily: (fontFamily) => {
    set({ fontFamily })
    applyTypography(fontFamily, get().fontSizeScale)
  },

  setFontSizeScale: (scale) => {
    set({ fontSizeScale: scale })
    applyTypography(get().fontFamily, scale)
  },

  resetTheme: () => {
    set({ theme: 'light', fontFamily: 'Inter', fontSizeScale: 1 })
    applyTheme('light')
    applyTypography('Inter', 1)
  },
}))

export default useThemeStore

