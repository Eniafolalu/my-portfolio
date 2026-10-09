"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const WHATSAPP_NUMBER = "2348135526944";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project_description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      // Build structured WhatsApp message
      const messageText = `Hello Enioluwa,

I would like to make an inquiry through your portfolio:

• Name: ${formData.name.trim()}
• Email: ${formData.email.trim()}
• Project Inquiry:
${formData.project_description.trim()}`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`;
      setWhatsappLink(url);

      // Attempt recording in Supabase database as backup
      try {
        const supabase = createClient();
        await supabase.from("contact_messages").insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          project_description: formData.project_description.trim(),
        } as any);
      } catch {
        // Non-blocking fallback so WhatsApp dispatch is never interrupted
      }

      // Open WhatsApp with prefilled message
      window.open(url, "_blank", "noopener,noreferrer");

      setStatus("success");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to prepare message";
      setStatus("error");
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-surface-border bg-surface p-8 sm:p-10">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-editorial-50">
              Inquiry Prepared
            </h3>
            <p className="mt-2 max-w-sm text-sm text-editorial-400">
              WhatsApp should open automatically. If it didn&apos;t open, tap the button below to send your inquiry directly.
            </p>
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 hover:scale-[1.02]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Open WhatsApp Chat</span>
              </a>
            )}
            <button
              onClick={() => {
                setStatus("idle");
                setFormData({ name: "", email: "", project_description: "" });
              }}
              className="mt-6 text-xs font-semibold uppercase tracking-wider text-editorial-400 hover:text-white"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage || "An error occurred. Please try again."}</span>
              </motion.div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-editorial-300"
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Alex Morgan"
                className="mt-2 w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-3 text-sm text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-editorial-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="alex@company.com"
                className="mt-2 w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-3 text-sm text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="project_description"
                className="block text-xs font-semibold uppercase tracking-wider text-editorial-300"
              >
                Project Description
              </label>
              <textarea
                id="project_description"
                rows={4}
                required
                value={formData.project_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    project_description: e.target.value,
                  })
                }
                placeholder="Tell me about your product vision, timeline, and goals..."
                className="mt-2 w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-3 text-sm text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{isSubmitting ? "Connecting..." : "Send via WhatsApp"}</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
