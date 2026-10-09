"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Project, ProjectCategory } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import { FadeUp, StaggerList, MotionItem } from "@/components/ui/motion";

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
    <section className="mx-auto w-full max-w-7xl px-6 md:px-8">
      {/* Header & Category Controls */}
      <FadeUp className="flex flex-col justify-between gap-6 border-b border-surface-border pb-8 md:flex-row md:items-end">
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
      </FadeUp>

      {/* Category Tabs Filter */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all duration-200",
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

        <span className="shrink-0 text-xs text-editorial-400 md:hidden">
          Swipe to explore →
        </span>
      </div>

      {/* Project Previews Carousel on Mobile / Grid on Tablet & Desktop */}
      {filteredProjects.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-surface-border bg-surface p-12 text-center text-editorial-400">
          <p className="text-sm">No projects found in this category.</p>
        </div>
      ) : (
        <div className="mt-8 w-full max-w-full min-w-0">
          <StaggerList key={selectedCategory} className="flex w-full max-w-full min-w-0 gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar overscroll-x-contain md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 lg:gap-6 md:overflow-visible md:pb-0 md:pt-0">
            {filteredProjects.map((project) => {
              const projectUrl = project.behance_url || "/projects";
              const isExternal = !!project.behance_url;

              return (
                <MotionItem
                  key={project.id}
                  className="group flex w-[84vw] max-w-[320px] sm:w-[340px] min-w-0 flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface snap-start transition-all duration-300 hover:border-orange-500/40 hover:bg-surface-hover md:w-auto md:max-w-none md:flex-shrink"
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
                      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-muted text-xs text-editorial-500">
                      {project.title}
                    </div>
                  )}

                  <div className="absolute top-3 right-3 rounded-full bg-background/80 p-2 text-editorial-100 backdrop-blur-md transition-all group-hover:bg-orange-500 group-hover:text-white">
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>

                <div className="flex flex-1 flex-col justify-between p-5 md:p-5 lg:p-6">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-editorial-400">
                      <span className="text-orange-400">{project.category}</span>
                      <span>{project.timeline}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-medium tracking-tight text-editorial-50 sm:text-xl line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-editorial-400 line-clamp-2">
                      {project.short_description}
                    </p>
                  </div>

                  {project.tools && project.tools.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-surface-border/50 pt-3.5">
                      {project.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-editorial-400"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                </MotionItem>
            );
          })}
          </StaggerList>
        </div>
      )}
    </section>
  );
}
