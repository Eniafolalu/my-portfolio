"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project_description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name,
        email: formData.email,
        project_description: formData.project_description,
      } as any);

      if (error) {
        throw new Error(error.message);
      }

      setStatus("success");
      setFormData({ name: "", email: "", project_description: "" });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send message";
      setStatus("error");
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-surface-border bg-surface p-8 sm:p-10">
      {status === "success" ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          <h3 className="mt-4 text-xl font-medium text-editorial-50">
            Message Sent Successfully
          </h3>
          <p className="mt-2 max-w-sm text-sm text-editorial-400">
            Thank you for reaching out. I will review your project details and respond within 24–48 hours.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 text-xs font-semibold uppercase tracking-wider text-editorial-300 hover:text-white"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {status === "error" && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage || "An error occurred. Please try again."}</span>
            </div>
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
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-editorial-100 py-3.5 text-sm font-semibold text-background transition-all hover:bg-white disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
