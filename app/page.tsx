import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";

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
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((m) => m.Contact)
);
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <FeaturedProjects />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
