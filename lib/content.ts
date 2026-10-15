/**
 * lib/content.ts — single source of truth for all text, links, and images
 * on https://anasalam.vercel.app
 *
 * RULES FOR CODING AGENTS
 * 1. Never hardcode copy, links, or image paths in components. Import from this file.
 * 2. Layout, section names, ordering, and which fields to show are free design choices.
 * 3. You may extract and add content as the design needs :
 *
 *    - Extract, shorten, or reformat existing text. Never change numbers, names, or meaning.
 *    - Add functional UI strings (nav labels, button text, aria-labels, section headings)
 *      to `ui`. Keep them plain and factual.
 *
 *    - New wording that adds NO new facts: hero headline, section intros, card blurbs,
 *      captions, transitions. Add it to `additions` with a `reason` and `derivedFrom`,
 *      and list every new entry in your final message so the owner can review it.
 *
 *    - Any new fact: numbers, metrics, achievements, awards, skills or technologies,
 *      dates, employers, testimonials, user counts, or claims about projects.
 *    - New projects, links, or images that are not already in this file.
 *    - If the design needs one of these, do not add it. Ask in your final message.
 *
 * 4. Images: use only entries in `images`, rendered with next/image at the given
 *    width and height. Never use stock photos, gradients, emoji, or "coming soon" boxes.
 *    If a non-optional file is missing from /public, stop and report it.
 *    If an image has `optional: true` and its file is missing, omit it and its container.
 *    If adding an image would genuinely enhance the UI, then add but inform.
 * 5. Empty fields: omit the element. Never render empty labels or placeholder text.
 * 6. Technologies are plain text (chips or lists). No technology logos or icon packs except the skills section.
 * 7. No phone number anywhere. External links open in a new tab with rel="noopener noreferrer".
 * 8. Respect prefers-reduced-motion for every animation.
 */

/* ----------------------------------------------------------------- types */

export interface ImageAsset {
  /** Path relative to /public */
  src: string;
  alt: string;
  width: number;
  height: number;
  optional?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  featured?: boolean;
  inProgress?: boolean;
  oneLiner: string;
  short: string;
  full: string;
  highlights: string[];
  stack: string[];
  links: { live?: string; github?: string };
  images: ImageAsset[];
}

export interface Achievement {
  title: string;
  organization?: string;
  summary: string;
  image?: ImageAsset;
}

/* ------------------------------------------------------------------ site */

export const site = {
  title: "Anas Alam — Full-Stack Developer",
  description:
    "First-year BCA student and full-stack developer building AI-powered web apps with Next.js, TypeScript, and PostgreSQL. Open to remote internships.",
  url: "https://anasalam.vercel.app",
  language: "en",
  ogImage: { src: "/images/og.png", width: 1200, height: 630, alt: "Anas Alam, full-stack developer" },
  favicon: "/icon.png",
  resumeHref: "/Anas_Alam_Resume.pdf",
} as const;

/* ---------------------------------------------------------------- person */

export const person = {
  name: "Anas Alam",
  role: "Full-stack developer",
  location: "Ranchi, Jharkhand, India",
  education: {
    degree: "BCA",
    institution: "Dr. Shyama Prasad Mukherjee University, Ranchi",
    status: "First year",
    expectedGraduation: "2029",
  },
  lookingFor: "Remote software engineering internships",
  email: "anasalam.xyz@gmail.com",
  mainStack: ["Next.js", "TypeScript", "PostgreSQL"],
} as const;

/* ---------------------------------------------------------------- images */

export const images = {
  profile: {
    src: "/images/profile.png",
    alt: "Portrait of Anas Alam",
    width: 1024,
    height: 1536,
  },
  roundoneLanding: {
    src: "/images/projects/roundone/landing.png",
    alt: "RoundOne landing page",
    width: 1920,
    height: 1200,
  },
  roundoneInterview: {
    src: "/images/projects/roundone/interview.png",
    alt: "RoundOne live interview screen",
    width: 1920,
    height: 1200,
  },
  roundoneResults: {
    src: "/images/projects/roundone/results.png",
    alt: "RoundOne results page with scores and feedback",
    width: 1920,
    height: 1200,
  },
  roundoneDashboard: {
    src: "/images/projects/roundone/dashboard.png",
    alt: "RoundOne dashboard showing session history",
    width: 1920,
    height: 1200,
  },
  worknestTasks: {
    src: "/images/projects/worknest/tasks.png",
    alt: "WorkNest task board",
    width: 1920,
    height: 1200,
  },
  worknestTeam: {
    src: "/images/projects/worknest/team.png",
    alt: "WorkNest team and task creation",
    width: 1920,
    height: 1200,
  },
  blogApiDocs: {
    src: "/images/projects/blog-api/docs.png",
    alt: "Blog API interactive documentation",
    width: 1920,
    height: 1200,
  },
  codeJam: {
    src: "/images/achievements/code-jam-2026.jpg",
    alt: "Code Jam 2026 certificate or newspaper feature",
    width: 1200,
    height: 800,
    optional: true,
  },
} as const satisfies Record<string, ImageAsset>;

