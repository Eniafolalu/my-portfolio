"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/types/portfolio";

interface ProjectInfiniteGalleryProps {
  projects: Project[];
}

export function ProjectInfiniteGallery({
  projects = [],
}: ProjectInfiniteGalleryProps) {
  // Graceful handling for empty state
  if (!projects || projects.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12 text-center text-editorial-400">
        <p className="text-sm">No published projects available at this time.</p>
      </div>
    );
  }

  // Ensure there are enough cards to make a seamless infinite loop
  let baseList = [...projects];
  while (baseList.length < 6) {
    baseList = [...baseList, ...projects];
  }

  // Duplicate for infinite CSS marquee (0% -> -50%)
  const displayItems = [...baseList, ...baseList];

  return (
    <div className="relative w-full overflow-hidden py-6 md:py-10">
      {/* 3D Perspective Stage */}
      <div className="relative w-full [perspective:1400px]">
        {/* Edge Gradient Mask for smooth fade-in/fade-out */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
          {/* 3D Spatial Track — Continuous linear movement without pause on hover */}
          <div
            className="flex w-max animate-marquee items-center gap-6 py-4 [transform-style:preserve-3d] [transform:rotateX(4deg)_rotateY(-4deg)] sm:gap-8 md:[transform:rotateX(5deg)_rotateY(-6deg)] motion-reduce:transform-none motion-reduce:animate-none"
            style={{ willChange: "transform" }}
          >
            {displayItems.map((project, index) => {
              const projectUrl = project.behance_url || "/projects";
              const isExternal = !!project.behance_url;

              return (
                <div
                  key={`${project.id}-${index}`}
                  className="group relative w-[280px] sm:w-[360px] md:w-[420px] lg:w-[460px] flex-shrink-0 transition-transform duration-300"
                >
                  <a
                    href={projectUrl}
                    target={isExternal ? "_blank" : "_self"}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="block overflow-hidden rounded-2xl border border-surface-border/80 bg-surface/90 shadow-2xl shadow-black/80 transition-all duration-300 hover:border-orange-500/50 hover:shadow-orange-500/10 md:rounded-3xl"
                  >
                    {/* Project Image Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
                      {project.cover_image ? (
                        <Image
                          src={project.cover_image}
                          alt={project.title}
                          fill
                          sizes="(max-width: 640px) 280px, (max-width: 1024px) 420px, 460px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-surface-muted text-xs text-editorial-500">
                          {project.title}
                        </div>
                      )}

                      {/* Subtle Overlay Badge */}
                      <div className="absolute top-3 right-3 rounded-full bg-background/80 p-2 text-editorial-100 backdrop-blur-md transition-all group-hover:bg-orange-500 group-hover:text-white md:top-4 md:right-4">
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>

                    {/* Card Metadata Footer */}
                    <div className="flex items-center justify-between p-4 sm:p-5">
                      <div className="min-w-0 flex-1 pr-3">
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-orange-400">
                          {project.category || "Case Study"}
                        </span>
                        <h3 className="mt-1 truncate text-sm font-medium text-editorial-50 sm:text-base">
                          {project.title}
                        </h3>
                      </div>
                      <span className="flex-shrink-0 text-xs font-mono text-editorial-500">
                        {project.timeline || ""}
                      </span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
