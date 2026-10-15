import * as React from "react";

export interface TagPillProps {
  label: string;
  size?: "sm" | "md";
  className?: string;
  variant?: "outline" | "subtle";
}

/**
 * Reusable outlined tech stack / category pill.
 */
export function TagPill({
  label,
  size = "md",
  className = "",
  variant = "outline",
}: TagPillProps) {
  const sizeClasses =
    size === "sm"
      ? "px-2.5 py-0.5 text-[10px]"
      : "px-3.5 py-1 text-xs";

  const isOutline = variant === "outline";

  return (
    <span
      className={`theme-transition inline-flex items-center rounded-full font-mono font-medium shadow-2xs select-none ${sizeClasses} ${className}`}
      style={{
        background: isOutline ? "var(--tag-pill-bg)" : "var(--surface-elevated)",
        color: isOutline ? "var(--tag-pill-text)" : "var(--foreground)",
        border: isOutline ? "1px solid var(--tag-pill-border)" : "1px solid var(--border)",
      }}
    >
      {label}
    </span>
  );
}

