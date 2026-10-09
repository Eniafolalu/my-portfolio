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

        </div>

        {/* RIGHT: portrait image */}
        <div className="flex items-start justify-center lg:col-span-5">
          <div className="relative w-full max-w-sm lg:max-w-md">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-orange-500/20 via-orange-500/5 to-transparent blur-2xl opacity-60" />

            {/* Portrait Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-surface-border bg-surface shadow-2xl shadow-black/80">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-muted">
                <Image
                  src="/my-image.jpeg"
                  alt={settings?.owner_name || "Enioluwa Afolalu"}
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 420px"
                  className="object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                />
                {/* Subtle Editorial Gradient Overlay at bottom */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
              </div>

              {/* Integrated Caption strip */}
              <div className="flex items-center justify-between border-t border-surface-border/60 bg-surface/90 px-6 py-4 backdrop-blur-md">
                <div>
                  <p className="text-sm font-semibold tracking-tight text-editorial-100">
                    {settings?.owner_name || "Enioluwa Afolalu"}
                  </p>
                  <p className="text-xs text-editorial-400">
                    {settings?.professional_title || "Product Designer"}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                  <span>Available for work</span>
                </div>
              </div>
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
          CAREER & WORK HISTORY
        </span>
        <h2 className="mt-2 text-2xl font-medium text-editorial-50 sm:text-3xl">
          JOB EXPERIENCE
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {careerEntries.map((entry) => (
            <div
              key={entry.id}
              className="group flex flex-col justify-between rounded-2xl border border-surface-border bg-surface p-6 sm:p-8 transition-all hover:border-orange-500/30 hover:bg-surface-hover"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-orange-400 font-medium">{entry.year}</span>
                  {entry.company && (
                    <span className="text-xs font-sans uppercase tracking-wider text-editorial-400">
                      {entry.company}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-lg font-medium text-editorial-100 sm:text-xl">
                  {entry.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-editorial-400">
                  {entry.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
