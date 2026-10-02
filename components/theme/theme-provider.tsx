"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "enclecta-theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Inline script string injected in <head> (see app/layout.tsx) so the
 *  correct theme is applied to <html> before React hydrates — avoids a
 *  flash of the wrong theme on reload. */
export const themeInitScript = `(function(){var d=document.documentElement;d.setAttribute("data-theme","dark");try{if(localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)})==="light")d.setAttribute("data-theme","light");}catch(e){}})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  // the inline script already set the DOM attribute before hydration; this
  // state just needs to agree with it on mount so React doesn't fight the DOM
  const [theme, setThemeState] = useState<Theme>("dark");

 useEffect(() => {
  const attr = document.documentElement.getAttribute("data-theme");
  setThemeState(attr === "light" ? "light" : "dark");
}, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable (private mode, etc.) — theme just won't persist
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
