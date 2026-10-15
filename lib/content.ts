/**
 * Application content definitions.
 * Centralizes copy, navigation links, and social metadata for the footer and site sections.
 */

export interface FooterNavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterNavColumn {
  title: string;
  links?: FooterNavLink[];
  text?: string[];
}

export interface FooterSocialLink {
  name: "LinkedIn" | "Twitter/X" | "Instagram";
  href: string;
  ariaLabel: string;
}

export const FOOTER_CONTENT = {
  tagline: "Full-stack developer building AI systems and fluid web applications.",
  notchLabel: "Open to internships",
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
        { label: "Twitter / X", href: "https://x.com/anasalam_xyz", external: true },
      ],
    },
    {
      title: "Status",
      text: [
        "Available for remote internships · 2025",
        "Ranchi, India (UTC+5:30)",
        "BCA (1st Year) · DSPMU Ranchi",
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
      name: "Twitter/X",
      href: "https://x.com/anasalam_xyz",
      ariaLabel: "Visit Anas Alam's Twitter / X profile",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/anasalam.xyz",
      ariaLabel: "Visit Anas Alam's Instagram profile",
    },
  ] as FooterSocialLink[],
  copyright: `© ${new Date().getFullYear()} Anas Alam. All rights reserved.`,
  backToTopLabel: "Back to top ↑",
};

