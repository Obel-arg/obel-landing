import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { TransitionLink } from "@/components/ui/TransitionLink";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.company} — ${project.title} | OBEL`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main className="px-4 md:px-10 lg:px-16 pt-8 pb-24">
      {/* Back link */}
      <TransitionLink
        href="/#works"
        className="inline-flex items-center gap-2 font-sans text-sm opacity-50 hover:opacity-80 transition-opacity duration-300 mb-8"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M10 13L5 8L10 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to works
      </TransitionLink>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
        {/* Left sidebar */}
        <div className="lg:w-[280px] xl:w-[320px] lg:shrink-0 lg:sticky lg:top-[96px] lg:self-start">
          {/* Title */}
          <h1 className="font-serif font-normal text-4xl md:text-5xl lg:text-6xl tracking-tight mb-10">
            Featured projects
          </h1>

          {/* Metadata table */}
          <div className="space-y-5 mb-12">
            <div className="flex gap-8">
              <span className="font-sans text-sm md:text-base font-semibold w-20 shrink-0">
                Client
              </span>
              <span className="font-sans text-sm md:text-base">
                {project.company}
              </span>
            </div>
            <div className="flex gap-8">
              <span className="font-sans text-sm md:text-base font-semibold w-20 shrink-0">
                Year
              </span>
              <span className="font-sans text-sm md:text-base">
                {project.year}
              </span>
            </div>
            <div className="flex gap-8">
              <span className="font-sans text-sm md:text-base font-semibold w-20 shrink-0">
                Services
              </span>
              <span className="font-sans text-sm md:text-base">
                {project.services.join(", ")}
              </span>
            </div>
            <div className="flex gap-8">
              <span className="font-sans text-sm md:text-base font-semibold w-20 shrink-0">
                Link
              </span>
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm md:text-base hover:opacity-60 transition-opacity duration-300 underline"
                >
                  Visit site
                </a>
              ) : (
                <span className="font-sans text-sm md:text-base opacity-40">
                  —
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-sans text-2xl md:text-3xl font-semibold tracking-tight mb-4">
              Little description
            </h2>
            <div className="font-sans text-sm md:text-base leading-relaxed opacity-70 space-y-4">
              {project.longDescription.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Image gallery */}
        <div className="flex-1 min-w-0">
          {/* Top row: 2 images side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {project.images.slice(0, 2).map((img, i) => (
              <div
                key={i}
                className="aspect-[685/335] bg-foreground/5 border border-foreground/10 overflow-hidden"
              >
                <div className="w-full h-full flex items-center justify-center text-foreground/30">
                  <span className="font-sans text-sm font-semibold">
                    Preview image
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom: 1 large image */}
          {project.images[2] && (
            <div className="aspect-[1387/608] bg-foreground/5 border border-foreground/10 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-foreground/30">
                <span className="font-sans text-sm font-semibold">
                  Preview image
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
