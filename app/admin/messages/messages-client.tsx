"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Check, Archive, Clock, Building2, Tag } from "lucide-react";
import { ContactMessage } from "@/lib/db";
import { updateMessageStatusAction } from "../actions";
import { Badge } from "@/components/ui/badge";

export function MessagesClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filtered = messages.filter((m) => {
    if (filter === "unread") return m.status === "unread";
    if (filter === "read") return m.status === "read";
    return true;
  });

  const handleStatus = async (id: string, status: "unread" | "read" | "archived") => {
    const res = await updateMessageStatusAction(id, status);
    if (res.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      router.refresh();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-northfold-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
            INBOX & CLIENT INQUIRIES
          </span>
          <h1 className="text-3xl font-semibold text-northfold-ink mt-1">
            Submitted Inquiries ({messages.length})
          </h1>
          <p className="text-sm font-serif text-northfold-muted mt-1">
            Inquiries submitted via the public contact form and securely logged to Neon Postgres.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider ${
              filter === "all" ? "bg-northfold-ink text-white" : "bg-northfold-surface text-northfold-muted"
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider ${
              filter === "unread" ? "bg-northfold-ink text-white" : "bg-northfold-surface text-northfold-muted"
            }`}
          >
            Unread ({messages.filter((m) => m.status === "unread").length})
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-northfold-muted border border-dashed rounded-2xl bg-white">
            <Mail className="w-8 h-8 mx-auto text-northfold-faded mb-2" />
            <p className="text-sm font-serif">No messages in this view.</p>
          </div>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border bg-white shadow-sm space-y-4 transition-colors ${
                msg.status === "unread" ? "border-emerald-300 ring-1 ring-emerald-300" : "border-northfold-border"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-northfold-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-northfold-ink text-base font-sans">
                    {msg.name}
                  </span>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs font-mono text-northfold-muted hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" /> {msg.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={msg.status === "unread" ? "statusPublished" : "secondary"}>
                    {msg.status.toUpperCase()}
                  </Badge>
                  {msg.created_at && (
                    <span className="text-[11px] font-mono text-northfold-faded">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Company & Project Type Meta */}
              <div className="flex flex-wrap gap-4 text-xs font-mono text-northfold-muted">
                {msg.company && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-northfold-faded" />
                    <span>Company: {msg.company}</span>
                  </span>
                )}
                {msg.project_type && (
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-northfold-faded" />
                    <span>Discipline: {msg.project_type}</span>
                  </span>
                )}
              </div>

              {/* Message Body */}
              <div className="p-4 rounded-xl bg-northfold-surface/60 font-serif text-sm text-northfold-ink leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                {msg.status === "unread" ? (
                  <button
                    onClick={() => handleStatus(msg.id, "read")}
                    className="px-3 py-1 rounded-full text-xs font-mono border border-northfold-border hover:bg-neutral-100 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark as Read</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatus(msg.id, "unread")}
                    className="px-3 py-1 rounded-full text-xs font-mono border border-northfold-border hover:bg-neutral-100 text-northfold-muted"
                  >
                    Mark as Unread
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
