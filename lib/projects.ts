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
    image: "/images/projects/hang.png",
    images: [
      "/images/projects/hang.png",
      "/images/projects/hang.png",
      "/images/projects/hang.png",
    ],
  },
  {
    id: 2,
    slug: "iusports",
    company: "iuSports",
    title: "App Design & Development",
    year: "2025",
    description:
      "Full-cycle mobile app design and development for a sports technology platform.",
    longDescription:
      "iuSports came to us with a vision: make sports tracking smarter, faster, and more intuitive. We took that vision and turned it into a product people actually want to use.\n\nFrom UX research to pixel-perfect design to native development, we owned every step. The result is an app that feels as sharp as the athletes who use it—fast, focused, and built to perform.",
    services: ["UX Design", "App Development", "Brand Identity"],
    image: "/images/projects/iusports.png",
    images: [
      "/images/projects/iusports.png",
      "/images/projects/iusports.png",
      "/images/projects/iusports.png",
    ],
  },
];

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
