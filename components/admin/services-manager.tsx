"use client";

import { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Loader2, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Service } from "@/types/portfolio";
import {
  createService,
  updateService,
  deleteService,
  toggleService,
} from "@/lib/actions/cms";

interface ServicesManagerProps {
  initialServices: Service[];
}

export function ServicesManager({ initialServices }: ServicesManagerProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingService(null);
    setTitle("");
    setDescription("");
    setIsPublished(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setTitle(s.title);
    setDescription(s.description);
    setIsPublished(s.is_published);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("is_published", isPublished ? "true" : "false");

    startTransition(async () => {
      if (editingService) {
        const res = await updateService(editingService.id, formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setServices((prev) =>
            prev.map((item) =>
              item.id === editingService.id
                ? { ...item, title, description, is_published: isPublished }
                : item
            )
          );
          setModalOpen(false);
        }
      } else {
        const res = await createService(formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setModalOpen(false);
          window.location.reload();
        }
      }
    });
  };

  const handleDelete = (s: Service) => {
    if (!confirm(`Are you sure you want to delete service "${s.title}"?`)) return;
    startTransition(async () => {
      const res = await deleteService(s.id);
      if (res?.success) {
        setServices((prev) => prev.filter((item) => item.id !== s.id));
      }
    });
  };

  const handleToggle = (s: Service) => {
    startTransition(async () => {
      const res = await toggleService(s.id, s.is_published);
      if (res?.success) {
        setServices((prev) =>
          prev.map((item) =>
            item.id === s.id
              ? { ...item, is_published: !item.is_published }
              : item
          )
        );
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
            Services CMS
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            Define and manage design service capabilities displayed on the public homepage.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-4 py-2 text-xs font-semibold text-background hover:bg-white transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden divide-y divide-surface-border">
        {services.length === 0 ? (
          <div className="p-12 text-center text-xs text-editorial-500">
            No services configured yet. Click &ldquo;Add Service&rdquo; to create one.
          </div>
        ) : (
          services.map((s) => (
            <div
              key={s.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-surface-hover transition-colors"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-editorial-100">
                    {s.title}
                  </span>
                  <button
                    onClick={() => handleToggle(s)}
                    disabled={isPending}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase transition-opacity ${
                      s.is_published
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                    }`}
                  >
                    {s.is_published ? "Published" : "Draft"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-editorial-400 max-w-xl">
                  {s.description}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => openEditModal(s)}
                  className="p-2 rounded-lg border border-surface-border text-editorial-300 hover:bg-surface-muted hover:text-white transition-colors"
                  title="Edit Service"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(s)}
                  className="p-2 rounded-lg text-editorial-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-surface-border bg-surface p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-medium text-editorial-50">
              {editingService ? "Edit Service" : "Add New Service"}
            </h2>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Product Strategy & UX Architecture"
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Translating complex user journeys and business objectives into elegant..."
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="service-publish"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-surface-border text-editorial-100 bg-surface-muted"
                />
                <label
                  htmlFor="service-publish"
                  className="text-xs text-editorial-200 cursor-pointer"
                >
                  Publish service immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-editorial-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-5 py-2 text-xs font-semibold text-background hover:bg-white transition-colors"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingService ? "Save Changes" : "Create Service"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
