export interface Project {
  id: number;
  slug: string;
  company: string;
  title: string;
  year: string;
  description: string;
  longDescription: string;
  services: string[];
  link?: string;
  image: string;
  images: string[];
}

const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "hang",
    company: "Hang",
    title: "Brand Identity & Web Platform",
    year: "2025",
    description:
      "Complete brand overhaul and digital platform for a leading tech company.",
    longDescription:
      "When this call came, we knew one thing: it was time to release the beast. A full-throttle sprint where every move had to match the scale of millions watching—and buying. No second chances, no half-measures.\n\nWe built an e-commerce experience engineered for high-traffic, high-stakes drops, ensuring every fan could snag their piece without breaking the internet.\n\nWe built an experience that hit hard, moved fast, and kept the crowd on their toes. This one snagged our first Webby, our trophy for making the internet a little wilder.",
    services: ["Brand Strategy", "Visual Identity", "Web Development"],
    image: "/images/projects/project-1.jpg",
    images: [
      "/images/projects/project-1-a.jpg",
      "/images/projects/project-1-b.jpg",
      "/images/projects/project-1-c.jpg",
    ],
  },
  {
    id: 2,
    slug: "startupx",
    company: "StartupX",
    title: "Product Launch Campaign",
    year: "2025",
    description:
      "End-to-end product launch including brand positioning and digital experience.",
    longDescription:
      "From zero to launch in record time. We partnered with StartupX to define their brand voice, craft a visual identity that cuts through noise, and build the digital experience that would introduce them to the world.\n\nEvery pixel, every word, every interaction was designed to convert curiosity into commitment. The result: a launch that exceeded every metric they set.",
    services: ["Brand Strategy", "Campaign", "Digital Experience"],
    image: "/images/projects/project-2.jpg",
    images: [
      "/images/projects/project-2-a.jpg",
      "/images/projects/project-2-b.jpg",
      "/images/projects/project-2-c.jpg",
    ],
  },
  {
    id: 3,
    slug: "financehub",
    company: "FinanceHub",
    title: "Digital Transformation",
    year: "2024",
    description:
      "Modernizing the digital presence of a financial services firm.",
    longDescription:
      "FinanceHub needed more than a facelift—they needed a complete digital rethinking. We stripped away the corporate jargon and rebuilt their platform from the ground up with clarity, speed, and trust as the guiding principles.\n\nThe new experience puts users first, making complex financial tools feel intuitive and accessible. Clean interfaces, smart workflows, and a brand that finally matches the innovation behind the product.",
    services: ["UX Design", "Web Development", "Content Strategy"],
    image: "/images/projects/project-3.jpg",
    images: [
      "/images/projects/project-3-a.jpg",
      "/images/projects/project-3-b.jpg",
      "/images/projects/project-3-c.jpg",
    ],
  },
];

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
