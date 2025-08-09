import "./globals.css";
import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { ThemeProvider } from "next-themes";

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
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="fixed top-4 right-4 z-50">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Pallav Bhardwaj - Resume.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-4 py-2 text-sm font-medium shadow hover:bg-accent transition card-hover no-tap-highlight"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v14" /><path d="m6 11 6 6 6-6" /><path d="M5 21h14" /></svg>
              View Resume
            </a>
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
