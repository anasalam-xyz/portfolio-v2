"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionBadge } from "@/components/SectionBadge";

// ─── Data: Pencil & Graphite Artwork Collection ──────────────────────────────
// `index` key allows manual reordering or placement anytime.
export interface ArtPiece {
  index?: number;
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  year: string;
  medium: string;
  blurDataURL?: string;
}

const WARM_GRAPHITE_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMCAxMCc+PHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPScjMmIyNjIyJy8+PC9zdmc+";

  export const ART_PIECES: ArtPiece[] = [
    {
      id: "evelyn",
      src: "/images/art/evelyn.jpg",
      width: 2898,
      height: 3624,
      alt: "Pencil portrait study focusing on realistic facial planes, soft lighting, and subtle tonal gradations",
      title: "Portrait Study in Shadow",
      year: "2025",
      medium: "2B–8B Graphite on Heavyweight Cartridge",
      blurDataURL: WARM_GRAPHITE_BLUR,
    },
    {
      id: "choso",
      src: "/images/art/choso.jpg",
      width: 3060,
      height: 3490,
      alt: "Dynamic pencil illustration of Choso with distinctive facial markings and intense cross-hatched gaze",
      title: "Choso — Convergence",
      year: "2024",
      medium: "Dark Graphite & Cross-Hatching on Bristol",
      blurDataURL: WARM_GRAPHITE_BLUR,
  },
  {
    id: "touka",
    src: "/images/art/touka.jpg",
    width: 3060,
    height: 3024,
    alt: "Square format graphite study of Touka Kirishima with deep contrast and expressive feathering",
    title: "Touka — Wings of Glass",
    year: "2024",
    medium: "Pencil & Charcoal Shading on Fine Grain Paper",
    blurDataURL: WARM_GRAPHITE_BLUR,
  },
  {
    id: "zoro",
    src: "/images/art/zoro.jpg",
    width: 2993,
    height: 3666,
    alt: "Bold graphite drawing of Roronoa Zoro with bandana and textured ink-like shadow depths",
    title: "Zoro — Asura Stance",
    year: "2024",
    medium: "Graphite Contour & Dramatic Contrast",
    blurDataURL: WARM_GRAPHITE_BLUR,
  },
  {
    id: "hina",
    src: "/images/art/hina.jpg",
    width: 2674,
    height: 3869,
    alt: "Pencil sketch of Hina Amano praying with translucent raindrop reflections and soft gradient shading",
    title: "Hina — Sunshine Girl",
    year: "2024",
    medium: "Mechanical Pencil & Blending Stump on Paper",
    blurDataURL: WARM_GRAPHITE_BLUR,
  },
  {
    id: "yuta",
    src: "/images/art/yuta.jpg",
    width: 2541,
    height: 3219,
    alt: "Expressive graphite drawing of Yuta Okkotsu with ring detail and dramatic psychological depth",
    title: "Yuta — Rika's Vow",
    year: "2024",
    medium: "Fine Line Graphite & Shading on Paper",
    blurDataURL: WARM_GRAPHITE_BLUR,
  },
  {
    id: "victor",
    src: "/images/art/victor.jpg",
    width: 2928,
    height: 3906,
    alt: "Detailed graphite pencil portrait study of Viktor with delicate mechanical accents and textured cross-hatching",
    title: "Viktor — The Herald",
    year: "2024",
    medium: "Graphite & Charcoal on Cold-Pressed Paper",
    blurDataURL: WARM_GRAPHITE_BLUR,
  },
];

const useIsomorphicLayoutEffect =
typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface ArtSectionProps {
  theme?: "light" | "dark";
}

