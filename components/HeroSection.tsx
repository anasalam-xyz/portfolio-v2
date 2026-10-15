"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { person, images, links, ui, additions, achievements, projects } from "@/lib/content";

// ─── Content Helpers ──────────────────────────────────────────────────────────

function addition(id: string): string {
  return (additions as ReadonlyArray<{ id: string; text: string }>).find(
    (a) => a.id === id
  )?.text ?? "";
}

const firstAchievement = achievements[0]; // Code Jam 2026
const featuredProject = projects.find((p) => p.featured) ?? projects[0];

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

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

// ─── Social Circle Button ────────────────────────────────────────────────────
function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="social-btn focus-ring theme-transition relative inline-flex h-9 w-9 items-center justify-center rounded-full after:absolute after:-inset-1.5 after:content-['']"
      style={{
        background: "var(--social-btn-bg)",
        color: "var(--social-btn-text)",
        border: "1px solid var(--social-btn-border)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
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

// ─── Component ───────────────────────────────────────────────────────────────

export function HeroSection({ theme = "light" }: HeroSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const leftGroupRef = React.useRef<HTMLDivElement>(null);
  const rightGroupRef = React.useRef<HTMLDivElement>(null);
  const stampBadgeRef = React.useRef<HTMLDivElement>(null);
  const headingAreaRef = React.useRef<HTMLDivElement>(null);
  const photoRef = React.useRef<HTMLDivElement>(null);
  const ctaDockRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // ── Initial entrance animation ───────────────────────────────────────
      if (!prefersReduced) {
        // Heading block fades in
        gsap.from(headingAreaRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
        });

        // Photo rises gracefully from bottom
        gsap.from(photoRef.current, {
          opacity: 0,
          y: 40,
          duration: 1.0,
          ease: "power3.out",
          delay: 0.25,
        });

        // Left floating elements slide in
        gsap.from(leftGroupRef.current, {
          opacity: 0,
          x: -60,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.45,
        });

        // Right floating elements slide in
        gsap.from(rightGroupRef.current, {
          opacity: 0,
          x: 60,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.5,
        });

        // Stamp badge pops in with a slight spring
        gsap.from(stampBadgeRef.current, {
          opacity: 0,
          scale: 0.75,
          duration: 0.7,
          ease: "back.out(1.6)",
          delay: 0.55,
        });

        // CTA dock floats up
        gsap.from(ctaDockRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.6,
        });
      }

      // ── Scroll Animation: Elements slide outwards on scroll down ──────────
      // Reverses automatically on scroll up via scrub — stays 100% visible!
      if (!prefersReduced) {
        const scrollCfg = {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=650",
          scrub: 1.2,
        };

        // Left group slides OUT to the LEFT (stays fully visible)
        gsap.to(leftGroupRef.current, {
          x: -180,
          ease: "power1.out",
          scrollTrigger: scrollCfg,
        });

        // Right group slides OUT to the RIGHT (stays fully visible)
        gsap.to(rightGroupRef.current, {
          x: 180,
          ease: "power1.out",
          scrollTrigger: scrollCfg,
        });

        // Stamp badge slides OUT to the RIGHT & UP (stays fully visible)
        gsap.to(stampBadgeRef.current, {
          x: 0,
          y: -30,
          ease: "power1.out",
          scrollTrigger: scrollCfg,
        });

        // Cutout stays grounded with subtle parallax (no opacity drop)
        gsap.to(photoRef.current, {
          y: 0,
          scale: 1.5,
          ease: "power1.out",
          scrollTrigger: scrollCfg,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme={theme}
      aria-label={`Hero — ${person.name} portfolio introduction`}
      className="theme-transition relative h-[100svh] min-h-[680px] w-full overflow-hidden"
      style={{
        background: "var(--canvas)",
        color: "var(--foreground)",
      }}
    >
      {/* ── Subtle Background Grid Lines matching reference ───────────────── */}
      <div
        aria-hidden="true"
        className="theme-transition pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Soft Warm Glow behind subject ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="theme-transition pointer-events-none absolute left-1/2 top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
        }}
      />

      {/* ── Circular Watermark Motif behind cutout ────────────────────────── */}
      <div
        aria-hidden="true"
        className="theme-transition pointer-events-none absolute bottom-0 left-1/2 h-[580px] w-[580px] -translate-x-1/2 rounded-full border opacity-50"
        style={{
          borderColor: "var(--border)",
          background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 75%)",
        }}
      />

      {/* ── Monumental Display Name in Instrument Serif behind cutout (z-10) ─ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 select-none whitespace-nowrap text-center font-serif leading-none tracking-tight opacity-[0.06] md:bottom-14 md:opacity-[0.07]"
        style={{
          fontSize: "clamp(5rem, 17vw, 15rem)",
          color: "var(--foreground)",
        }}
      >
        {person.name.toUpperCase()}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TOP CENTERED HEADLINE HIERARCHY — z-30
          Status Pill → "I'm Anas Alam" (italic serif accent) → Subtitle
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={headingAreaRef}
        className="absolute inset-x-0 top-0 z-30 flex flex-col items-center px-4 pt-20 md:pt-24"
      >

        {/* H1 Headline — DM Sans + Instrument Serif italic emphasis */}
        <h1
          className="flex mt-12 items-center justify-center text-center font-bold tracking-tight leading-none"
          style={{ fontSize: "clamp(2.75rem, 6.8vw, 5.25rem)" }}
        >
          <span className="font-sans" style={{ color: "var(--foreground)" }}>
            I&apos;m&nbsp;Anas&nbsp;
          </span>
          <span
            className="font-serif italic font-normal tracking-normal"
            style={{ color: "var(--accent)" }}
          >
            Alam
          </span>
        </h1>

        {/* Subtitle (DM Sans) */}
        <p
          className="theme-transition font-sans mt-3 text-center font-medium"
          style={{
            fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
            color: "var(--muted)",
          }}
        >
          {addition("hero-subtitle") || "Full-Stack Developer based in Ranchi, India"}
        </p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CENTER CUTOUT PHOTO — z-20, bottom-anchored
          Enlarged by ~50% to dominate the hero stage, matching the reference photo scale.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={photoRef}
        className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[68svh] sm:h-[75svh] md:h-[86svh] lg:h-[92svh] -translate-x-1/2 will-change-transform max-h-[1050px]"
        style={{
          aspectRatio: `${images.profile.width} / ${images.profile.height}`,
        }}
      >
        <Image
          src={images.profile.src}
          alt={images.profile.alt}
          width={images.profile.width}
          height={images.profile.height}
          priority
          quality={95}
          className="h-full w-full object-contain object-bottom"
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 60vw, 52vw"
        />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LEFT FLOATING GROUP — z-30, desktop only
          "Follow Me On" + 4 Dark Social Buttons + Social Proof / Stat Card
          Slides OUT to the left on scroll down!
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={leftGroupRef}
        className="absolute z-30 hidden will-change-transform md:block"
        style={{
          left: "clamp(2rem, 6vw, 6.5rem)",
          top: "46%",
        }}
      >
        {/* "Follow Me On" label in DM Mono */}
        <p
          className="theme-transition font-mono text-[11px] font-medium uppercase tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          {ui.hero.findMeOn || "Follow Me On"}
        </p>

        {/* Circular dark buttons row */}
        <div className="mt-2.5 flex items-center gap-2">
          <SocialButton href={links.github} label="GitHub profile">
            <GitHubIcon />
          </SocialButton>
          <SocialButton href={links.linkedin} label="LinkedIn profile">
            <LinkedInIcon />
          </SocialButton>
          <SocialButton href={links.email} label="Email Anas Alam">
            <MailIcon />
          </SocialButton>
          <SocialButton href={links.portfolio} label="Portfolio link">
            <GlobeIcon />
          </SocialButton>
        </div>

        {/* Social Proof / Review-style Stat Card matching reference */}
        <div
          className="theme-transition mt-6 rounded-2xl border p-3.5 backdrop-blur-md shadow-xs max-w-[210px]"
          style={{
            background: "var(--pill-bg)",
            borderColor: "var(--pill-border)",
          }}
        >
          {/* Overlapping avatar circles in DM Mono (shrink-0 + isolate prevents clipping) */}
          <div className="flex items-center -space-x-2 font-mono isolate py-0.5 pl-0.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 ring-[var(--pill-bg)] bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200 text-[10px] font-bold shadow-2xs">
              TS
            </div>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 ring-[var(--pill-bg)] bg-stone-300 text-stone-900 dark:bg-stone-700 dark:text-stone-100 text-[10px] font-bold shadow-2xs">
              N15
            </div>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 ring-[var(--pill-bg)] bg-stone-400 text-stone-950 dark:bg-stone-600 dark:text-stone-100 text-[10px] font-bold shadow-2xs">
              R1
            </div>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-2 ring-[var(--pill-bg)] bg-stone-500 text-white dark:bg-stone-500 dark:text-white text-[10px] font-bold shadow-2xs">
              CJ
            </div>
          </div>

          {/* Rating / metric headline in DM Mono (neutral bold, no orange) */}
          <p className="theme-transition font-mono mt-2.5 text-xs font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
            150+ DSA Solved <span style={{ color: "var(--muted)" }}>(NeetCode)</span>
          </p>

          <p className="theme-transition font-mono mt-0.5 text-[11px] font-normal leading-tight" style={{ color: "var(--muted)" }}>
            Rank 1 Across All Rounds · Code Jam
          </p>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TOP-RIGHT ROTATING CIRCULAR STAMP BADGE — z-30, desktop only
          "OPEN TO WORK ★ HIRE ME ★" circular text with orange center arrow
          Slides OUT to the right & up on scroll down!
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={stampBadgeRef}
        className="absolute z-30 hidden will-change-transform md:block"
        style={{
          top: "16%",
          right: "clamp(2rem, 7vw, 7rem)",
        }}
      >
        <a
          href={links.email}
          aria-label="Open to work — contact Anas Alam"
          className="group focus-ring relative block h-[96px] w-[96px] rounded-full transition-transform hover:scale-105 active:scale-95"
        >
          {/* Rotating Text Ring SVG */}
          <svg
            className="animate-spin-slow absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <defs>
              <path
                id="stampTextPath"
                d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                fill="none"
              />
            </defs>
            <text
              fontSize="8.5"
              fontWeight="500"
              letterSpacing="2.8"
              fill="currentColor"
              className="theme-transition font-mono"
              style={{ color: "var(--foreground)" }}
            >
              <textPath href="#stampTextPath">
                ★ OPEN TO WORK ★ HIRE ME
              </textPath>
            </text>
          </svg>

          {/* Center Neutral Button with Right Arrow (no orange fill) */}
          <div
            className="theme-transition absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-transform group-hover:rotate-45"
            style={{
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          RIGHT FLOATING GROUP — z-30, desktop only
          Quote Mark + Tagline + Single Neutral Outlined Skill Cloud
          Slides OUT to the right on scroll down!
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={rightGroupRef}
        className="absolute z-30 hidden will-change-transform md:block"
        style={{
          right: "clamp(2rem, 6vw, 6.5rem)",
          top: "38%",
        }}
      >
        {/* Quote Block (Neutralized quote mark + DM Sans tagline) */}
        <div className="max-w-[230px] text-right">
          <span
            className="block font-serif text-5xl font-normal leading-none select-none opacity-60"
            style={{ color: "var(--muted)" }}
            aria-hidden="true"
          >
            “
          </span>
          <p
            className="theme-transition font-sans mt-0.5 text-[13px] font-normal leading-snug"
            style={{ color: "var(--foreground)" }}
          >
            {addition("hero-tagline") || "Building AI-powered web applications with obsessive craft!"}
          </p>
        </div>

        {/* Skill Tag Cloud: single neutral outlined style, no fills, sparkle chip removed */}
        <div className="mt-5 flex flex-col items-end gap-2">
          {/* Row 1: [Full-Stack] [Next.js 15] */}
          <div className="flex items-center gap-1.5 font-mono">
            <span
              className="theme-transition rounded-full px-3.5 py-1 text-xs font-medium backdrop-blur-sm shadow-2xs"
              style={{
                background: "var(--tag-pill-bg)",
                color: "var(--tag-pill-text)",
                border: "1px solid var(--tag-pill-border)",
              }}
            >
              Full-Stack
            </span>
            <span
              className="theme-transition rounded-full px-3.5 py-1 text-xs font-medium backdrop-blur-sm shadow-2xs"
              style={{
                background: "var(--tag-pill-bg)",
                color: "var(--tag-pill-text)",
                border: "1px solid var(--tag-pill-border)",
              }}
            >
              Next.js 15
            </span>
          </div>

          {/* Row 2: [AI Web Applications] (sparkle chip removed) */}
          <div className="flex items-center gap-1.5 font-mono">
            <span
              className="theme-transition rounded-full px-4 py-1 text-xs font-medium backdrop-blur-sm shadow-2xs"
              style={{
                background: "var(--tag-pill-bg)",
                color: "var(--tag-pill-text)",
                border: "1px solid var(--tag-pill-border)",
              }}
            >
              AI Web Applications
            </span>
          </div>

          {/* Row 3: [TypeScript] [PostgreSQL] */}
          <div className="flex items-center gap-1.5 font-mono">
            <span
              className="theme-transition rounded-full px-3.5 py-1 text-xs font-medium backdrop-blur-sm shadow-2xs"
              style={{
                background: "var(--tag-pill-bg)",
                color: "var(--tag-pill-text)",
                border: "1px solid var(--tag-pill-border)",
              }}
            >
              TypeScript
            </span>
            <span
              className="theme-transition rounded-full px-3.5 py-1 text-xs font-medium backdrop-blur-sm shadow-2xs"
              style={{
                background: "var(--tag-pill-bg)",
                color: "var(--tag-pill-text)",
                border: "1px solid var(--tag-pill-border)",
              }}
            >
              PostgreSQL
            </span>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BOTTOM CENTER DUAL-CTA DOCK — z-40
          Amber "View work" (dark text, no white on amber) + Neutral "Hire Me"
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={ctaDockRef}
        className="absolute bottom-6 left-0 right-0 z-40 flex items-center justify-center px-4 md:bottom-8"
      >
        <div
          className="theme-transition inline-flex items-center gap-1 rounded-full p-1.5 shadow-xl backdrop-blur-md"
          style={{
            background: "var(--dock-bg)",
            border: "1px solid var(--dock-border)",
          }}
        >
          {/* Left Orange Pill: Portfolio / View Work (dark text avoiding white on amber) */}
          <a
            href="#work"
            className="pressable focus-ring font-sans inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold shadow-sm transition-opacity hover:opacity-95 md:px-7 md:py-3 md:text-sm"
            style={{
              background: "var(--cta-primary-bg)",
              color: "var(--cta-primary-text)",
            }}
          >
            <span>{ui.hero.viewWorkLabel || "Portfolio"}</span>
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{
                background: "rgba(0,0,0,0.12)",
                color: "var(--cta-primary-text)",
              }}
              aria-hidden="true"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </a>

          {/* Right Secondary Pill: Hire Me / Résumé */}
          <a
            href={links.resume}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ui.hero.resumeAriaLabel}
            className="pressable focus-ring theme-transition font-sans inline-flex items-center rounded-full px-6 py-2.5 text-xs font-bold transition-colors md:px-7 md:py-3 md:text-sm"
            style={{
              background: "var(--cta-secondary-bg)",
              color: "var(--cta-secondary-text)",
              border: "1px solid var(--cta-secondary-border)",
            }}
          >
            {ui.hero.resumeLabel || "Hire Me"}
          </a>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MOBILE FLOATING ROW (below md) — z-30
          Shows compact socials & neutral featured badge
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute bottom-24 left-0 right-0 z-30 flex items-center justify-between px-5 md:hidden">
        <div className="flex gap-2">
          <SocialButton href={links.github} label="GitHub">
            <GitHubIcon />
          </SocialButton>
          <SocialButton href={links.linkedin} label="LinkedIn">
            <LinkedInIcon />
          </SocialButton>
        </div>

        <a
          href="#work"
          className="pressable focus-ring theme-transition font-mono inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium backdrop-blur-md"
          style={{
            background: "var(--tag-pill-bg)",
            borderColor: "var(--tag-pill-border)",
            color: "var(--tag-pill-text)",
          }}
        >
          <span style={{ color: "var(--muted)" }} aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </span>
          {featuredProject?.title || "Featured"}
        </a>
      </div>
    </section>
  );
}
