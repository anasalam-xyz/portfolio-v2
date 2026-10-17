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
  "FastAPI",
  "Tailwind CSS",
];

const FOCUS_AREAS = [
  "Building 2D Platformer Game",
  "AI Agents & Tooling",
  "Interactive Animation",
  "Data Structures & Algorithms",
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
              className="tile-inner h-full w-full overflow-hidden rounded-2xl border transition-all duration-300 hover:border-[var(--accent)] hover:shadow-md flex flex-col sm:flex-row"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              {/* Photo: square, full height of the card on sm+ */}
              <div
                className="m-2 relative aspect-square w-auto shrink-0 self-stretch overflow-hidden rounded-xl"
              >
                <Image
                  src="/images/about-me.png"
                  alt="Anas Alam portrait"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 640px) 320px, 100vw"
                />
              </div>

              {/* Text column: owns the padding now */}
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 p-6 sm:p-8">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                    Anas Alam
                  </h3>
                  <p className="mt-1 text-xs font-mono" style={{ color: "var(--muted)" }}>
                    Ranchi, India. UTC+5:30
                  </p>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                    Hi, I’m Anas. I build AI-powered web apps, front to back. I like products that feel simple to use, which usually means a lot of invisible work on layout, speed and small details. When I’m not coding, I’m usually drawing, solving a Rubik’s cube, or losing a chess game.
                  </p>
                </div>

                {/* Move the rest of the card here: the divider and the Primary Stack row */}
              </div>

              {/* <div className="mt-6 pt-5 border-t flex flex-wrap items-center justify-between gap-3 text-xs" style={{ borderColor: "var(--border)" }}>
                <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>
                  Primary Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CORE_STACK.slice(0, 4).map((tech) => (
                    <TagPill key={tech} label={tech} size="sm" variant="subtle" />
                  ))}
                </div>
              </div> */}
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
                  First Year (2025 – 2029)
                </p>
                <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  Dr. Shyama Prasad Mukherjee University, Ranchi
                </p>
              </div>

              <div className="mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <p className="text-[11px] font-mono leading-relaxed" style={{ color: "var(--muted)" }}>
                  Coursework: Data Structures &amp; Algorithms, Calculus, OOPS, Relational Databases.
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
                  Full-Stack
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
                    etc.
                  </span>

                </div>
                <h4 className="mt-2 text-lg font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                  Hobbies
                </h4>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  Off the clock: pencil sketches, Rubik’s cubes, chess, anime and manga, and the occasional Minecraft build.                </p>
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
                        pb: 14.55s
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
                        elo: 1400
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
