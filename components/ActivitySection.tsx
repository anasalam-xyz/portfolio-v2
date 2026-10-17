"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { useRowGravity } from "@/hooks/use-row-gravity";
import type { GitHubActivity } from "@/lib/github";
import type { LeetCodeActivity } from "@/lib/leetcode";

// Register plugins once at module level
gsap.registerPlugin(ScrollTrigger, Draggable);

export interface ActivitySectionProps {
  theme?: "light" | "dark";
  githubData: GitHubActivity;
  leetcodeData: LeetCodeActivity;
}

type ActiveSource = "github" | "leetcode";

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LeetCodeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.834 3.788 5.724 5.724 0 0 0 2.212-.185 5.922 5.922 0 0 0 2.454-1.328l4.475-4.476a1.374 1.374 0 0 0 0-1.943 1.374 1.374 0 0 0-1.943 0l-4.475 4.476a3.178 3.178 0 0 1-1.316.713 3.178 3.178 0 0 1-1.189.1 3.19 3.19 0 0 1-2.597-2.036 3.018 3.018 0 0 1-.188-.547 2.973 2.973 0 0 1-.033-1.269 2.83 2.83 0 0 1 .65-1.131l3.854-4.126.002-.002L14.444.96A1.374 1.374 0 0 0 13.483 0zm-2.88 7.283a1.374 1.374 0 0 0-.972.403L5.155 12.162a1.374 1.374 0 0 0 0 1.943 1.374 1.374 0 0 0 1.943 0l4.476-4.476a1.374 1.374 0 0 0-.971-2.346z" />
    </svg>
  );
}

function ArrowUpRightIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

