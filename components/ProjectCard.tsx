"use client";

import * as React from "react";
import Image from "next/image";
import { TagPill } from "@/components/TagPill";

export type ProjectImage = {
  src: string;      // path or imported asset URL
  alt: string;      // meaningful alt text
  width: number;    // intrinsic dimensions, to reserve space and avoid layout shift
  height: number;
};

export type Project = {
  id: string;                  // stable unique key, e.g. "roundone"
  title: string;
  description: string;         // short; the card clamps it to 2-3 lines
  techStack: string[];         // rendered as chips, in display order
  liveUrl?: string;            // hide the button if absent
  repoUrl?: string;            // hide the button if absent
  thumbnail: ProjectImage;     // required: the main image, and the only one shown on mobile
  secondaryImage?: ProjectImage; // optional: desktop only, falls back gracefully if absent
};

export type Projects = Project[];

export interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const { title, description, techStack, liveUrl, repoUrl, thumbnail, secondaryImage } = project;

  return (
    <article
      data-project-card
      className="theme-transition relative w-[88vw] sm:w-[85vw] lg:w-[80vw] max-w-[1100px] shrink-0 h-[560px] sm:h-[500px] lg:h-[480px] rounded-3xl border select-none overflow-hidden snap-center flex flex-col lg:flex-row"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MOBILE LAYOUT: Thumbnail on top (hidden on desktop)
          Shows single image only
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="lg:hidden relative h-[210px] sm:h-[230px] w-full shrink-0 overflow-hidden border-b border-[var(--border)]">
        <Image
          src={thumbnail.src}
          alt={thumbnail.alt}
          width={thumbnail.width}
          height={thumbnail.height}
          priority={priority}
          sizes="(max-width: 1024px) 88vw, 600px"
          className="h-full w-full object-cover object-top"
        />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          LEFT COLUMN (Desktop): Text, stack chips, and action buttons
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        data-parallax="text"
        className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden will-change-transform"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3
              className="font-bold text-2xl sm:text-3xl tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              {title}
            </h3>
          </div>

          {/* Short description clamped to 2-3 lines so cards maintain equal visual rhythm */}
          <p
            className="text-xs sm:text-sm leading-relaxed line-clamp-3"
            style={{ color: "var(--muted)" }}
          >
            {description}
          </p>

          {/* Tech Stack Chips */}
          <div className="pt-2 flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <TagPill key={tech} label={tech} size="sm" variant="subtle" />
            ))}
          </div>
        </div>

        {/* Action Buttons: Live and Repo Links (hidden without gap if absent) */}
        <div className="pt-6 border-t flex flex-wrap items-center gap-3" style={{ borderColor: "var(--border)" }}>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${title} live demo in a new tab`}
              className="group pressable focus-ring inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-mono font-bold shadow-xs transition-opacity hover:opacity-95"
              style={{
                background: "var(--accent)",
                color: "#FFFFFF",
              }}
            >
              <span>View Live</span>
              <span className="text-[11px] transition-transform group-hover:translate-x-0.5">↗</span>
            </a>
          )}

          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${title} source code on GitHub in a new tab`}
              className="group pressable focus-ring inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-mono font-medium border transition-colors hover:border-[var(--accent)]"
              style={{
                background: "var(--surface-elevated)",
                borderColor: "var(--border-strong)",
                color: "var(--foreground)",
              }}
            >
              <span>Source Code</span>
              <span className="text-[11px] transition-transform group-hover:translate-x-0.5">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          RIGHT COLUMN (Desktop only): Composed two-image layout with parallax frames
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="hidden lg:block relative w-[48%] h-full shrink-0 p-8 overflow-hidden bg-[var(--surface-elevated)]">
        {/* Primary/Large Image Frame (oversized by 15% for smooth scrubbed parallax) */}
        <div
          className={`relative h-full w-full rounded-2xl border overflow-hidden shadow-md ${
            secondaryImage ? "w-[84%] h-[82%]" : "w-full h-full"
          }`}
          style={{ borderColor: "var(--border-strong)" }}
        >
          <div
            data-parallax="primary"
            className="relative h-full w-[136%] -left-[18%] will-change-transform"
          >
            <Image
              src={thumbnail.src}
              alt={thumbnail.alt}
              width={thumbnail.width}
              height={thumbnail.height}
              priority={priority}
              sizes="(min-width: 1024px) 42vw, 600px"
              className="h-full w-full object-cover object-left-top"
            />
          </div>
        </div>

        {/* Secondary/Offset Image Frame (optional: desktop only, graceful fallback if absent) */}
        {secondaryImage && (
          <div
            className="absolute bottom-6 right-6 w-[56%] h-[54%] rounded-xl border overflow-hidden shadow-2xl z-10"
            style={{
              borderColor: "var(--border-strong)",
              background: "var(--surface)",
            }}
          >
            <div
              data-parallax="secondary"
              className="relative h-full w-[165%] -left-[32.5%] will-change-transform"
            >
              <Image
                src={secondaryImage.src}
                alt={secondaryImage.alt}
                width={secondaryImage.width}
                height={secondaryImage.height}
                priority={priority}
                sizes="(min-width: 1024px) 26vw, 400px"
                className="h-full w-full object-cover object-left-top"
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
