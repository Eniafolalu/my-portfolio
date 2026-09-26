export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteSettings, getCareerEntries } from "@/lib/data";

export default async function AboutPage() {
  const [settings, careerEntries] = await Promise.all([
    getSiteSettings(),
    getCareerEntries(),
  ]);

  const skills = settings?.skills_list || [
    "Product Strategy",
    "Design Systems",
    "Mobile App Design (iOS/Android)",
    "SaaS & Enterprise Dashboards",
    "User Research & Testing",
    "Interactive Prototyping",
    "Information Architecture",
    "Design Operations",
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">

      {/* ---------------------------------------------------------------- */}
      {/* HERO — two-column editorial layout                               */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">

        {/* LEFT: copy */}
        <div className="flex flex-col justify-center lg:col-span-7">
          <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
            ABOUT ME
          </span>
          <h1 className="mt-4 text-3xl font-medium tracking-tight text-editorial-50 sm:text-5xl lg:text-6xl">
            {settings?.about_headline ||
              "I design digital experiences at the intersection of strategy, usability and visual design."}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-editorial-400 sm:text-lg">
            {settings?.about_description ||
              "Product Designer focused on creating intuitive, scalable and visually refined experiences across mobile apps, websites and dashboards."}
          </p>

          {/* Skills tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-surface-border bg-surface px-3 py-1 text-xs font-medium text-editorial-300"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10">
            <Link
              href="#timeline"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-orange-400 transition-colors hover:text-orange-300"
            >
              <span>Explore Full Journey &amp; Timeline</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* RIGHT: portrait image */}
        <div className="flex items-start justify-center lg:col-span-5">
          <div className="w-full max-w-sm lg:max-w-none">
            {/* 3:4 portrait container */}
            <div
              className="relative w-full overflow-hidden rounded-3xl border border-surface-border bg-surface-muted"
              style={{ paddingBottom: "133.33%" }}
            >
              {settings?.profile_image_url ? (
                <Image
                  src={settings.profile_image_url}
                  alt={settings?.owner_name || "Profile photo"}
                  fill
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 45vw, 36vw"
                  className="object-cover object-top"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="font-display text-6xl font-semibold text-editorial-300">
                    {(settings?.owner_name || "EA")
                      .split(" ")
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
                    {settings?.professional_title || "Product Designer"}
                  </span>
                </div>
              )}
              {/* Editorial bottom-fade */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background/40 to-transparent" />
            </div>

            {/* Caption strip */}
            <div className="mt-4 flex items-center justify-between px-1">
              <div>
                <p className="text-sm font-semibold text-editorial-100">
                  {settings?.owner_name || "Enioluwa Afolalu"}
                </p>
                <p className="text-xs text-editorial-400">
                  {settings?.professional_title || "Product Designer"}
                </p>
              </div>
              <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                Available for work
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Skills Matrix */}
      <div className="mt-20 border-t border-surface-border pt-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
          CORE CAPABILITIES
        </span>
        <h2 className="mt-2 text-2xl font-medium text-editorial-50">
          Skills &amp; Expertise
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={skill}
              className="rounded-xl border border-surface-border bg-surface p-4 text-xs font-medium text-editorial-200"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Career Timeline */}
      <div id="timeline" className="mt-24 border-t border-surface-border pt-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
          TIMELINE
        </span>
        <h2 className="mt-2 text-2xl font-medium text-editorial-50 sm:text-3xl">
          MY DESIGN JOURNEY
        </h2>

        <div className="mt-12 space-y-12 border-l border-surface-border pl-6 md:pl-8">
          {careerEntries.map((entry) => (
            <div key={entry.id} className="relative group">
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 h-3 w-3 rounded-full border border-editorial-200 bg-background" />
              <span className="text-xs font-mono font-medium text-editorial-400">
                {entry.year}
              </span>
              <h3 className="mt-1 text-xl font-medium text-editorial-100">
                {entry.title}
                {entry.company && (
                  <span className="text-editorial-400 font-normal"> · {entry.company}</span>
                )}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-editorial-400">
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
