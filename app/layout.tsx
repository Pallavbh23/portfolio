import "./globals.css";
import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { ThemeProvider } from "next-themes";
import UpButton from "@/components/UpButton";

const heading = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Pallav Bhardwaj — Portfolio",
  description: "Payments, reliability, data — and playful DSA.",
  openGraph: { type: "website", title: "Pallav Bhardwaj", images: ["/og.png"] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className={`${heading.variable} ${sans.variable}`}>
      <body id="top">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-4 py-2 text-sm font-medium shadow hover:bg-accent transition card-hover no-tap-highlight"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" /><circle cx="12" cy="12" r="3" /></svg>
              View Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-indigo-600/90 text-white backdrop-blur px-4 py-2 text-sm font-medium shadow hover:bg-indigo-500 transition no-tap-highlight"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10v6a2 2 0 0 1-2 2H7l-4 4V6a2 2 0 0 1 2-2h5" /><path d="m16 2 6 6" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /></svg>
              Contact Me
            </a>
          </div>
          {children}
          <UpButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
