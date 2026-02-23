import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ProjectAccordion } from "@/components/ui/ProjectAccordion";
import { ShareButton } from "@/components/ui/ShareButton";
import { Footer } from "@/components/layout/Footer";

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
    <>
      <main className="px-4 sm:px-6 md:px-10 lg:px-16 pt-24 sm:pt-28 pb-16 sm:pb-24">
        {/* Back link */}
      <TransitionLink
        href="/#works"
        className="inline-flex items-center gap-2 font-sans text-xs sm:text-sm opacity-50 hover:opacity-80 transition-opacity duration-300 mb-6 sm:mb-8"
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

      {/* Mobile: stacked with reordered sections / Desktop: two-column */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left sidebar */}
        <div className={`w-full lg:w-[320px] xl:w-[360px] lg:shrink-0 flex flex-col gap-6 md:gap-8${project.showcase ? " lg:sticky lg:top-[96px] lg:self-start lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto scrollbar-none" : ""}`}>
          {/* Project title */}
          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.04em] leading-[1.1]">
            {project.company}
          </h1>

          {/* Metadata card */}
          <div className="rounded-2xl border border-foreground/15 px-4 sm:px-6 py-4 sm:py-5">
            {[
              { label: "Client", value: project.company },
              { label: "Year", value: project.year },
              { label: "Country", value: project.country },
              { label: "Service", value: project.services.join(", ") },
              { label: "Link", value: project.link || null },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-baseline justify-between py-2 sm:py-2.5 ${
                  i < arr.length - 1 ? "border-b border-foreground/8" : ""
                }`}
              >
                <span className="font-sans text-sm sm:text-base font-medium text-foreground/55 tracking-[-0.03em] shrink-0 self-start">
                  {row.label}
                </span>
                {row.label === "Link" && row.value ? (
                  <a
                    href={row.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm sm:text-base text-foreground/55 tracking-[-0.03em] text-right ml-4 underline hover:text-foreground/80 transition-colors duration-300"
                  >
                    Visit site
                  </a>
                ) : (
                  <span className="font-sans text-sm sm:text-base text-foreground/55 tracking-[-0.03em] text-right ml-4">
                    {row.value || "—"}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* On mobile: images come here, between metadata and accordion */}
          <div className="lg:hidden flex flex-col gap-3 sm:gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {project.images.slice(0, 2).map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-foreground/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${project.company} — image ${i + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
            {project.images[2] && (
              <div className="overflow-hidden rounded-lg border border-foreground/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.images[2]}
                  alt={`${project.company} — image 3`}
                  className="w-full h-auto"
                />
              </div>
            )}
            {project.images.length > 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {project.images.slice(3, 5).map((img, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-lg border border-foreground/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${project.company} — image ${i + 4}`}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Accordion sections */}
          <ProjectAccordion
            items={[
              { label: "Description", content: project.longDescription },
              { label: "The Problem", content: project.problem },
              { label: "The Solution", content: project.solution },
            ]}
          />

          {/* Tools section */}
          {project.tools.length > 0 && (
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="border-t border-foreground/10" />
              <span className="font-sans text-base sm:text-lg text-foreground tracking-[-0.03em]">
                Tools Used
              </span>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {project.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="size-[48px] sm:size-[54px] rounded-xl flex items-center justify-center overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tool.icon}
                      alt={tool.name}
                      width={42}
                      height={42}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
              <div className="border-t border-foreground/10" />
            </div>
          )}

          {/* Share button */}
          <ShareButton />
        </div>

        {/* Right: Image gallery (desktop only — mobile images are inline above) */}
        <div className="hidden lg:flex lg:flex-col lg:gap-5 flex-1 min-w-0">
          <div className="grid grid-cols-2 gap-5">
            {project.images.slice(0, 2).map((img, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-foreground/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${project.company} — image ${i + 1}`}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>

          {project.images[2] && (
            <div className="overflow-hidden rounded-lg border border-foreground/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.images[2]}
                alt={`${project.company} — image 3`}
                className="w-full h-auto"
              />
            </div>
          )}

          {project.images.length > 3 && (
            <div className="grid grid-cols-2 gap-5">
              {project.images.slice(3, 5).map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${project.company} — image ${i + 4}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
