"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis, scrollToTarget } from "@/components/smooth-scroll";

interface FooterNavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterNavColumn {
  title: string;
  links?: FooterNavLink[];
  text?: string[];
}

interface FooterSocialLink {
  name: "LinkedIn" | "X" | "Instagram";
  href: string;
  ariaLabel: string;
}

const FOOTER_CONTENT = {
  notchLabel: "Something to Say ?",
  heading: "Let's build something extraordinary.",
  subheading:
    "Have a project in mind, an internship opportunity, or just want to say hi? Send me a message or copy my email directly.",
  email: "anasalam.xyz@gmail.com",
  navColumns: [
    {
      title: "Navigation",
      links: [
        { label: "Home", href: "#" },
        { label: "About", href: "#about" },
        { label: "Selected Work", href: "#projects" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "GitHub", href: "https://github.com/anasalam-xyz", external: true },
        { label: "LinkedIn", href: "https://linkedin.com/in/anasalam-xyz", external: true },
        { label: "Twitter / X", href: "https://x.com/anasalam_", external: true },
      ],
    },
    {
      title: "Status",
      text: [
        "Available for remote internships",
        "Ranchi, India (UTC+5:30)",
        "BCA (1st Year) at DSPMU Ranchi",
      ],
    },
  ] as FooterNavColumn[],
  socials: [
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/anasalam-xyz",
      ariaLabel: "Visit Anas Alam's LinkedIn profile",
    },
    {
      name: "X",
      href: "https://x.com/anasalam_",
      ariaLabel: "Visit Anas Alam's Twitter / X profile",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/anasalam_xyz",
      ariaLabel: "Visit Anas Alam's Instagram profile",
    },
  ] as FooterSocialLink[],
  copyright: `© ${new Date().getFullYear()} Anas Alam. All rights reserved.`,
  backToTopLabel: "Back to top ↑",
};

type FormStatus = "idle" | "loading" | "success" | "error";

