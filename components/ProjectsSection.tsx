"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionBadge } from "@/components/SectionBadge";
import { ProjectCard, Project, Projects } from "@/components/ProjectCard";

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
  },
  {
    id: "worknest",
    title: "WorkNest",
    description:
      "A collaborative workspace and team task management platform with role-based JWT authentication, task lifecycle workflows, and 10+ REST endpoints.",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
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
  },
  {
    id: "blog-api",
    title: "Blog API",
    description:
      "An asynchronous RESTful backend service built to learn modern Python backend architecture, featuring async SQLAlchemy 2.0 and JWT auth on Neon PostgreSQL.",
    techStack: ["FastAPI", "Python", "SQLAlchemy", "PostgreSQL", "JWT", "Pydantic"],
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
  },
  {
    id: "coop-platformer",
    title: "Co-op Platformer",
    description:
      "A two-player browser platformer built around real-time communication where both players share one level but collide with different versions of it.",
    techStack: ["TypeScript", "Phaser 3", "Node.js", "WebSockets"],
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
  },
];

export interface ProjectsSectionProps {
  theme?: "light" | "dark";
}

export function ProjectsSection({ theme = "light" }: ProjectsSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  // Carousel navigation state
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(true);

  // Click-drag state
  const isDraggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const scrollLeftRef = React.useRef(0);
  const hasMovedRef = React.useRef(false);

  const targetIndexRef = React.useRef(0);

  // ── Sync Scroll Progress and Active Card Index ───────────────────────────────
  const updateScrollState = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const progress = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
    setScrollProgress(Math.min(1, Math.max(0, progress)));

    // Determine active index based on card center relative to container center
    const cardElements = Array.from(el.querySelectorAll<HTMLElement>("[data-project-card]"));
    if (cardElements.length > 0) {
      const containerRect = el.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      let closestIdx = 0;
      let closestDist = Infinity;

      cardElements.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(cardCenter - containerCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });

      setCurrentIndex(closestIdx);
      targetIndexRef.current = closestIdx;
      setCanScrollPrev(closestIdx > 0);
      setCanScrollNext(closestIdx < cardElements.length - 1);
    }
  }, []);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollState);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);
    updateScrollState();

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  // ── Arrow Navigation Controls ────────────────────────────────────────────────
  const scrollToCard = React.useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;

    const cardElements = Array.from(el.querySelectorAll<HTMLElement>("[data-project-card]"));
    const targetCard = cardElements[index];
    if (targetCard) {
      targetIndexRef.current = index;
      const elRect = el.getBoundingClientRect();
      const cardRect = targetCard.getBoundingClientRect();
      const targetScroll = el.scrollLeft + (cardRect.left + cardRect.width / 2) - (elRect.left + elRect.width / 2);
      el.scrollTo({ left: Math.max(0, targetScroll), behavior: "smooth" });
    }
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToCard(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < PROJECTS.length - 1) {
      scrollToCard(currentIndex + 1);
    }
  };

  // ── Keyboard Navigation ──────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // ── Wheel Redirection: Horizontal card advance until boundary, then vertical page scroll ─
  React.useEffect(() => {
    const scroller = scrollerRef.current;
    const section = sectionRef.current;
    if (!scroller || !section) return;

    let wheelCooldown = 0;

    const onWheel = (e: WheelEvent) => {
      // If user is actively performing horizontal trackpad scroll, let browser handle it natively
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }

      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      if (maxScroll <= 0) return;

      const cardElements = Array.from(scroller.querySelectorAll<HTMLElement>("[data-project-card]"));
      if (cardElements.length === 0) return;

      // Gate: Horizontal scroll kicks in ONLY when the entire card height is on screen.
      // This prevents unwanted horizontal scrolling while the cards are only partially visible.
      const sampleCard = cardElements[targetIndexRef.current] || cardElements[0];
      const cardRect = sampleCard.getBoundingClientRect();
      const cardFits = cardRect.height <= window.innerHeight;
      const isEntireCardOnScreen = cardFits
        ? cardRect.top >= -2 && cardRect.bottom <= window.innerHeight + 2
        : cardRect.top <= 2 && cardRect.bottom >= window.innerHeight - 2;

      if (!isEntireCardOnScreen) {
        return;
      }

      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      const atStart = targetIndexRef.current <= 0 && scroller.scrollLeft <= 15;
      const atEnd = targetIndexRef.current >= cardElements.length - 1 && scroller.scrollLeft >= maxScroll - 15;

      if (isScrollingDown) {
        if (!atEnd) {
          // Inside projects: hijack vertical wheel and advance horizontally
          e.preventDefault();
          e.stopPropagation();

          const now = Date.now();
          if (now - wheelCooldown > 320) {
            wheelCooldown = now;

            if (targetIndexRef.current < cardElements.length - 1) {
              const nextIdx = targetIndexRef.current + 1;
              scrollToCard(nextIdx);
            } else {
              scroller.scrollTo({
                left: maxScroll,
                behavior: "smooth",
              });
            }
          }
        }
        // When atEnd: do NOT call preventDefault or stopPropagation!
        // The event bubbles directly to window, allowing Lenis to scroll page down!
      } else if (isScrollingUp) {
        if (!atStart) {
          // Inside projects: hijack vertical wheel and move backwards horizontally
          e.preventDefault();
          e.stopPropagation();

          const now = Date.now();
          if (now - wheelCooldown > 320) {
            wheelCooldown = now;

            if (targetIndexRef.current > 0) {
              const prevIdx = targetIndexRef.current - 1;
              scrollToCard(prevIdx);
            } else {
              scroller.scrollTo({
                left: 0,
                behavior: "smooth",
              });
            }
          }
        }
        // When atStart: do NOT call preventDefault or stopPropagation!
        // The event bubbles directly to window, allowing Lenis to scroll page up!
      }
    };

    section.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      section.removeEventListener("wheel", onWheel);
    };
  }, [scrollToCard]);

  // ── Desktop Click & Drag Handling ────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollerRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    el.style.scrollBehavior = "auto";
    el.style.scrollSnapType = "none"; // Temporarily suspend snap during active drag
    el.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDraggingRef.current) return;
    const el = scrollerRef.current;
    isDraggingRef.current = false;
    if (!el) return;

    el.style.scrollBehavior = "smooth";
    el.style.scrollSnapType = "x mandatory"; // Restore snap
    el.style.cursor = "grab";
  };

  // Prevent drag movement from accidentally opening links
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      hasMovedRef.current = false;
    }
  };

  // ── Horizontal Scrub-based Parallax with GSAP ScrollTrigger ──────────────────
  useGSAP(
    () => {
      const scrollerEl = scrollerRef.current;
      if (!scrollerEl) return;

      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      // Only enable parallax on desktop (>=1024px) without reduced motion to guarantee 60fps touch on mobile
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = Array.from(scrollerEl.querySelectorAll<HTMLElement>("[data-project-card]"));
        const triggers: ScrollTrigger[] = [];

        cards.forEach((card) => {
          const primaryImg = card.querySelector<HTMLElement>("[data-parallax='primary']");
          const secondaryImg = card.querySelector<HTMLElement>("[data-parallax='secondary']");
          const textCol = card.querySelector<HTMLElement>("[data-parallax='text']");

          if (primaryImg) {
            triggers.push(
              ScrollTrigger.create({
                trigger: card,
                scroller: scrollerEl,
                horizontal: true,
                start: "left right",
                end: "right left",
                scrub: true,
                animation: gsap.fromTo(
                  primaryImg,
                  { xPercent: 11 },
                  { xPercent: -11, ease: "none" }
                ),
              })
            );
          }

          if (secondaryImg) {
            triggers.push(
              ScrollTrigger.create({
                trigger: card,
                scroller: scrollerEl,
                horizontal: true,
                start: "left right",
                end: "right left",
                scrub: true,
                animation: gsap.fromTo(
                  secondaryImg,
                  { xPercent: 21 },
                  { xPercent: -21, ease: "none" }
                ),
              })
            );
          }

          if (textCol) {
            triggers.push(
              ScrollTrigger.create({
                trigger: card,
                scroller: scrollerEl,
                horizontal: true,
                start: "left right",
                end: "right left",
                scrub: true,
                animation: gsap.fromTo(
                  textCol,
                  { xPercent: 3 },
                  { xPercent: -3, ease: "none" }
                ),
              })
            );
          }
        });

        return () => {
          triggers.forEach((t) => t.kill());
        };
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-theme={theme}
      aria-label="Selected work and featured projects"
      className="theme-transition min-h-screen py-28 sm:py-32 flex flex-col justify-center border-t overflow-hidden"
      style={{
        background: "var(--canvas)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8">
        {/* ── Section Header Row: Badge, Title & Navigation Controls ───────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mt-1"
              style={{ color: "var(--foreground)" }}
            >
              Featured Projects &amp; Systems
            </h2>
            <p className="mt-3 text-xs sm:text-sm max-w-xl leading-relaxed" style={{ color: "var(--muted)" }}>
              Full-stack AI web applications built with Next.js, TypeScript, PostgreSQL, and performant backend architectures.
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
          NATIVE HORIZONTAL SCROLL CONTAINER
          - overflow-x: auto with scroll-snap
          - Does NOT hijack vertical wheel (page scrolls past vertically)
          - touch-action: pan-y (vertical swipe scrolls page; horizontal swipe scrolls cards)
          - data-lenis-prevent so smooth scroll handles page scroll without interfering
          - Keyboard operable with left/right arrow keys
          - Desktop click-and-drag enabled
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={scrollerRef}
        role="region"
        tabIndex={0}
        aria-label="Projects carousel scroller. Use left and right arrow keys to navigate."
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClickCapture={handleClickCapture}
        className="w-full overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing focus-ring outline-none select-none scrollbar-none"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        <div className="flex gap-6 sm:gap-8 px-6 sm:px-8 max-w-none w-max py-4">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index === 0}
            />
          ))}
        </div>
      </div>

      {/* ── Scroller Progress Indicator Bar ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 mt-6">
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
