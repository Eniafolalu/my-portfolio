import Link from "next/link";
import { FolderKanban, Layers, Quote, Mail, Plus, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/types/portfolio";

export default async function AdminDashboardPage() {
  let totalProjects = 0;
  let publishedProjects = 0;
  let draftProjects = 0;
  let totalTestimonials = 0;
  let unreadMessages = 0;
  let recentProjects: Project[] = [];

  try {
    const supabase = await createClient();

    const { data: projectsData } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    const { count: testimonialsCount } = await supabase
      .from("testimonials")
      .select("id", { count: "exact", head: true });

    const { count: messagesCount } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);

    if (projectsData) {
      const projects = projectsData as Project[];
      totalProjects = projects.length;
      publishedProjects = projects.filter((p) => p.status === "published").length;
      draftProjects = projects.filter((p) => p.status === "draft").length;
      recentProjects = projects.slice(0, 5);
    }

    if (testimonialsCount) totalTestimonials = testimonialsCount;
    if (messagesCount) unreadMessages = messagesCount;
  } catch (err) {
    console.warn("Could not query metrics:", err);
  }

  const statCards = [
    { label: "Total Projects", value: totalProjects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Published Projects", value: publishedProjects, icon: Layers, href: "/admin/projects" },
    { label: "Draft Projects", value: draftProjects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Testimonials", value: totalTestimonials, icon: Quote, href: "/admin/testimonials" },
    { label: "Unread Messages", value: unreadMessages, icon: Mail, href: "/admin/messages", alert: unreadMessages > 0 },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
            Overview Dashboard
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            Welcome to your product design portfolio management workspace.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-4 py-2 text-xs font-semibold text-background hover:bg-white transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-2xl border border-surface-border bg-surface p-5 transition-all hover:border-editorial-200/30 hover:bg-surface-hover"
            >
              <div className="flex items-center justify-between text-editorial-400">
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  {stat.label}
                </span>
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-editorial-50">
                  {stat.value}
                </span>
                {stat.alert && (
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Projects Table */}
      <div className="rounded-2xl border border-surface-border bg-surface p-6">
        <div className="flex items-center justify-between border-b border-surface-border/60 pb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
            Recent Projects
          </h2>
          <Link
            href="/admin/projects"
            className="text-xs font-medium text-editorial-400 hover:text-editorial-100 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="py-8 text-center text-xs text-editorial-500">
            No projects found in database yet.
          </div>
        ) : (
          <div className="divide-y divide-surface-border/40">
            {recentProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-3.5 text-xs"
              >
                <div>
                  <span className="font-medium text-editorial-100">{p.title}</span>
                  <span className="ml-3 text-editorial-500">{p.category}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                      p.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {p.status}
                  </span>
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="text-editorial-400 hover:text-white"
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