/* ------------------------------------------------------------------- bio */

export const bio = {
  oneLiner:
    "First-year BCA student and full-stack developer building AI-powered web apps with Next.js, TypeScript, and PostgreSQL.",
  short:
    "I'm a first-year BCA student at Dr. Shyama Prasad Mukherjee University in Ranchi. I build full-stack web apps, including RoundOne, an AI mock interview platform that I built and deployed. I'm looking for a remote software engineering internship.",
  full: [
    "I'm a first-year BCA student at Dr. Shyama Prasad Mukherjee University in Ranchi. I build full-stack web apps, and my main project, RoundOne, is an AI mock interview platform that I built and deployed.",
    "Alongside projects, I practice data structures and algorithms in Java and have completed NeetCode 150. I take part in coding contests and hackathons, and in 2026 I won Code Jam at my university, ranking first in all three rounds.",
    "Right now I'm building a browser-based co-op platformer where two players share one level but each sees a different version of it, so they have to talk to get through.",
  ],
  bullets: [
    "First-year BCA student in Ranchi",
    "Builds full-stack web apps with Next.js, TypeScript, and PostgreSQL",
    "Completed NeetCode 150 in Java",
    "Won Code Jam 2026 at his university (rank 1 across all three rounds)",
    "Looking for a remote software engineering internship",
  ],
} as const;

/* ---------------------------------------------------------------- skills */

export const skills = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Java", "Python"] },
  { group: "Frontend", items: ["React", "Next.js (App Router)", "Tailwind CSS"] },
  {
    group: "Backend",
    items: ["Node.js", "Express", "FastAPI", "REST APIs", "JWT", "OAuth (Google, GitHub)", "Groq API"],
  },
  { group: "Databases and auth", items: ["PostgreSQL (Supabase, Neon)", "MongoDB", "Supabase Auth"] },
  { group: "Tools and platforms", items: ["Git", "GitHub", "Vercel", "Render"] },
] as const;

/* -------------------------------------------------------------- projects */

/* -------------------------------------------------------------- projects */

export const projects: Project[] = [
  {
    slug: "roundone",
    title: "RoundOne",
    featured: true,
    oneLiner: "An AI mock interview platform that adapts to your answers.",
    short:
      "An AI mock interview platform where the interviewer asks follow-up questions based on what you actually said. At the end, you get a score for every answer along with written feedback.",
    full: "RoundOne is a mock interview platform. You choose a role, experience level, interview type, and number of questions, then practice with an AI interviewer that asks follow-up questions based on what you actually said. When the session ends, you get a score for every answer, written feedback, strengths, weaknesses, and a final verdict.",
    highlights: [
      "Adaptive follow-up questions generated from your previous answers, with model responses typically taking 0.2–0.4 seconds using Groq",
      "Per-answer scores (0–100) with written feedback, plus strengths, weaknesses, and a verdict for every session",
      "Voice interview mode using the Web Speech API, with timing-based confidence and fluency signals, and resume for interrupted sessions",
      "Session history with score trends, and shareable public result links",
      "Cookie-based JWT auth with Google and GitHub sign-in through Supabase Auth, and row-level security on every database table",
      "7 API routes and 12 pages, including password reset and account deletion",
    ],
    stack: [
      "Next.js 15",
      "TypeScript",
      "Supabase (PostgreSQL)",
      "Groq API",
      "Tailwind CSS",
      "Vercel",
    ],
    links: {
      live: "https://getroundone.vercel.app/",
      github: "https://github.com/anasalam-xyz/RoundOne",
    },
    images: [
      images.roundoneLanding,
      images.roundoneInterview,
      images.roundoneResults,
      images.roundoneDashboard,
    ],
  },
  {
    slug: "worknest",
    title: "WorkNest",
    oneLiner: "A task management platform for teams.",
    short:
      "A MERN-stack platform where teams create, assign, and track tasks, with JWT authentication and per-user access control.",
    full: "WorkNest is a MERN-stack platform where teams create, assign, and track tasks across workflows. It has 10+ REST endpoints covering the task lifecycle and user management, a MongoDB schema designed around teams and tasks, and JWT-based authentication and authorization so each user only accesses their own data.",
    highlights: [
      "10+ REST endpoints covering the task lifecycle and user management",
      "MongoDB schema designed around teams and tasks",
      "JWT-based authentication and authorization",
    ],
    stack: [
      "React",
      "Node.js",
      "Express",
      "MongoDB Atlas",
      "Tailwind CSS",
    ],
    links: {
      live: "https://worknest-teams.vercel.app",
      github: "https://github.com/anasalam-xyz/worknest",
    },
    images: [
      images.worknestTasks,
      images.worknestTeam,
    ],
  },
  {
    slug: "blog-api",
    title: "Blog API",
    oneLiner: "A learning project: an async REST API built with FastAPI.",
    short:
      "A blog backend I built to learn modern Python backend development, using FastAPI, async SQLAlchemy 2.0, and JWT authentication on Neon PostgreSQL.",
    full: "A blog backend I built to learn modern Python backend development. It uses FastAPI with async SQLAlchemy 2.0, Pydantic v2, Alembic migrations, and JWT authentication on Neon PostgreSQL.",
    highlights: [],
    stack: [
      "FastAPI",
      "SQLAlchemy 2.0 (async)",
      "Pydantic v2",
      "Alembic",
      "PostgreSQL (Neon)",
      "JWT",
    ],
    links: {
      github: "https://github.com/anasalam-xyz/blog-api",
    },
    images: [images.blogApiDocs],
  },
  {
    slug: "coop-platformer",
    title: "Co-op Platformer",
    inProgress: true,
    oneLiner:
      "A two-player browser game where each player lives in a different version of the same level.",
    short:
      "A multiplayer co-op platformer built around communication. Both players share one level, but each sees and collides with a different version of it.",
    full: "A multiplayer co-op platformer built around communication. Both players share one level, but each sees and collides with a different version of it. A platform for one can be a gap for the other, so you have to describe what you see and trigger things for each other to reach the end. It uses an authoritative game server with client-side prediction.",
    highlights: [],
    stack: [
      "TypeScript",
      "Phaser 3",
      "Node.js",
      "WebSockets",
      "Tiled",
    ],
    links: {},
    images: [],
  },
];

