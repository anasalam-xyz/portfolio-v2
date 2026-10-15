"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface BentoScatterOptions {
  /** Whether to animate tiles assembling into the grid as section enters from bottom. Default true. */
  gather?: boolean;
  /** Whether to animate tiles dispersing outward as section exits toward top. Default true. */
  disperse?: boolean;
  /** Distance multiplier for scatter offsets. Default 0.6. */
  spread?: number;
  /** Maximum tilt rotation in degrees. Default 3. */
  maxTilt?: number;
  /** Scatter opacity. Default 0.2. */
  scatterOpacity?: number;
  /** Scatter scale. Default 0.94. */
  scatterScale?: number;
  /** ScrollTrigger target element. Defaults to "grid" if [data-grid] is found, else "section". */
  triggerTarget?: "grid" | "section";
  /** Custom start for gather ScrollTrigger. */
  gatherStart?: string;
  /** Custom end for gather ScrollTrigger. */
  gatherEnd?: string;
  /** Custom start for disperse ScrollTrigger. */
  disperseStart?: string;
  /** Custom end for disperse ScrollTrigger. */
  disperseEnd?: string;
}

/**
 * Calculates the layout offset of an element relative to a parent container,
 * regardless of intermediate offsetParents.
 */
function getOffsetRelativeToGrid(el: HTMLElement, grid: HTMLElement) {
  let left = 0;
  let top = 0;
  let curr: HTMLElement | null = el;

  while (curr && curr !== grid && curr !== document.body) {
    left += curr.offsetLeft;
    top += curr.offsetTop;
    curr = curr.offsetParent as HTMLElement | null;
  }

  return { left, top };
}

/**
 * Hook to apply a scroll-scrubbed "scatter" parallax to bento grid tiles.
 *
 * Requirements:
 * - [data-grid] container serves as the center reference (position: relative).
 * - Elements with [data-tile] animate composite properties only (x, y, rotation, scale, opacity).
 * - Tiles can define data-depth (e.g. "0.8" to "1.4") for parallax intensity.
 * - Tiles can define data-scatter-x="0" to lock horizontal movement (e.g. centered hero portrait).
 * - Gathers as section scrolls into view.
 * - Fully assembled between gather end and disperse start.
 * - Disperses as section exits.
 * - Full effect on >= 1024px; 0.3x intensity on < 1024px; disabled on prefers-reduced-motion.
 */
