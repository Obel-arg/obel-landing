import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { Footer } from "@/components/layout/Footer";
import { PerspectiveTransition } from "@/components/motion/PerspectiveTransition";

// Placeholder to reserve space during dynamic import loading (prevents CLS)
const SectionPlaceholder = () => (
  <div style={{ minHeight: "50vh" }} aria-hidden />
);

// Below-fold sections — dynamic imports for bundle splitting (Rule: bundle-dynamic-imports)
const About = dynamic(
  () => import("@/components/sections/About").then((m) => m.About),
  { loading: SectionPlaceholder }
);
const FeaturedProjects = dynamic(
  () => import("@/components/sections/FeaturedProjects").then((m) => m.FeaturedProjects),
  { loading: SectionPlaceholder }
);
const Services = dynamic(
  () => import("@/components/sections/Services").then((m) => m.Services),
  { loading: SectionPlaceholder }
);
const ObelHub = dynamic(
  () => import("@/components/sections/ObelHub").then((m) => m.ObelHub),
  { loading: SectionPlaceholder }
);
const BizarapShowcase = dynamic(
  () => import("@/components/sections/BizarapShowcase").then((m) => m.BizarapShowcase),
  { loading: SectionPlaceholder }
);
export default function Home() {
  return (
    <main>
      <Hero />
      {/* Scroll anchor for #about — must be OUTSIDE PerspectiveTransition's sticky
          context, otherwise Lenis miscalculates position when sticky is active */}
      <div id="about" />
      <PerspectiveTransition
        section1={<About />}
        section2={<Services />}
      />
      <ObelHub />
      <BizarapShowcase />
      <FeaturedProjects />
      <Footer />
    </main>
  );
}
