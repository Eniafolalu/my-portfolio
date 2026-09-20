import { Plus } from "lucide-react";
import { getSiteSettings, getCareerEntries } from "@/lib/data";

export default async function AdminAboutPage() {
  const [settings, careerEntries] = await Promise.all([
    getSiteSettings(),
    getCareerEntries(),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
          About & Career Journey CMS
        </h1>
        <p className="text-xs text-editorial-400 mt-1">
          Manage your editorial biography, skills matrix, and career timeline milestones.
        </p>
      </div>

      {/* Bio Overview */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
          Biography & Headline
        </h2>
        <div className="space-y-2">
          <div className="text-xs text-editorial-400">Headline</div>
          <div className="text-sm font-medium text-editorial-100">
            {settings?.about_headline || "I design digital experiences at the intersection of strategy, usability and visual design."}
          </div>
        </div>
      </div>

      {/* Career Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
            Career Journey Timeline ({careerEntries.length} entries)
          </h2>
          <button className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-3.5 py-1.5 text-xs font-semibold text-background hover:bg-white transition-colors">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Timeline Entry</span>
          </button>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden divide-y divide-surface-border">
          {careerEntries.map((e) => (
            <div key={e.id} className="p-5 hover:bg-surface-hover transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-editorial-400">{e.year}</span>
                  <h3 className="text-sm font-medium text-editorial-100 mt-0.5">
                    {e.title} {e.company && `· ${e.company}`}
                  </h3>
                </div>
                <div className="text-xs text-editorial-400">Order: {e.sort_order}</div>
              </div>
              <p className="mt-2 text-xs text-editorial-400 max-w-2xl">{e.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
