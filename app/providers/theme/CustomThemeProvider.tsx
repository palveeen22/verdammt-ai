'use client'

import { useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useThemeStore } from './model/useThemeStore'

export function CustomThemeProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { mode, customTheme } = useThemeStore()

  useEffect(() => {
    if (mode === 'custom') {
      // Apply custom CSS variables
      const root = document.documentElement
      
      root.style.setProperty('--color-primary', customTheme.primary)
      root.style.setProperty('--color-secondary', customTheme.secondary)
      root.style.setProperty('--color-background', customTheme.background)
      root.style.setProperty('--color-foreground', customTheme.foreground)
      root.style.setProperty('--color-accent', customTheme.accent)
      
      // Add custom class
      root.classList.add('theme-custom')
      root.classList.remove('dark', 'light')
    } else {
      // Remove custom class when switching to light/dark
      document.documentElement.classList.remove('theme-custom')
    }
  }, [mode, customTheme])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}