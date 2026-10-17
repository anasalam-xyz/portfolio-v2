"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ProjectCard, Projects } from "@/components/ProjectCard";
import { useLenis } from "@/components/smooth-scroll";
import { useRef } from "react";

export type { ProjectImage, Project, Projects } from "@/components/ProjectCard";

// ─── Multiple-Entry Project Data (Local to ProjectsSection) ───────────────────
// Note on images: Dedicated screenshots for Blog API and Co-op Platformer are
// currently pending; using verified RoundOne/WorkNest high-res assets as fallback.
export const PROJECTS: Projects = [
  {
    id: "roundone",
    title: "RoundOne",
    description:
      "An AI mock interview platform that conducts voice-driven technical interviews, asks adaptive follow-up questions, and scores answers with granular feedback.",
    techStack: ["Next.js 15", "TypeScript", "PostgreSQL", "Groq API", "Tailwind CSS"],
    category: "AI Interview Platform",
    year: "2025",
    liveUrl: "https://getroundone.vercel.app/",
    repoUrl: "https://github.com/anasalam-xyz/RoundOne",
    thumbnail: {
      src: "/images/projects/roundone/landing.png",
      alt: "RoundOne AI interview platform landing interface",
      width: 1920,
      height: 1200,
    },
    secondaryImage: {
      src: "/images/projects/roundone/interview.png",
      alt: "RoundOne live adaptive interview session",
      width: 1920,
      height: 1200,
    },
    images: [
      {
        src: "/images/projects/roundone/landing.png",
        alt: "RoundOne AI interview platform landing interface",
        width: 1920,
        height: 1200,
      },
      {
        src: "/images/projects/roundone/interview.png",
        alt: "RoundOne live adaptive interview session",
        width: 1920,
        height: 1200,
      },
      {
        src: "/images/projects/roundone/dashboard.png",
        alt: "RoundOne candidate analytics dashboard",
        width: 1920,
        height: 1200,
      },
      {
        src: "/images/projects/roundone/result.png",
        alt: "RoundOne technical performance evaluation report",
        width: 1920,
        height: 1200,
      },
    ],
  },
  {
    id: "worknest",
    title: "WorkNest",
    description:
      "A collaborative workspace and team task management platform with role-based JWT authentication, task lifecycle workflows, and 10+ REST endpoints.",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    category: "Collaborative Workspace",
    year: "2024",
    liveUrl: "https://worknest-teams.vercel.app",
    repoUrl: "https://github.com/anasalam-xyz/worknest",
    thumbnail: {
      src: "/images/projects/worknest/dashboard.png",
      alt: "WorkNest team workspace and project dashboard",
      width: 1920,
      height: 1200,
    },
    secondaryImage: {
      src: "/images/projects/worknest/project.png",
      alt: "WorkNest task management and project board",
      width: 1920,
      height: 1200,
    },
    images: [
      {
        src: "/images/projects/worknest/dashboard.png",
        alt: "WorkNest team workspace and project dashboard",
        width: 1920,
        height: 1200,
      },
      {
        src: "/images/projects/worknest/project.png",
        alt: "WorkNest task management and project board",
        width: 1920,
        height: 1200,
      },
      {
        src: "/images/projects/worknest/login.png",
        alt: "WorkNest authentication and workspace access",
        width: 1920,
        height: 1200,
      },
      {
        src: "/images/projects/worknest/dashboard.png",
        alt: "WorkNest collaborative sprint board overview",
        width: 1920,
        height: 1200,
      },
    ],
  },
  {
    id: "blog-api",
    title: "Blog API",
    description:
      "An asynchronous RESTful backend service built to learn modern Python backend architecture, featuring async SQLAlchemy 2.0 and JWT auth on Neon PostgreSQL.",
    techStack: ["FastAPI", "Python", "SQLAlchemy", "PostgreSQL", "JWT", "Pydantic"],
    category: "Backend API Service",
    year: "2024",
    repoUrl: "https://github.com/anasalam-xyz/blog-api",
    thumbnail: {
      src: "/images/projects/roundone/auth.png",
      alt: "Blog API authentication and architecture documentation",
      width: 1920,
      height: 1200,
    },
    secondaryImage: {
      src: "/images/projects/roundone/dashboard.png",
      alt: "Blog API schema and endpoint explorer",
      width: 1920,
      height: 1200,
    },
    images: [
      {
        src: "/images/projects/roundone/auth.png",
        alt: "Blog API authentication and architecture documentation",
        width: 1920,
        height: 1200,
      },
      {
        src: "/images/projects/roundone/dashboard.png",
        alt: "Blog API schema and endpoint explorer",
        width: 1920,
        height: 1200,
      },
      {
        src: "/images/projects/roundone/landing.png",
        alt: "Blog API documentation and route specification",
        width: 1920,
        height: 1200,
      },
      {
        src: "/images/projects/roundone/result.png",
        alt: "Blog API automated test suite results",
        width: 1920,
        height: 1200,
      },
    ],
  },
  {
    id: "coop-platformer",
    title: "Co-op Platformer",
    description:
      "A two-player browser platformer built around real-time communication where both players share one level but collide with different versions of it.",
    techStack: ["TypeScript", "Phaser 3", "Node.js", "WebSockets"],
    category: "Multiplayer Web Game",
    year: "2024",
    thumbnail: {
      src: "/images/projects/roundone/result.png",
      alt: "Co-op Platformer gameplay mechanics and synchronization view",
      width: 1920,
      height: 1200,
    },
    secondaryImage: {
      src: "/images/projects/worknest/login.png",
      alt: "Co-op Platformer level overview and lobby interface",
      width: 1920,
      height: 1200,
    },
    images: [
      {
        src: "/images/projects/roundone/result.png",
        alt: "Co-op Platformer gameplay mechanics and synchronization view",
        width: 1920,
        height: 1200,
      },
      {
        src: "/images/projects/worknest/login.png",
        alt: "Co-op Platformer level overview and lobby interface",
        width: 1920,
        height: 1200,
      },
      {
        src: "/images/projects/worknest/project.png",
        alt: "Co-op Platformer multiplayer session and physics state",
        width: 1920,
        height: 1200,
      },
      {
        src: "/images/projects/roundone/landing.png",
        alt: "Co-op Platformer title screen and player matchmaking",
        width: 1920,
        height: 1200,
      },
    ],
  },
];

