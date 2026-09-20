import Link from "next/link";
import { ArrowUpRight, MessageSquare, Calendar } from "lucide-react";
import { SocialLink } from "@/types/portfolio";

interface PublicFooterProps {
  calendlyUrl?: string;
  socialLinks?: SocialLink[];
  ownerName?: string;
}

export function PublicFooter({
  calendlyUrl = "https://calendly.com",
  socialLinks = [],
  ownerName = "Enioluwa Afolalu",
}: PublicFooterProps) {
  const currentYear = new Date().getFullYear();

  // Fallback social links if database is empty
  const defaultSocials = [
    { id: "1", platform: "LinkedIn", label: "LinkedIn", url: "https://linkedin.com", sort_order: 1, is_enabled: true, created_at: "" },
    { id: "2", platform: "Behance", label: "Behance", url: "https://behance.net", sort_order: 2, is_enabled: true, created_at: "" },
    { id: "3", platform: "Instagram", label: "Instagram", url: "https://instagram.com", sort_order: 3, is_enabled: true, created_at: "" },
    { id: "4", platform: "Dribbble", label: "Dribbble", url: "https://dribbble.com", sort_order: 4, is_enabled: true, created_at: "" },
    { id: "5", platform: "X", label: "X (Twitter)", url: "https://x.com", sort_order: 5, is_enabled: true, created_at: "" },
  ];

  const displayedSocials = socialLinks.length > 0
    ? socialLinks.filter((s) => s.is_enabled)
    : defaultSocials;

  return (
    <footer className="border-t border-surface-border bg-background pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Main CTA Section */}
        <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface/50 p-8 sm:p-12 lg:p-16">
          <div className="max-w-3xl space-y-6">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-editorial-400">
              HAVE A PRODUCT IN MIND?
            </span>
            <h2 className="text-3xl font-medium tracking-tight text-editorial-50 sm:text-4xl lg:text-5xl">
              Let&apos;s turn your idea into an experience people enjoy using.
            </h2>
            <p className="max-w-xl text-base text-editorial-400">
              Available for select product design advisory, design system architectures, and end-to-end digital product design engagements.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-editorial-100 px-6 py-3.5 text-sm font-semibold text-background transition-all hover:bg-white"
              >
                <Calendar className="h-4 w-4" />
                <span>Book a Call</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface px-6 py-3.5 text-sm font-semibold text-editorial-100 transition-all hover:border-editorial-200/40 hover:bg-surface-hover"
              >
                <MessageSquare className="h-4 w-4 text-editorial-400" />
                <span>Send a Message</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Social Links & Meta */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-surface-border/50 pt-8 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {displayedSocials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-editorial-400 transition-colors hover:text-editorial-100"
              >
                <span>{social.label}</span>
                <ArrowUpRight className="h-3 w-3 text-editorial-600 transition-colors group-hover:text-editorial-300" />
              </a>
            ))}
          </div>

          <div className="text-xs text-editorial-500">
            © {currentYear} {ownerName}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
