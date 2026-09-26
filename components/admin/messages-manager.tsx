"use client";

import { useState, useTransition } from "react";
import { Mail, CheckCheck, Trash2, Loader2, Reply } from "lucide-react";
import { ContactMessage } from "@/types/portfolio";
import { formatDate } from "@/lib/utils";
import { toggleMessageRead, deleteMessage } from "@/lib/actions/cms";

interface MessagesManagerProps {
  initialMessages: ContactMessage[];
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [isPending, startTransition] = useTransition();
  const [actingId, setActingId] = useState<string | null>(null);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const handleToggleRead = (m: ContactMessage) => {
    setActingId(m.id);
    startTransition(async () => {
      const res = await toggleMessageRead(m.id, m.is_read);
      if (res?.success) {
        setMessages((prev) =>
          prev.map((item) =>
            item.id === m.id ? { ...item, is_read: !item.is_read } : item
          )
        );
      }
      setActingId(null);
    });
  };

  const handleDelete = (m: ContactMessage) => {
    if (!confirm(`Delete message from ${m.name}?`)) return;
    setActingId(m.id);
    startTransition(async () => {
      const res = await deleteMessage(m.id);
      if (res?.success) {
        setMessages((prev) => prev.filter((item) => item.id !== m.id));
      }
      setActingId(null);
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
            Inquiries & Messages CMS
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
          messages.map((m) => {
            const isItemBusy = isPending && actingId === m.id;
            return (
              <div
                key={m.id}
                className={`p-6 transition-colors hover:bg-surface-hover ${
                  !m.is_read ? "bg-surface-muted/30" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-editorial-100">
                      {m.name}
                    </span>
                    <a
                      href={`mailto:${m.email}?subject=Re:%20Project%20Inquiry%20from%20Portfolio`}
                      className="text-xs text-editorial-400 hover:text-editorial-200 flex items-center gap-1"
                    >
                      <span>{m.email}</span>
                      <Reply className="h-3 w-3" />
                    </a>
                    {!m.is_read && (
                      <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                        New
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-editorial-500">
                    <span>{formatDate(m.created_at)}</span>
                    <button
                      type="button"
                      disabled={isItemBusy}
                      onClick={() => handleToggleRead(m)}
                      className="flex items-center gap-1 rounded-lg border border-surface-border px-2.5 py-1 text-editorial-300 hover:bg-surface-muted hover:text-white transition-colors"
                      title="Toggle read status"
                    >
                      {isItemBusy ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCheck className="h-3.5 w-3.5" />
                      )}
                      <span>{m.is_read ? "Mark Unread" : "Mark Read"}</span>
                    </button>
                    <button
                      type="button"
                      disabled={isItemBusy}
                      onClick={() => handleDelete(m)}
                      className="p-1.5 rounded-lg text-editorial-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-editorial-300 whitespace-pre-line bg-surface-muted/40 p-4 rounded-xl border border-surface-border/50">
                  {m.project_description}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
