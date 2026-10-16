"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * Row-based gravity animation for icons in a grid ([data-icon] children).
 * - Rows are grouped by layout position; within a row, the first half enters
 *   from the left and the second half from the right (2 left / 2 right for 4 columns).
 * - One scrubbed timeline per row: slide in hovering -> drop -> hold -> rise -> slide out.
 * - Lenis handles smoothing, so scrub is `true` (no second smoothing layer).
 * - Reduced motion: icons are simply visible.
 */
export function useRowGravity(gridRef: React.RefObject<HTMLElement | null>) {
  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // Listing the breakpoints as conditions makes the setup re-run (and
    // re-group the rows) when the column count changes.
    mm.add(
      {
        motionOk: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
        wide: "(min-width: 768px)",
        narrow: "(max-width: 767px)",
      },
      (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean };
        const icons = gsap.utils.toArray<HTMLElement>("[data-icon]", grid);
        if (icons.length === 0) return;

        if (reduce) {
          gsap.set(icons, { opacity: 1, x: 0, y: 0, rotation: 0 });
          return;
        }

        // Group into rows by vertical position (4px tolerance), then order each row left to right
        const sorted = [...icons].sort(
          (a, b) => a.offsetTop - b.offsetTop || a.offsetLeft - b.offsetLeft
        );
        const rows: HTMLElement[][] = [];
        sorted.forEach((el) => {
          const row = rows[rows.length - 1];
          if (row && Math.abs(row[0].offsetTop - el.offsetTop) < 4) row.push(el);
          else rows.push([el]);
        });

        gsap.set(icons, { willChange: "transform", force3D: true });

        const lift = 24;
        const reach = () => window.innerWidth * 0.35;
        const stagger = { each: 0.015 };

        rows.forEach((row) => {
          const sideOf = new Map<HTMLElement, number>();
          row.forEach((el, i) => sideOf.set(el, i < row.length / 2 ? -1 : 1));
          const side = (el: HTMLElement) => sideOf.get(el) ?? 1;

          const x = (_: number, el: HTMLElement) => side(el) * reach();
          const hoverY = -lift;
          const tilt = (_: number, el: HTMLElement) => side(el) * 8;
          const halfTilt = (_: number, el: HTMLElement) => side(el) * 3;

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: row[0],
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          tl.set(row, { opacity: 1 })
            // 1. Slide in, hovering above the spot with a small tilt
            .fromTo(
              row,
              { x, y: hoverY, rotation: tilt },
              {
                x: 0,
                y: hoverY,
                rotation: halfTilt,
                ease: "power1.out",
                duration: 0.35,
                stagger,
              }
            )
            // 2. Drop to rest and straighten
            .to(row, {
              y: 0,
              rotation: 0,
              ease: "power2.in",
              duration: 0.2,
              stagger,
            })
            // 3. Hold
            .to({}, { duration: 0.2 })
            // 4. Rise slightly
            .to(row, {
              y: hoverY * 0.5,
              rotation: (_: number, el: HTMLElement) => -halfTilt(_, el),
              ease: "power1.out",
              duration: 0.15,
              stagger,
            })
            // 5. Slide out toward its own side
            .to(row, {
              x,
              rotation: (_: number, el: HTMLElement) => -tilt(_, el),
              ease: "power1.in",
              duration: 0.35,
              stagger,
            });
        });

        return () => {
          gsap.set(icons, { clearProps: "willChange" });
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, [gridRef]);
}