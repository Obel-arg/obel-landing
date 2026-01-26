"use client";

import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { HEADER_HEIGHT } from "@/lib/constants";

// Title area height (title + padding)
const TITLE_AREA_HEIGHT = 110;

// Placeholder projects - replace with actual data
const PROJECTS = [
  {
    id: 1,
    company: "TechCorp",
    title: "Brand Identity & Web Platform",
    description:
      "Complete brand overhaul and digital platform for a leading tech company.",
    services: ["Brand Strategy", "Visual Identity", "Web Development"],
    image: "/images/projects/project-1.jpg",
  },
  {
    id: 2,
    company: "StartupX",
    title: "Product Launch Campaign",
    description:
      "End-to-end product launch including brand positioning and digital experience.",
    services: ["Brand Strategy", "Campaign", "Digital Experience"],
    image: "/images/projects/project-2.jpg",
  },
  {
    id: 3,
    company: "FinanceHub",
    title: "Digital Transformation",
    description:
      "Modernizing the digital presence of a financial services firm.",
    services: ["UX Design", "Web Development", "Content Strategy"],
    image: "/images/projects/project-3.jpg",
  },
];

function ProjectCard({ project }: { project: (typeof PROJECTS)[0] }) {
  return (
    <div className="bg-background py-4 border-t border-foreground/10">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Project Image - smaller, more compact */}
        <div className="lg:w-1/2 xl:w-[55%]">
          <div className="aspect-[16/10] bg-foreground/5 rounded-sm overflow-hidden border border-foreground/10">
            <div className="w-full h-full flex items-center justify-center text-foreground/30">
              <span className="font-sans text-sm">Preview Image</span>
            </div>
          </div>
        </div>

        {/* Project Info - compact */}
        <div className="lg:w-1/2 xl:w-[45%] flex flex-col justify-between py-2">
          <div>
            <span className="font-sans text-xs font-medium opacity-50 uppercase tracking-wider">
              {project.company}
            </span>
            <h3 className="mt-1 font-sans font-semibold text-xl md:text-2xl tracking-tight">
              {project.title}
            </h3>
            <p className="mt-2 font-sans text-sm md:text-base opacity-70 leading-relaxed line-clamp-2">
              {project.description}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.services.map((service) => (
              <span
                key={service}
                className="px-2 py-0.5 text-xs border border-foreground/15 rounded-full opacity-70"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedProjects() {
  return (
    <section id="works" className="below-fold grid-layout !gap-y-0">
      {PROJECTS.map((project, index) => {
        const isFirst = index === 0;

        return (
          <div
            key={project.id}
            className={cn(
              "col-span-full bg-background",
              "lg:sticky"
            )}
            style={{
              zIndex: index + 1,
              // First card sticks at header height (to show title above all cards)
              // Other cards stick below the title area
              top: isFirst ? HEADER_HEIGHT : HEADER_HEIGHT + TITLE_AREA_HEIGHT,
            }}
          >
            {/* Title only in first card - visible because other cards start below it */}
            {isFirst && (
              <div className="pt-6">
                <Reveal>
                  <h2 className="font-sans font-semibold text-4xl md:text-5xl lg:text-6xl tracking-tight pb-6">
                    Featured Projects
                  </h2>
                </Reveal>
              </div>
            )}
            <ProjectCard project={project} />
          </div>
        );
      })}
    </section>
  );
}
