import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
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
          Edit Project: {params.id}
        </h1>
        <p className="text-xs text-editorial-400 mt-1">
          Modify project metadata, cover artwork, and gallery slides.
        </p>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface p-8 text-center text-xs text-editorial-400">
        <p className="text-sm font-medium text-editorial-200">
          Project Editor Architecture Ready
        </p>
        <p className="mt-2 max-w-md mx-auto">
          Full edit controls, Supabase Storage media management, duplicate, archive, and delete flows will be wired in Phase 3.
        </p>
      </div>
    </div>
  );
}
