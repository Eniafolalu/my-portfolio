import { Plus, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SocialLink } from "@/types/portfolio";

export default async function AdminSocialsPage() {
  let socials: SocialLink[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) socials = data;
  } catch (err) {
    console.warn(err);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
            Social Channels CMS
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            Manage your public social links (LinkedIn, Behance, Instagram, Dribbble, X) and toggles.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-4 py-2 text-xs font-semibold text-background hover:bg-white transition-colors">
          <Plus className="h-3.5 w-3.5" />
          <span>Add Social Link</span>
        </button>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden divide-y divide-surface-border">
        {socials.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between p-5 hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-editorial-100">{s.label}</span>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-editorial-500 hover:text-editorial-300 flex items-center gap-1"
              >
                <span>{s.url}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                  s.is_enabled
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-zinc-500/10 text-zinc-400"
                }`}
              >
                {s.is_enabled ? "Enabled" : "Disabled"}
              </span>
              <span className="text-editorial-500">Order: {s.sort_order}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
