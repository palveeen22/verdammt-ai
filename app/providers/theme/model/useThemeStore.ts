import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CustomTheme {
  primary: string
  secondary: string
  background: string
  foreground: string
  accent: string
}

interface ThemeStore {
  mode: 'light' | 'dark' | 'custom'
  customTheme: CustomTheme
  setMode: (mode: 'light' | 'dark' | 'custom') => void
  setCustomTheme: (theme: Partial<CustomTheme>) => void
  resetCustomTheme: () => void
}

const defaultCustomTheme: CustomTheme = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  background: '#ffffff',
  foreground: '#000000',
  accent: '#f59e0b',
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      customTheme: defaultCustomTheme,
      
      setMode: (mode) => set({ mode }),
      
      setCustomTheme: (theme) =>
        set((state) => ({
          customTheme: { ...state.customTheme, ...theme },
        })),
      
      resetCustomTheme: () =>
        set({ customTheme: defaultCustomTheme }),
    }),
    {
      name: 'theme-storage',
    }
  )
)