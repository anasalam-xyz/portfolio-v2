"use client";

import * as React from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";

let currentTheme: Theme = "dark";

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
    document.documentElement.classList.toggle("dark", currentTheme === "dark");
  }
  themeListeners.forEach((listener) => listener());
}

function transitionTheme(nextTheme: Theme) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const doc =
    typeof document !== "undefined"
      ? (document as Document & { activeViewTransition?: unknown })
      : null;

  // Fallback to instant switch when View Transitions API is unsupported, prefers-reduced-motion is active, or a view transition is already running (e.g. Kokonut UI reveal)
  if (
    !doc ||
    !("startViewTransition" in doc) ||
    typeof doc.startViewTransition !== "function" ||
    prefersReduced ||
    doc.documentElement.hasAttribute("data-theme-reveal")
  ) {
    applyThemeChange(nextTheme);
    return;
  }

  try {
    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        applyThemeChange(nextTheme);
      });
    });
    transition.finished.catch(() => {});
  } catch {
    // If a view transition is already in progress, apply theme change directly
    applyThemeChange(nextTheme);
  }
}

export function useTheme() {
  const theme = React.useSyncExternalStore<Theme>(
    subscribeTheme,
    () => currentTheme,
    () => "dark"
  );

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
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

