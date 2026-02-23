export interface Project {
  id: number;
  slug: string;
  company: string;
  title: string;
  year: string;
  description: string;
  longDescription: string;
  problem: string;
  solution: string;
  services: string[];
  link?: string;
  image: string;
  images: string[];
  showcase?: boolean;
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
      "HANG connects brands and creators in a single platform where they can discover opportunities, apply with one click, manage deliverables, track progress and ensure content quality. By organizing the entire process — from matching to execution and performance — it professionalizes influencer marketing and brings visibility, efficiency and long-term collaboration to the ecosystem.",
    problem:
      "Influencer marketing is fragmented, inefficient and hard to scale. Brands struggle to find the right creators and manage campaigns, while creators waste time applying to opportunities that aren't a real fit.",
    solution:
      "HANG is a structured marketplace with intelligent matching, centralized campaign management and clear workflows — reducing friction and turning collaborations into a scalable, measurable system for brands and creators.",
    services: ["Brand Strategy", "Visual Identity", "Web Development"],
    image: "/images/projects/hang-cover.webp",
    images: [
      "/images/projects/hang-wordmark.webp",
      "/images/projects/hang1.webp",
      "/images/projects/hang2.webp",
    ],
  },
  {
    id: 2,
    slug: "iusports",
    company: "iuSports",
    title: "App Design & Development",
    year: "2026",
    description:
      "Full-cycle mobile app design and development for a sports technology platform.",
    longDescription:
      "iuSports is a platform that allows amateur players and teams to watch their recorded matches, clip their best plays and goals, and easily share them on social media or within the app. At the same time, it centralizes the entire game experience: booking fields, building teams, challenging others, and competing in a digital environment that combines video, community, and management. It brings a professional-level experience to everyday sports, focusing on enjoyment, visibility, and connection between people.",
    problem:
      "Amateur sports run on passion, but operations, video and performance tracking are still manual, fragmented and hard to scale.",
    solution:
      "iuSports automates recording, highlights, analytics and management in one platform — bringing professional tools and visibility to the amateur ecosystem.",
    services: ["UX Design", "App Development", "Brand Identity"],
    image: "/images/projects/iusports-cover.webp",
    images: [
      "/images/projects/iusports-logos.webp",
      "/images/projects/iusports1.webp",
      "/images/projects/iusports2.webp",
    ],
  },
  {
    id: 3,
    slug: "bizarrap",
    company: "Bizarrap",
    title: "Visual Identity & Digital Experience",
    year: "2026",
    // TODO(human): Replace these placeholders with real Bizarrap project content
    description:
      "Placeholder description for the Bizarrap project.",
    longDescription:
      "Placeholder long description for the Bizarrap project.",
    problem:
      "Placeholder problem statement for the Bizarrap project.",
    solution:
      "Placeholder solution statement for the Bizarrap project.",
    services: ["Visual Identity", "Web Development", "Digital Experience"],
    image: "/images/projects/bizarrap-screen.png",
    images: [],
    showcase: true,
  },
];

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
