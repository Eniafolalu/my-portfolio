"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, AlertCircle, Save } from "lucide-react";
import { SiteSettings } from "@/types/portfolio";
import { updateSiteSettings } from "@/lib/actions/cms";

interface SettingsManagerProps {
  initialSettings: SiteSettings | null;
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ownerName, setOwnerName] = useState(
    initialSettings?.owner_name || "Enioluwa Afolalu"
  );
  const [professionalTitle, setProfessionalTitle] = useState(
    initialSettings?.professional_title || "Product Designer · UI/UX Designer"
  );
  const [calendlyUrl, setCalendlyUrl] = useState(
    initialSettings?.calendly_url || "https://calendly.com"
  );
  const [behanceUrl, setBehanceUrl] = useState(
    initialSettings?.behance_url || "https://behance.net"
  );
  const [contactEmail, setContactEmail] = useState(
    initialSettings?.contact_email || "enioluwa.afolalu@example.com"
  );
  const [linkedinUrl, setLinkedinUrl] = useState(
    initialSettings?.linkedin_url || "https://linkedin.com"
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("owner_name", ownerName);
    formData.append("professional_title", professionalTitle);
    formData.append("calendly_url", calendlyUrl);
    formData.append("behance_url", behanceUrl);
    formData.append("contact_email", contactEmail);
    formData.append("linkedin_url", linkedinUrl);
    formData.append(
      "about_headline",
      initialSettings?.about_headline || ""
    );
    formData.append(
      "about_description",
      initialSettings?.about_description || ""
    );
    formData.append(
      "skills_list",
      initialSettings?.skills_list?.join("\n") || ""
    );

    startTransition(async () => {
      const res = await updateSiteSettings(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  return (
    <div className="max-w-3xl space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
          Site Identity & Settings
        </h1>
        <p className="text-xs text-editorial-400 mt-1">
          Configure global identity settings, external URLs (Calendly booking, Behance), and contact details.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400">
          <Check className="h-4 w-4 shrink-0" />
          <span>Site settings saved and synchronized live!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-surface-border bg-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
            Identity & Bio
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                Owner Full Name *
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                Professional Title / Headline *
              </label>
              <input
                type="text"
                required
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-editorial-200">
            Booking & External Integrations
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                Calendly URL (Powers &ldquo;Book a Call&rdquo; CTA buttons) *
              </label>
              <input
                type="url"
                required
                value={calendlyUrl}
                onChange={(e) => setCalendlyUrl(e.target.value)}
                placeholder="https://calendly.com/your-handle"
                className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                Behance Profile URL (Default Behance destination) *
              </label>
              <input
                type="url"
                required
                value={behanceUrl}
                onChange={(e) => setBehanceUrl(e.target.value)}
                placeholder="https://behance.net/your-profile"
                className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/your-profile"
                className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-editorial-300 mb-1.5">
                Inquiry Destination Email *
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="hello@enioluwa.design"
                className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5 text-xs text-editorial-100 focus:border-editorial-300 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-editorial-100 px-6 py-2.5 text-xs font-semibold text-background hover:bg-white transition-colors shadow-md"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>{isPending ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
