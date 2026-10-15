"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useBentoScatter } from "@/hooks/use-bento-scatter";
import { TagPill } from "@/components/TagPill";
// Register plugins once at module level per GSAP best practices
gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Multiple-Entry Data Definitions ─────────────────────────────────────────
const SKILL_TAG_ROWS = [
  ["Next.js", "React"],
  ["Node.js", "Tailwind CSS"],
  ["TypeScript", "PostgreSQL"],
] as const;

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

function ArrowUpRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
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
  const photoInnerRef = React.useRef<HTMLDivElement>(null);
  const leftGroupRef = React.useRef<HTMLDivElement>(null);
  const rightGroupRef = React.useRef<HTMLDivElement>(null);
  const stampBadgeRef = React.useRef<HTMLDivElement>(null);
  const ctaDockRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ── Entrance Animations (Respects prefers-reduced-motion) ───────────────
      // Uses autoAlpha and xPercent/yPercent so properties NEVER collide with scroll tweens
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(headingAreaRef.current, {
          autoAlpha: 0,
          yPercent: 18,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
        });

        // Photo inner rises gracefully (outer wrapper handles layout centering)
        gsap.from(photoInnerRef.current, {
          autoAlpha: 0,
          yPercent: 12,
          duration: 1.0,
          ease: "power3.out",
          delay: 0.25,
        });

        // Left floating group slides in via xPercent
        gsap.from(leftGroupRef.current, {
          autoAlpha: 0,
          xPercent: -30,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.45,
        });

        // Right floating group slides in via xPercent
        gsap.from(rightGroupRef.current, {
          autoAlpha: 0,
          xPercent: 30,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.5,
        });

        // Stamp badge pops in via scale
        gsap.from(stampBadgeRef.current, {
          autoAlpha: 0,
          scale: 0.75,
          duration: 0.7,
          ease: "back.out(1.6)",
          delay: 0.55,
        });

        // CTA dock floats up via yPercent
        gsap.from(ctaDockRef.current, {
          autoAlpha: 0,
          yPercent: 25,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.6,
        });
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
          <span className="font-sans" style={{ color: "var(--foreground)" }}>
            I&apos;m&nbsp;Anas Alam
          </span>
          
        </h1>

        {/* Subtitle in DM Sans (Font size >= 12px) */}
        <p
          className="theme-transition font-sans mt-3 text-center text-sm md:text-base font-medium"
          style={{ color: "var(--muted)" }}
        >
          Full-Stack Developer based in Ranchi, India
        </p>
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
          ref={photoInnerRef}
          data-tile
          data-depth="1.3"
          data-scatter-x="0"
          className="relative h-full w-full will-change-transform"
        >
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LEFT FLOATING GROUP — z-30, desktop only (lg:block, hidden below 1024px)
          "Find Me On" + 3 Social Buttons (no self globe) + NeetCode 150 Stat Card
          No backdrop-blur to ensure 60fps compositor scroll performance
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={leftGroupRef}
        data-tile
        data-depth="1.1"
        className="absolute z-30 hidden will-change-transform lg:block"
        style={{
          left: "clamp(2rem, 6vw, 6.5rem)",
          top: "46%",
        }}
      >
        {/* "Find Me On" label in DM Mono (text-xs >= 12px) */}
        <p
          className="theme-transition font-mono text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          Find Me On
        </p>

        {/* Circular social buttons row (Email has no target="_blank") */}
        <div className="mt-2.5 flex items-left gap-2">
          {SOCIAL_LINKS.map(({ name, href, label, isExternal }) => (
            <SocialButton
              key={name}
              href={href}
              label={label}
              isExternal={isExternal}
            >
              {name === "GitHub" && <GitHubIcon />}
              {name === "LinkedIn" && <LinkedInIcon />}
              {name === "Email" && <MailIcon />}
            </SocialButton>
          ))}
        </div>

        {/*
        <div
          className="theme-transition mt-6 rounded-2xl border p-4 shadow-xs max-w-[220px]"
          style={{
            background: "var(--pill-bg)",
            borderColor: "var(--pill-border)",
          }}
        >
          <p
            className="theme-transition font-mono text-xs font-semibold leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {dsaAchievement.title}
          </p>
          <p
            className="theme-transition font-mono mt-1 text-xs font-normal leading-snug"
            style={{ color: "var(--muted)" }}
          >
            {dsaAchievement.summary}
          </p>

          <div
            className="mt-3 pt-2.5 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="theme-transition font-mono text-xs font-medium leading-tight"
              style={{ color: "var(--foreground)" }}
            >
              {contestAchievement.title}
            </p>
            <p
              className="theme-transition font-mono mt-0.5 text-xs font-normal leading-snug"
              style={{ color: "var(--muted)" }}
            >
              {contestAchievement.summary}
            </p>
          </div>
        </div>**/}
      </div> 

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TOP-RIGHT ROTATING CIRCULAR STAMP BADGE — z-30 (lg:block, hidden below 1024px)
          Text derived from person.lookingFor, textLength fills perimeter without gaps
          CSS spin respects motion-reduce:animate-none
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* <div
        ref={stampBadgeRef}
        className="absolute z-30 hidden will-change-transform lg:block"
        style={{
          top: "16%",
          right: "clamp(2rem, 7vw, 7rem)",
        }}
      >
        <a
          href="mailto:anasalam.xyz@gmail.com"
          aria-label="Open to work — contact Anas Alam"
          className="group focus-ring relative block h-[100px] w-[100px] rounded-full transition-transform hover:scale-105 active:scale-95"
        >
          <svg
            className="animate-spin-slow motion-reduce:animate-none absolute inset-0 h-full w-full"
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
              fontSize="7.8"
              fontWeight="600"
              fill="currentColor"
              className="theme-transition font-mono"
              style={{ color: "var(--foreground)" }}
            >
              <textPath
                href="#stampTextPath"
                textLength="226"
                lengthAdjust="spacing"
              >
                OPEN TO REMOTE INTERNSHIPS • AVAILABLE NOW • 
              </textPath>
            </text>
          </svg>

          <div
            className="theme-transition absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-transform group-hover:rotate-45"
            style={{
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            }}
          >
            <ArrowRightIcon />
          </div>
        </a>
      </div> */}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          RIGHT FLOATING GROUP — z-30, desktop only (lg:block, hidden below 1024px)
          Tagline (no quote mark, no "obsessive craft") + Outlined Skill Cloud
          No backdrop-blur on moving elements for smooth 60fps scrolling
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={rightGroupRef}
        data-tile
        data-depth="0.9"
        className="absolute z-30 hidden will-change-transform lg:block"
        style={{
          right: "clamp(2rem, 6vw, 6.5rem)",
          top: "40%",
        }}
      >
        {/* Tagline Block (clean DM Sans typography, no testimonial quote mark) */}
        <div className="max-w-[240px] text-right">
          <p
            className="theme-transition font-sans text-xs md:text-sm font-normal leading-relaxed"
            style={{ color: "var(--foreground)" }}
          >
            Building AI-powered web applications with Next.js, TypeScript, and PostgreSQL.
          </p>
        </div>

        {/* Skill Tag Cloud: Outlined neutral pills derived from mainStack and skills */}
        <div className="mt-5 flex flex-col items-end gap-2">
          {SKILL_TAG_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-1.5 font-mono">
              {row.map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BOTTOM CENTER DUAL-CTA DOCK — z-40
          Primary: View Projects -> #projects
          Secondary: Download Resume -> /Anas_Alam_Resume.pdf
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={ctaDockRef}
        className="absolute bottom-6 left-0 right-0 z-40 flex items-center justify-center px-4 md:bottom-8"
      >
        <div
          className="theme-transition inline-flex items-center gap-1 rounded-full p-1.5 shadow-xl"
          style={{
            background: "var(--dock-bg)",
            border: "1px solid var(--dock-border)",
          }}
        >
          {/* Primary Action: View Projects */}
          <a
            href="#projects"
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
              <ArrowRightIcon className="oh-3 w-3" />
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MOBILE FLOATING ROW (below lg: < 1024px) — z-30
          Shows compact socials & featured project pill without overlapping photo
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute bottom-24 left-0 right-0 z-30 flex items-center justify-between px-5 lg:hidden">
        <div className="flex gap-2">
          {SOCIAL_LINKS.map(({ name, href, label, isExternal }) => (
            <SocialButton
              key={name}
              href={href}
              label={label}
              isExternal={isExternal}
            >
              {name === "GitHub" && <GitHubIcon />}
              {name === "LinkedIn" && <LinkedInIcon />}
              {name === "Email" && <MailIcon />}
            </SocialButton>
          ))}
        </div>

        <a
          href="#projects"
          className="pressable focus-ring theme-transition font-mono inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium"
          style={{
            background: "var(--pill-bg)",
            borderColor: "var(--pill-border)",
            color: "var(--tag-pill-text)",
          }}
        >
          <span style={{ color: "var(--muted)" }} aria-hidden="true">
            <ArrowUpRightIcon />
          </span>
          <span>RoundOne</span>
        </a>
      </div>
    </section>
  );
}
