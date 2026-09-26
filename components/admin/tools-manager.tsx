"use client";

import { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Tool } from "@/types/portfolio";
import {
  createTool,
  updateTool,
  deleteTool,
  toggleTool,
} from "@/lib/actions/cms";

interface ToolsManagerProps {
  initialTools: Tool[];
}

export function ToolsManager({ initialTools }: ToolsManagerProps) {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingTool(null);
    setName("");
    setIsEnabled(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (t: Tool) => {
    setEditingTool(t);
    setName(t.name);
    setIsEnabled(t.is_enabled);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tool name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("is_enabled", isEnabled ? "true" : "false");

    startTransition(async () => {
      if (editingTool) {
        const res = await updateTool(editingTool.id, formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setTools((prev) =>
            prev.map((item) =>
              item.id === editingTool.id
                ? { ...item, name, is_enabled: isEnabled }
                : item
            )
          );
          setModalOpen(false);
        }
      } else {
        const res = await createTool(formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setModalOpen(false);
          window.location.reload();
        }
      }
    });
  };

  const handleDelete = (t: Tool) => {
    if (!confirm(`Are you sure you want to delete tool "${t.name}"?`)) return;
    startTransition(async () => {
      const res = await deleteTool(t.id);
      if (res?.success) {
        setTools((prev) => prev.filter((item) => item.id !== t.id));
      }
    });
  };

  const handleToggle = (t: Tool) => {
    startTransition(async () => {
      const res = await toggleTool(t.id, t.is_enabled);
      if (res?.success) {
        setTools((prev) =>
          prev.map((item) =>
            item.id === t.id
              ? { ...item, is_enabled: !item.is_enabled }
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
            Tools CMS
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            Manage the software tools & stack displayed in the continuous marquee on the homepage.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-4 py-2 text-xs font-semibold text-background hover:bg-white transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Tool</span>
        </button>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden divide-y divide-surface-border">
        {tools.length === 0 ? (
          <div className="p-12 text-center text-xs text-editorial-500">
            No tools configured yet. Click &ldquo;Add Tool&rdquo; to add software items.
          </div>
        ) : (
          tools.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-5 hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-editorial-100">
                  {t.name}
                </span>
                <button
                  onClick={() => handleToggle(t)}
                  disabled={isPending}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase transition-opacity ${
                    t.is_enabled
                      ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20"
                  }`}
                >
                  {t.is_enabled ? "Active" : "Disabled"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(t)}
                  className="p-2 rounded-lg border border-surface-border text-editorial-300 hover:bg-surface-muted hover:text-white transition-colors"
                  title="Edit Tool"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t)}
                  className="p-2 rounded-lg text-editorial-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Tool"
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
          <div className="w-full max-w-md rounded-3xl border border-surface-border bg-surface p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-medium text-editorial-50">
              {editingTool ? "Edit Tool" : "Add New Tool"}
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
                  Tool / Software Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Figma, Framer, Linear, React"
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="tool-enabled"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-surface-border text-editorial-100 bg-surface-muted"
                />
                <label
                  htmlFor="tool-enabled"
                  className="text-xs text-editorial-200 cursor-pointer"
                >
                  Enable in marquee display
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
                  <span>{editingTool ? "Save Changes" : "Add Tool"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
