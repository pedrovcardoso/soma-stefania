import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const applyTheme = (themeName) => {
 if (typeof window === 'undefined') return
 const root = document.documentElement
 root.setAttribute('data-theme', themeName)
}

const applyTypography = (fontFamily, fontSizeScale) => {
 if (typeof window === 'undefined') return
 const root = document.documentElement

 const fontStacks = {
  'Inter': 'var(--font-inter), "Segoe UI", sans-serif',
  'Roboto': 'var(--font-roboto), "Segoe UI", sans-serif',
  'Segoe UI': '"Segoe UI", system-ui, -apple-system, sans-serif',
  'Serif': 'Georgia, Cambria, "Times New Roman", Times, serif, "Segoe UI"',
  'Mono': 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace, "Segoe UI"',
  'OpenDyslexic': 'OpenDyslexic, "Segoe UI", sans-serif'
 }

 const family = fontStacks[fontFamily] || fontStacks['Segoe UI']

 root.style.setProperty('--font-primary', family)
 root.style.setProperty('--font-size-scale', fontSizeScale)
}

const useThemeStore = create(
 persist(
  (set, get) => ({
   theme: 'light',
   fontFamily: 'Segoe UI',
   fontSizeScale: 1,
   vLibrasActive: false,

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

   setVLibrasActive: (active) => {
    set({ vLibrasActive: active })
   },

   resetTheme: () => {
    set({ theme: 'light', fontFamily: 'Segoe UI', fontSizeScale: 1, vLibrasActive: false })
    applyTheme('light')
    applyTypography('Segoe UI', 1)
   },
  }),
  {
   name: 'soma-preferences-storage',
   onRehydrateStorage: () => (state) => {
    if (state) {
     applyTheme(state.theme);
     applyTypography(state.fontFamily, state.fontSizeScale);
    }
   },
  }
 )
)

export default useThemeStore