import type { Metadata, Viewport } from "next";
import { Instrument_Serif, DM_Sans, Quicksand } from "next/font/google";
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

const quicksand = Quicksand({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-quicksand",
});


const SITE_URL = "https://anasalam.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Anas Alam — Full-Stack Developer",
  description:
    "Anas Alam is a full-stack developer from Ranchi, India, building AI-powered web apps with Next.js, TypeScript and PostgreSQL. Open to remote internships.",
  keywords: [
    "Anas Alam",
    "full-stack developer",
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "portfolio",
  ],
  authors: [{ name: "Anas Alam", url: SITE_URL }],
  creator: "Anas Alam",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Anas Alam",
    title: "Anas Alam — Full-Stack Developer",
    description:
      "Full-stack developer building AI-powered web apps with Next.js, TypeScript and PostgreSQL.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anas Alam — Full-Stack Developer",
    description:
      "Full-stack developer building AI-powered web apps with Next.js, TypeScript and PostgreSQL.",
    creator: "@anasalam_",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#12100E" },
  ],
};

// Runs before first paint: decides whether the loader shows at all.
const loaderGate = `try{var s=sessionStorage.getItem("loader-seen"),r=matchMedia("(prefers-reduced-motion: reduce)").matches;document.documentElement.classList.add(s||r?"skip-loader":"is-loading")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${dmSans.variable} ${quicksand.variable} h-full antialiased`}
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