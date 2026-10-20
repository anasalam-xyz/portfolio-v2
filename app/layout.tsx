import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, DM_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "Anas Alam",
  description:
    "Full-stack developer building AI-powered web apps with Next.js, TypeScript, and PostgreSQL.",
};

// Runs before first paint: decides whether the loader shows at all.
const loaderGate = `try{var s=sessionStorage.getItem("loader-seen"),r=matchMedia("(prefers-reduced-motion: reduce)").matches;document.documentElement.classList.add(s||r?"skip-loader":"is-loading")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderGate }} />
        <noscript>
          <style>{`#loader{display:none}[data-hero-reveal]{visibility:visible!important}[data-hero-reveal="photo"]{clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <SmoothScroll>
          <Loader />
          <Navbar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}