import Link from "next/link";
import { Plus, Search, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/types/portfolio";

export default async function AdminProjectsPage() {
  let projects: Project[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) projects = data;
  } catch (err) {
    console.warn(err);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
            Projects CMS
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            Manage your case studies, gallery imagery, category tags, and Behance redirects.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-4 py-2 text-xs font-semibold text-background hover:bg-white transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Project</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4 rounded-2xl border border-surface-border bg-surface p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-editorial-500" />
          <input
            type="text"
            placeholder="Search projects by title, category, or role..."
            className="w-full rounded-xl bg-surface-muted py-2 pl-10 pr-4 text-xs text-editorial-100 placeholder:text-editorial-600 focus:outline-none"
          />
        </div>
        <div className="text-xs text-editorial-400 px-2">
          {projects.length} Total
        </div>
      </div>

      {/* Projects List */}
      <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center text-xs text-editorial-500">
            No projects in database. Click &ldquo;Create Project&rdquo; to add your first case study.
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-surface-hover transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-editorial-100">
                      {p.title}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                        p.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {p.status}
                    </span>
                    {p.is_featured && (
                      <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-editorial-400 flex items-center gap-2">
                    <span>{p.category}</span>
                    <span>·</span>
                    <span>{p.project_type}</span>
                    <span>·</span>
                    <span>Order: {p.sort_order}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  {p.behance_url && (
                    <a
                      href={p.behance_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-editorial-400 hover:text-editorial-100 hover:bg-surface-muted"
                      title="View Behance Destination"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="rounded-lg border border-surface-border bg-surface-muted px-3 py-1.5 text-editorial-200 hover:bg-surface-hover hover:text-white"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
