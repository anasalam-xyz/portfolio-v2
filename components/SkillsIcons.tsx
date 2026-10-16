"use client";

import React from "react";
import * as SVGL from "@ridemountainpig/svgl-react";
import { useTheme } from "@/hooks/use-theme";

/**
 * Dual-theme icon wrapper that renders ONLY ONE icon
 * based on the current theme (light or dark).
 * Guarantees only a single icon element exists in the DOM.
 */
export const DualThemeIcon: React.FC<{
  light: React.ReactNode;
  dark: React.ReactNode;
}> = ({ light, dark }) => {
  const { theme } = useTheme();
  return <>{theme === "dark" ? dark : light}</>;
};

/**
 * 18 technology icons for the Skills section sourced from svgl.
 */
export const SkillsIcons: Record<string, React.ReactNode> = {
  "Next.js": <SVGL.Nextjs />,
  "TypeScript": <SVGL.TypeScript />,
  "React": <DualThemeIcon light={<SVGL.ReactLight />} dark={<SVGL.ReactDark />} />,
  "Node.js": <SVGL.Nodejs />,
  "Express": <DualThemeIcon light={<SVGL.ExpressjsLight />} dark={<SVGL.ExpressjsDark />} />,
  "FastAPI": <SVGL.FastAPI />,
  "PostgreSQL": <SVGL.PostgreSQL />,
  "MongoDB": <DualThemeIcon light={<SVGL.MongoDBLight />} dark={<SVGL.MongoDBDark />} />,
  "MySQL": <DualThemeIcon light={<SVGL.MySQLLight />} dark={<SVGL.MySQLDark />} />,
  "Supabase": <SVGL.Supabase />,
  "Git": <SVGL.Git />,
  "GitHub": <DualThemeIcon light={<SVGL.GitHubLight />} dark={<SVGL.GitHubDark />} />,
  "Java": <SVGL.Java />,
  "Python": <SVGL.Python />,
  "JavaScript": <SVGL.JavaScript />,
  "HTML": <SVGL.HTML5 />,
  "CSS": <SVGL.CSS />,
  "Tailwind CSS": <SVGL.TailwindCSS />,
};
