import Link from "next/link";
import { ArrowUpRight, Calendar, MessageSquare, ArrowRight } from "lucide-react";
import {
  getSiteSettings,
  getPublishedProjects,
  getPublishedServices,
  getEnabledTools,
  getTestimonials,
} from "@/lib/data";

export default async function HomePage() {
  const [settings, projects, services, tools, testimonials] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects(),
    getPublishedServices(),
    getEnabledTools(),
    getTestimonials(),
  ]);

  const calendlyUrl = settings?.calendly_url || "https://calendly.com";

  return (
    <div className="flex flex-col gap-24 pb-20 md:gap-36">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 md:px-8 md:pt-32">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-editorial-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            WHAT I DO
          </div>

          <h1 className="text-4xl font-medium tracking-tight text-editorial-50 sm:text-6xl lg:text-7xl">
            I design digital products that make complex experiences feel simple.
          </h1>

          <p className="max-w-2xl text-lg text-editorial-400 sm:text-xl">
            {settings?.about_description ||
              "Product Designer focused on creating intuitive, scalable and visually refined experiences across mobile apps, websites and dashboards."}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-editorial-100 px-6 py-3.5 text-sm font-semibold text-background transition-all hover:bg-white"
            >
              <Calendar className="h-4 w-4" />
              <span>Book a Call</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-6 py-3.5 text-sm font-semibold text-editorial-100 transition-all hover:border-editorial-200/40 hover:bg-surface-hover"
            >
              <MessageSquare className="h-4 w-4 text-editorial-400" />
              <span>Send a Message</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. EXPLORE WORK (Architecture container) */}
      {/* ------------------------------------------------------------- */}
      <section className="border-y border-surface-border/60 bg-surface/30 py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
                SELECTED PORTFOLIO
              </span>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-editorial-50 sm:text-4xl">
                EXPLORE MY WORK
              </h2>
              <p className="mt-2 max-w-xl text-sm text-editorial-400 sm:text-base">
                A selection of digital experiences I&apos;ve designed across fintech, mobility, SaaS, e-commerce and more.
              </p>
            </div>

            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-editorial-200 hover:text-white"
            >
              <span>Explore All UI Work</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Carousel Preview Placeholder */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-surface-border bg-surface p-8 text-center text-editorial-400">
            <p className="text-sm font-medium">
              Horizontal infinite project carousel ({projects.length} projects configured in database)
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
              <span className="rounded-full border border-surface-border bg-surface-muted px-3 py-1 text-editorial-300">
                Mobile Apps
              </span>
              <span className="rounded-full border border-surface-border bg-surface-muted px-3 py-1 text-editorial-300">
                Websites
              </span>
              <span className="rounded-full border border-surface-border bg-surface-muted px-3 py-1 text-editorial-300">
                Dashboards
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. DESIGN SERVICES (Architecture container) */}
      {/* ------------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
            CAPABILITIES
          </span>
          <h2 className="mt-2 text-2xl font-medium tracking-tight text-editorial-50 sm:text-4xl">
            DESIGN SERVICES
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="group rounded-2xl border border-surface-border bg-surface p-8 transition-all hover:border-editorial-200/30 hover:bg-surface-hover"
            >
              <span className="text-xs font-mono text-editorial-500">
                0{service.sort_order}
              </span>
              <h3 className="mt-4 text-xl font-medium text-editorial-100">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-editorial-400">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. TOOLS I USE (Architecture container) */}
      {/* ------------------------------------------------------------- */}
      <section className="border-y border-surface-border/60 py-16">
        <div className="mx-auto max-w-7xl px-6 text-center md:px-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
            STACK & SOFTWARE
          </span>
          <h2 className="mt-2 text-xl font-medium tracking-tight text-editorial-50 sm:text-2xl">
            TOOLS I USE
          </h2>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center gap-2 rounded-full border border-surface-border bg-surface px-5 py-2.5 text-xs font-medium text-editorial-200"
              >
                <span>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. TESTIMONIALS (Architecture container) */}
      {/* ------------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
            ENDORSEMENTS
          </span>
          <h2 className="mt-2 text-2xl font-medium tracking-tight text-editorial-50 sm:text-4xl">
            WHAT CLIENTS SAY
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-surface-border bg-surface p-8"
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
