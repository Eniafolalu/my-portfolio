import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-xs font-medium text-editorial-400 hover:text-editorial-100 mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </Link>
        <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
          Create New Project
        </h1>
        <p className="text-xs text-editorial-400 mt-1">
          Add a new case study, upload imagery to Supabase Storage, and configure metadata.
        </p>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface p-8 text-center text-xs text-editorial-400">
        <p className="text-sm font-medium text-editorial-200">
          Project Creation Architecture Ready
        </p>
        <p className="mt-2 max-w-md mx-auto">
          Full form controls (title, slug, category, role, tools, cover image upload, gallery reorder, Behance URL, and publish toggle) will be wired to Supabase Storage and database mutations in Phase 3.
        </p>
      </div>
    </div>
  );
}
