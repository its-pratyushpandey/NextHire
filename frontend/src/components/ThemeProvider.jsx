import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Loader2 } from "lucide-react";

const ThemeProviderContext = createContext({})

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "job-portal-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => 
    localStorage.getItem(storageKey) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches ? "dark" : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <NextThemesProvider {...props}>
      <ThemeProviderContext.Provider value={value}>
        <div className="min-h-screen">
          {children}
          <div id="loading-overlay" className="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        </div>
      </ThemeProviderContext.Provider>
    </NextThemesProvider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}