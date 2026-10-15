"use client";

import * as React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { person, projects } from "@/lib/content";

export default function Home() {
  // Hero theme state: "light" matches reference design by default
  const [heroTheme, setHeroTheme] = React.useState<"light" | "dark">("light");

  // Read saved theme from localStorage on initial client mount if available
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("hero-theme");
      if (saved === "light" || saved === "dark") {
        setHeroTheme(saved);
      }
    } catch {
      // localStorage may be unavailable or restricted
    }
  }, []);

  const toggleHeroTheme = React.useCallback(() => {
    setHeroTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem("hero-theme", next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <>
      {/* Floating Pill Navbar with Theme Toggle */}
      <Navbar heroTheme={heroTheme} onToggleHeroTheme={toggleHeroTheme} />

      <main>
        {/* Hero Section with explicit light/dark theme toggle */}
        <HeroSection theme={heroTheme} />

        {/* Selected Work section placeholder for scroll destination (to be styled later) */}
        <section
          id="work"
          aria-label="Selected work"
          className="min-h-screen px-6 py-32 text-center flex flex-col items-center justify-center border-t"
          style={{
            background: "var(--canvas)",
            borderColor: "var(--border)",
            color: "var(--muted)",
          }}
        >
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <span
              className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border mb-4"
              style={{
                borderColor: "var(--border-strong)",
                color: "var(--accent)",
                background: "var(--pill-bg)",
              }}
            >
              Selected Work
            </span>

            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Featured Projects &amp; Systems
            </h2>

            <p className="mt-3 text-sm sm:text-base leading-relaxed max-w-lg">
              Full-stack AI web applications built with Next.js, TypeScript, PostgreSQL, and performant backend architectures.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
              {projects.map((project) => (
                <div
                  key={project.slug}
                  className="rounded-2xl border p-5 backdrop-blur-sm transition-all hover:border-[var(--accent)]"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base" style={{ color: "var(--foreground)" }}>
                      {project.title}
                    </span>
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold hover:underline"
                        style={{ color: "var(--accent)" }}
                      >
                        Live ↗
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {project.short}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-mono"
                        style={{
                          background: "var(--surface-elevated)",
                          color: "var(--foreground)",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About section placeholder */}
        <section
          id="about"
          aria-label="About Anas Alam"
          className="px-6 py-24 text-center border-t"
          style={{
            background: "var(--surface-elevated)",
            borderColor: "var(--border)",
          }}
        >
          <div className="max-w-xl mx-auto">
            <span
              className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block"
              style={{
                borderColor: "var(--border-strong)",
                color: "var(--accent)",
                background: "var(--pill-bg)",
              }}
            >
              About
            </span>
            <h3 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
              {person.name}
            </h3>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              {person.education.degree} ({person.education.status}) · {person.education.institution}
            </p>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              {person.lookingFor}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
