"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Project, ProjectCategory } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface ExploreWorkSectionProps {
  projects: Project[];
}

const CATEGORIES: ProjectCategory[] = ["All", "Mobile Apps", "Websites", "Dashboards"];

export function ExploreWorkSection({ projects = [] }: ExploreWorkSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => {
          const cat = (project.category || "").toLowerCase();
          const pType = (project.project_type || "").toLowerCase();
          const target = selectedCategory.toLowerCase();
          return cat.includes(target) || target.includes(cat) || pType.includes(target);
        });

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8">
      {/* Header & Category Controls */}
      <div className="flex flex-col justify-between gap-6 border-b border-surface-border pb-8 md:flex-row md:items-end">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
            SELECTED PORTFOLIO
          </span>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-editorial-50 sm:text-4xl">
            EXPLORE MY WORK
          </h2>
          <p className="mt-2 max-w-xl text-sm text-editorial-400 sm:text-base">
            A selection of digital experiences I&apos;ve designed across fintech, mobility, SaaS, e-commerce and more.
          </p>
        </div>

        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-sm font-medium text-editorial-200 transition-colors hover:text-orange-400"
        >
          <span>Explore All UI Work</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Category Tabs Filter */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "border border-surface-border bg-surface text-editorial-400 hover:border-editorial-200/30 hover:bg-surface-hover hover:text-editorial-200"
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Project Previews Grid */}
      {filteredProjects.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-surface-border bg-surface p-12 text-center text-editorial-400">
          <p className="text-sm">No projects found in this category.</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredProjects.map((project) => {
            const projectUrl = project.behance_url || "/projects";
            const isExternal = !!project.behance_url;

            return (
              <article
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-surface-border bg-surface transition-all duration-300 hover:border-orange-500/40 hover:bg-surface-hover"
              >
                <a
                  href={projectUrl}
                  target={isExternal ? "_blank" : "_self"}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted"
                >
                  {project.cover_image ? (
                    <Image
                      src={project.cover_image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-muted text-xs text-editorial-500">
                      {project.title}
                    </div>
                  )}

                  <div className="absolute top-4 right-4 rounded-full bg-background/80 p-2.5 text-editorial-100 backdrop-blur-md transition-all group-hover:bg-orange-500 group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>

                <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-editorial-400">
                      <span className="text-orange-400">{project.category}</span>
                      <span>{project.timeline}</span>
                    </div>
                    <h3 className="mt-3 font-display text-xl font-medium tracking-tight text-editorial-50 sm:text-2xl">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-editorial-400">
                      {project.short_description}
                    </p>
                  </div>

                  {project.tools && project.tools.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2 border-t border-surface-border/50 pt-4">
                      {project.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-editorial-400"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
