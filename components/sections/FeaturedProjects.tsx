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
        <div className="lg:w-1/2 xl:w-[45%] flex flex-col justify-between py-2">
          <div>
            <span className="font-sans text-xs font-medium opacity-50 uppercase tracking-wider">
              {project.company}
            </span>
            <h3 className="mt-1 font-sans font-semibold text-[1.1rem] md:text-[1.4rem] lg:text-[1.775rem] tracking-tight group-hover:opacity-70 transition-opacity duration-300">
              {project.title}
            </h3>
            <p className="mt-2 font-sans text-sm md:text-base opacity-50 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Problem & Solution — separate child so justify-between pushes it to bottom */}
          <div className="mt-8 space-y-4">
            <div>
              <h4 className="font-sans font-semibold text-sm md:text-base underline underline-offset-4">
                The problem:
              </h4>
              <p className="mt-2 font-sans text-sm md:text-base leading-relaxed">
                {project.problem}
              </p>
            </div>

            <Image
              src="/images/obel-mark.svg"
              alt=""
              width={100}
              height={46}
              aria-hidden="true"
              className="w-10 h-auto -scale-x-100"
            />

            <div>
              <h4 className="font-sans font-semibold text-sm md:text-base underline underline-offset-4">
                The Solution:
              </h4>
              <p className="mt-2 font-sans text-sm md:text-base leading-relaxed">
                {project.solution}
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
    <section id="works" className="below-fold grid-layout !gap-y-0">
      {PROJECTS.map((project, index) => {
        const isFirst = index === 0;

        return (
          <div
            key={project.id}
            className={cn(
              "col-span-full bg-background",
              "sticky"
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
