"use client";

import * as React from "react";
import { IconTile } from "@/components/IconTile";
import { SkillsIcons } from "@/components/SkillsIcons";
import { SectionBadge } from "@/components/SectionBadge";
import { useRowGravity } from "@/hooks/use-row-gravity";

export interface SkillsSectionProps {
  theme?: "light" | "dark";
}

/**
 * Skills Section
 *
 * - Responsive Grid: 4 columns on desktop and tablet, 3 columns on mobile.
 * - Symmetrically animated with useRowGravity (GSAP ScrollTrigger scrub).
 * - overflow-x: clip avoids horizontal page overflow while sliding in.
 * - Monospaced tooltips on hover and keyboard focus with full accessibility.
 */
export function SkillsSection({ theme = "light" }: SkillsSectionProps) {
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Apply row-gravity animation (skipped under prefers-reduced-motion)
  useRowGravity(gridRef);

  const skillsList = Object.entries(SkillsIcons);

  return (
    <section
      id="skills"
      data-theme={theme}
      aria-labelledby="skills-heading"
      className="skills-section theme-transition relative px-6 py-28 sm:py-32 border-t overflow-x-clip"
      style={{
        background: "var(--canvas)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14 sm:mb-16">
          <h2
            id="skills-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-medium font-display tracking-tight mt-1"
            style={{ color: "var(--foreground)" }}
          >
            Skills &amp; Technologies
          </h2>
          <p
            className="mt-3 text-xs sm:text-sm max-w-md mx-auto leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Core technologies, languages, and frameworks I use to engineer full-stack web applications and AI tools.
          </p>
        </div>

        {/* ── Skills Grid: 4 cols on desktop & tablet, 3 cols on mobile ── */}
        <div
          ref={gridRef}
          role="list"
          aria-label="Technology and skills grid"
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6 max-w-3xl w-full mx-auto justify-items-center"
        >
          {skillsList.map(([label, icon]) => (
            <IconTile key={label} label={label} icon={icon} />
          ))}
        </div>
      </div>
    </section>
  );
}
