"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Loader2,
  Filter,
} from "lucide-react";
import { Project } from "@/types/portfolio";
import {
  toggleProjectStatus,
  toggleProjectFeatured,
  deleteProject,
} from "@/lib/actions/projects";

interface ProjectsListProps {
  initialProjects: Project[];
}

export function ProjectsList({ initialProjects }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isPending, startTransition] = useTransition();
  const [actingId, setActingId] = useState<string | null>(null);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleStatus = (p: Project) => {
    setActingId(p.id);
    startTransition(async () => {
      try {
        const res = await toggleProjectStatus(p.id, p.status);
        if (res?.success) {
          setProjects((prev) =>
            prev.map((item) =>
              item.id === p.id
                ? {
                    ...item,
                    status: (res.newStatus as "published" | "draft" | "archived") || (item.status === "published" ? "draft" : "published"),
                  }
                : item
            )
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setActingId(null);
      }
    });
  };

  const handleToggleFeatured = (p: Project) => {
    setActingId(p.id);
    startTransition(async () => {
      try {
        const res = await toggleProjectFeatured(p.id, p.is_featured);
        if (res?.success) {
          setProjects((prev) =>
            prev.map((item) =>
              item.id === p.id
                ? { ...item, is_featured: !item.is_featured }
                : item
            )
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setActingId(null);
      }
    });
  };

  const handleDelete = (p: Project) => {
    if (!confirm(`Are you sure you want to delete "${p.title}"?`)) return;
    setActingId(p.id);
    startTransition(async () => {
      try {
        const res = await deleteProject(p.id);
        if (res?.success) {
          setProjects((prev) => prev.filter((item) => item.id !== p.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setActingId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
            Projects CMS
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            Manage your case studies, gallery imagery, categories, and Behance links.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-4 py-2.5 text-xs font-semibold text-background hover:bg-white transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Project</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-editorial-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, category, role..."
            className="w-full rounded-xl border border-surface-border bg-surface py-2.5 pl-10 pr-4 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-editorial-500 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-surface px-3 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-surface px-3 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Projects Table / Card List */}
      <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden shadow-sm">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-xs text-editorial-500">
            No projects found matching your criteria.
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {filteredProjects.map((p) => {
              const isItemBusy = isPending && actingId === p.id;
              return (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative h-14 w-20 shrink-0 rounded-lg overflow-hidden bg-surface-muted border border-surface-border">
                      {p.cover_image ? (
                        <Image
                          src={p.cover_image}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-editorial-600">
                          No Img
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-medium text-editorial-100">
                          {p.title}
                        </span>

                        {/* Status Badge */}
                        <button
                          type="button"
                          disabled={isItemBusy}
                          onClick={() => handleToggleStatus(p)}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase transition-opacity ${
                            p.status === "published"
                              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                          } ${isItemBusy ? "opacity-50" : ""}`}
                          title="Click to toggle publish status"
                        >
                          {p.status}
                        </button>

                        {/* Featured Badge */}
                        <button
                          type="button"
                          disabled={isItemBusy}
                          onClick={() => handleToggleFeatured(p)}
                          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                            p.is_featured
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                              : "bg-surface-muted text-editorial-500 hover:text-editorial-300"
                          }`}
                          title="Click to toggle featured status"
                        >
                          <Star
                            className={`h-2.5 w-2.5 ${
                              p.is_featured ? "fill-blue-400" : ""
                            }`}
                          />
                          <span>{p.is_featured ? "Featured" : "Regular"}</span>
                        </button>
                      </div>

                      <div className="mt-1.5 text-xs text-editorial-400 flex flex-wrap items-center gap-2">
                        <span className="text-editorial-300">{p.category}</span>
                        <span>·</span>
                        <span>{p.project_type}</span>
                        <span>·</span>
                        <span>{p.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {p.behance_url && (
                      <a
                        href={p.behance_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-editorial-400 hover:text-editorial-100 hover:bg-surface-muted transition-colors"
                        title="View Behance Project"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}

                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-editorial-200 hover:bg-surface-hover hover:text-white transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      disabled={isItemBusy}
                      onClick={() => handleDelete(p)}
                      className="p-1.5 rounded-lg text-editorial-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete project"
                    >
                      {isItemBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
