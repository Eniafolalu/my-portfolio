import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Service } from "@/types/portfolio";

export default async function AdminServicesPage() {
  let services: Service[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) services = data;
  } catch (err) {
    console.warn(err);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
            Services CMS
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            Define and reorder design service capabilities displayed across the portfolio.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-4 py-2 text-xs font-semibold text-background hover:bg-white transition-colors">
          <Plus className="h-3.5 w-3.5" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden divide-y divide-surface-border">
        {services.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-5 hover:bg-surface-hover transition-colors"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-editorial-100">
                  {s.title}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                    s.is_published
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {s.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="mt-1 text-xs text-editorial-400 max-w-xl">
                {s.description}
              </p>
            </div>
            <div className="text-xs text-editorial-400">
              Order: {s.sort_order}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
