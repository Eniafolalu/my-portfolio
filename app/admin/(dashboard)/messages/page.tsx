import { Mail, CheckCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ContactMessage } from "@/types/portfolio";
import { formatDate } from "@/lib/utils";

export default async function AdminMessagesPage() {
  let messages: ContactMessage[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) messages = data;
  } catch (err) {
    console.warn(err);
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
            Inquiries & Contact Messages
          </h1>
          <p className="text-xs text-editorial-400 mt-1">
            Review incoming project inquiries submitted via the public contact form.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full border border-surface-border bg-surface px-3 py-1.5 text-editorial-300">
            {unreadCount} Unread
          </span>
          <span className="rounded-full border border-surface-border bg-surface px-3 py-1.5 text-editorial-300">
            {messages.length} Total
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-surface-border bg-surface overflow-hidden divide-y divide-surface-border">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-xs text-editorial-500">
            <Mail className="mx-auto h-6 w-6 text-editorial-600 mb-2" />
            No inquiries received yet. Submissions from /contact will appear here securely.
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`p-6 transition-colors hover:bg-surface-hover ${
                !m.is_read ? "bg-surface/80" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-editorial-100">
                    {m.name}
                  </span>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs text-editorial-400 hover:text-editorial-200"
                  >
                    {m.email}
                  </a>
                  {!m.is_read && (
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                      New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-editorial-500">
                  <span>{formatDate(m.created_at)}</span>
                  <button
                    className="flex items-center gap-1 rounded-lg border border-surface-border px-2.5 py-1 text-editorial-300 hover:bg-surface-muted hover:text-white"
                    title="Toggle read status"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>{m.is_read ? "Mark Unread" : "Mark Read"}</span>
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-editorial-300 whitespace-pre-line">
                {m.project_description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