export function useBentoScatter(
  sectionRef: React.RefObject<HTMLElement | null>,
  options: BentoScatterOptions = {}
) {
  const {
    gather = true,
    disperse = true,
    spread = 0.6,
    maxTilt = 3,
    scatterOpacity = 0.2,
    scatterScale = 0.94,
    triggerTarget,
    gatherStart,
    gatherEnd,
    disperseStart,
    disperseEnd,
  } = options;

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    const setupScatter = (intensity: number) => {
      const gridEl =
        (section.matches("[data-grid]")
          ? section
          : section.querySelector<HTMLElement>("[data-grid]")) || section;

      const tileEls = Array.from(
        section.querySelectorAll<HTMLElement>("[data-tile]")
      );

      if (!tileEls.length) return;

      // Select appropriate trigger element: default to gridEl unless explicitly specified or grid is section
      const triggerEl =
        triggerTarget === "section"
          ? section
          : triggerTarget === "grid"
          ? gridEl
          : gridEl !== section
          ? gridEl
          : section;

      // Calibrated trigger positions preventing animations from starting/ending too early
      const isGridTrigger = triggerEl === gridEl && gridEl !== section;
      const finalGatherStart = gatherStart ?? (isGridTrigger ? "top 85%" : "top bottom");
      const finalGatherEnd = gatherEnd ?? (isGridTrigger ? "top 35%" : "top 30%");
      const finalDisperseStart = disperseStart ?? (isGridTrigger ? "bottom 35%" : "bottom 70%");
      const finalDisperseEnd = disperseEnd ?? "bottom top";

      const getScatterProps = (tile: HTMLElement) => {
        const rawDepth = tile.dataset.depth ? parseFloat(tile.dataset.depth) : 1.0;
        const depth = isNaN(rawDepth) ? 1.0 : rawDepth;

        // Check if horizontal movement is disabled (e.g. data-scatter-x="0" on hero profile image)
        const allowScatterX =
          tile.dataset.scatterX !== "0" && tile.dataset.scatterX !== "false";

        const gridW = gridEl.offsetWidth;
        const gridH = gridEl.offsetHeight;
        const cx = gridW / 2;
        const cy = gridH / 2;

        const pos = getOffsetRelativeToGrid(tile, gridEl);
        const tx = pos.left + tile.offsetWidth / 2;
        const ty = pos.top + tile.offsetHeight / 2;

        let dx = tx - cx;
        let dy = ty - cy;

        // If tile happens to be dead center, give a natural subtle downward drift
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
          dx = 15;
          dy = 30;
        }

        const targetX = allowScatterX ? dx * spread * depth * intensity : 0;
        const targetY = dy * spread * depth * intensity;

        // Rotation up to maxTilt deg, proportional to horizontal distance from center (0 if scatterX is locked)
        const rawTilt = (dx / (cx || 1)) * maxTilt * depth * intensity;
        const targetRotation = allowScatterX
          ? Math.max(-maxTilt, Math.min(maxTilt, rawTilt))
          : 0;

        return {
          x: targetX,
          y: targetY,
          rotation: targetRotation,
          scale: 1 - (1 - scatterScale) * intensity,
          opacity: 1 - (1 - scatterOpacity) * intensity,
        };
      };

      // ── Gather ScrollTrigger ─────────────────────────────────────────────
      // Scrubs as section/grid enters from bottom; fully assembled at gatherEnd
      if (gather) {
        gsap.fromTo(
          tileEls,
          {
            x: (_i, el) => getScatterProps(el as HTMLElement).x,
            y: (_i, el) => getScatterProps(el as HTMLElement).y,
            rotation: (_i, el) => getScatterProps(el as HTMLElement).rotation,
            scale: (_i, el) => getScatterProps(el as HTMLElement).scale,
            opacity: (_i, el) => getScatterProps(el as HTMLElement).opacity,
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            ease: "none",
            stagger: 0.03,
            scrollTrigger: {
              trigger: triggerEl,
              start: finalGatherStart,
              end: finalGatherEnd,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // ── Disperse ScrollTrigger ───────────────────────────────────────────
      // Scrubs as section/grid exits toward top; starts dispersing at disperseStart
      if (disperse) {
        gsap.to(tileEls, {
          x: (_i, el) => getScatterProps(el as HTMLElement).x,
          y: (_i, el) => getScatterProps(el as HTMLElement).y,
          rotation: (_i, el) => getScatterProps(el as HTMLElement).rotation,
          scale: (_i, el) => getScatterProps(el as HTMLElement).scale,
          opacity: (_i, el) => getScatterProps(el as HTMLElement).opacity,
          ease: "none",
          immediateRender: false,
          stagger: 0.03,
          scrollTrigger: {
            trigger: triggerEl,
            start: finalDisperseStart,
            end: finalDisperseEnd,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }
    };

    // Desktop: full intensity (1.0x)
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        setupScatter(1.0);
      }
    );

    // Mobile / Tablet: 0.3x intensity
    mm.add(
      "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
      () => {
        setupScatter(0.3);
      }
    );

    return () => {
      mm.revert();
    };
  }, [
    gather,
    disperse,
    spread,
    maxTilt,
    scatterOpacity,
    scatterScale,
    triggerTarget,
    gatherStart,
    gatherEnd,
    disperseStart,
    disperseEnd,
    sectionRef,
  ]);
}
