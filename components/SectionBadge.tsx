import * as React from "react";

export interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable uppercase mono badge for section headings (e.g. "Selected Work", "About Me").
 */
export function SectionBadge({ children, className = "" }: SectionBadgeProps) {
  return (
    <span
      className={`inline-block text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border mb-4 ${className}`}
      style={{
        borderColor: "var(--border-strong)",
        color: "var(--accent)",
        background: "var(--pill-bg)",
      }}
    >
      {children}
    </span>
  );
}

