"use client";

import * as React from "react";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ActivitySection } from "@/components/ActivitySection";
import { ArtSection } from "@/components/ArtSection";
import { useTheme } from "@/hooks/use-theme";
import type { GitHubActivity } from "@/lib/github";
import type { LeetCodeActivity } from "@/lib/leetcode";

export interface HomeSectionsProps {
  githubData: GitHubActivity;
  leetcodeData: LeetCodeActivity;
}

export function HomeSections({ githubData, leetcodeData }: HomeSectionsProps) {
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

        {/* Skills & Technologies Section */}
        <SkillsSection theme={theme} />

        {/* Engineering Activity Section (GitHub & LeetCode Stack) */}
        <ActivitySection theme={theme} githubData={githubData} leetcodeData={leetcodeData} />

        {/* Traditional Art & Studies Section */}
        <ArtSection theme={theme} />
      </main>
    </div>
  );
}