export function ArtSection({ theme = "light" }: ArtSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);
  const triggerButtonRefs = React.useRef<Map<number, HTMLButtonElement>>(new Map());
  const modalCloseBtnRef = React.useRef<HTMLButtonElement>(null);
  
  // Touch swipe tracking state
  const touchStartXRef = React.useRef<number>(0);
  const touchStartTimeRef = React.useRef<number>(0);
  
  // Sorted list honoring `index` keys if specified, or declared order
  const sortedPieces = React.useMemo(() => {
    if (ART_PIECES.some((p) => typeof p.index === "number")) {
      return [...ART_PIECES].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    }
    return ART_PIECES;
  }, []);

  // ── GSAP Scrubbed ScrollTrigger Reveal ──────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // Normal motion: top-to-bottom clip wipe & inner image counter-scale
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const artItems = gsap.utils.toArray<HTMLElement>("[data-art]", section);
      const triggers: ScrollTrigger[] = [];

      // Detect column positions dynamically to stagger wipe start across each row
      const leftPositions = artItems.map((el) => el.offsetLeft);
      const uniqueCols: number[] = [];
      leftPositions.forEach((pos) => {
        if (!uniqueCols.some((c) => Math.abs(c - pos) < 24)) {
          uniqueCols.push(pos);
        }
      });
      uniqueCols.sort((a, b) => a - b);

      artItems.forEach((item) => {
        const innerImg = item.querySelector<HTMLElement>("[data-art-img]");
        const colIndex = Math.max(
          0,
          uniqueCols.findIndex((c) => Math.abs(c - item.offsetLeft) < 24)
        );

        // Stagger trigger windows across columns:
        // Col 0 starts at 76%, Col 1 at 69%, Col 2 at 62%
        const startPercent = Math.max(50, 76 - colIndex * 7);
        const endPercent = Math.max(15, 36 - colIndex * 7);
        const scrubLag = 0.55 + colIndex * 0.1;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: `top ${startPercent}%`,
            end: `top ${endPercent}%`,
            scrub: scrubLag,
            invalidateOnRefresh: true,
          },
        });

        // Clip-path wipe: inset(0% 0% 100% 0%) -> inset(0% 0% 0% 0%)
        tl.fromTo(
          item,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none" },
          0
        );

        // Inner image scale: 1.15 -> 1.0 (synchronized with clip wipe)
        if (innerImg) {
          tl.fromTo(
            innerImg,
            { scale: 1.15 },
            { scale: 1.0, ease: "none" },
            0
          );
        }

        if (tl.scrollTrigger) {
          triggers.push(tl.scrollTrigger);
        }
      });

      return () => {
        triggers.forEach((t) => t.kill());
      };
    });

    // Reduced motion fallback: reveal statically
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const artItems = gsap.utils.toArray<HTMLElement>("[data-art]", section);
      artItems.forEach((item) => {
        const innerImg = item.querySelector<HTMLElement>("[data-art-img]");
        gsap.set(item, { clipPath: "inset(0% 0% 0% 0%)" });
        if (innerImg) {
          gsap.set(innerImg, { scale: 1.0 });
        }
      });
    });

    return () => {
      mm.revert();
    };
  }, [sortedPieces]);

  // ── Lightbox Open / Close & Focus Management ────────────────────────────────
  const openLightbox = React.useCallback((idx: number) => {
    setActiveIdx(idx);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = React.useCallback(() => {
    if (activeIdx !== null) {
      const trigger = triggerButtonRefs.current.get(activeIdx);
      if (trigger) {
        // Return focus to triggering thumbnail (Emil Kowalski a11y rule)
        setTimeout(() => trigger.focus(), 20);
      }
    }
    setActiveIdx(null);
    document.body.style.overflow = "";
  }, [activeIdx]);

  const handlePrev = React.useCallback(() => {
    if (activeIdx === null) return;
    setActiveIdx((prev) =>
      prev === null ? 0 : (prev - 1 + sortedPieces.length) % sortedPieces.length
    );
  }, [activeIdx, sortedPieces.length]);

  const handleNext = React.useCallback(() => {
    if (activeIdx === null) return;
    setActiveIdx((prev) =>
      prev === null ? 0 : (prev + 1) % sortedPieces.length
    );
  }, [activeIdx, sortedPieces.length]);

  // Keyboard navigation & Focus trap inside Lightbox
  React.useEffect(() => {
    if (activeIdx === null) return;

    // Auto-focus close button upon opening
    modalCloseBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Tab") {
        // Simple robust focus trap between interactive controls
        const modalEl = document.getElementById("art-lightbox-dialog");
        if (!modalEl) return;
        const focusable = Array.from(
          modalEl.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIdx, closeLightbox, handleNext, handlePrev]);

  // Touch swipe detection for mobile & tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;
    const timeTaken = Date.now() - touchStartTimeRef.current;
    const velocity = Math.abs(deltaX) / (timeTaken || 1);

    // Fast flick or standard distance threshold (Emil Kowalski velocity gesture rule)
    if (deltaX > 45 || (deltaX > 20 && velocity > 0.12)) {
      handlePrev();
    } else if (deltaX < -45 || (deltaX < -20 && velocity > 0.12)) {
      handleNext();
    }
  };

  const activeArt = activeIdx !== null ? sortedPieces[activeIdx] : null;

  return (
    <section
      ref={sectionRef}
      id="art"
      data-theme={theme}
      aria-labelledby="art-heading"
      className="art-section theme-transition relative px-6 py-28 sm:py-32 border-t overflow-hidden"
      style={{
        background: "var(--canvas)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="text-center max-w-xl mx-auto mb-14 sm:mb-16">
          <h2
            id="art-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mt-1"
            style={{ color: "var(--foreground)" }}
          >
            Pencil &amp; Graphite Studies
          </h2>
          <p
            className="mt-3 text-xs sm:text-sm font-mono max-w-md mx-auto leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            I do pencil sketches occasionally. Here are some of my works.
          </p>
        </div>

        {/* ── Masonry Grid: 3 cols desktop, 2 cols tablet & mobile ─────────── */}
        <div
          role="region"
          aria-label="Art gallery masonry columns"
          className="columns-2 md:columns-3 gap-4 sm:gap-5 lg:gap-6"
        >
          {sortedPieces.map((piece, i) => (
            <div
              key={piece.id}
              data-art
              className="break-inside-avoid mb-4 sm:mb-5 lg:mb-6"
            >
              <button
                ref={(el) => {
                  if (el) triggerButtonRefs.current.set(i, el);
                  else triggerButtonRefs.current.delete(i);
                }}
                type="button"
                onClick={() => openLightbox(i)}
                aria-label={`View ${piece.title} (${piece.year}) in full lightbox`}
                className="group relative block w-full rounded-2xl border overflow-hidden outline-none cursor-pointer text-left
                  focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:border-[var(--accent)]"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              >
                {/* Image Frame with Inner Scale Animation (NO scale on hover) */}
                <div data-art-inner className="relative w-full overflow-hidden">
                  <div data-art-img className="relative w-full">
                    <Image
                      src={piece.src}
                      alt={piece.alt}
                      width={piece.width}
                      height={piece.height}
                      sizes="(max-width: 768px) 50vw, 33vw"
                      placeholder="blur"
                      blurDataURL={piece.blurDataURL}
                      onLoad={() => {
                        ScrollTrigger.refresh();
                      }}
                      className="w-full h-auto object-cover block"
                    />
                  </div>
                </div>

                {/* Small mono caption overlay revealed on hover / keyboard focus */}
                <div
                  className="caption-overlay absolute inset-0 flex flex-col justify-end p-3.5 sm:p-5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(18, 16, 14, 0.90) 0%, rgba(18, 16, 14, 0.45) 45%, transparent 100%)",
                  }}
                >
                  <span className="font-sans font-bold text-xs sm:text-sm text-white tracking-tight leading-snug">
                    {piece.title}
                  </span>
                  <div className="mt-1 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-white/75">
                    <span className="truncate">{piece.medium}</span>
                    <span className="shrink-0 font-semibold text-[var(--accent)]">
                      {piece.year}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Accessible Modal Lightbox ───────────────────────────────────────── */}
      {activeArt && activeIdx !== null && (
        <div
          id="art-lightbox-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={`Artwork detail: ${activeArt.title}`}
          data-lenis-prevent
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 select-none"
          style={{
            background: "rgba(18, 16, 14, 0.94)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          onClick={(e) => {
            // Dismiss when clicking directly on the backdrop
            if (e.target === e.currentTarget) {
              closeLightbox();
            }
          }}
        >
          {/* Top Bar: Counter & Close Button */}
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-20 pointer-events-none">
            <span
              className="font-mono text-xs font-semibold tracking-wider px-3 py-1.5 rounded-full border pointer-events-auto"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                borderColor: "rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
              }}
              aria-live="polite"
            >
              <span>{String(activeIdx + 1).padStart(2, "0")}</span>
              <span className="opacity-50"> / </span>
              <span className="opacity-75">{String(sortedPieces.length).padStart(2, "0")}</span>
            </span>

            {/* 44x44px accessible touch target close button */}
            <button
              ref={modalCloseBtnRef}
              type="button"
              onClick={closeLightbox}
              aria-label="Close lightbox"
              className="group pressable focus-ring pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:bg-white/10 active:scale-95"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                borderColor: "rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
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
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Arrows: Left (Prev) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous artwork"
            className="group pressable focus-ring hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border transition-all hover:bg-white/10 active:scale-95"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderColor: "rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
            }}
          >
            <svg
              width="20"
              height="20"
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

          {/* Navigation Arrows: Right (Next) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next artwork"
            className="group pressable focus-ring hidden sm:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border transition-all hover:bg-white/10 active:scale-95"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderColor: "rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
            }}
          >
            <svg
              width="20"
              height="20"
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

          {/* Lightbox Center Content: Image & Metadata */}
          <div
            className="relative flex flex-col items-center justify-center max-h-[85vh] max-w-[92vw] sm:max-w-4xl w-full"
            style={{
              animation: "fadeInScale 200ms cubic-bezier(0.23, 1, 0.32, 1) forwards",
            }}
          >
            {/* Uncropped Image Container */}
            <div className="relative max-h-[70vh] sm:max-h-[74vh] w-auto overflow-hidden rounded-xl border shadow-2xl flex items-center justify-center"
              style={{
                borderColor: "rgba(255, 255, 255, 0.12)",
                background: "#14110F",
              }}
            >
              <Image
                key={activeArt.id}
                src={activeArt.src}
                alt={activeArt.alt}
                width={activeArt.width}
                height={activeArt.height}
                priority
                sizes="(max-width: 1024px) 90vw, 850px"
                className="max-h-[70vh] sm:max-h-[74vh] w-auto h-auto object-contain block"
              />
            </div>

            {/* Bottom Metadata Info Card */}
            <div className="mt-4 text-center max-w-lg px-4">
              <h3 className="font-serif text-lg sm:text-2xl font-normal text-white tracking-tight">
                {activeArt.title}
              </h3>
              <p className="mt-1 font-mono text-[11px] sm:text-xs text-white/70">
                <span>{activeArt.medium}</span>
                <span className="mx-2 text-white/30">·</span>
                <span className="text-[var(--accent)] font-semibold">{activeArt.year}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

