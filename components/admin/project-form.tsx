"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  Trash2,
  ExternalLink,
  Loader2,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { Project, ProjectImage } from "@/types/portfolio";
import {
  createProject,
  updateProject,
  deleteProject,
  deleteGalleryImage,
} from "@/lib/actions/projects";

interface ProjectFormProps {
  initialData?: Project;
  initialImages?: ProjectImage[];
  isEdit?: boolean;
}

const CATEGORIES = [
  "Mobile Apps",
  "Websites",
  "Dashboards",
  "Design Systems",
  "Brand & Identity",
  "Product Strategy",
];

const PROJECT_TYPES = [
  "Mobile Application",
  "Web Application",
  "SaaS Dashboard",
  "Marketing Website",
  "E-Commerce Platform",
  "Design System & UI Kit",
];

export function ProjectForm({
  initialData,
  initialImages = [],
  isEdit = false,
}: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [shortDescription, setShortDescription] = useState(
    initialData?.short_description || ""
  );
  const [category, setCategory] = useState(
    initialData?.category || "Mobile Apps"
  );
  const [projectType, setProjectType] = useState(
    initialData?.project_type || "Mobile Application"
  );
  const [role, setRole] = useState(
    initialData?.role || "Lead Product Designer"
  );
  const [timeline, setTimeline] = useState(
    initialData?.timeline || "3 Months · 2024"
  );
  const [team, setTeam] = useState(initialData?.team || "");
  const [tools, setTools] = useState(
    initialData?.tools?.join(", ") || "Figma, Protopie, Design Tokens"
  );
  const [behanceUrl, setBehanceUrl] = useState(
    initialData?.behance_url || ""
  );
  const [status, setStatus] = useState<"published" | "draft" | "archived">(
    initialData?.status || "draft"
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData?.is_featured || false
  );

  // Cover image preview
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.cover_image || null
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Gallery state
  const [existingImages, setExistingImages] = useState<ProjectImage[]>(
    initialImages
  );
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Auto-generate slug if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit && (!slug || slug === slugify(title))) {
      setSlug(slugify(val));
    }
  };

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    }
  };

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryFiles((prev) => [...prev, ...files]);
      const newUrls = files.map((f) => URL.createObjectURL(f));
      setGalleryPreviews((prev) => [...prev, ...newUrls]);
    }
  };

  const handleRemoveNewGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (img: ProjectImage) => {
    if (!confirm("Are you sure you want to delete this gallery image?")) return;
    try {
      await deleteGalleryImage(img.id, img.image_url);
      setExistingImages((prev) => prev.filter((i) => i.id !== img.id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete gallery image.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !shortDescription.trim() || !category || !projectType || !role || !timeline) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isEdit && !coverFile && !coverPreview) {
      setError("Please upload a cover image for the project.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug || slugify(title));
    formData.append("short_description", shortDescription);
    formData.append("category", category);
    formData.append("project_type", projectType);
    formData.append("role", role);
    formData.append("timeline", timeline);
    formData.append("team", team);
    formData.append("tools", tools);
    formData.append("behance_url", behanceUrl);
    formData.append("status", status);
    formData.append("is_featured", isFeatured ? "true" : "false");

    if (coverFile) {
      formData.append("cover_image", coverFile);
    }

    galleryFiles.forEach((f) => {
      formData.append("gallery_images", f);
    });

    startTransition(async () => {
      try {
        if (isEdit && initialData) {
          const res = await updateProject(initialData.id, formData);
          if (res?.error) {
            setError(res.error);
          } else {
            setSuccess("Project updated successfully!");
            setGalleryFiles([]);
            setGalleryPreviews([]);
            router.refresh();
          }
        } else {
          const res = await createProject(formData);
          if (res?.error) {
            setError(res.error);
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  };

  const handleDeleteProject = async () => {
    if (!initialData) return;
    if (
      !confirm(
        `Are you sure you want to permanently delete "${initialData.title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteProject(initialData.id);
      if (res?.error) {
        setError(res.error);
        setIsDeleting(false);
      } else {
        router.push("/admin/projects");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete project.");
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-16">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-xs font-medium text-editorial-400 hover:text-editorial-100 mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Projects</span>
          </Link>
          <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
            {isEdit ? `Edit Project: ${initialData?.title}` : "Create New Project"}
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            {isEdit
              ? "Update project information, media assets, and Behance redirects."
              : "Publish a new case study to your portfolio with real-time Supabase storage."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEdit && (
            <button
              type="button"
              disabled={isDeleting || isPending}
              onClick={handleDeleteProject}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              <span>Delete Project</span>
            </button>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-5 py-2.5 text-xs font-semibold text-background hover:bg-white transition-all disabled:opacity-50 shadow-md"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>
              {isPending
                ? isEdit
                  ? "Saving Changes..."
                  : "Creating Project..."
                : isEdit
                ? "Save Changes"
                : "Publish Project"}
            </span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-400">
          <Check className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Core Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Card: Basic Info */}
          <div className="rounded-2xl border border-surface-border bg-surface p-6 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
              Project Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Payflow Financial Platform"
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-sm text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  URL Slug *
                </label>
                <div className="flex items-center rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-sm">
                  <span className="text-editorial-500 text-xs mr-1">/projects/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    placeholder="payflow-financial-platform"
                    className="w-full bg-transparent text-editorial-100 placeholder:text-editorial-600 focus:outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Short Description & Case Study Summary *
                </label>
                <textarea
                  required
                  rows={4}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A complete UX redesign and mobile application architecture for modern cross-border payments..."
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-3 text-sm text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card: Cover Image & Gallery */}
          <div className="rounded-2xl border border-surface-border bg-surface p-6 space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
                Media & Visual Assets
              </h2>
              <p className="text-xs text-editorial-400 mt-1">
                Upload primary cover artwork and supplemental gallery slides. Images are uploaded to Supabase Storage.
              </p>
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-editorial-300">
                Primary Cover Image *
              </label>

              {coverPreview ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-surface-border group bg-surface-muted">
                  <Image
                    src={coverPreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer rounded-xl bg-editorial-100 px-3.5 py-2 text-xs font-semibold text-background hover:bg-white transition-colors">
                      <span>Change Cover Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-surface-border rounded-2xl p-8 cursor-pointer hover:border-editorial-300 hover:bg-surface-muted/50 transition-colors">
                  <Upload className="h-8 w-8 text-editorial-500 mb-2" />
                  <span className="text-xs font-medium text-editorial-200">
                    Click to upload high-res cover image
                  </span>
                  <span className="text-[11px] text-editorial-500 mt-1">
                    PNG, JPG, or WEBP (Recommended: 16:9 ratio, min 1600x900)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Gallery Images */}
            <div className="space-y-4 pt-4 border-t border-surface-border">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-medium text-editorial-300">
                    Gallery Images & Mockups
                  </label>
                  <p className="text-[11px] text-editorial-500">
                    Displayed in the 3D spatial carousel and case study deep-dives.
                  </p>
                </div>

                <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-xl border border-surface-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-editorial-200 hover:bg-surface-hover hover:text-white transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryFilesChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Grid of existing + newly added images */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Existing DB images */}
                {existingImages.map((img) => (
                  <div
                    key={img.id}
                    className="group relative aspect-video rounded-xl overflow-hidden border border-surface-border bg-surface-muted"
                  >
                    <Image
                      src={img.image_url}
                      alt="Gallery asset"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img)}
                        className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                        title="Delete image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Newly selected images before upload */}
                {galleryPreviews.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-video rounded-xl overflow-hidden border border-editorial-300/40 bg-surface-muted"
                  >
                    <Image
                      src={url}
                      alt="New upload preview"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-emerald-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                      New
                    </span>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveNewGalleryImage(idx)}
                        className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {existingImages.length === 0 && galleryPreviews.length === 0 && (
                <div className="py-6 text-center border border-dashed border-surface-border rounded-xl text-xs text-editorial-500">
                  <ImageIcon className="mx-auto h-5 w-5 mb-1.5 text-editorial-600" />
                  No additional gallery images added yet.
                </div>
              )}
            </div>
          </div>

          {/* Card: External Links */}
          <div className="rounded-2xl border border-surface-border bg-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
              External Case Study Links
            </h2>
            <div>
              <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                Behance Presentation URL
              </label>
              <div className="flex items-center rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-sm">
                <input
                  type="url"
                  value={behanceUrl}
                  onChange={(e) => setBehanceUrl(e.target.value)}
                  placeholder="https://behance.net/gallery/..."
                  className="w-full bg-transparent text-editorial-100 placeholder:text-editorial-600 focus:outline-none text-xs"
                />
                {behanceUrl && (
                  <a
                    href={behanceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-editorial-400 hover:text-editorial-100 ml-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Metadata & Settings */}
        <div className="space-y-6">
          {/* Card: Publishing Settings */}
          <div className="rounded-2xl border border-surface-border bg-surface p-6 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
              Visibility & Status
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Publish Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "published" | "draft" | "archived")
                  }
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none"
                >
                  <option value="published">Published (Visible Live)</option>
                  <option value="draft">Draft (Admin Only)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-surface-border">
                <div>
                  <label className="text-xs font-medium text-editorial-100 block">
                    Featured Project
                  </label>
                  <span className="text-[11px] text-editorial-500">
                    Prioritize in Hero 3D Gallery
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-surface-border text-editorial-100 focus:ring-0 focus:ring-offset-0 bg-surface-muted cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card: Classification */}
          <div className="rounded-2xl border border-surface-border bg-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
              Classification
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Primary Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Project Sub-Type *
                </label>
                <input
                  type="text"
                  required
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  placeholder="e.g., Mobile Application"
                  list="project-types"
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                />
                <datalist id="project-types">
                  {PROJECT_TYPES.map((pt) => (
                    <option key={pt} value={pt} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Card: Project Scope & Role */}
          <div className="rounded-2xl border border-surface-border bg-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
              Role & Scope
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  My Role *
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Lead Product Designer"
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Timeline *
                </label>
                <input
                  type="text"
                  required
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g., 3 Months · 2024"
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Team Composition (Optional)
                </label>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="e.g., 1 PM, 3 Engineers, 1 UX Researcher"
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                  Tools & Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                  placeholder="Figma, Protopie, React, Storybook"
                  className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
