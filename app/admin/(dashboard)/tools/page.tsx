import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Tool } from "@/types/portfolio";

export default async function AdminToolsPage() {
  let tools: Tool[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("tools")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) tools = data;
  } catch (err) {
    console.warn(err);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
            Tools CMS
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            Manage the software tools displayed in the continuous marquee on the homepage.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-4 py-2 text-xs font-semibold text-background hover:bg-white transition-colors">
          <Plus className="h-3.5 w-3.5" />
          <span>Add Tool</span>
        </button>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden divide-y divide-surface-border">
        {tools.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between p-5 hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-editorial-100">{t.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                  t.is_enabled
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-zinc-500/10 text-zinc-400"
                }`}
              >
                {t.is_enabled ? "Active" : "Disabled"}
              </span>
            </div>
            <div className="text-xs text-editorial-400">Order: {t.sort_order}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
