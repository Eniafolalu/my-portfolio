"use client";

import { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { SocialLink } from "@/types/portfolio";
import {
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  toggleSocialLink,
} from "@/lib/actions/cms";

interface SocialsManagerProps {
  initialSocials: SocialLink[];
}

export function SocialsManager({ initialSocials }: SocialsManagerProps) {
  const [socials, setSocials] = useState<SocialLink[]>(initialSocials);
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialLink | null>(null);

  // Form State
  const [platform, setPlatform] = useState("LinkedIn");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setPlatform("LinkedIn");
    setLabel("");
    setUrl("");
    setIsEnabled(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (s: SocialLink) => {
    setEditingItem(s);
    setPlatform(s.platform);
    setLabel(s.label);
    setUrl(s.url);
    setIsEnabled(s.is_enabled);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !label.trim() || !url.trim()) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("platform", platform);
    formData.append("label", label);
    formData.append("url", url);
    formData.append("is_enabled", isEnabled ? "true" : "false");

    startTransition(async () => {
      if (editingItem) {
        const res = await updateSocialLink(editingItem.id, formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setSocials((prev) =>
            prev.map((item) =>
              item.id === editingItem.id
                ? { ...item, platform, label, url, is_enabled: isEnabled }
                : item
            )
          );
          setModalOpen(false);
        }
      } else {
        const res = await createSocialLink(formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setModalOpen(false);
          window.location.reload();
        }
      }
    });
  };

  const handleDelete = (s: SocialLink) => {
    if (!confirm(`Delete link for "${s.label}"?`)) return;
    startTransition(async () => {
      const res = await deleteSocialLink(s.id);
      if (res?.success) {
        setSocials((prev) => prev.filter((item) => item.id !== s.id));
      }
    });
  };

  const handleToggle = (s: SocialLink) => {
    startTransition(async () => {
      const res = await toggleSocialLink(s.id, s.is_enabled);
      if (res?.success) {
        setSocials((prev) =>
          prev.map((item) =>
            item.id === s.id ? { ...item, is_enabled: !item.is_enabled } : item
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
            Social Channels CMS
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            Manage your public social links (LinkedIn, Behance, Instagram, Dribbble, X) and active visibility.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-4 py-2 text-xs font-semibold text-background hover:bg-white transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Social Link</span>
        </button>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden divide-y divide-surface-border">
        {socials.length === 0 ? (
          <div className="p-12 text-center text-xs text-editorial-500">
            No social links configured yet. Click &ldquo;Add Social Link&rdquo; to add channels.
          </div>
        ) : (
          socials.map((s) => (
            <div
              key={s.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-editorial-100">
                  {s.label}
                </span>
                <span className="text-xs text-editorial-500 font-mono">
                  ({s.platform})
                </span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-editorial-400 hover:text-editorial-200 flex items-center gap-1 truncate max-w-xs"
                >
                  <span className="truncate">{s.url}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  onClick={() => handleToggle(s)}
                  disabled={isPending}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase transition-opacity ${
                    s.is_enabled
                      ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20"
                  }`}
                >
                  {s.is_enabled ? "Enabled" : "Disabled"}
                </button>

                <button
                  onClick={() => openEditModal(s)}
                  className="p-2 rounded-lg border border-surface-border text-editorial-300 hover:bg-surface-muted hover:text-white transition-colors"
                  title="Edit Link"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(s)}
                  className="p-2 rounded-lg text-editorial-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Link"
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
              {editingItem ? "Edit Social Link" : "Add Social Link"}
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
                  Platform
                </label>
                <input
                  type="text"
                  required
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="e.g., LinkedIn, Behance, Dribbble, X"
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Display Label *
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g., LinkedIn / Enioluwa Afolalu"
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Profile URL *
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="social-enabled"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-surface-border text-editorial-100 bg-surface-muted"
                />
                <label
                  htmlFor="social-enabled"
                  className="text-xs text-editorial-200 cursor-pointer"
                >
                  Enable link in portfolio footer and contact section
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
                  <span>{editingItem ? "Save Changes" : "Add Link"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
