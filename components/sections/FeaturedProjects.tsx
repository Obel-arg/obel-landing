"use client";

import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { HEADER_HEIGHT } from "@/lib/constants";
import { getAllProjects, type Project } from "@/lib/projects";

// Title area height (title + padding)
const TITLE_AREA_HEIGHT = 110;

const PROJECTS = getAllProjects();

function ProjectCard({
  project,
  isFirst,
}: {
  project: Project;
  isFirst?: boolean;
}) {
  return (
    <TransitionLink
      href={`/projects/${project.slug}`}
      className={cn(
        "block bg-background py-4 group cursor-pointer",
        !isFirst && "border-t border-foreground/10"
      )}
    >
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Project Image */}
        <div className="lg:w-1/2 xl:w-[55%]">
          <div className="aspect-[16/10] bg-foreground/5 rounded-sm overflow-hidden border border-foreground/10 transition-all duration-500 group-hover:border-foreground/25">
            <div className="w-full h-full flex items-center justify-center text-foreground/30">
              <span className="font-sans text-sm">Preview Image</span>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="lg:w-1/2 xl:w-[45%] flex flex-col justify-between py-2">
          <div>
            <span className="font-sans text-xs font-medium opacity-50 uppercase tracking-wider">
              {project.company}
            </span>
            <h3 className="mt-1 font-sans font-semibold text-xl md:text-2xl tracking-tight group-hover:opacity-70 transition-opacity duration-300">
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
    </TransitionLink>
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
              top: isFirst
                ? HEADER_HEIGHT
                : HEADER_HEIGHT + TITLE_AREA_HEIGHT,
            }}
          >
            {/* Title only in first card */}
            {isFirst && (
              <div className="pt-6 border-b border-foreground/10">
                <Reveal>
                  <h2 className="font-serif font-normal text-4xl md:text-5xl lg:text-6xl tracking-tight pb-6">
                    Featured Projects
                  </h2>
                </Reveal>
              </div>
            )}
            <ProjectCard project={project} isFirst={isFirst} />
          </div>
        );
      })}
    </section>
  );
}
