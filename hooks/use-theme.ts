"use client";

import * as React from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";

let currentTheme: Theme = "light";

if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem("hero-theme");
    if (saved === "light" || saved === "dark") {
      currentTheme = saved;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      currentTheme = "dark";
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

function applyThemeChange(nextTheme: Theme) {
  currentTheme = nextTheme;
  try {
    localStorage.setItem("hero-theme", currentTheme);
  } catch {
    // ignore
  }
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }
  themeListeners.forEach((listener) => listener());
}

function transitionTheme(nextTheme: Theme) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fallback to instant switch when View Transitions API is unsupported or prefers-reduced-motion is active
  if (
    typeof document === "undefined" ||
    !("startViewTransition" in document) ||
    typeof document.startViewTransition !== "function" ||
    prefersReduced
  ) {
    applyThemeChange(nextTheme);
    return;
  }

  document.startViewTransition(() => {
    flushSync(() => {
      applyThemeChange(nextTheme);
    });
  });
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
    const next = currentTheme === "light" ? "dark" : "light";
    transitionTheme(next);
  }, []);

  const setTheme = React.useCallback((newTheme: Theme) => {
    if (newTheme === currentTheme) return;
    transitionTheme(newTheme);
  }, []);

  return { theme, toggleTheme, setTheme };
}