// ─── Heatmap Sub-Grid ────────────────────────────────────────────────────────

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ActivityHeatmapGrid({
  weeks,
  unit,
}: {
  weeks: GitHubActivity["weeks"];
  unit: "contributions" | "submissions";
}) {
  // Compute month headers above columns
  let lastSeenMonth = -1;
  const monthHeaders = weeks.map((w) => {
    const validDay = w.days.find((d) => !d.isPlaceholder && d.date.includes("-"));
    if (!validDay) return null;
    const parts = validDay.date.split("-");
    const m = parseInt(parts[1], 10) - 1;
    if (m !== lastSeenMonth) {
      lastSeenMonth = m;
      return MONTH_NAMES[m];
    }
    return null;
  });

  return (
    <div className="w-full select-none">
      {/* Month labels row */}
      <div className="flex gap-1 sm:gap-1.5 mb-1.5 justify-between px-0.5">
        {weeks.map((_, colIdx) => (
          <div
            key={colIdx}
            className="w-2.5 sm:w-3 text-[10px] font-mono leading-none tracking-tight text-center"
            style={{ color: "var(--muted)" }}
          >
            {monthHeaders[colIdx] ?? ""}
          </div>
        ))}
      </div>

      {/* Weekday Columns (Sunday through Saturday, 7 rows) */}
      <div className="flex gap-1 sm:gap-1.5 justify-between">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1 sm:gap-1.5">
            {week.days.map((day, dIdx) => {
              if (day.isPlaceholder) {
                return (
                  <div
                    key={dIdx}
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 pointer-events-none"
                    aria-hidden="true"
                  />
                );
              }

              return (
                <div
                  key={dIdx}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] sm:rounded-[2.5px] transition-colors duration-150 hover:ring-1 hover:ring-[var(--foreground)]"
                  style={{
                    backgroundColor: `var(--heatmap-${day.level})`,
                  }}
                  title={`${day.count} ${unit} on ${day.date}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Grid Legend */}
      <div className="mt-3.5 flex items-center justify-between font-mono text-[11px]" style={{ color: "var(--muted)" }}>
        <span className="text-[10px] uppercase tracking-wider">Last 120 Days</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((lvl) => (
              <div
                key={lvl}
                className="w-2.5 h-2.5 rounded-[2px]"
                style={{ backgroundColor: `var(--heatmap-${lvl})` }}
              />
            ))}
          </div>
          <span className="text-[10px]">More</span>
        </div>
      </div>
    </div>
  );
}

// ─── Activity Section Component ──────────────────────────────────────────────

export function ActivitySection({
  theme = "light",
  githubData,
  leetcodeData,
}: ActivitySectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // selectedTab updates immediately so the orange indicator pill slides without delay
  const [selectedTab, setSelectedTab] = React.useState<ActiveSource>("github");
  // activeCard updates when card swap animation completes
  const [activeCard, setActiveCard] = React.useState<ActiveSource>("github");
  const [isSwapping, setIsSwapping] = React.useState(false);

  // Card element refs (inner elements for Draggable, outer wrappers for useRowGravity)
  const ghOuterRef = React.useRef<HTMLDivElement>(null);
  const ghInnerRef = React.useRef<HTMLDivElement>(null);
  const lcOuterRef = React.useRef<HTMLDivElement>(null);
  const lcInnerRef = React.useRef<HTMLDivElement>(null);

  const draggableRef = React.useRef<Draggable | null>(null);
  const hasNudgedRef = React.useRef(false);

  // Apply row gravity animation to the outer card wrappers
  useRowGravity(gridRef);

  // ── Card Swap Orchestrator ────────────────────────────────────────────────
  const swapCards = React.useCallback(
    (direction: number = 1, currentDragX?: number) => {
      if (isSwapping) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const isGhFront = activeCard === "github";
      const nextSource: ActiveSource = isGhFront ? "leetcode" : "github";
      const frontEl = isGhFront ? ghInnerRef.current : lcInnerRef.current;
      const backEl = isGhFront ? lcInnerRef.current : ghInnerRef.current;
      const frontOuter = isGhFront ? ghOuterRef.current : lcOuterRef.current;
      const backOuter = isGhFront ? lcOuterRef.current : ghOuterRef.current;

      if (!frontEl || !backEl || !frontOuter || !backOuter) return;

      // Update the toggle button immediately so the orange background slides right away!
      setSelectedTab(nextSource);

      // Disable Draggable during transition so it releases control
      if (draggableRef.current) {
        draggableRef.current.disable();
      }

      if (prefersReducedMotion) {
        // Instant swap without animation
        setActiveCard(nextSource);
        frontOuter.style.zIndex = "10";
        backOuter.style.zIndex = "20";
        gsap.set(frontEl, { x: 0, y: -16, scale: 0.94, rotation: -1.5 });
        gsap.set(backEl, { x: 0, y: 0, scale: 1, rotation: 0 });
        return;
      }

      setIsSwapping(true);

      // Read current x position of frontEl (where the drag left off)
      const startX = currentDragX ?? (gsap.getProperty(frontEl, "x") as number) ?? 0;
      const currentRotation = (gsap.getProperty(frontEl, "rotation") as number) ?? 0;

      const slideOutX = direction * 440;
      const slideOutRotate = direction * 8;

      // Calculate remaining distance to slide out
      const distRemaining = Math.abs(slideOutX - startX);
      const slideOutDuration = Math.max(0.16, Math.min(0.28, 0.28 * (distRemaining / 440)));

      const tl = gsap.timeline({
        onComplete: () => {
          setActiveCard(nextSource);
          setIsSwapping(false);
        },
      });

      // 1. Slide front card out to the side, starting from current drag position!
      tl.fromTo(
        frontEl,
        { x: startX, rotation: currentRotation },
        {
          x: slideOutX,
          rotation: slideOutRotate,
          duration: slideOutDuration,
          ease: "power2.in",
        }
      )
        // 2. Swap z-index on outer wrappers and position frontEl behind
        .call(() => {
          frontOuter.style.zIndex = "10";
          backOuter.style.zIndex = "20";
          gsap.set(frontEl, {
            x: direction * 160,
            y: -16,
            scale: 0.94,
            rotation: -1.5,
          });
        })
        // 3. Settle previous front card into back and bring other card forward
        .to(
          backEl,
          {
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "+=0.01"
        )
        .to(
          frontEl,
          {
            x: 0,
            y: -16,
            scale: 0.94,
            rotation: -1.5,
            duration: 0.5,
            ease: "power3.out",
          },
          "<"
        );
    },
    [activeCard, isSwapping]
  );

  // ── Setup Draggable on Front Card Only ──────────────────────────────────────
  React.useEffect(() => {
    const isGhFront = activeCard === "github";
    const frontEl = isGhFront ? ghInnerRef.current : lcInnerRef.current;
    const backEl = isGhFront ? lcInnerRef.current : ghInnerRef.current;
    const frontOuter = isGhFront ? ghOuterRef.current : lcOuterRef.current;
    const backOuter = isGhFront ? lcOuterRef.current : ghOuterRef.current;

    if (!frontEl || !backEl || !frontOuter || !backOuter) return;

    // Ensure outer wrapper z-indices match active state
    frontOuter.style.zIndex = "20";
    backOuter.style.zIndex = "10";

    // Ensure resting transforms match active state
    gsap.set(frontEl, { x: 0, y: 0, scale: 1, rotation: 0 });
    gsap.set(backEl, { x: 0, y: -16, scale: 0.94, rotation: -1.5 });

    if (draggableRef.current) {
      draggableRef.current.kill();
      draggableRef.current = null;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let lastDragX = 0;
    let lastDragTime = 0;
    let dragVelocity = 0;

    const [inst] = Draggable.create(frontEl, {
      type: "x",
      edgeResistance: 0.65,
      cursor: "grab",
      activeCursor: "grabbing",
      zIndexBoost: false,
      allowContextMenu: false,
      onPress() {
        lastDragX = this.x;
        lastDragTime = Date.now();
        dragVelocity = 0;
      },
      onDrag() {
        const now = Date.now();
        const dt = (now - lastDragTime) / 1000;
        if (dt > 0.008) {
          dragVelocity = (this.x - lastDragX) / dt;
          lastDragX = this.x;
          lastDragTime = now;
        }
        // Small tilt while dragging (x * 0.04 deg)
        gsap.set(frontEl, { rotation: this.x * 0.04 });
      },
      onDragEnd() {
        const currentX = this.x;
        const isPastThreshold = Math.abs(currentX) > 90;
        const isQuickFlick = Math.abs(dragVelocity) > 350;

        if (isPastThreshold || isQuickFlick) {
          const dir = Math.abs(currentX) > 10 ? (currentX > 0 ? 1 : -1) : (dragVelocity > 0 ? 1 : -1);
          swapCards(dir, currentX);
        } else {
          // Under threshold: spring back with elastic
          gsap.to(frontEl, {
            x: 0,
            rotation: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.75)",
          });
        }
      },
    });

    draggableRef.current = inst;

    return () => {
      inst?.kill();
    };
  }, [activeCard, swapCards]);

  // ── One-Time 12px Nudge on Scroll Entrance ──────────────────────────────────
  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current || hasNudgedRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 72%",
      once: true,
      onEnter: () => {
        if (hasNudgedRef.current) return;
        hasNudgedRef.current = true;

        const target = ghInnerRef.current;
        if (!target) return;

        gsap.timeline({ delay: 0.4 })
          .to(target, {
            x: 12,
            rotation: 0.48, // 12 * 0.04
            duration: 0.24,
            ease: "power2.out",
          })
          .to(target, {
            x: 0,
            rotation: 0,
            duration: 0.6,
            ease: "elastic.out(1.15, 0.65)",
          });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // ── Keyboard Navigation (ArrowLeft / ArrowRight) ───────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      swapCards(e.key === "ArrowRight" ? 1 : -1);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="activity"
      data-theme={theme}
      aria-labelledby="activity-heading"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="activity-section theme-transition relative px-6 py-28 sm:py-32 border-t overflow-x-clip focus:outline-none"
      style={{
        background: "var(--canvas)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14 sm:mb-16">
          <h2
            id="activity-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-medium font-display tracking-tight mt-1"
            style={{ color: "var(--foreground)" }}
          >
            Coding Activity
          </h2>
          <p
            className="mt-3 text-xs sm:text-sm font-mono max-w-md mx-auto leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Consistent engineering rhythm across open-source systems and algorithmic problem solving.
          </p>
        </div>

        {/* ── Stacked Cards Container (CSS Grid for robust stacking & natural height) ── */}
        <div
          ref={gridRef}
          className="relative grid grid-cols-1 grid-rows-1 w-full max-w-[560px] mx-auto pt-6"
        >
          {/* Card 1: GitHub Card */}
          <div
            ref={ghOuterRef}
            data-gravity-item
            data-side="left"
            className="col-start-1 row-start-1 w-full will-change-transform"
            style={{
              zIndex: activeCard === "github" ? 20 : 10,
            }}
          >
            <div
              ref={ghInnerRef}
              aria-hidden={activeCard !== "github"}
              inert={activeCard !== "github" ? true : undefined}
              onClick={() => {
                if (!isSwapping && activeCard !== "github") {
                  swapCards(-1);
                }
              }}
              className={`theme-transition relative w-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl border select-none ${
                activeCard === "github" ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
              }`}
              style={{
                background: "var(--dock-bg)",
                borderColor: "var(--dock-border)",
                touchAction: "pan-y",
              }}
            >
              {/* Card Header Tab */}
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{
                      background: "var(--social-btn-bg)",
                      color: "var(--social-btn-text)",
                      border: "1px solid var(--social-btn-border)",
                    }}
                  >
                    <GitHubIcon />
                  </span>
                  <div>
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                      GitHub
                    </span>
                    <span className="ml-2 font-mono text-[11px]" style={{ color: "var(--muted)" }}>
                      @{githubData.username}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://github.com/${githubData.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${githubData.username} on GitHub`}
                  className="theme-transition focus-ring inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium"
                  style={{
                    background: "var(--pill-bg)",
                    border: "1px solid var(--pill-border)",
                    color: "var(--muted)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Profile</span>
                  <ArrowUpRightIcon />
                </a>
              </div>

              {/* Headline Stat */}
              <div className="pt-4 pb-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl sm:text-3xl font-medium tracking-tight" style={{ color: "var(--foreground)" }}>
                    {githubData.totalContributions}
                  </span>
                  <span className="font-mono text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
                    contributions in the last 4 months
                  </span>
                </div>
              </div>

              {/* 4-Month Grid */}
              <div className="pt-1">
                <ActivityHeatmapGrid weeks={githubData.weeks} unit="contributions" />
              </div>
            </div>
          </div>

          {/* Card 2: LeetCode Card */}
          <div
            ref={lcOuterRef}
            data-gravity-item
            data-side="right"
            className="col-start-1 row-start-1 w-full will-change-transform"
            style={{
              zIndex: activeCard === "leetcode" ? 20 : 10,
            }}
          >
            <div
              ref={lcInnerRef}
              aria-hidden={activeCard !== "leetcode"}
              inert={activeCard !== "leetcode" ? true : undefined}
              onClick={() => {
                if (!isSwapping && activeCard !== "leetcode") {
                  swapCards(1);
                }
              }}
              className={`theme-transition relative w-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl border select-none ${
                activeCard === "leetcode" ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
              }`}
              style={{
                background: "var(--dock-bg)",
                borderColor: "var(--dock-border)",
                touchAction: "pan-y",
              }}
            >
              {/* Card Header Tab */}
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{
                      background: "var(--social-btn-bg)",
                      color: "var(--social-btn-text)",
                      border: "1px solid var(--social-btn-border)",
                    }}
                  >
                    <LeetCodeIcon />
                  </span>
                  <div>
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                      LeetCode
                    </span>
                    <span className="ml-2 font-mono text-[11px]" style={{ color: "var(--muted)" }}>
                      @{leetcodeData.username}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://leetcode.com/u/${leetcodeData.username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${leetcodeData.username} on LeetCode`}
                  className="theme-transition focus-ring inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium"
                  style={{
                    background: "var(--pill-bg)",
                    border: "1px solid var(--pill-border)",
                    color: "var(--muted)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Profile</span>
                  <ArrowUpRightIcon />
                </a>
              </div>

              {/* Headline Stat */}
              <div className="pt-4 pb-3">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="font-mono text-2xl sm:text-3xl font-medium tracking-tight" style={{ color: "var(--foreground)" }}>
                    {leetcodeData.streak}
                  </span>
                  <span className="font-mono text-xs sm:text-sm" style={{ color: "var(--muted)" }}>
                    day streak · {leetcodeData.totalActiveDays} active days · {leetcodeData.totalSubmissions} submissions
                  </span>
                </div>
              </div>

              {/* 4-Month Grid */}
              <div className="pt-1">
                <ActivityHeatmapGrid weeks={leetcodeData.weeks} unit="submissions" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Indicator Buttons & Hint ───────────────────────────────────────── */}
        <div className="mt-8 flex flex-col items-center gap-2.5">
          <div
            role="tablist"
            aria-label="Activity source switcher"
            className="relative inline-flex items-center gap-1 rounded-full p-1 border shadow-xs"
            style={{
              background: "var(--dock-bg)",
              borderColor: "var(--dock-border)",
            }}
          >
            {/* Sliding Orange Background Pill */}
            <div
              aria-hidden="true"
              className="absolute top-1 bottom-1 rounded-full pointer-events-none"
              style={{
                background: "var(--accent)",
                left: 4,
                width: 112,
                transform: selectedTab === "github" ? "translateX(0px)" : "translateX(116px)",
                transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />

            <button
              type="button"
              role="tab"
              aria-selected={selectedTab === "github"}
              aria-controls="github-card"
              onClick={() => {
                if (selectedTab !== "github" && !isSwapping) {
                  swapCards(-1);
                }
              }}
              className="relative z-10 pressable focus-ring inline-flex w-28 items-center justify-center gap-2 rounded-full py-1.5 font-mono text-xs font-medium transition-colors duration-200"
              style={{
                color: selectedTab === "github" ? "var(--cta-primary-text)" : "var(--muted)",
              }}
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={selectedTab === "leetcode"}
              aria-controls="leetcode-card"
              onClick={() => {
                if (selectedTab !== "leetcode" && !isSwapping) {
                  swapCards(1);
                }
              }}
              className="relative z-10 pressable focus-ring inline-flex w-28 items-center justify-center gap-2 rounded-full py-1.5 font-mono text-xs font-medium transition-colors duration-200"
              style={{
                color: selectedTab === "leetcode" ? "var(--cta-primary-text)" : "var(--muted)",
              }}
            >
              <LeetCodeIcon className="w-3.5 h-3.5" />
              <span>LeetCode</span>
            </button>
          </div>

          <p
            className="font-mono text-[11px] tracking-wide"
            style={{ color: "var(--muted)" }}
          >
            Drag or tap to switch
          </p>

          {/* Screen reader live region */}
          <div aria-live="polite" className="sr-only">
            {selectedTab === "github" ? "GitHub activity card is active" : "LeetCode activity card is active"}
          </div>
        </div>
      </div>
    </section>
  );
}
