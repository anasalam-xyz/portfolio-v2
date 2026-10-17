"use client";

import * as React from "react";
import Image from "next/image";

export type ProjectImage = {
  src: string;      // path or imported asset URL
  alt: string;      // meaningful alt text
  width: number;    // intrinsic dimensions
  height: number;
};

export type Project = {
  id: string;                    // stable unique key, e.g. "roundone"
  title: string;
  description: string;           // short; the card clamps it
  techStack: string[];           // rendered as chips, in display order
  liveUrl?: string;              // hide the button if absent
  repoUrl?: string;              // hide the button if absent
  thumbnail: ProjectImage;       // fallback main image
  secondaryImage?: ProjectImage; // optional
  category?: string;             // optional editorial category
  year?: string;                 // optional release/development year
  images?: ProjectImage[];       // screenshots array
};

export type Projects = Project[];

export interface ProjectCardProps {
  project: Project;
  index: number;
  priority?: boolean;
}

const DARK_ESPRESSO_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMCAxMCc+PHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPScjMTIxMDBlJy8+PC9zdmc+";

export function ProjectCard({ project, index, priority = false }: ProjectCardProps) {
  const { title, description, techStack, liveUrl, repoUrl, category, year, thumbnail, secondaryImage } = project;
  const numberStr = String(index + 1).padStart(2, "0");
  const metaText = [category, year].filter(Boolean).join(" · ");

  // Exactly two photos: primary (thumbnail) and secondary (secondaryImage || images?.[1])
  const img1 = thumbnail || (project.images && project.images[0]);
  const img2 = secondaryImage || (project.images && project.images.length > 1 ? project.images[1] : undefined);

  return (
    <article
      data-project-card
      className="theme-transition relative w-[88vw] sm:w-[84vw] lg:w-[76vw] max-w-[1100px] shrink-0 select-none rounded-3xl border overflow-hidden shadow-xl flex flex-col"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TOP: Fixed-height Media Area with EXACTLY two photos & parallax
          - No buttons, badges, or overlays
          - Both photos sit inside overflow-hidden frames with matching height
          - Horizontal parallax at slightly different speeds
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="relative w-full h-[180px] sm:h-[220px] lg:h-[260px] shrink-0 overflow-hidden bg-[var(--surface-elevated)] border-b"
        style={{ borderColor: "var(--border)" }}
      >
        {img2 ? (
          // Two photos side-by-side with parallax
          <div className="shadow-lg flex gap-1 h-full w-full items-center">
            {/* Photo 1 (Primary): slightly wider frame */}
            <div className="relative h-full flex-[1.2] lg:flex-[1.25] overflow-hidden bg-[var(--surface)]">
              <div
                data-parallax="primary"
                className="relative h-full w-[120%] -left-[10%] will-change-transform"
              >
                <Image
                  src={img1.src}
                  alt={img1.alt}
                  fill
                  priority={priority}
                  loading={priority ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 45vw, 60vw"
                  placeholder="blur"
                  blurDataURL={DARK_ESPRESSO_BLUR}
                  className="object-cover object-top select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Photo 2 (Secondary): complementary frame */}
            <div className="relative h-full flex-1 overflow-hidden bg-[var(--surface)]">
              <div
                data-parallax="secondary"
                className="relative h-full w-[130%] -left-[15%] will-change-transform"
              >
                <Image
                  src={img2.src}
                  alt={img2.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 35vw, 40vw"
                  placeholder="blur"
                  blurDataURL={DARK_ESPRESSO_BLUR}
                  className="object-cover object-top select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        ) : (
          // Single photo fallback: fills 100% width with no gap
          <div className="relative h-full w-full overflow-hidden bg-[var(--surface)]">
            <div
              data-parallax="primary"
              className="relative h-full w-[120%] -left-[10%] will-change-transform"
            >
              <Image
                src={img1.src}
                alt={img1.alt}
                fill
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 76vw, 88vw"
                placeholder="blur"
                blurDataURL={DARK_ESPRESSO_BLUR}
                className="object-cover object-top select-none pointer-events-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BOTTOM: Text Content Area (UNTOUCHED)
          - Label, "01" number, title, description, tech chips, Live/Source buttons
          - Normal padding below the buttons
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="relative w-full flex-1 p-5 sm:p-7 lg:p-8 flex flex-col justify-between overflow-hidden z-10 select-text"
        style={{
          background: "var(--surface)",
        }}
      >
        {/* Giant Outlined Number in Top-Right inside the panel (contained, clipped by overflow-hidden) */}
        <div
          data-parallax="number"
          className="absolute -top-3 sm:-top-5 -right-1 sm:right-4 z-0 pointer-events-none will-change-transform select-none"
        >
          <span
            aria-hidden="true"
            className="font-display font-bold text-6xl sm:text-8xl lg:text-9xl tracking-tighter leading-none block select-none opacity-40 sm:opacity-100"
            style={{
              color: "transparent",
              WebkitTextStroke: "1.5px color-mix(in srgb, var(--foreground) 25%, transparent)",
            }}
          >
            {numberStr}
          </span>
        </div>

        {/* Content Section */}
        <div className="relative z-10 space-y-1.5 sm:space-y-2.5">
          {metaText && (
            <p
              className="font-mono text-xs uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              {metaText}
            </p>
          )}

          {/* Project Title (Display Serif) */}
          <div data-parallax="title" className="will-change-transform">
            <h3
              className="font-display font-medium tracking-tight leading-[0.95]"
              style={{
                fontSize: "clamp(2.25rem, 4.5vw, 4.25rem)",
                color: "var(--foreground)",
              }}
            >
              {title}
            </h3>
          </div>

          {/* One-line Description */}
          <p
            className="font-sans text-xs sm:text-sm truncate max-w-[85%] lg:max-w-[70%] leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {description}
          </p>
        </div>

        {/* Bottom Row: Outlined Tech Pills & Action Buttons */}
        <div
          className="relative z-10 pt-3 sm:pt-4 flex flex-wrap items-center justify-between gap-3 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Outlined Tech-Tag Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full border bg-transparent font-medium"
                style={{
                  borderColor: "var(--border-strong)",
                  color: "var(--foreground)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons: View Live (amber-accent) & Source Code (outlined) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${title} live demo in a new tab`}
                className="group/btn pressable focus-ring inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 text-xs font-mono font-bold shadow-xs transition-opacity hover:opacity-95"
                style={{
                  background: "var(--accent)",
                  color: "var(--cta-primary-text, #181715)",
                }}
              >
                <span>View Live</span>
                <span className="text-[11px] transition-transform group-hover/btn:translate-x-0.5">↗</span>
              </a>
            )}

            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${title} source code on GitHub in a new tab`}
                className="group/btn pressable focus-ring inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 text-xs font-mono font-medium border transition-colors hover:border-[var(--accent)]"
                style={{
                  borderColor: "var(--border-strong)",
                  background: "var(--surface-elevated)",
                  color: "var(--foreground)",
                }}
              >
                <span>Source Code</span>
                <span className="text-[11px] transition-transform group-hover/btn:translate-x-0.5">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
