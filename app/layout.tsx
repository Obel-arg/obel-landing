import type { Metadata } from "next";
import { Instrument_Serif, Inter, Press_Start_2P } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PixelTransition } from "@/components/motion/PixelTransition";
import { RouteTransition } from "@/components/motion/RouteTransition";
import { ContactModal } from "@/components/ui/ContactModal";
import { Agentation } from "agentation";
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

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
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
        className={`${instrumentSerif.variable} ${inter.variable} ${pressStart2P.variable} ${GeistMono.variable} antialiased`}
      >
        <PixelTransition />
        <RouteTransition />
        <ContactModal />
        <Header />
        <SmoothScroll>{children}</SmoothScroll>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
