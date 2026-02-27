"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { getAllProjects, type Project } from "@/lib/projects";

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
          <div className="relative aspect-[16/10] bg-foreground/5 rounded-sm overflow-hidden border border-foreground/10 transition-all duration-500 group-hover:border-foreground/25">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
        </div>

        {/* Project Info */}
        <div className="lg:w-1/2 xl:w-[45%] flex flex-col py-2 relative">
          {/* Clickable indicator */}
          <span
            aria-hidden="true"
            className="absolute top-2 right-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-foreground/15 text-foreground/40 font-sans font-light text-xl md:text-2xl leading-none pb-[1px] transition-all duration-300 group-hover:bg-foreground group-hover:border-foreground group-hover:text-background group-hover:scale-110"
          >
            +
          </span>
          <div>
            <span className="font-sans text-xs font-medium opacity-50 uppercase tracking-wider">
              {project.company}
            </span>
            <h3 className="mt-1 font-sans font-semibold text-[1.1rem] md:text-[1.4rem] lg:text-[1.775rem] tracking-tight">
              {project.title}
            </h3>
            <p className="mt-2 font-sans text-sm md:text-base opacity-50 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Problem & Solution — hidden on mobile */}
          <div className="hidden md:block mt-4 md:mt-6 space-y-6 md:space-y-8 max-w-full lg:max-w-[70%]">
            <div>
              <h4 className="font-sans font-semibold text-sm md:text-base">
                The problem:
              </h4>
              <p className="mt-1.5 font-sans text-sm md:text-base leading-relaxed opacity-60">
                {project.shortProblem}
              </p>
            </div>

            <div>
              <h4 className="font-sans font-semibold text-sm md:text-base">
                The Solution:
              </h4>
              <p className="mt-1.5 font-sans text-sm md:text-base leading-relaxed opacity-60">
                {project.shortSolution}
              </p>
            </div>
          </div>
        </div>
      </div>
    </TransitionLink>
  );
}

export function FeaturedProjects() {
  return (
    <section id="works" className="relative z-10 bg-background grid-layout !gap-y-0 py-20 md:py-24 lg:py-32">
      {PROJECTS.map((project, index) => {
        const isFirst = index === 0;
        const isShowcase = project.showcase;

        return (
          <div
            key={project.id}
            className={cn(
              "col-span-full bg-background sticky",
              isShowcase && "md:hidden"
            )}
            style={{
              zIndex: index + 1,
              top: isFirst
                ? 'var(--header-height)'
                : 'calc(var(--header-height) + clamp(76px, 10vw, 110px))',
            }}
          >
            {/* Title only in first card */}
            {isFirst && (
              <div className="pt-6 border-b border-foreground/10">
                <Reveal>
                  <h2 className="font-neuebit text-[2.5rem] md:text-[4rem] lg:text-[5.5rem] xl:text-[clamp(5.5rem,5.21vw,90px)] leading-[0.67] tracking-[-0.023em] pb-6">
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
