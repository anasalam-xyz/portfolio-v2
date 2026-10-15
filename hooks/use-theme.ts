"use client";

import * as React from "react";

export type Theme = "light" | "dark";

let currentTheme: Theme = "light";

if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem("hero-theme");
    if (saved === "light" || saved === "dark") {
      currentTheme = saved;
    }
  } catch {
    // localStorage may be unavailable
  }
}

const themeListeners = new Set<() => void>();

function subscribeTheme(callback: () => void) {
  themeListeners.add(callback);
  return () => {
    themeListeners.delete(callback);
  };
}

export function useTheme() {
  const theme = React.useSyncExternalStore<Theme>(
    subscribeTheme,
    () => currentTheme,
    () => "light"
  );

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("hero-theme", currentTheme);
    } catch {
      // ignore
    }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", currentTheme);
    }
    themeListeners.forEach((listener) => listener());
  }, []);

  const setTheme = React.useCallback((newTheme: Theme) => {
    if (newTheme === currentTheme) return;
    currentTheme = newTheme;
    try {
      localStorage.setItem("hero-theme", currentTheme);
    } catch {
      // ignore
    }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", currentTheme);
    }
    themeListeners.forEach((listener) => listener());
  }, []);

  return { theme, toggleTheme, setTheme };
}

