"use client";

import * as React from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisContext = React.createContext<Lenis | null>(null);

let activeLenis: Lenis | null = null;
const subscribers = new Set<() => void>();

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function getSnapshot(): Lenis | null {
  return activeLenis;
}

function getServerSnapshot(): null {
  return null;
}

export function useLenis(): Lenis | null {
  const contextLenis = React.useContext(LenisContext);
  const storeLenis = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  return contextLenis ?? storeLenis;
}

/**
 * Universal smooth scroll to an element ID, hash, or scroll pixel offset.
 * Handles pinned ScrollTrigger sections (e.g. #projects) by resolving
 * either ScrollTrigger.start or the surrounding .pin-spacer offset.
 */
export function scrollToTarget(
  target: string | number,
  options?: { duration?: number; offset?: number }
) {
  if (typeof window === "undefined") return;

  const duration = options?.duration ?? 1.2;
  const easing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

  let targetScroll = 0;
  if (typeof target === "number") {
    targetScroll = target;
  } else if (target === "#" || target === "" || target === "#home") {
    targetScroll = 0;
  } else if (target === "#projects") {
    const el = document.getElementById("projects");
    if (el) {
      let stStart: number | undefined;
      try {
        const st = ScrollTrigger.getAll().find((s) => s.trigger === el);
        if (st && typeof st.start === "number") {
          stStart = st.start;
        }
      } catch {
        // fallback
      }
      if (typeof stStart === "number") {
        targetScroll = stStart;
      } else {
        const pinSpacer = el.closest(".pin-spacer") as HTMLElement | null;
        targetScroll = (pinSpacer || el).getBoundingClientRect().top + window.scrollY;
      }
    }
  } else {
    const id = target.startsWith("#") ? target.slice(1) : target;
    const el = document.getElementById(id);
    if (el) {
      targetScroll = el.getBoundingClientRect().top + window.scrollY;
    }
  }

  if (options?.offset) {
    targetScroll += options.offset;
  }

  if (activeLenis) {
    activeLenis.scrollTo(targetScroll, {
      duration,
      easing,
    });
  } else {
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  }
}

export interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenis = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  React.useEffect(() => {
    // Skip entirely when prefers-reduced-motion is enabled
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Creates one Lenis instance with autoRaf: false (driven by GSAP ticker)
    // and default touch settings (leaves native touch scrolling alone)
    const lenisInstance = new Lenis({
      autoRaf: false,
    });

    // Notify ScrollTrigger on every Lenis scroll event
    lenisInstance.on("scroll", ScrollTrigger.update);

    // Drive Lenis from gsap.ticker
    const tickerCallback = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    activeLenis = lenisInstance;
    subscribers.forEach((notify) => notify());

    // Refresh ScrollTrigger after fonts and images load to ensure accurate start/end positions
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    const handleWindowLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", handleWindowLoad);

    return () => {
      window.removeEventListener("load", handleWindowLoad);
      gsap.ticker.remove(tickerCallback);
      lenisInstance.off("scroll", ScrollTrigger.update);
      lenisInstance.destroy();
      activeLenis = null;
      subscribers.forEach((notify) => notify());
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
