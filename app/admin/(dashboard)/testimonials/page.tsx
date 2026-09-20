import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Testimonial } from "@/types/portfolio";

export default async function AdminTestimonialsPage() {
  let testimonials: Testimonial[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) testimonials = data;
  } catch (err) {
    console.warn(err);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
            Testimonials CMS
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            Manage client testimonials, roles, companies, and featured status.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-4 py-2 text-xs font-semibold text-background hover:bg-white transition-colors">
          <Plus className="h-3.5 w-3.5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden divide-y divide-surface-border">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between p-5 hover:bg-surface-hover transition-colors"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-editorial-100">
                  {t.client_name}
                </span>
                <span className="text-xs text-editorial-400">
                  {t.role}, {t.company}
                </span>
                {t.is_featured && (
                  <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-editorial-300 italic max-w-2xl line-clamp-2">
                &ldquo;{t.testimonial}&rdquo;
              </p>
            </div>
            <div className="text-xs text-editorial-400">Order: {t.sort_order}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