/* ---------------------------------------------------------- achievements */

export const achievements: Achievement[] = [
  {
    title: "Code Jam 2026",
    organization: "Coders Hub Club, Dr. Shyama Prasad Mukherjee University",
    summary:
      "Rank 1 across all three rounds: debugging, AI image generation, and DSA. Featured in a newspaper.",
    image: images.codeJam,
  },
  {
    title: "NeetCode 150",
    summary: "Completed all 150 problems, solved in Java.",
  },
];

/* --------------------------------------------------------------- contact */

export const contact = {
  short: "Open to remote software engineering internships. Email is the fastest way to reach me.",
  full: "I'm looking for a remote software engineering internship. Email is the fastest way to reach me, and my GitHub and LinkedIn are linked below.",
  email: "anasalam.xyz@gmail.com",
  // No contact form.
} as const;

export const links = {
  github: "https://github.com/anasalam-xyz",
  linkedin: "https://www.linkedin.com/in/anasalam-xyz",
  email: "mailto:anasalam.xyz@gmail.com",
  resume: "/Anas_Alam_Resume.pdf",
  portfolio: "https://anasalam.vercel.app",
} as const;

/* -------------------------------------------------------------------- ui */
/* Plain functional strings: nav labels, button text, aria-labels. No facts. */

export const ui = {
  hero: {
    statusLabel: "Open to remote internships",
    statusAriaLabel: "Availability status: open to remote internships",
    scrollCta: "Explore work",
    resumeLabel: "View résumé",
    resumeAriaLabel: "Download Anas Alam's résumé (PDF)",
    viewWorkLabel: "View work",
    findMeOn: "Find Me On",
    openToWork: "Open to work",
  },
  nav: {
    work: "Work",
    about: "About",
    contact: "Contact",
    letsTalk: "Let's Talk",
    logoName: "Anas.",
  },
} as const;

/* ------------------------------------------------------------ additions */
/* New wording that adds NO new facts. Each entry includes reason + derivedFrom. */
/* Owner review required before shipping. */

export const additions = [
  {
    id: "hero-tagline",
    text: "Building AI-powered web apps with obsessive craft.",
    reason: "Hero headline — reformats the site description into a punchy active sentence for the Monolith hero layout.",
    derivedFrom: "site.description: 'building AI-powered web apps with Next.js, TypeScript, and PostgreSQL'",
  },
  {
    id: "hero-role-short",
    text: "Full-Stack Developer",
    reason: "Pill label — title-case version of person.role for visual display; no meaning changed.",
    derivedFrom: "person.role: 'Full-stack developer'",
  },
  {
    id: "hero-education-short",
    text: "BCA · DSPMU Ranchi",
    reason: "Pill micro-copy — compressed abbreviation of education fields for tight pill width.",
    derivedFrom: "person.education.degree + person.education.institution (abbreviated)",
  },
  {
    id: "hero-stack-pill",
    text: "Next.js · TS · PostgreSQL",
    reason: "Pill label — abbreviated version of person.mainStack for tight pill width.",
    derivedFrom: "person.mainStack: ['Next.js', 'TypeScript', 'PostgreSQL']",
  },
  {
    id: "hero-project-teaser",
    text: "Featured: RoundOne",
    reason: "Pill label pointing to featured project — derived from projects[0].title where featured === true.",
    derivedFrom: "projects[0].title where featured === true",
  },
  {
    id: "hero-subtitle",
    text: "Full-Stack Developer · Ranchi, India",
    reason: "Hero subtitle line combining role and location for display; no facts changed, just formatted.",
    derivedFrom: "person.role ('Full-stack developer') + person.location ('Ranchi, Jharkhand, India', abbreviated)",
  },
] as const;