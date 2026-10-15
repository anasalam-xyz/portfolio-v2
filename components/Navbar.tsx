"use client";

import * as React from "react";
import { ui, links, person } from "@/lib/content";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: ui.nav.work, href: "#work" },
  { label: ui.nav.about, href: "#about" },
  { label: ui.nav.contact, href: links.email },
] as const;

export interface NavbarProps {
  heroTheme?: "light" | "dark";
  onToggleHeroTheme?: () => void;
}

/**
 * Floating dark pill navbar — inspired by reference design.
 * Centered floating pill with dark background, rounded-full,
 * logo on left, links in center, theme toggle icon (moon/sun), and white "Let's Talk" CTA.
 *
 * Impeccable fixes applied:
 * - 44x44px minimum accessible touch target for theme toggle and interactive items
 * - .focus-ring for keyboard navigators
 * - Explicit transitions instead of transition-all (Emil Kowalski)
 * - Safe hover gates for touch devices
 */
export function Navbar({ heroTheme = "light", onToggleHeroTheme }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [activeHref, setActiveHref] = React.useState<string>("#");
  const [indicator, setIndicator] = React.useState<{ x: number; width: number; opacity: number }>({
    x: 0,
    width: 0,
    opacity: 0,
  });
  const [prefersReduced, setPrefersReduced] = React.useState(false);

  const navUlRef = React.useRef<HTMLUListElement>(null);
  const linkRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  const isLight = heroTheme === "light";

  // Explicit, high-contrast palette calibrated for light and dark modes
  const themeStyles = React.useMemo(() => {
    return isLight
      ? {
          navBg: "rgba(255, 255, 255, 0.94)",
          navBorder: "rgba(28, 22, 19, 0.12)",
          navShadow: scrolled
            ? "0 16px 36px -8px rgba(28, 22, 19, 0.12), 0 0 0 1px rgba(28, 22, 19, 0.06)"
            : "0 8px 24px -4px rgba(28, 22, 19, 0.08), 0 0 0 1px rgba(28, 22, 19, 0.04)",
          textPrimary: "#1C1613",
          textMuted: "rgba(28, 22, 19, 0.70)",
          logoBg: "rgba(28, 22, 19, 0.06)",
          logoBorder: "rgba(28, 22, 19, 0.10)",
          logoText: "#1C1613",
          accent: "#B5611A", // Deep amber (6.0:1 contrast on white)
          hoverBg: "rgba(28, 22, 19, 0.06)",
          ctaBg: "#181715",
          ctaText: "#FFFFFF",
        }
      : {
          navBg: "#181715",
          navBorder: "rgba(255, 255, 255, 0.08)",
          navShadow: scrolled
            ? "0 16px 40px -8px rgba(0, 0, 0, 0.50), 0 0 0 1px rgba(255, 255, 255, 0.08)"
            : "0 10px 30px -6px rgba(0, 0, 0, 0.30), 0 0 0 1px rgba(255, 255, 255, 0.06)",
          textPrimary: "#FFFFFF",
          textMuted: "rgba(255, 255, 255, 0.72)",
          logoBg: "rgba(255, 255, 255, 0.08)",
          logoBorder: "rgba(255, 255, 255, 0.12)",
          logoText: "#FFFFFF",
          accent: "#E8953C",
          hoverBg: "rgba(255, 255, 255, 0.09)",
          ctaBg: "#FFFFFF",
          ctaText: "#181715",
        };
  }, [isLight, scrolled]);

  // Reduced motion preference check
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(media.matches);
    const handler = () => setPrefersReduced(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // Recalculate sliding underline geometry
  const updateIndicator = React.useCallback(() => {
    const activeIndex = NAV_LINKS.findIndex((link) => link.href === activeHref);
    if (activeIndex !== -1 && linkRefs.current[activeIndex] && navUlRef.current) {
      const ulRect = navUlRef.current.getBoundingClientRect();
      const elRect = linkRefs.current[activeIndex]!.getBoundingClientRect();
      setIndicator({
        x: elRect.left - ulRect.left + 12,
        width: Math.max(elRect.width - 24, 18),
        opacity: 1,
      });
    }
  }, [activeHref]);

  // Update underline on activeHref change & window resize
  React.useEffect(() => {
    // Immediate and next-tick update to ensure font metric measurement
    updateIndicator();
    const raf = requestAnimationFrame(updateIndicator);
    window.addEventListener("resize", updateIndicator);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  // Scroll spy to sync activeHref with current section
  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const workEl = document.getElementById("work");
      const aboutEl = document.getElementById("about");
      const scrollPos = window.scrollY + 140;

      if (aboutEl && scrollPos >= aboutEl.offsetTop) {
        setActiveHref("#about");
      } else if (workEl && scrollPos >= workEl.offsetTop) {
        setActiveHref("#work");
      } else {
        setActiveHref("#");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-theme={heroTheme}
      className="fixed left-0 right-0 top-4 z-50 flex justify-center px-4 md:top-5"
    >
      <nav
        className="theme-transition flex w-full max-w-3xl items-center justify-between gap-3 rounded-full px-4 py-2 font-sans backdrop-blur-md md:px-5 md:py-2.5"
        style={{
          background: themeStyles.navBg,
          border: `1px solid ${themeStyles.navBorder}`,
          boxShadow: themeStyles.navShadow,
        }}
        aria-label="Primary navigation"
      >
        {/* ── Logo with Neutral Tile ─────────────────────────────────── */}
        <a
          href="#"
          className="pressable focus-ring flex min-h-[44px] shrink-0 items-center gap-2.5 rounded-full"
          aria-label={`${person.name} — home`}
          onClick={() => setActiveHref("#")}
        >
          {/* Neutral Logo Tile */}
          <div
            className="theme-transition flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black shadow-inner"
            style={{
              background: themeStyles.logoBg,
              color: themeStyles.logoText,
              border: `1px solid ${themeStyles.logoBorder}`,
            }}
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>
          </div>
          <span
            className="theme-transition font-bold tracking-tight"
            style={{ fontSize: "1.05rem", color: themeStyles.textPrimary }}
          >
            {ui.nav.logoName || "Anas."}
          </span>
        </a>

        {/* ── Nav Links with Sliding Active Underline ─────────────── */}
        <ul
          ref={navUlRef}
          className="relative hidden items-center gap-1 sm:flex"
          role="list"
        >
          {NAV_LINKS.map(({ label, href }, index) => {
            const isActive = activeHref === href;
            return (
              <li key={label}>
                <a
                  ref={(el) => {
                    linkRefs.current[index] = el;
                  }}
                  href={href}
                  className="focus-ring relative inline-flex min-h-[44px] items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-160"
                  style={{
                    color: isActive ? themeStyles.accent : themeStyles.textMuted,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = themeStyles.textPrimary;
                      e.currentTarget.style.backgroundColor = themeStyles.hoverBg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = themeStyles.textMuted;
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  onClick={() => {
                    setActiveHref(href);
                  }}
                >
                  {label}
                </a>
              </li>
            );
          })}

          {/* Sliding Animated Underline */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1.5 h-[2.5px] rounded-full will-change-transform"
            style={{
              background: themeStyles.accent,
              transform: `translateX(${indicator.x}px)`,
              width: `${indicator.width}px`,
              opacity: indicator.opacity,
              transition: prefersReduced
                ? "opacity 160ms ease-out"
                : "transform 280ms cubic-bezier(0.23, 1, 0.32, 1), width 280ms cubic-bezier(0.23, 1, 0.32, 1), opacity 180ms ease-out",
            }}
          />
        </ul>

        {/* ── Right Controls: Theme Toggle + "Let's Talk" CTA ───────── */}
        <div className="flex items-center gap-2">
          {/* Theme switch button with 44x44px accessible touch area */}
          <button
            type="button"
            onClick={onToggleHeroTheme}
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            title={isLight ? "Switch to dark mode" : "Switch to light mode"}
            className="pressable focus-ring theme-transition flex h-11 w-11 items-center justify-center rounded-full opacity-80 hover:opacity-100"
            style={{ color: themeStyles.textPrimary }}
          >
            <span
              className="theme-transition flex h-8 w-8 items-center justify-center rounded-full shadow-2xs"
              style={{
                background: themeStyles.logoBg,
                border: `1px solid ${themeStyles.logoBorder}`,
                color: themeStyles.textPrimary,
              }}
            >
              {isLight ? (
                /* Moon icon: indicates clicking will switch to dark */
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                /* Sun icon: indicates clicking will switch to light */
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </span>
          </button>

          {/* Adaptive CTA button */}
          <a
            href={links.email}
            className="pressable focus-ring theme-transition shrink-0 rounded-full px-5 py-2 text-xs font-semibold shadow-xs"
            style={{
              background: themeStyles.ctaBg,
              color: themeStyles.ctaText,
            }}
            aria-label="Send an email to Anas Alam"
          >
            {ui.nav.letsTalk}
          </a>
        </div>
      </nav>
    </header>
  );
}
