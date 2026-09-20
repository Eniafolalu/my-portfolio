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
      {/* Header */}
      <div className="max-w-3xl space-y-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
          ABOUT ME
        </span>
        <h1 className="text-3xl font-medium tracking-tight text-editorial-50 sm:text-5xl lg:text-6xl">
          {settings?.about_headline ||
            "I design digital experiences at the intersection of strategy, usability and visual design."}
        </h1>
        <p className="text-base leading-relaxed text-editorial-400 sm:text-lg">
          {settings?.about_description ||
            "Product Designer focused on creating intuitive, scalable and visually refined experiences across mobile apps, websites and dashboards."}
        </p>
      </div>

      {/* Skills Matrix */}
      <div className="mt-20 border-t border-surface-border pt-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
          CORE CAPABILITIES
        </span>
        <h2 className="mt-2 text-2xl font-medium text-editorial-50">
          Skills & Expertise
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
      <div className="mt-24 border-t border-surface-border pt-16">
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
