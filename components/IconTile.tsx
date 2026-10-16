import React, { ReactNode } from "react";

export interface IconTileProps {
  /** The SVG React component to render */
  icon: ReactNode;
  /** Accessible label for the icon (e.g., "Next.js") */
  label: string;
}

/**
 * Reusable tile for a technology icon.
 * - Outer container has [data-icon] for GSAP row-gravity scroll animations.
 * - Starts hidden (opacity: 0) in CSS to avoid flash before JS runs.
 * - Inner wrapper handles hover/focus transforms, borders, and shadows (never on [data-icon]).
 * - Displays a small monospaced tooltip on hover and keyboard focus.
 * - Accent color applied strictly on hover/focus.
 */
export const IconTile: React.FC<IconTileProps> = ({ icon, label }) => {
  return (
    <div
      data-icon
      className="skills-icon-item w-full flex items-center justify-center"
    >
      <div
        tabIndex={0}
        role="img"
        aria-label={label}
        className="group relative flex aspect-square w-full max-w-[124px] items-center justify-center rounded-2xl border p-4 sm:p-5 shadow-xs transition-all duration-200 outline-none select-none cursor-default
          focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:border-[var(--accent)]
          hover:border-[var(--accent)] hover:shadow-md hover:-translate-y-1"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        {/* Centered icon with gentle scale on tile hover */}
        <div className="relative h-9 w-9 sm:h-11 sm:w-11 flex items-center justify-center transition-transform duration-200 group-hover:scale-108">
          {icon}
        </div>

        {/* Small monospaced tooltip on hover and keyboard focus */}
        <div
          role="tooltip"
          aria-hidden="true"
          className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md px-2.5 py-1 text-[11px] font-mono font-medium tracking-tight whitespace-nowrap shadow-md transition-all duration-150 opacity-0 invisible translate-y-1
            group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
            group-focus-visible:opacity-100 group-focus-visible:visible group-focus-visible:translate-y-0 z-20"
          style={{
            background: "var(--surface-elevated)",
            color: "var(--foreground)",
            border: "1px solid var(--border-strong)",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};
