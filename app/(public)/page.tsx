import Link from "next/link";
import { ArrowUpRight, Calendar, MessageSquare, ArrowRight, Layers, PenTool, MousePointer2, Monitor, Paintbrush, Sparkles, LayoutDashboard } from "lucide-react";
import {
  getSiteSettings,
  getPublishedProjects,
  getPublishedServices,
  getEnabledTools,
  getTestimonials,
  getCareerEntries,
} from "@/lib/data";
import { ProjectInfiniteGallery } from "@/components/home/project-infinite-gallery";
import { ExploreWorkSection } from "@/components/home/explore-work-section";
import { FadeUp, StaggerList, MotionItem } from "@/components/ui/motion";

export default async function HomePage() {
  const [settings, projects, services, tools, testimonials, careerEntries] =
    await Promise.all([
      getSiteSettings(),
      getPublishedProjects(),
      getPublishedServices(),
      getEnabledTools(),
      getTestimonials(),
      getCareerEntries(),
    ]);

  const calendlyUrl = settings?.calendly_url || "https://calendly.com";

  return (
    <div className="flex flex-col gap-24 pb-20 md:gap-36 w-full max-w-full overflow-x-hidden min-w-0">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO + INFINITE 3D GALLERY + HERO STATS */}
      {/* ------------------------------------------------------------- */}
      <section className="relative w-full pt-16 md:pt-24">
        {/* ── Hero glow + floating icons wrapper ── */}
        <div className="relative">

          {/* Central orange radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[220px] w-[320px] rounded-full bg-orange-500/[0.06] blur-[70px] xl:h-[520px] xl:w-[820px] xl:bg-orange-500/[0.11] xl:blur-[110px]"
          />
          {/* Tighter accent glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[100px] w-[200px] rounded-full bg-orange-400/[0.04] blur-[50px] xl:h-[200px] xl:w-[420px] xl:bg-orange-400/[0.07] xl:blur-[70px]"
          />

          {/* ── Floating design icon badges (xl only) ── */}

          {/* Top-left: Layers */}
          <div aria-hidden="true" className="pointer-events-none absolute left-[3%] top-[8%] flex items-center gap-0 xl:gap-2 rounded-full xl:rounded-2xl border border-surface-border/80 bg-surface/70 backdrop-blur-md p-2 xl:px-3.5 xl:py-2.5 text-xs font-medium text-editorial-300 shadow-xl animate-float-1">
            <Layers className="h-4 w-4 text-orange-400" />
            <span className="hidden xl:inline">Components</span>
          </div>

          {/* Top-right: PenTool */}
          <div aria-hidden="true" className="pointer-events-none absolute right-[3%] top-[8%] flex items-center gap-0 xl:gap-2 rounded-full xl:rounded-2xl border border-surface-border/80 bg-surface/70 backdrop-blur-md p-2 xl:px-3.5 xl:py-2.5 text-xs font-medium text-editorial-300 shadow-xl animate-float-2">
            <PenTool className="h-4 w-4 text-orange-400" />
            <span className="hidden xl:inline">Design Systems</span>
          </div>

          {/* Mid-left: MousePointer2 */}
          <div aria-hidden="true" className="pointer-events-none absolute left-[2%] top-[52%] -translate-y-1/2 hidden xl:flex items-center gap-2 rounded-2xl border border-surface-border/80 bg-surface/70 backdrop-blur-md px-3.5 py-2.5 text-xs font-medium text-editorial-300 shadow-xl animate-float-3">
            <MousePointer2 className="h-4 w-4 text-orange-400" />
            <span>Interactions</span>
          </div>

          {/* Mid-right: Monitor */}
          <div aria-hidden="true" className="pointer-events-none absolute right-[2%] top-[48%] -translate-y-1/2 hidden xl:flex items-center gap-2 rounded-2xl border border-surface-border/80 bg-surface/70 backdrop-blur-md px-3.5 py-2.5 text-xs font-medium text-editorial-300 shadow-xl animate-float-1">
            <Monitor className="h-4 w-4 text-orange-400" />
            <span>Responsive UI</span>
          </div>

          {/* Bottom-left: Paintbrush */}
          <div aria-hidden="true" className="pointer-events-none absolute left-[4%] bottom-[10%] flex items-center gap-0 xl:gap-2 rounded-full xl:rounded-2xl border border-surface-border/80 bg-surface/70 backdrop-blur-md p-2 xl:px-3.5 xl:py-2.5 text-xs font-medium text-editorial-300 shadow-xl animate-float-2">
            <Paintbrush className="h-4 w-4 text-orange-400" />
            <span className="hidden xl:inline">Visual Craft</span>
          </div>

          {/* Bottom-right: Sparkles */}
          <div aria-hidden="true" className="pointer-events-none absolute right-[4%] bottom-[10%] flex items-center gap-0 xl:gap-2 rounded-full xl:rounded-2xl border border-surface-border/80 bg-surface/70 backdrop-blur-md p-2 xl:px-3.5 xl:py-2.5 text-xs font-medium text-editorial-300 shadow-xl animate-float-3">
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span className="hidden xl:inline">Micro-animations</span>
          </div>

          {/* ── Hero copy ── */}
          <FadeUp className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-orange-400 sm:px-4 sm:text-xs">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500 animate-pulse" />
              <span className="block sm:hidden">Designer · UI/UX</span>
              <span className="hidden sm:block">Product Designer · UI/UX Specialist</span>
            </div>

            <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-editorial-50 sm:text-6xl md:text-7xl lg:text-[5.2rem] lg:leading-[1.08]">
              I design digital products that make complex experiences feel simple.
            </h1>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="h-4 w-4" />
                <span className="block md:hidden">Book</span>
                <span className="hidden md:block">Book a Call</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface/80 px-7 py-3.5 text-sm font-semibold text-editorial-100 transition-all hover:border-orange-500/40 hover:bg-surface-hover"
              >
                <MessageSquare className="h-4 w-4 text-editorial-400" />
                <span>Send a Message</span>
              </Link>
            </div>
          </FadeUp>
        </div>

        {/* 2. INFINITE 3D PROJECT GALLERY */}
        <div className="mt-12 w-full md:mt-16">
          <ProjectInfiniteGallery projects={projects} />
        </div>

        {/* 3. HERO CREDIBILITY STATISTICS */}
        <FadeUp delay={0.1} className="mx-auto mt-8 w-full max-w-4xl px-6 md:mt-12">
          <div className="grid gap-8 text-center grid-cols-3 sm:gap-4 sm:divide-x sm:divide-surface-border/60">
            <div className="flex flex-col items-center justify-center sm:px-4">
              <span className="font-display text-4xl font-bold tracking-tight text-orange-500 sm:text-5xl">
                20+
              </span>
              <span className="mt-2 text-xs font-medium uppercase tracking-wider text-editorial-300 sm:text-sm">
                Products Delivered
              </span>
            </div>
            <div className="flex flex-col items-center justify-center sm:px-4">
              <span className="font-display text-4xl font-bold tracking-tight text-orange-500 sm:text-5xl">
                99.4%
              </span>
              <span className="mt-2 text-xs font-medium uppercase tracking-wider text-editorial-300 sm:text-sm">
                Client Satisfaction
              </span>
            </div>
            <div className="flex flex-col items-center justify-center sm:px-4">
              <span className="font-display text-4xl font-bold tracking-tight text-orange-500 sm:text-5xl">
                3+
              </span>
              <span className="mt-2 text-xs font-medium uppercase tracking-wider text-editorial-300 sm:text-sm">
                Years Specialized Experience
              </span>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. EXPLORE MY WORK (CMS-Driven Portfolio Grid + Filter) */}
      {/* ------------------------------------------------------------- */}
      <ExploreWorkSection projects={projects} />

      {/* ------------------------------------------------------------- */}
      {/* 5. DESIGN SERVICES */}
      {/* ------------------------------------------------------------- */}
      {/* Section bg: subtle dot-grid + left accent glow */}
      <div className="relative w-full">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(249,115,22,0.04)_0%,transparent_60%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
      <FadeUp className="relative mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
              CAPABILITIES
            </span>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-editorial-50 sm:text-4xl">
              DESIGN SERVICES
            </h2>
          </div>
          <span className="shrink-0 text-xs text-editorial-400 md:hidden">
            Swipe to explore →
          </span>
        </div>

        <div className="mt-8 w-full max-w-full min-w-0">
          <StaggerList className="flex w-full max-w-full min-w-0 gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar overscroll-x-contain md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 md:pt-0">
            {services.map((service) => (
              <MotionItem
                key={service.id}
                className="group flex w-[84vw] max-w-[320px] sm:w-[340px] min-w-0 flex-shrink-0 flex-col justify-between rounded-2xl border border-surface-border bg-surface p-6 snap-start transition-all hover:border-orange-500/30 hover:bg-surface-hover md:w-auto md:max-w-none md:flex-shrink md:p-8"
              >
                <div>
                  <span className="text-xs font-mono text-orange-400">
                    0{service.sort_order}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-medium text-editorial-100 sm:text-xl">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-editorial-400">
                    {service.description}
                  </p>
                </div>
              </MotionItem>
            ))}
          </StaggerList>
        </div>
      </FadeUp>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. TOOLS I USE */}
      {/* ------------------------------------------------------------- */}
      <FadeUp className="relative border-y border-surface-border/60 py-16 overflow-hidden">
        {/* dot grid + center glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[180px] w-[500px] rounded-full bg-orange-500/[0.05] blur-[80px]" />
        <div className="mx-auto max-w-7xl px-6 text-center md:px-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
            STACK &amp; SOFTWARE
          </span>
          <h2 className="mt-2 font-display text-xl font-medium tracking-tight text-editorial-50 sm:text-2xl">
            TOOLS I USE
          </h2>

          <StaggerList className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {tools.map((tool) => (
              <MotionItem
                key={tool.id}
                className="flex items-center gap-2 rounded-full border border-surface-border bg-surface px-5 py-2.5 text-xs font-medium text-editorial-200 transition-colors hover:border-orange-500/30"
              >
                <span>{tool.name}</span>
              </MotionItem>
            ))}
          </StaggerList>
        </div>
      </FadeUp>



      {/* ------------------------------------------------------------- */}
      {/* 7. WHAT CLIENTS SAY */}
      {/* ------------------------------------------------------------- */}
      {/* Section bg: diagonal stripe gradient + subtle top highlight */}
      <div className="relative w-full py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-surface/60 via-background to-background" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 border-y border-surface-border/40" />
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
      <FadeUp className="relative mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
              ENDORSEMENTS
            </span>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-editorial-50 sm:text-4xl">
              WHAT CLIENTS SAY
            </h2>
          </div>
          <span className="shrink-0 text-xs text-editorial-400 md:hidden">
            Swipe to read →
          </span>
        </div>

        <div className="mt-8 w-full max-w-full min-w-0">
          <StaggerList className="flex w-full max-w-full min-w-0 gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar overscroll-x-contain md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 md:pt-0">
            {testimonials.map((item) => (
              <MotionItem
                key={item.id}
                className="group flex w-[84vw] max-w-[320px] sm:w-[340px] min-w-0 flex-shrink-0 flex-col justify-between rounded-2xl border border-surface-border bg-surface p-6 snap-start transition-all hover:border-orange-500/30 hover:bg-surface-hover md:w-auto md:max-w-none md:flex-shrink md:p-8"
              >
                <p className="text-sm leading-relaxed text-editorial-300 italic">
                  &ldquo;{item.testimonial}&rdquo;
                </p>
                <div className="mt-6 border-t border-surface-border/50 pt-4">
                  <div className="text-sm font-semibold text-editorial-100">
                    {item.client_name}
                  </div>
                  <div className="text-xs text-editorial-400">
                    {item.role} · {item.company}
                  </div>
                </div>
              </MotionItem>
            ))}
          </StaggerList>
        </div>
      </FadeUp>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 8. ABOUT ME / DESIGN JOURNEY PREVIEW */}
      {/* ------------------------------------------------------------- */}
      {/* Section bg: faint radial glow bottom-right */}
      <div className="relative w-full">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(249,115,22,0.05)_0%,transparent_55%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px]" />
      <FadeUp className="relative mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-surface-border pb-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
              BACKGROUND & PHILOSOPHY
            </span>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-editorial-50 sm:text-4xl">
              ABOUT ME & DESIGN JOURNEY
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-editorial-400 sm:text-base">
              {settings?.about_headline ||
                "I design digital experiences at the intersection of strategy, usability and visual craft."}
            </p>
          </div>

          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-sm font-medium text-editorial-200 transition-colors hover:text-orange-400"
          >
            <span>Read Full Journey & Skills</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Timeline & Skills Preview */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Timeline Column */}
          <div className="lg:col-span-7">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
              CAREER HIGHLIGHTS
            </h3>
            <StaggerList className="mt-6 space-y-8 border-l border-surface-border pl-6 md:pl-8">
              {careerEntries.slice(0, 3).map((entry) => (
                <MotionItem key={entry.id} className="relative group">
                  <div className="absolute -left-[31px] md:-left-[39px] top-1.5 h-3 w-3 rounded-full border border-orange-500/60 bg-background" />
                  <span className="text-xs font-mono font-medium text-orange-400">
                    {entry.year}
                  </span>
                  <h4 className="mt-1 text-lg font-medium text-editorial-100">
                    {entry.title}
                    {entry.company && (
                      <span className="font-normal text-editorial-400">
                        {" "}
                        · {entry.company}
                      </span>
                    )}
                  </h4>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-editorial-400">
                    {entry.description}
                  </p>
                </MotionItem>
              ))}
            </StaggerList>
          </div>

          {/* Skills / Bio Column */}
          <div className="flex flex-col justify-between rounded-3xl border border-surface-border bg-surface p-8 lg:col-span-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
                CORE CAPABILITIES
              </span>
              <h4 className="mt-2 font-display text-xl font-medium text-editorial-100">
                Specialized Disciplines
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-editorial-400">
                {settings?.about_description ||
                  "Product Designer focused on creating intuitive, scalable and visually refined experiences across mobile apps, websites and dashboards."}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {(
                  settings?.skills_list || [
                    "Product Strategy",
                    "Design Systems",
                    "Mobile UI (iOS/Android)",
                    "SaaS Dashboards",
                    "User Research",
                    "Interactive Prototyping",
                  ]
                )
                  .slice(0, 6)
                  .map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-surface-border bg-surface-muted px-3 py-1 text-xs text-editorial-300"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            <div className="mt-8 border-t border-surface-border/60 pt-6">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400 transition-colors hover:text-orange-300"
              >
                <span>Explore Full Bio & Timeline</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </FadeUp>
      </div>
    </div>
  );
}

