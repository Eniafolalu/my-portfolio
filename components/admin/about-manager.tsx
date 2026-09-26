"use client";

import { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Loader2, Check, AlertCircle } from "lucide-react";
import { CareerEntry, SiteSettings } from "@/types/portfolio";
import {
  createCareerEntry,
  updateCareerEntry,
  deleteCareerEntry,
  updateSiteSettings,
} from "@/lib/actions/cms";

interface AboutManagerProps {
  initialSettings: SiteSettings | null;
  initialEntries: CareerEntry[];
}

export function AboutManager({
  initialSettings,
  initialEntries,
}: AboutManagerProps) {
  const [entries, setEntries] = useState<CareerEntry[]>(initialEntries);
  const [isPending, startTransition] = useTransition();
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Bio Form State
  const [headline, setHeadline] = useState(
    initialSettings?.about_headline ||
      "I design digital experiences at the intersection of strategy, usability and visual design."
  );
  const [description, setDescription] = useState(
    initialSettings?.about_description ||
      "With over 4 years of specialized experience in product design, I partner with fast-growing startups and enterprises to create thoughtful, user-centered digital products that drive measurable business impact."
  );
  const [skillsText, setSkillsText] = useState(
    initialSettings?.skills_list?.join("\n") ||
      "Product Strategy\nUser Research\nWireframing & Prototyping\nDesign Systems\nInteraction Design\nUsability Testing"
  );

  // Timeline Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CareerEntry | null>(null);
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [entryDescription, setEntryDescription] = useState("");
  const [entryError, setEntryError] = useState<string | null>(null);

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError(null);
    setSettingsSuccess(false);

    const formData = new FormData();
    formData.append("owner_name", initialSettings?.owner_name || "Enioluwa Afolalu");
    formData.append(
      "professional_title",
      initialSettings?.professional_title || "Lead Product Designer"
    );
    formData.append("about_headline", headline);
    formData.append("about_description", description);
    formData.append("skills_list", skillsText);
    formData.append("calendly_url", initialSettings?.calendly_url || "");
    formData.append("behance_url", initialSettings?.behance_url || "");
    formData.append("contact_email", initialSettings?.contact_email || "");
    formData.append("linkedin_url", initialSettings?.linkedin_url || "");

    startTransition(async () => {
      const res = await updateSiteSettings(formData);
      if (res?.error) {
        setSettingsError(res.error);
      } else {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    });
  };

  const openCreateTimelineModal = () => {
    setEditingEntry(null);
    setYear("");
    setTitle("");
    setCompany("");
    setEntryDescription("");
    setEntryError(null);
    setModalOpen(true);
  };

  const openEditTimelineModal = (e: CareerEntry) => {
    setEditingEntry(e);
    setYear(e.year);
    setTitle(e.title);
    setCompany(e.company || "");
    setEntryDescription(e.description);
    setEntryError(null);
    setModalOpen(true);
  };

  const handleSaveTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year.trim() || !title.trim() || !entryDescription.trim()) {
      setEntryError("Year, title, and description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("year", year);
    formData.append("title", title);
    formData.append("company", company);
    formData.append("description", entryDescription);

    startTransition(async () => {
      if (editingEntry) {
        const res = await updateCareerEntry(editingEntry.id, formData);
        if (res?.error) {
          setEntryError(res.error);
        } else {
          setEntries((prev) =>
            prev.map((item) =>
              item.id === editingEntry.id
                ? {
                    ...item,
                    year,
                    title,
                    company: company || null,
                    description: entryDescription,
                  }
                : item
            )
          );
          setModalOpen(false);
        }
      } else {
        const res = await createCareerEntry(formData);
        if (res?.error) {
          setEntryError(res.error);
        } else {
          setModalOpen(false);
          window.location.reload();
        }
      }
    });
  };

  const handleDeleteTimeline = (e: CareerEntry) => {
    if (!confirm(`Delete milestone "${e.title}" (${e.year})?`)) return;
    startTransition(async () => {
      const res = await deleteCareerEntry(e.id);
      if (res?.success) {
        setEntries((prev) => prev.filter((item) => item.id !== e.id));
      }
    });
  };

  return (
    <div className="space-y-10 pb-12">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
          About & Career Journey CMS
        </h1>
        <p className="text-xs text-editorial-400 mt-1">
          Manage your editorial biography, skills matrix, and career timeline milestones.
        </p>
      </div>

      {/* Biography & Skills Form */}
      <form onSubmit={handleSaveBio} className="space-y-6">
        <div className="rounded-2xl border border-surface-border bg-surface p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
              Biography & Narrative
            </h2>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-4 py-2 text-xs font-semibold text-background hover:bg-white transition-colors"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Bio Settings</span>
            </button>
          </div>

          {settingsError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{settingsError}</span>
            </div>
          )}

          {settingsSuccess && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
              <Check className="h-4 w-4 shrink-0" />
              <span>Bio settings updated successfully!</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                About Headline (Punchy Introduction) *
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                Detailed Biography & Design Philosophy *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                Core Skills Matrix (One per line)
              </label>
              <textarea
                rows={4}
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="Product Strategy&#10;Design Systems&#10;UX Research"
                className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Career Timeline Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
            Career Timeline Milestones ({entries.length})
          </h2>
          <button
            onClick={openCreateTimelineModal}
            className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-3.5 py-1.5 text-xs font-semibold text-background hover:bg-white transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Timeline Entry</span>
          </button>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden divide-y divide-surface-border">
          {entries.length === 0 ? (
            <div className="p-12 text-center text-xs text-editorial-500">
              No timeline milestones recorded yet. Click &ldquo;Add Timeline Entry&rdquo; to build your history.
            </div>
          ) : (
            entries.map((e) => (
              <div
                key={e.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-surface-hover transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-emerald-400">
                      {e.year}
                    </span>
                    <span className="text-sm font-medium text-editorial-100">
                      {e.title}
                    </span>
                    {e.company && (
                      <span className="text-xs text-editorial-400">
                        · {e.company}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-editorial-400 max-w-2xl leading-relaxed">
                    {e.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => openEditTimelineModal(e)}
                    className="p-2 rounded-lg border border-surface-border text-editorial-300 hover:bg-surface-muted hover:text-white transition-colors"
                    title="Edit Entry"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTimeline(e)}
                    className="p-2 rounded-lg text-editorial-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Timeline */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-surface-border bg-surface p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-medium text-editorial-50">
              {editingEntry ? "Edit Timeline Entry" : "Add Timeline Entry"}
            </h2>

            {entryError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{entryError}</span>
              </div>
            )}

            <form onSubmit={handleSaveTimeline} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                    Year / Time Period *
                  </label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g., 2023 – Present"
                    className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                    Role / Milestone Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Senior Product Designer"
                    className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Company / Organization (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Fintech Global"
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Summary & Impact *
                </label>
                <textarea
                  required
                  rows={3}
                  value={entryDescription}
                  onChange={(e) => setEntryDescription(e.target.value)}
                  placeholder="Led end-to-end UX for multi-currency wallet and design tokens library..."
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none leading-relaxed"
                />
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
                  <span>{editingEntry ? "Save Milestone" : "Add Milestone"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
