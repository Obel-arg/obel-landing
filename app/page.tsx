import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { Footer } from "@/components/layout/Footer";

// Below-fold sections — dynamic imports for bundle splitting (Rule: bundle-dynamic-imports)
const About = dynamic(() =>
  import("@/components/sections/About").then((m) => m.About)
);
const FeaturedProjects = dynamic(() =>
  import("@/components/sections/FeaturedProjects").then(
    (m) => m.FeaturedProjects
  )
);
const Services = dynamic(() =>
  import("@/components/sections/Services").then((m) => m.Services)
);
const ObelHub = dynamic(() =>
  import("@/components/sections/ObelHub").then((m) => m.ObelHub)
);
export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <ObelHub />
      <FeaturedProjects />
      <Footer />
    </main>
  );
}
