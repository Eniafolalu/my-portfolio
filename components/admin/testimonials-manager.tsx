"use client";

import { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Loader2, Star, AlertCircle } from "lucide-react";
import { Testimonial } from "@/types/portfolio";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialFeatured,
} from "@/lib/actions/cms";

interface TestimonialsManagerProps {
  initialTestimonials: Testimonial[];
}

export function TestimonialsManager({
  initialTestimonials,
}: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(initialTestimonials);
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  // Form State
  const [clientName, setClientName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setClientName("");
    setRole("");
    setCompany("");
    setTestimonial("");
    setIsFeatured(true);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingItem(t);
    setClientName(t.client_name);
    setRole(t.role);
    setCompany(t.company);
    setTestimonial(t.testimonial);
    setIsFeatured(t.is_featured);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !role.trim() || !company.trim() || !testimonial.trim()) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("client_name", clientName);
    formData.append("role", role);
    formData.append("company", company);
    formData.append("testimonial", testimonial);
    formData.append("is_featured", isFeatured ? "true" : "false");

    startTransition(async () => {
      if (editingItem) {
        const res = await updateTestimonial(editingItem.id, formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setTestimonials((prev) =>
            prev.map((item) =>
              item.id === editingItem.id
                ? {
                    ...item,
                    client_name: clientName,
                    role,
                    company,
                    testimonial,
                    is_featured: isFeatured,
                  }
                : item
            )
          );
          setModalOpen(false);
        }
      } else {
        const res = await createTestimonial(formData);
        if (res?.error) {
          setError(res.error);
        } else {
          setModalOpen(false);
          window.location.reload();
        }
      }
    });
  };

  const handleDelete = (t: Testimonial) => {
    if (!confirm(`Delete testimonial from ${t.client_name}?`)) return;
    startTransition(async () => {
      const res = await deleteTestimonial(t.id);
      if (res?.success) {
        setTestimonials((prev) => prev.filter((item) => item.id !== t.id));
      }
    });
  };

  const handleToggleFeatured = (t: Testimonial) => {
    startTransition(async () => {
      const res = await toggleTestimonialFeatured(t.id, t.is_featured);
      if (res?.success) {
        setTestimonials((prev) =>
          prev.map((item) =>
            item.id === t.id
              ? { ...item, is_featured: !item.is_featured }
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
            Testimonials CMS
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            Manage client quotes, roles, companies, and featured carousel priority.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-4 py-2 text-xs font-semibold text-background hover:bg-white transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden divide-y divide-surface-border">
        {testimonials.length === 0 ? (
          <div className="p-12 text-center text-xs text-editorial-500">
            No testimonials added yet. Click &ldquo;Add Testimonial&rdquo; to add client feedback.
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-surface-hover transition-colors"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-editorial-100">
                    {t.client_name}
                  </span>
                  <span className="text-xs text-editorial-400">
                    {t.role}, {t.company}
                  </span>
                  <button
                    onClick={() => handleToggleFeatured(t)}
                    disabled={isPending}
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                      t.is_featured
                        ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        : "bg-surface-muted text-editorial-500 hover:text-editorial-300"
                    }`}
                  >
                    <Star
                      className={`h-2.5 w-2.5 ${
                        t.is_featured ? "fill-blue-400" : ""
                      }`}
                    />
                    <span>{t.is_featured ? "Featured" : "Standard"}</span>
                  </button>
                </div>
                <p className="mt-1 text-xs text-editorial-300 italic max-w-2xl line-clamp-2">
                  &ldquo;{t.testimonial}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => openEditModal(t)}
                  className="p-2 rounded-lg border border-surface-border text-editorial-300 hover:bg-surface-muted hover:text-white transition-colors"
                  title="Edit Testimonial"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t)}
                  className="p-2 rounded-lg text-editorial-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Testimonial"
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
              {editingItem ? "Edit Testimonial" : "Add New Testimonial"}
            </h2>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g., Sarah Jenkins"
                    className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                    Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., VP of Product"
                    className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Stripe, Fintech Corp"
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Client Quote / Testimonial *
                </label>
                <textarea
                  required
                  rows={4}
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  placeholder="Enioluwa transformed our entire product design system and boosted user activation by 35%..."
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="test-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-surface-border text-editorial-100 bg-surface-muted"
                />
                <label
                  htmlFor="test-featured"
                  className="text-xs text-editorial-200 cursor-pointer"
                >
                  Feature this testimonial on the homepage
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
                  <span>{editingItem ? "Save Changes" : "Create Testimonial"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
