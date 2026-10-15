"use client";

import * as React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { AboutSection } from "@/components/AboutSection";

let currentHeroTheme: "light" | "dark" = "light";
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem("hero-theme");
    if (saved === "light" || saved === "dark") {
      currentHeroTheme = saved;
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

export default function Home() {
  const currentTheme = React.useSyncExternalStore<"light" | "dark">(
    subscribeTheme,
    (): "light" | "dark" => currentHeroTheme,
    (): "light" | "dark" => "light"
  );

  // Synchronize document-level theme attribute so <html>, <body>, and all components follow navbar theme
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = React.useCallback(() => {
    currentHeroTheme = currentHeroTheme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("hero-theme", currentHeroTheme);
    } catch {
      // ignore
    }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", currentHeroTheme);
    }
    themeListeners.forEach((listener) => listener());
  }, []);

  return (
    <div
      data-theme={currentTheme}
      className="theme-transition min-h-screen"
      style={{
        background: "var(--canvas)",
        color: "var(--foreground)",
      }}
    >
      {/* Floating Pill Navbar with Theme Toggle */}
      <Navbar heroTheme={currentTheme} onToggleHeroTheme={toggleTheme} />

      <main>
        {/* Hero Section */}
        <HeroSection theme={currentTheme} />

        {/* About Section Bento with Scatter Parallax */}
        <AboutSection theme={currentTheme} />

        {/* Selected Work Section */}
        <ProjectsSection theme={currentTheme} />
      </main>
    </div>
  );
}
