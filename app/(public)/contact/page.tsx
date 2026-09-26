export const dynamic = "force-dynamic";

import { Calendar, ArrowUpRight, Mail } from "lucide-react";
import { getSiteSettings, getTestimonials } from "@/lib/data";
import { ContactForm } from "@/components/contact/contact-form";

export default async function ContactPage() {
  const [settings, testimonials] = await Promise.all([
    getSiteSettings(),
    getTestimonials(),
  ]);

  const calendlyUrl = settings?.calendly_url || "https://calendly.com";
  const contactEmail =
    settings?.contact_email || "enioluwa.afolalu@example.com";
  const behanceUrl = settings?.behance_url || "https://behance.net";
  const linkedinUrl = settings?.linkedin_url || "https://linkedin.com";

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28">
      {/* Header */}
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
          GET IN TOUCH
        </span>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-editorial-50 sm:text-6xl">
          LET&apos;S WORK TOGETHER
        </h1>
        <p className="mt-4 text-base text-editorial-400 sm:text-lg">
          Have a product, idea or experience you want to bring to life? Tell me a little about it.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Form Container */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        {/* Sidebar Info & Direct Channels */}
        <div className="flex flex-col justify-between space-y-10 lg:col-span-5">
          {/* Quick Call Box */}
          <div className="rounded-3xl border border-surface-border bg-surface p-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
              DIRECT BOOKING
            </span>
            <h2 className="mt-2 text-xl font-medium text-editorial-50">
              PREFER A QUICK CONVERSATION?
            </h2>
            <p className="mt-2 text-sm text-editorial-400">
              Pick a 30-minute introductory discovery session directly on my calendar.
            </p>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-editorial-100 px-6 py-3 text-xs font-semibold text-background transition-all hover:bg-white"
            >
              <Calendar className="h-4 w-4" />
              <span>Book a Call</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Direct Details */}
          <div className="space-y-4 rounded-3xl border border-surface-border bg-surface p-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
              DIRECT CHANNELS
            </span>
            <div className="space-y-3 pt-2">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center justify-between text-sm text-editorial-200 hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-editorial-400" />
                  <span>{contactEmail}</span>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-editorial-500" />
              </a>

              <a
                href={behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-sm text-editorial-200 hover:text-white"
              >
                <span>Behance Profile</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-editorial-500" />
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-sm text-editorial-200 hover:text-white"
              >
                <span>LinkedIn Profile</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-editorial-500" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials on Contact Page */}
      {testimonials.length > 0 && (
        <div className="mt-28 border-t border-surface-border pt-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-editorial-400">
            CLIENT FEEDBACK
          </span>
          <h2 className="mt-2 text-2xl font-medium text-editorial-50">
            What Clients Say
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.slice(0, 2).map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-surface-border bg-surface p-6"
              >
                <p className="text-sm italic text-editorial-300">
                  &ldquo;{t.testimonial}&rdquo;
                </p>
                <p className="mt-4 text-xs font-semibold text-editorial-100">
                  {t.client_name} · {t.role}, {t.company}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
