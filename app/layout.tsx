import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PixelTransition } from "@/components/motion/PixelTransition";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OBEL - AI-First Digital Studio",
  description:
    "OBEL is an AI-first digital studio and branding partner built for teams that move fast. We craft sharp identities and high-performing digital experiences.",
  keywords: [
    "digital studio",
    "branding",
    "AI",
    "design",
    "web development",
    "startup",
  ],
  authors: [{ name: "OBEL Labs LLC" }],
  openGraph: {
    title: "OBEL - AI-First Digital Studio",
    description:
      "We craft sharp identities and high-performing digital experiences.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${inter.variable} antialiased`}
      >
        <PixelTransition />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