export interface ProjectsSectionProps {
  theme?: "light" | "dark";
}

export function ProjectsSection({ theme = "light" }: ProjectsSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const scrollTriggerRef = React.useRef<ScrollTrigger | null>(null);
  const lenis = useLenis();

  // Carousel navigation state
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(true);

  const barRef = useRef<HTMLDivElement>(null);

  // ── Programmatic Card Navigation via Lenis/Scroll ────────────────────────────
  const goToCard = React.useCallback(
    (targetIdx: number) => {
      const st = scrollTriggerRef.current;
      if (!st) return;

      const clampedIdx = Math.max(0, Math.min(PROJECTS.length - 1, targetIdx));
      const targetScroll = st.start + (clampedIdx / (PROJECTS.length - 1)) * (st.end - st.start);

      if (lenis) {
        lenis.scrollTo(targetScroll, {
          duration: 0.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    },
    [lenis]
  );

  const handlePrev = React.useCallback(() => {
    if (currentIndex > 0) {
      goToCard(currentIndex - 1);
    }
  }, [currentIndex, goToCard]);

  const handleNext = React.useCallback(() => {
    if (currentIndex < PROJECTS.length - 1) {
      goToCard(currentIndex + 1);
    }
  }, [currentIndex, goToCard]);

  // ── Keyboard Navigation (Left/Right arrows while section is active) ──────────
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const st = scrollTriggerRef.current;
      if (!st || !st.isActive) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // ── Pinned Horizontal Scroll with GSAP & Lenis ───────────────────────────────
  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Distance needed to travel so Card (N-1) is centered
        const getDistance = () => {
          return track.scrollWidth - window.innerWidth;
        };

        const horizontalTween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
        });

        const st = ScrollTrigger.create({
          trigger: section,
          start: () => {
            const bar = barRef.current;
            if (!bar || window.innerWidth < 640) return "top top"; // phone unchanged
            const barBottom =
              bar.getBoundingClientRect().bottom - section.getBoundingClientRect().top;
            const offset = Math.round(barBottom - window.innerHeight);
            return offset >= 0 ? `top top-=${offset}` : `top top+=${-offset}`;
          },
          end: () => "+=" + getDistance(),
          pin: true,
          animation: horizontalTween,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            setScrollProgress(progress);
            const activeIdx = Math.min(
              PROJECTS.length - 1,
              Math.max(0, Math.round(progress * (PROJECTS.length - 1)))
            );
            setCurrentIndex(activeIdx);
            setCanScrollPrev(activeIdx > 0);
            setCanScrollNext(activeIdx < PROJECTS.length - 1);
          },
        });

        scrollTriggerRef.current = st;

        // Container-animation driven parallax for cards (desktop >= 1024px)
        const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-project-card]"));
        cards.forEach((card) => {
          const primaryImg = card.querySelector<HTMLElement>("[data-parallax='primary']");
          const secondaryImg = card.querySelector<HTMLElement>("[data-parallax='secondary']");
          const numberEl = card.querySelector<HTMLElement>("[data-parallax='number']");
          const titleEl = card.querySelector<HTMLElement>("[data-parallax='title']");

          if (primaryImg) {
            gsap.fromTo(
              primaryImg,
              { xPercent: 6 },
              {
                xPercent: -6,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontalTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            );
          }

          if (secondaryImg) {
            gsap.fromTo(
              secondaryImg,
              { xPercent: 14 },
              {
                xPercent: -14,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontalTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            );
          }

          if (numberEl) {
            gsap.fromTo(
              numberEl,
              { xPercent: -15 },
              {
                xPercent: 15,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontalTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            );
          }

          if (titleEl) {
            gsap.fromTo(
              titleEl,
              { xPercent: 4 },
              {
                xPercent: -4,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontalTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            );
          }
        });

        // Recalculate ScrollTrigger measurements with exact card content heights
        ScrollTrigger.refresh();
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        setScrollProgress(0);
        setCurrentIndex(0);
        setCanScrollPrev(false);
        setCanScrollNext(true);
      });

      return () => {
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
          scrollTriggerRef.current = null;
        }
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-theme={theme}
      aria-label="Selected work and featured projects"
      className="theme-transition relative w-full min-h-screen py-10 sm:py-14 flex flex-col justify-center border-t overflow-hidden"
      style={{
        background: "var(--canvas)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 shrink-0">
        {/* ── Section Header Row: Badge, Title & Navigation Controls ───────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-6 sm:mb-8">
          <div>
            <h2
              className="ml-12 text-3xl sm:text-4xl lg:text-5xl font-medium font-display tracking-tight mt-1"
              style={{ color: "var(--foreground)" }}
            >
              Featured Projects
            </h2>
            <p className="ml-12 mt-3 text-xs sm:text-sm max-w-xl leading-relaxed" style={{ color: "var(--muted)" }}>
              Some of my personal projects for you to see.
            </p>
          </div>

          {/* Controls: Counter and Previous/Next Buttons */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Progress Counter e.g. "01 / 04" */}
            <span
              className="font-mono text-xs sm:text-sm tracking-wider font-semibold"
              style={{ color: "var(--muted)" }}
              aria-live="polite"
              aria-atomic="true"
            >
              <span style={{ color: "var(--foreground)" }}>
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              {" / "}
              <span>{String(PROJECTS.length).padStart(2, "0")}</span>
            </span>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canScrollPrev}
                aria-label="Previous project card"
                className="group pressable focus-ring flex h-10 w-10 items-center justify-center rounded-full border transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--accent)]"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:-translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canScrollNext}
                aria-label="Next project card"
                className="group pressable focus-ring flex h-10 w-10 items-center justify-center rounded-full border transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--accent)]"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HORIZONTAL CARDS VIEWPORT
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative w-full overflow-hidden py-3 sm:py-5">
        <div
          ref={trackRef}
          className="flex gap-6 sm:gap-8 lg:gap-10 items-stretch will-change-transform"
          style={{
            paddingLeft: "max(1.5rem, calc((100vw - min(76vw, 1100px)) / 2))",
            paddingRight: "max(1.5rem, calc((100vw - min(76vw, 1100px)) / 2))",
          }}
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              priority={index === 0}
            />
          ))}
        </div>
      </div>

      {/* ── Scroller Progress Indicator Bar ──────────────────────────────── */}
      <div ref={barRef} className="max-w-7xl mx-auto w-full px-6 sm:px-8 mt-5 sm:mt-7 shrink-0">
        <div
          className="relative h-1 w-full rounded-full overflow-hidden"
          style={{ background: "var(--border)" }}
          aria-hidden="true"
        >
          <div
            className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-150"
            style={{
              width: `${Math.max(12, scrollProgress * 100)}%`,
              background: "var(--accent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
