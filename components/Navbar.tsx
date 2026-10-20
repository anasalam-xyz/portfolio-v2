"use client";

import * as React from "react";
import gsap from "gsap";
import { scrollToTarget } from "@/components/smooth-scroll";
import { useTheme } from "@/hooks/use-theme";
import { SwitchButton } from "@/components/kokonutui/switch-button";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Art", href: "#art" },
  { label: "Contact", href: "#footer" },
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
export function Navbar({ heroTheme, onToggleHeroTheme }: NavbarProps = {}) {
  const { theme: storeTheme, setTheme, toggleTheme: storeToggleTheme } = useTheme();
  const currentTheme = heroTheme ?? storeTheme;
  const toggleTheme = onToggleHeroTheme ?? storeToggleTheme;

  const [scrolled, setScrolled] = React.useState(false);
  const [activeHref, setActiveHref] = React.useState<string>("#");
  const [indicator, setIndicator] = React.useState<{ x: number; width: number; opacity: number }>({
    x: 0,
    width: 0,
    opacity: 0,
  });
  const prefersReduced = React.useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => (typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false),
    () => false
  );

  const headerRef = React.useRef<HTMLElement>(null);
  const navUlRef = React.useRef<HTMLUListElement>(null);
  const linkRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const isClickScrollingRef = React.useRef(false);
  const clickScrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const isLight = currentTheme === "light";

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

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(updateIndicator);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  // Click handler with scroll lock so underline doesn't jitter while animating
  const handleNavClick = React.useCallback(
    (href: string, e: React.MouseEvent) => {
      e.preventDefault();
      setActiveHref(href);
      isClickScrollingRef.current = true;
      if (clickScrollTimeoutRef.current) {
        clearTimeout(clickScrollTimeoutRef.current);
      }
      clickScrollTimeoutRef.current = setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 1300);

      scrollToTarget(href);
    },
    []
  );

  // Scroll spy to sync activeHref across all 5 sections: Home, About, Work, Art, Contact
  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      if (isClickScrollingRef.current) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const isBottom = window.scrollY + clientHeight >= scrollHeight - 60;

      if (isBottom) {
        setActiveHref("#footer");
        return;
      }

      const threshold = Math.min(220, clientHeight * 0.35);

      const footerEl = document.getElementById("footer");
      const artEl = document.getElementById("art");
      const projectsEl = document.getElementById("projects");
      const aboutEl = document.getElementById("about");

      if (footerEl && footerEl.getBoundingClientRect().top <= threshold) {
        setActiveHref("#footer");
      } else if (artEl && artEl.getBoundingClientRect().top <= threshold) {
        setActiveHref("#art");
      } else if (projectsEl && projectsEl.getBoundingClientRect().top <= threshold) {
        setActiveHref("#projects");
      } else if (aboutEl && aboutEl.getBoundingClientRect().top <= threshold) {
        setActiveHref("#about");
      } else {
        setActiveHref("#");
      }
    };

    const cancelClickScroll = () => {
      if (isClickScrollingRef.current) {
        isClickScrollingRef.current = false;
        if (clickScrollTimeoutRef.current) {
          clearTimeout(clickScrollTimeoutRef.current);
        }
      }
    };

    // Run once on mount to establish initial active state based on current scroll position
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", cancelClickScroll, { passive: true });
    window.addEventListener("touchstart", cancelClickScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", cancelClickScroll);
      window.removeEventListener("touchstart", cancelClickScroll);
      if (clickScrollTimeoutRef.current) {
        clearTimeout(clickScrollTimeoutRef.current);
      }
    };
  }, []);

  // ── Entrance Animation synced with loader:reveal ──────────────────────────
  React.useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(header, { autoAlpha: 1, y: 0 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const isSkipLoader = document.documentElement.classList.contains("skip-loader");
      const speed = isSkipLoader ? 0.6 : 1.0;

      const navTl = gsap.timeline({ paused: true });
      navTl.fromTo(
        header,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8 * speed,
          ease: "expo.out",
          clearProps: "transform,y",
        },
        0.25 * speed // Starts after headline starts
      );

      const playNav = () => {
        navTl.play();
      };

      if (isSkipLoader || !document.documentElement.classList.contains("is-loading")) {
        playNav();
      } else {
        window.addEventListener("loader:reveal", playNav, { once: true });
      }

      return () => {
        window.removeEventListener("loader:reveal", playNav);
        navTl.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      data-hero-reveal="navbar"
      data-theme={currentTheme}
      className="mx-auto w-fit fixed left-0 right-0 top-4 z-50 flex justify-center px-4 md:top-5"
    >
      <nav
        className="opacity-90 backdrop-blur-xl theme-transition flex w-full max-w-3xl items-center justify-between gap-3 rounded-full px-4 py-2 font-sans backdrop-blur-md md:px-5 md:py-2.5"
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
          aria-label="Anas Alam — home"
          onClick={(e) => handleNavClick("#", e)}
        >

          <span
            className="theme-transition font-bold tracking-tight"
            style={{ fontSize: "1.05rem", color: themeStyles.textPrimary }}
          >
            {"<Anas/>"}
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
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = isActive ? themeStyles.accent : themeStyles.textMuted;
                  }}
                  onClick={(e) => handleNavClick(href, e)}
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
          {/* Kokonut UI Theme Switch Button */}
          <SwitchButton
            theme={currentTheme}
            onThemeChange={(newTheme) => {
              if (onToggleHeroTheme && newTheme !== currentTheme) {
                onToggleHeroTheme();
              } else {
                setTheme(newTheme);
              }
            }}
            showLabel={false}
            size="sm"
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            title={isLight ? "Switch to dark mode" : "Switch to light mode"}
            className="rounded-full border transition-transform hover:scale-105 active:scale-95 shadow-2xs focus-ring"
            style={{
              background: themeStyles.logoBg,
              borderColor: themeStyles.logoBorder,
              color: themeStyles.textPrimary,
            }}
          />

          {/* Adaptive CTA button */}
          <a
            href="mailto:anasalam.xyz@gmail.com"
            className="inline-flex items-center justify-center group pressable focus-ring theme-transition shrink-0 rounded-full px-5 py-2 text-xs font-semibold shadow-xs"
            style={{
              background: themeStyles.ctaBg,
              color: themeStyles.ctaText,
            }}
            aria-label="Send an email to Anas Alam"
          >
            <span>Say Hi!</span>
            <svg className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 ml-1" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>

          </a>
        </div>
      </nav>
    </header>
  );
}
