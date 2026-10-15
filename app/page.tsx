"use client";

import * as React from "react";
import { HeroSection } from "@/components/HeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { AboutSection } from "@/components/AboutSection";
import { useTheme } from "@/hooks/use-theme";

export default function Home() {
  const { theme } = useTheme();

  return (
    <div
      data-theme={theme}
      className="theme-transition min-h-screen"
      style={{
        background: "var(--canvas)",
        color: "var(--foreground)",
      }}
    >
      <main>
        {/* Hero Section */}
        <HeroSection theme={theme} />

        {/* About Section Bento with Scatter Parallax */}
        <AboutSection theme={theme} />

        {/* Selected Work Section */}
        <ProjectsSection theme={theme} />
      </main>
    </div>
  );
}