export function Footer() {
  const footerRef = React.useRef<HTMLElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Form state
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [honeypot, setHoneypot] = React.useState("");
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [copied, setCopied] = React.useState(false);


  // Subtle reveal animation on scroll (composite-only, no layout shift)
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!cardRef.current) return;
        gsap.from(cardRef.current, {
          autoAlpha: 0,
          y: 28,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
          },
        });
      });
    },
    { scope: footerRef }
  );

  // Email clipboard copy with feedback
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(FOOTER_CONTENT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement("textarea");
      textarea.value = FOOTER_CONTENT.email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Back to top scroll handler
  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget(0);
  };

  // Stubbed submit handler simulating network delay and resolving UI states
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    // Client-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!message.trim()) {
      setStatus("error");
      setErrorMessage("Please enter a message before sending.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, _gotcha: honeypot }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "send failed");

      setStatus("success");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("Unable to send your message right now.");
    }
  };

  return (
    <footer
      id="footer"
      ref={footerRef}
      aria-label="Site footer and contact"
      className="theme-transition relative w-full pt-16 pb-8 overflow-hidden"
      style={{
        background: "var(--footer-bg)",
        color: "var(--footer-text)",
      }}
    >
      {/* ── Desktop & Mobile Top-Edge Stepped Chamfer Silhouette ─────────────── */}
      <style jsx>{`
        .footer-stepped-edge {
          /* Desktop: Low on left/right (48px down), raised in center with 48px 45-deg transitions */
          clip-path: polygon(
            0 48px,
            calc(50% - 280px) 48px,
            calc(50% - 232px) 0,
            calc(50% + 232px) 0,
            calc(50% + 280px) 48px,
            100% 48px,
            100% 100%,
            0 100%
          );
        }
        @media (max-width: 767px) {
          .footer-stepped-edge {
            /* Mobile: Simplified single notch in center with 20px 45-deg transitions */
            clip-path: polygon(
              0 20px,
              calc(50% - 60px) 20px,
              calc(50% - 40px) 0,
              calc(50% + 40px) 0,
              calc(50% + 60px) 20px,
              100% 20px,
              100% 100%,
              0 100%
            );
          }
        }

        .contact-card-chamfer {
          /* Inset card: chamfered corners with top-left notch tab */
          clip-path: polygon(
            0 20px,
            20px 0,
            160px 0,
            188px 28px,
            calc(100% - 20px) 28px,
            100% 48px,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            20px 100%,
            0 calc(100% - 20px)
          );
        }
        @media (max-width: 767px) {
          .contact-card-chamfer {
            /* Mobile inset card */
            clip-path: polygon(
              0 16px,
              16px 0,
              140px 0,
              164px 24px,
              calc(100% - 16px) 24px,
              100% 40px,
              100% calc(100% - 16px),
              calc(100% - 16px) 100%,
              16px 100%,
              0 calc(100% - 16px)
            );
          }
        }
      `}</style>

      {/* Decorative chamfer silhouette background container */}
      <div className="footer-stepped-edge absolute inset-0 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            1. INFO ROW ON DARK AREA
            Tagline/Logo on left + 2-3 Columns of Navigation on right
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="pt-8 pb-14 border-b-2" style={{ borderColor: "var(--footer-border)" }}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
            {/* Left Column: Brand & Tagline */}
            <div className="max-w-sm">
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-tight" style={{ color: "var(--footer-text)" }}>
                Anas Alam
              </span>
            </div>

            {/* Right Columns: Site navigation & status */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-mono">
              {FOOTER_CONTENT.navColumns.map((col) => (
                <div key={col.title} className="flex flex-col gap-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--footer-text)" }}>
                    {col.title}
                  </span>
                  {col.links && (
                    <ul className="space-y-2">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            {...(link.external
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                            className="transition-colors inline-flex items-center gap-1 focus-ring rounded-xs"
                            style={{ color: "var(--footer-muted)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--footer-text)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--footer-muted)")}
                            onClick={(e) => {
                              if (!link.external && link.href.startsWith("#")) {
                                e.preventDefault();
                                scrollToTarget(link.href);
                              }
                            }}
                          >
                            <span>{link.label}</span>
                            {link.external && <span className="text-[10px]">↗</span>}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  {col.text && (
                    <ul className="space-y-1.5 text-[11px] leading-relaxed" style={{ color: "var(--footer-muted)" }}>
                      {col.text.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            2. INSET CONTACT CARD ("LIGHT AREA" with flat color contrast)
            Chamfered silhouette with corner notch tab
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div ref={cardRef} className="my-14 will-change-transform">
          <div
            className="contact-card-chamfer relative w-full p-7 sm:p-12 transition-colors"
            style={{
              background: "var(--surface)",
              color: "var(--foreground)",
            }}
          >

            <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column: Big Wordmark Heading & Subheading */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full">
                <div>
                  <h3
                    className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-tight"
                    style={{ color: "var(--foreground)" }}
                  >
                    {FOOTER_CONTENT.heading}
                  </h3>
                  <p
                    className="mt-4 text-xs sm:text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {FOOTER_CONTENT.subheading}
                  </p>
                </div>

                {/* Email Copy Pill */}
                <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[11px] font-mono uppercase tracking-wider mb-2 text-[var(--muted)]">
                    Direct Email
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="group pressable focus-ring inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-mono border transition-all"
                    style={{
                      background: "var(--surface-elevated)",
                      borderColor: "var(--border-strong)",
                      color: "var(--foreground)",
                    }}
                    aria-label={`Copy email address ${FOOTER_CONTENT.email} to clipboard`}
                  >
                    <span className="font-medium">{FOOTER_CONTENT.email}</span>
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors"
                      style={{
                        background: copied ? "var(--accent)" : "var(--surface)",
                        color: copied ? "var(--cta-primary-text)" : "var(--accent)",
                      }}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column: Contact Form & Socials */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full">
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-4"
                  aria-label="Contact message form"
                >
                  {/* Hidden honeypot field (anti-spam) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="contact-honeypot">Do not fill this field</label>
                    <input
                      type="text"
                      id="contact-honeypot"
                      name="_gotcha"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5"
                      style={{ color: "var(--foreground)" }}
                    >
                      Your Email <span className="text-[var(--accent)]">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      disabled={status === "loading" || status === "success"}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      className="focus-ring w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-sans transition-colors disabled:opacity-60"
                      style={{
                        background: "var(--surface-elevated)",
                        borderColor: "var(--border-strong)",
                        color: "var(--foreground)",
                      }}
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-mono uppercase tracking-wider font-semibold mb-1.5"
                      style={{ color: "var(--foreground)" }}
                    >
                      Message <span className="text-[var(--accent)]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={3}
                      placeholder="Tell me about your project, idea, or role..."
                      value={message}
                      disabled={status === "loading" || status === "success"}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      className="placeholder:text-[var(--muted)] placeholder:opacity-70 focus-ring w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-sans transition-colors resize-none disabled:opacity-60"
                      style={{
                        background: "var(--surface-elevated)",
                        borderColor: "var(--border-strong)",
                        color: "var(--foreground)",
                      }}
                    />
                  </div>

                  {/* Form Live Feedback */}
                  <div
                    aria-live="polite"
                    className="min-h-[20px] text-xs font-mono transition-opacity"
                  >
                    {status === "error" && (
                      <div className="flex flex-wrap items-center gap-2" style={{ color: "var(--color-error)" }}>
                        <span>{errorMessage || "Submission failed."}</span>
                        <span>
                          Try emailing directly:{" "}
                          <a
                            href={`mailto:${FOOTER_CONTENT.email}`}
                            className="underline font-bold hover:opacity-80"
                          >
                            {FOOTER_CONTENT.email}
                          </a>
                        </span>
                      </div>
                    )}
                    {status === "success" && (
                      <p className="font-semibold flex items-center gap-1.5" style={{ color: "var(--color-success)" }}>
                        <span>✓</span> Message sent successfully! I&apos;ll get back to you shortly.
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between gap-4 pt-1">
                    <button
                      type="submit"
                      disabled={status === "loading" || status === "success"}
                      className="group pressable focus-ring inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-opacity hover:opacity-95 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      style={{
                        background: "var(--accent)",
                        color: "var(--cta-primary-text)",
                      }}
                    >
                      {status === "loading" ? (
                        <>
                          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          <span>Sending...</span>
                        </>
                      ) : status === "success" ? (
                        <span>Sent ✓</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <span className="transition-transform group-hover:translate-x-0.5">→</span>
                        </>
                      )}
                    </button>

                    {/* Social Icon Links */}
                    <div className="flex items-center gap-2">
                      {FOOTER_CONTENT.socials.map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.ariaLabel}
                          className="pressable focus-ring flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:scale-105"
                          style={{
                            background: "var(--surface-elevated)",
                            borderColor: "var(--border)",
                            color: "var(--foreground)",
                          }}
                        >
                          {social.name === "LinkedIn" && (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                              <rect width="4" height="12" x="2" y="9" />
                              <circle cx="4" cy="4" r="2" />
                            </svg>
                          )}
                          {social.name === "X" && (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          )}
                          {social.name === "Instagram" && (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            3. FINE PRINT
            Copyright notice and smooth back-to-top link
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono"
          style={{
            borderColor: "var(--footer-border)",
            color: "var(--footer-muted)",
          }}
        >
          <p>{FOOTER_CONTENT.copyright}</p>
          <a
            href="#"
            onClick={handleBackToTop}
            className="transition-colors focus-ring rounded-xs"
            style={{ color: "var(--footer-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--footer-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--footer-muted)")}
            aria-label="Scroll back to top of the page"
          >
            {FOOTER_CONTENT.backToTopLabel}
          </a>
        </div>
      </div>
    </footer>
  );
}

