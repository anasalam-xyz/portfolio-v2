import * as React from "react";

interface FloatingPillProps {
  children: React.ReactNode;
  /** Make pill an anchor link */
  href?: string;
  target?: string;
  rel?: string;
  /** Additional Tailwind / CSS classes */
  className?: string;
  /** Passed through for GSAP targeting */
  "data-parallax-factor"?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

/**
 * Frosted ceramic pill for the hero floating labels.
 *
 * Design decisions:
 * - backdrop-blur + translucent fill → legible against any backdrop (corduroy jacket or warm canvas)
 * - 1px warm border for crispness
 * - scale(0.97) on :active → Emil Kowalski pressable feedback
 * - Hover gated behind (hover:hover) + (pointer:fine) → no sticky hover on touch
 */
export function FloatingPill({
  children,
  href,
  className = "",
  style,
  ...rest
}: FloatingPillProps) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 " +
    "text-xs font-mono font-medium leading-none " +
    "backdrop-blur-md select-none " +
    "border transition-transform duration-[160ms] " +
    "will-change-transform ";

  const pillStyle: React.CSSProperties = {
    background: "var(--pill-bg)",
    borderColor: "var(--pill-border)",
    color: "var(--foreground)",
    ...style,
  };

  if (href) {
    return (
      <a
        href={href}
        className={`${base} pressable cursor-pointer ${className}`}
        style={pillStyle}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <span
      className={`${base} cursor-default ${className}`}
      style={pillStyle}
      {...(rest as React.HTMLAttributes<HTMLSpanElement>)}
    >
      {children}
    </span>
  );
}
