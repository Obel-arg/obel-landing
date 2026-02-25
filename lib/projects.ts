export interface ProjectTool {
  name: string;
  icon: string;
}

export interface Project {
  id: number;
  slug: string;
  company: string;
  title: string;
  year: string;
  country: string;
  description: string;
  longDescription: string;
  problem: string;
  solution: string;
  services: string[];
  tools: ProjectTool[];
  link?: string;
  image: string;
  images: string[];
  showcase?: boolean;
}

const PROJECTS: Project[] = [
  {
    id: 3,
    slug: "bizarrap",
    company: "Bizarrap",
    title: "Visual Identity & Digital Experience",
    year: "2026",
    country: "Argentina",
    // TODO(human): Replace these placeholders with real Bizarrap project content
    description:
      "Placeholder description for the Bizarrap project.",
    longDescription:
      "Placeholder long description for the Bizarrap project.",
    problem:
      "Placeholder problem statement for the Bizarrap project.",
    solution:
      "Placeholder solution statement for the Bizarrap project.",
    link: "https://bizarrap.com",
    services: ["Visual Identity", "Web Development", "Digital Experience"],
    tools: [
      { name: "Illustrator", icon: "/images/tools/illustrator.svg" },
      { name: "Figma", icon: "/images/tools/figma.svg" },
      { name: "Slack", icon: "/images/tools/slack.svg" },
      { name: "Gemini", icon: "/images/tools/gemini.webp" },
    ],
    image: "/images/projects/bizarrap-screen.webp",
    images: [
      "/images/projects/biza.webp",
      "/images/projects/biza1.webp",
      "/images/projects/biza2.webp",
      "/images/projects/biza3.webp",
      "/images/projects/biza4.webp",
    ],
    showcase: true,
  },
  {
    id: 4,
    slug: "dale-play-live",
    company: "Dale Play Live",
    title: "CTO-as-a-Service & Platform Development",
    year: "2025",
    country: "Argentina",
    description:
      "Dale Play Live is the live events and production division of Dale Play, responsible for managing concerts, tours, and large-scale shows as the brand expands its footprint in the entertainment industry.",
    longDescription:
      "Dale Play Live is the live events and production division of Dale Play, responsible for managing concerts, tours, and large-scale shows as the brand expands its footprint in the entertainment industry.",
    problem:
      "As the division scaled, coordinating logistics, suppliers, budgets, and internal workflows across multiple simultaneous events became increasingly complex. Disconnected tools and manual processes limited visibility and made real-time decision-making difficult.",
    solution:
      "We partnered as their CTO-as-a-Service and designed a centralized platform that brings all live operational processes into one system. The solution unifies planning, scheduling, supplier management, and financial tracking — providing full operational visibility, stronger control, and a scalable tech foundation for growth.",
    services: ["CTO-as-a-Service", "Strategy & Custom Platform Development"],
    tools: [
      { name: "Illustrator", icon: "/images/tools/illustrator.svg" },
      { name: "Figma", icon: "/images/tools/figma.svg" },
      { name: "Slack", icon: "/images/tools/slack.svg" },
      { name: "Gemini", icon: "/images/tools/gemini.webp" },
    ],
    image: "/images/projects/dpl-cover.webp",
    images: [
      "/images/projects/dpl1.webp",
      "/images/projects/dpl2.webp",
      "/images/projects/dpl3.webp",
    ],
  },
  {
    id: 1,
    slug: "dale-play-records",
    company: "Dale Play Records",
    title: "CTO-as-a-Service & Platform Development",
    year: "2024",
    country: "Argentina",
    description:
      "Dale Play Records is the music label division within Dale Play, managing artists, releases, campaigns, and creative operations as it scales its catalog and team.",
    longDescription:
      "Dale Play Records is the music label division within Dale Play, managing artists, releases, campaigns, and creative operations as it scales its catalog and team.",
    problem:
      "As the label grew, manual workflows and scattered data created operational friction. Managing projects, assets, and teams across channels without a unified system limited efficiency and made scaling more difficult.",
    solution:
      "We provided a full CTO-as-a-Service engagement and built Malbec, a centralized platform that aggregates all label data and workflows in a single place. This solution streamlines project coordination, gives real-time visibility into operations, and allows the team to focus on creativity and releases without process bottlenecks.",
    services: ["CTO-as-a-Service", "Platform Development"],
    tools: [
      { name: "Illustrator", icon: "/images/tools/illustrator.svg" },
      { name: "Figma", icon: "/images/tools/figma.svg" },
      { name: "Slack", icon: "/images/tools/slack.svg" },
      { name: "Gemini", icon: "/images/tools/gemini.webp" },
    ],
    image: "/images/projects/dpr-cover.webp",
    images: [
      "/images/projects/dpr1.webp",
      "/images/projects/dpr2.webp",
      "/images/projects/dpr3.webp",
    ],
  },
  {
    id: 2,
    slug: "iusports",
    company: "iuSports",
    title: "App Design & Development",
    year: "2026",
    country: "Argentina",
    description:
      "Full-cycle mobile app design and development for a sports technology platform.",
    longDescription:
      "iuSports is a platform that allows amateur players and teams to watch their recorded matches, clip their best plays and goals, and easily share them on social media or within the app. At the same time, it centralizes the entire game experience: booking fields, building teams, challenging others, and competing in a digital environment that combines video, community, and management. It brings a professional-level experience to everyday sports, focusing on enjoyment, visibility, and connection between people.",
    problem:
      "Amateur sports run on passion, but operations, video and performance tracking are still manual, fragmented and hard to scale.",
    solution:
      "iuSports automates recording, highlights, analytics and management in one platform — bringing professional tools and visibility to the amateur ecosystem.",
    services: ["UX Design", "App Development", "Brand Identity"],
    tools: [
      { name: "Figma", icon: "/images/tools/figma.svg" },
      { name: "Slack", icon: "/images/tools/slack.svg" },
    ],
    image: "/images/projects/iusports-cover.webp",
    images: [
      "/images/projects/iusports-logos.webp",
      "/images/projects/iusports1.webp",
      "/images/projects/iusports2.webp",
    ],
  },
  {
    id: 5,
    slug: "dubbing-hits",
    company: "Dubbing Hits",
    title: "Custom Analytics Platform Development",
    year: "2025",
    country: "Global",
    description:
      "Dubbing Hits is a global music marketing company managing paid media campaigns for multiple artists across platforms and markets. As campaign volume and complexity increased, operational visibility became critical.",
    longDescription:
      "Dubbing Hits is a global music marketing company managing paid media campaigns for multiple artists across platforms and markets. As campaign volume and complexity increased, operational visibility became critical.",
    problem:
      "Campaign data across Meta, Google, TikTok, and other advertising platforms was fragmented. Performance tracking relied on manual reporting and disconnected dashboards, limiting real-time insights and making cross-artist analysis inefficient.",
    solution:
      "We designed and developed a custom platform that centralizes all paid media campaigns into a single system. The platform aggregates cross-platform performance data, unifies reporting across artists, and provides real-time visibility — enabling clearer insights and stronger operational control.",
    services: ["Custom Analytics Platform Development"],
    tools: [
      { name: "Illustrator", icon: "/images/tools/illustrator.svg" },
      { name: "Figma", icon: "/images/tools/figma.svg" },
      { name: "Slack", icon: "/images/tools/slack.svg" },
      { name: "Gemini", icon: "/images/tools/gemini.webp" },
    ],
    image: "/images/projects/dh-cover.webp",
    images: [
      "/images/projects/dh0.webp",
      "/images/projects/dh1.webp",
      "/images/projects/dh2.webp",
    ],
  },
  {
    id: 6,
    slug: "catchfluence",
    company: "Catch Fluence",
    title: "Custom Platform Development",
    year: "2025",
    country: "Global",
    description:
      "Catch Fluence is a platform built for brands managing influencer-driven paid media campaigns. It centralizes campaign execution, content management, and performance tracking across multiple creators and platforms.",
    longDescription:
      "Catch Fluence is a platform built for brands managing influencer-driven paid media campaigns. It centralizes campaign execution, content management, and performance tracking across multiple creators and platforms.",
    problem:
      "Brands running paid media with influencers faced fragmented workflows. Campaign creation, post approvals, boosting content, and tracking results were handled across different tools, creating operational friction and limited visibility.",
    solution:
      "We designed and developed a centralized platform that allows brands to create campaigns, link influencer posts, schedule content, and manage paid media from a single system. Catch Fluence unifies execution and performance tracking — giving brands full control over their influencer advertising operations.",
    services: ["Custom Platform Development"],
    tools: [
      { name: "Illustrator", icon: "/images/tools/illustrator.svg" },
      { name: "Figma", icon: "/images/tools/figma.svg" },
      { name: "Slack", icon: "/images/tools/slack.svg" },
      { name: "Gemini", icon: "/images/tools/gemini.webp" },
    ],
    image: "/images/projects/ca-cover.webp",
    images: [
      "/images/projects/ca0.webp",
      "/images/projects/ca1.webp",
      "/images/projects/ca2.webp",
    ],
  },
];

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
