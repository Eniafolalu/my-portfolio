export const dynamic = "force-dynamic";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { getPublishedProjects, getSiteSettings } from "@/lib/data";

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    getPublishedProjects(),
    getSiteSettings(),
  ]);

  const behanceUrl = settings?.behance_url || "https://behance.net";

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-surface-border pb-12 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
            PORTFOLIO ARCHIVE
          </span>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-editorial-50 sm:text-6xl">
            SELECTED WORK
          </h1>
          <p className="mt-4 text-base text-editorial-400 sm:text-lg">
            A collection of product experiences, interfaces and digital products I&apos;ve designed from concept to completion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={behanceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-5 py-2.5 text-xs font-semibold text-editorial-100 transition-all hover:border-editorial-200/40 hover:bg-surface-hover"
          >
            <span>View Behance</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-editorial-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* Project Grid */}
      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-surface-border bg-surface transition-all hover:border-editorial-200/30"
          >
            <a
              href={project.behance_url || behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted"
            >
              {project.cover_image && (
                <Image
                  src={project.cover_image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
              <div className="absolute top-4 right-4 rounded-full bg-background/80 p-2 text-editorial-100 backdrop-blur-md transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </a>

            <div className="flex flex-1 flex-col justify-between p-8">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-editorial-400">
                  <span>{project.category}</span>
                  <span>{project.timeline}</span>
                </div>
                <h2 className="mt-3 text-2xl font-medium tracking-tight text-editorial-50">
                  {project.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-editorial-400">
                  {project.short_description}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-surface-border/50 pt-4">
                {project.tools?.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-editorial-400"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
