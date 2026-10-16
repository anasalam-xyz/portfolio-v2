"use client";

import * as React from "react";
import Image from "next/image";
import { useBentoScatter } from "@/hooks/use-bento-scatter";
import { TagPill } from "@/components/TagPill";

const CORE_STACK = [
  "Next.js",
  "TypeScript",
  "React",
  "PostgreSQL",
  "Node.js",
  "Tailwind CSS",
  "GSAP",
];

const FOCUS_AREAS = [
  "Full-Stack Web Systems",
  "AI Agents & Tooling",
  "Interactive Animation",
  "Relational Database Design",
];

export interface AboutSectionProps {
  theme?: "light" | "dark";
}

export function AboutSection({ theme = "light" }: AboutSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);

  // Apply calibrated scroll-scrubbed scatter parallax:
  // Triggers on the bento grid itself so entrance and exit don't happen prematurely
  useBentoScatter(sectionRef, {
    gather: true,
    disperse: true,
    spread: 0.5,
    triggerTarget: "grid",
    gatherStart: "top 85%",
    gatherEnd: "top 45%",
    disperseStart: "bottom 45%",
    disperseEnd: "bottom top",
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      data-theme={theme}
      aria-label="About Anas Alam"
      className="theme-transition relative px-6 py-32 border-t overflow-hidden"
      style={{
        background: "var(--surface-elevated)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header: excluded from scatter parallax (not a data-tile) */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2
            className="text-3xl sm:text-4xl font-medium font-display tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {"</ About Me >"}
          </h2>
        </div>

        {/* ── Bento Grid: relative reference container for scatter offsets ── */}
        <div
          data-grid="about"
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full text-left"
        >
          {/* ── Tile 1: Profile & Bio (data-depth="1.0") ── */}
          <div
            data-tile
            data-depth="1.0"
            className="md:col-span-2 relative flex flex-col"
          >
            <div
              className="tile-inner h-full w-full rounded-2xl border p-6 sm:p-8 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-md flex flex-col justify-between"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div
                  className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border shadow-inner"
                  style={{ borderColor: "var(--border-strong)" }}
                >
                  <Image
                    src="/images/about-me.png"
                    alt="Anas Alam portrait"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                      Anas Alam
                    </h3>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium"
                      style={{
                        background: "var(--surface-elevated)",
                        color: "var(--accent)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Open to work
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-mono" style={{ color: "var(--muted)" }}>
                    Ranchi, India · UTC+5:30
                  </p>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                    Building AI-powered web applications with Next.js, TypeScript, and PostgreSQL. Focused on clean architecture, accessible components, and 60fps micro-interactions.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t flex flex-wrap items-center justify-between gap-3 text-xs" style={{ borderColor: "var(--border)" }}>
                <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>
                  Primary Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CORE_STACK.slice(0, 4).map((tech) => (
                    <TagPill key={tech} label={tech} size="sm" variant="subtle" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Tile 2: Education (data-depth="1.2") ── */}
          <div
            data-tile
            data-depth="1.2"
            className="relative flex flex-col"
          >
            <div
              className="tile-inner h-full w-full rounded-2xl border p-6 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-md flex flex-col justify-between"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Education
                </span>
                <h4 className="mt-2 text-lg font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                  Bachelor of Computer Applications (BCA)
                </h4>
                <p className="mt-1 text-xs" style={{ color: "var(--accent)" }}>
                  First Year (2024 – 2027)
                </p>
                <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  Dr. Shyama Prasad Mukherjee University, Ranchi
                </p>
              </div>

              <div className="mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <p className="text-[11px] font-mono leading-relaxed" style={{ color: "var(--muted)" }}>
                  Coursework: Data Structures &amp; Algorithms, Discrete Mathematics, OOP, Relational Databases.
                </p>
              </div>
            </div>
          </div>

          {/* ── Tile 3: Core Skills & Stack (data-depth="0.85") ── */}
          <div
            data-tile
            data-depth="0.85"
            className="relative flex flex-col"
          >
            <div
              className="tile-inner h-full w-full rounded-2xl border p-6 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-md flex flex-col justify-between"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Proficiencies
                </span>
                <h4 className="mt-2 text-lg font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                  Full-Stack Architecture
                </h4>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  End-to-end application development with strict typing, server components, and responsive frontends.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {CORE_STACK.map((tech) => (
                  <TagPill key={tech} label={tech} size="sm" variant="subtle" />
                ))}
              </div>
            </div>
          </div>

          {/* ── Tile 4: Art & Hobbies (plain tile, NO link) (data-depth="1.4") ── */}
          <div
            data-tile
            data-depth="1.4"
            className="relative flex flex-col"
          >
            <div
              className="tile-inner h-full w-full rounded-2xl border p-6 transition-all duration-300 hover:border-[var(--border-strong)] flex flex-col justify-between select-none"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Traditional Art &amp; Mind
                  </span>
                  {/* Subtle pencil drawing icon */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "var(--muted)" }}
                    aria-hidden="true"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </div>
                <h4 className="mt-2 text-lg font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                  Pencil &amp; Graphite Studies
                </h4>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  Observational sketching, cross-hatching, and geometric perspective studies. Developing spatial awareness, proportion, and balance.
                </p>
              </div>

              {/* Hobbies List: Cubing and Chess */}
              <div className="mt-5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <span className="text-[10px] font-mono uppercase tracking-wider block mb-2.5" style={{ color: "var(--muted)" }}>
                  Personal Hobbies
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div
                    className="flex items-center gap-2.5 rounded-xl border p-2.5"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: "var(--surface)",
                        color: "var(--accent)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {/* Isometric Cube icon */}
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m21 16-9 5-9-5V8l9-5 9 5v8Z" />
                        <path d="m3.27 6.96 8.73 4.88 8.73-4.88" />
                        <path d="M12 22V12" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight truncate" style={{ color: "var(--foreground)" }}>
                        Cubing
                      </p>
                      <p className="text-[10px] leading-tight truncate" style={{ color: "var(--muted)" }}>
                        Speed &amp; 3D Patterns
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2.5 rounded-xl border p-2.5"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: "var(--surface)",
                        color: "var(--accent)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {/* Chess Pawn / Strategy icon */}
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M14 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5Z" />
                        <path d="M7 16h10" />
                        <path d="M8 22h8" />
                        <path d="m9 8 1 8h4l1-8" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight truncate" style={{ color: "var(--foreground)" }}>
                        Chess
                      </p>
                      <p className="text-[10px] leading-tight truncate" style={{ color: "var(--muted)" }}>
                        Strategy &amp; Tactics
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tile 5: Focus & Exploration (data-depth="1.1") ── */}
          <div
            data-tile
            data-depth="1.1"
            className="relative flex flex-col"
          >
            <div
              className="tile-inner h-full w-full rounded-2xl border p-6 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-md flex flex-col justify-between"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Current Focus
                </span>
                <h4 className="mt-2 text-lg font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                  Active Explorations
                </h4>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  What I&apos;m currently building, learning, and refining every day.
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {FOCUS_AREAS.map((area) => (
                  <div key={area} className="flex items-center gap-2 text-xs" style={{ color: "var(--foreground)" }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
