import "./globals.css";
import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Pallav Bhardwaj — Portfolio",
  description: "Payments, reliability, data — and playful DSA.",
  openGraph: { type: "website", title: "Pallav Bhardwaj", images: ["/api/og"] },
  twitter: { card: "summary_large_image", images: ["/api/og"] },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={interTight.variable}>{children}</body>
    </html>
  );
}
