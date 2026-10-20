"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useBentoScatter } from "@/hooks/use-bento-scatter";
import { scrollToTarget } from "@/components/smooth-scroll";
// Register plugins once at module level per GSAP best practices
gsap.registerPlugin(ScrollTrigger, useGSAP);

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com/anasalam-xyz",
    label: "GitHub profile",
    isExternal: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/anasalam-xyz",
    label: "LinkedIn profile",
    isExternal: true,
  },
  {
    name: "Email",
    href: "mailto:anasalam.xyz@gmail.com",
    label: "Email Anas Alam",
    isExternal: false,
  },
] as const;

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function SocialButton({
  href,
  label,
  children,
  isExternal = true,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  isExternal?: boolean;
}) {
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      className="social-btn focus-ring theme-transition relative inline-flex h-9 w-9 items-center justify-center rounded-full shadow-xs"
      style={{
        background: "var(--social-btn-bg)",
        color: "var(--social-btn-text)",
        border: "1px solid var(--social-btn-border)",
      }}
    >
      {children}
    </a>
  );
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface HeroSectionProps {
  theme?: "light" | "dark";
}

// ─── Hero Section Component ──────────────────────────────────────────────────

export function HeroSection({ theme = "light" }: HeroSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headingAreaRef = React.useRef<HTMLDivElement>(null);
  const photoWrapperRef = React.useRef<HTMLDivElement>(null);
  const photoClipRef = React.useRef<HTMLDivElement>(null);
  const photoInnerRef = React.useRef<HTMLDivElement>(null);
  const photoImageTargetRef = React.useRef<HTMLDivElement>(null);
  const socialsRowRef = React.useRef<HTMLDivElement>(null);
  const ctaDockRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      // ── Reduced Motion: Instant reveal with no transforms/transitions ──────
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(section.querySelectorAll("[data-hero-reveal]"), {
          autoAlpha: 1,
          y: 0,
          yPercent: 0,
          x: 0,
          xPercent: 0,
          scale: 1,
          clearProps: "clipPath",
        });
        if (photoClipRef.current) {
          gsap.set(photoClipRef.current, { clipPath: "inset(0% 0 0 0)" });
        }
        if (photoImageTargetRef.current) {
          gsap.set(photoImageTargetRef.current, { scale: 1, yPercent: 0 });
        }
      });

      // ── Standard Entrance Animation Synced with loader:reveal ──────────────
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const isSkipLoader = document.documentElement.classList.contains("skip-loader");
        const speed = isSkipLoader ? 0.6 : 1.0;

        const masterTl = gsap.timeline({
          paused: true,
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        });

        // 1. Headline: masked rise from yPercent 110 to 0, duration 0.9s, ease expo.out
        const headlineLines = section.querySelectorAll("[data-hero-reveal='headline']");
        if (headlineLines.length) {
          masterTl.fromTo(
            headlineLines,
            { yPercent: 110, autoAlpha: 1 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.9 * speed,
              ease: "expo.out",
              stagger: 0.09 * speed,
              clearProps: "transform,yPercent",
            },
            0
          );
        }

        // 3. Subtitle: masked rise from yPercent 110 to 0, starting 0.15s after headline
        const subtitleEls = section.querySelectorAll("[data-hero-reveal='subtitle']");
        if (subtitleEls.length) {
          masterTl.fromTo(
            subtitleEls,
            { yPercent: 110, autoAlpha: 1 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.9 * speed,
              ease: "expo.out",
              stagger: 0.09 * speed,
              clearProps: "transform,yPercent",
            },
            0.15 * speed
          );
        }

        // 4. Hero photo: wipes upward via clip-path, inner image settles from scale 1.08 / yPercent 4
        const photoStart = 0.1 * speed;
        if (photoClipRef.current && photoImageTargetRef.current) {
          masterTl.fromTo(
            photoClipRef.current,
            { clipPath: "inset(100% 0 0 0)", autoAlpha: 1 },
            {
              clipPath: "inset(0% 0 0 0)",
              autoAlpha: 1,
              duration: 1.1 * speed,
              ease: "expo.out",
            },
            photoStart
          );

          masterTl.fromTo(
            photoImageTargetRef.current,
            { scale: 1.08, yPercent: 4 },
            {
              scale: 1,
              yPercent: 0,
              duration: 1.1 * speed,
              ease: "expo.out",
              clearProps: "transform,scale,yPercent",
            },
            photoStart
          );
        }

        // 5. Floating elements (social icons): y 32 to 0 and autoAlpha 0 to 1, starting ~0.3s after photo starts
        const floatingStart = photoStart + 0.3 * speed;
        const floatingEls = section.querySelectorAll("[data-hero-reveal='floating']");
        const socialsContainer = section.querySelector("[data-hero-reveal='socials-container']");

        if (socialsContainer) {
          masterTl.fromTo(
            socialsContainer,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 0.8 * speed,
              ease: "expo.out",
            },
            floatingStart
          );
        }

        if (floatingEls.length) {
          masterTl.fromTo(
            floatingEls,
            { y: 32, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8 * speed,
              ease: "expo.out",
              stagger: 0.07 * speed,
              clearProps: "transform,y",
            },
            floatingStart
          );
        }

        // 6. CTA bar: y 24 to 0 and autoAlpha 0 to 1, last
        if (ctaDockRef.current) {
          const ctaStart = 0.75 * speed;
          masterTl.fromTo(
            ctaDockRef.current,
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8 * speed,
              ease: "expo.out",
              clearProps: "transform,y",
            },
            ctaStart
          );
        }

        const playEntrance = () => {
          masterTl.play();
        };

        if (isSkipLoader || !document.documentElement.classList.contains("is-loading")) {
          playEntrance();
        } else {
          window.addEventListener("loader:reveal", playEntrance, { once: true });
        }

        return () => {
          window.removeEventListener("loader:reveal", playEntrance);
          masterTl.kill();
        };
      });
    },
    { scope: sectionRef }
  );

  // Apply disperse-only scatter parallax to floating elements and photo
  useBentoScatter(sectionRef, {
    gather: false,
    disperse: true,
    spread: 0.6,
  });

  return (
    <section
      ref={sectionRef}
      data-grid="hero"
      data-theme={theme}
      aria-label="Anas Alam — portfolio introduction"
      className="theme-transition relative h-[100svh] min-h-[680px] w-full overflow-hidden"
      style={{
        background: "var(--canvas)",
        color: "var(--foreground)",
      }}
    >
      {/* ── Background Layer 1: Subtle Grid Lines ─────────────────────────── */}
      <div
        aria-hidden="true"
        className="theme-transition pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Background Layer 2: Soft Warm Radial Glow behind subject ───────── */}
      <div
        aria-hidden="true"
        className="theme-transition pointer-events-none absolute left-1/2 top-[44%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-35"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
        }}
      />

      {/* ── Subtle Monumental Display Name in Instrument Serif (z-10) ──────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 select-none whitespace-nowrap text-center font-serif leading-none tracking-tight opacity-[0.05] md:bottom-12 md:opacity-[0.06]"
        style={{
          fontSize: "clamp(5rem, 16vw, 14rem)",
          color: "var(--foreground)",
        }}
      >
        ANAS ALAM
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TOP CENTERED HEADLINE HIERARCHY — z-30
          Avoids collision with photo head by controlled padding & font scaling
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={headingAreaRef}
        className="absolute inset-x-0 top-16 md:top-0 z-30 flex flex-col items-center px-4 pt-18 md:pt-22"
      >
        {/* H1 Headline — DM Sans + Instrument Serif italic emphasis */}
        <h1
          className="flex mt-8 md:mt-10 items-center justify-center text-center font-bold tracking-tight leading-none"
          style={{ fontSize: "clamp(2.5rem, 6.2vw, 4.85rem)" }}
        >
          <span className="block overflow-hidden py-1">
            <span
              data-hero-reveal="headline"
              className="inline-block will-change-transform font-sans"
              style={{ color: "var(--foreground)" }}
            >
              hi, <span className="text-accent">anas</span> here.
            </span>
          </span>
        </h1>

        {/* Subtitle in DM Sans (Font size >= 12px) */}
        <div className="overflow-hidden mt-3 py-0.5">
          <p
            data-hero-reveal="subtitle"
            className="theme-transition font-sans text-center text-sm md:text-base font-medium inline-block will-change-transform"
            style={{ color: "var(--muted)" }}
          >
            Full-Stack Developer based in Ranchi, India
          </p>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CENTER CUTOUT PHOTO — z-20, bottom-anchored
          Outer div handles layout centering without GSAP interference.
          Inner div handles GSAP scroll scale and entrance motion.
          Capped height ensures photo never upscales past native resolution.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={photoWrapperRef}
        className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[68svh] sm:h-[76svh] lg:h-[90svh] -translate-x-1/2 max-h-[1050px]"
        style={{
          aspectRatio: "1024 / 1536",
        }}
      >
        <div
          ref={photoClipRef}
          data-hero-reveal="photo"
          className="relative h-full w-full will-change-transform overflow-hidden"
          style={{ clipPath: "inset(100% 0 0 0)" }}
        >
          <div
            ref={photoInnerRef}
            data-tile
            data-depth="1.3"
            data-scatter-x="0"
            className="relative h-full w-full will-change-transform"
          >
            <div ref={photoImageTargetRef} className="h-full w-full will-change-transform">
              <Image
                src="/images/profile.png"
                alt="Portrait of Anas Alam"
                width={1024}
                height={1536}
                priority
                quality={95}
                className="h-full w-full object-contain object-bottom"
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 58vw, 48vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BOTTOM CONTROLS CLUSTER — z-40
          - Row 1: "Find Me On" buttons (slides in from left)
          - Row 2: "View Projects" & "Download Resume" dock (slides in from right)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="pointer-events-none absolute bottom-5 left-0 right-0 z-40 flex flex-col items-center gap-2.5 px-4 md:bottom-8">
        {/* Socials Row */}
        <div
          ref={socialsRowRef}
          data-hero-reveal="socials-container"
          className="pointer-events-auto theme-transition inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 shadow-md will-change-transform"
          style={{
            border: "1px solid var(--dock-border)",
          }}
        >
          <div className="flex items-center gap-1.5">
            {SOCIAL_LINKS.map(({ name, href, label, isExternal }) => (
              <div
                key={name}
                data-hero-reveal="floating"
                className="inline-flex will-change-transform"
              >
                <SocialButton
                  href={href}
                  label={label}
                  isExternal={isExternal}
                >
                  {name === "GitHub" && <GitHubIcon />}
                  {name === "LinkedIn" && <LinkedInIcon />}
                  {name === "Email" && <MailIcon />}
                </SocialButton>
              </div>
            ))}
          </div>
        </div>

        {/* Floating CTA Dock */}
        <div
          ref={ctaDockRef}
          data-hero-reveal="cta"
          className="pointer-events-auto theme-transition inline-flex items-center gap-1 rounded-full p-1.5 shadow-xl will-change-transform"
          style={{
            background: "var(--dock-bg)",
            border: "1px solid var(--dock-border)",
          }}
        >
          {/* Primary Action: View Projects */}
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#projects");
            }}
            className="group pressable focus-ring font-sans inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold shadow-sm transition-opacity hover:opacity-95 md:px-7 md:py-3 md:text-sm"
            style={{
              background: "var(--cta-primary-bg)",
              color: "var(--cta-primary-text)",
            }}
          >
            <span>View Projects</span>
            <span
              className="group-hover:translate-x-1 transition-translate duration-200 flex h-5 w-5 items-center justify-center rounded-full"
              style={{
                background: "rgba(0,0,0,0.12)",
                color: "var(--cta-primary-text)",
              }}
              aria-hidden="true"
            >
              <ArrowRightIcon className="h-3 w-3" />
            </span>
          </a>

          {/* Secondary Action: Download Resume */}
          <a
            href="/Anas_Alam_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download Anas Alam's résumé (PDF)"
            className="pressable focus-ring theme-transition font-sans inline-flex items-center rounded-full px-6 py-2.5 text-xs font-bold transition-colors md:px-7 md:py-3 md:text-sm"
            style={{
              background: "var(--cta-secondary-bg)",
              color: "var(--cta-secondary-text)",
              border: "1px solid var(--cta-secondary-border)",
            }}
          >
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}
