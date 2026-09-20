import { getSiteSettings } from "@/lib/data";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
          Site Settings
        </h1>
        <p className="text-xs text-editorial-400 mt-1">
          Configure global identity settings, external URLs (Calendly, Behance), and contact details.
        </p>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface p-6 space-y-6">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-editorial-400">
            Owner Name
          </label>
          <div className="mt-1 text-sm font-medium text-editorial-100">
            {settings?.owner_name || "Enioluwa Afolalu"}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-editorial-400">
            Professional Title
          </label>
          <div className="mt-1 text-sm font-medium text-editorial-100">
            {settings?.professional_title || "Product Designer · UI/UX Designer"}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-editorial-400">
            Calendly URL (Powers &ldquo;Book a Call&rdquo; across site)
          </label>
          <div className="mt-1 text-sm font-mono text-editorial-300">
            {settings?.calendly_url || "https://calendly.com"}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-editorial-400">
            Behance Profile URL (Powers &ldquo;View Behance&rdquo; buttons)
          </label>
          <div className="mt-1 text-sm font-mono text-editorial-300">
            {settings?.behance_url || "https://behance.net"}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-editorial-400">
            Contact Email
          </label>
          <div className="mt-1 text-sm font-mono text-editorial-300">
            {settings?.contact_email || "enioluwa.afolalu@example.com"}
          </div>
        </div>
      </div>
    </div>
  );
}
