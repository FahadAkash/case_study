"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  Star,
  Search,
  CheckCircle,
  Clock,
  Inbox,
  Layers,
  SlidersHorizontal,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CaseStudy, ContactMessage } from "@/lib/db";
import { deleteCaseStudyAction, duplicateCaseStudyAction, saveCaseStudyAction } from "./actions";

interface AdminDashboardClientProps {
  initialCaseStudies: CaseStudy[];
  messages: ContactMessage[];
}

export function AdminDashboardClient({
  initialCaseStudies,
  messages,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(initialCaseStudies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const publishedCount = caseStudies.filter((c) => c.status === "published").length;
  const draftCount = caseStudies.filter((c) => c.status === "draft").length;
  const unreadMessagesCount = messages.filter((m) => m.status === "unread").length;

  const filtered = caseStudies.filter((cs) => {
    const matchesStatus = statusFilter === "all" || cs.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      cs.title.toLowerCase().includes(q) ||
      cs.slug.toLowerCase().includes(q) ||
      cs.topic_name?.toLowerCase().includes(q) ||
      cs.tags?.some((t) => t.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    setActionLoading(id);
    const res = await deleteCaseStudyAction(id);
    if (res.success) {
      setCaseStudies((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } else {
      alert("Error deleting case study: " + res.error);
    }
    setActionLoading(null);
  };

  const handleDuplicate = async (id: string) => {
    setActionLoading(`dup-${id}`);
    const res = await duplicateCaseStudyAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert("Error duplicating: " + res.error);
    }
    setActionLoading(null);
  };

  const handleToggleFeatured = async (cs: CaseStudy) => {
    const updated = { ...cs, featured: !cs.featured };
    setCaseStudies((prev) => prev.map((item) => (item.id === cs.id ? updated : item)));
    await saveCaseStudyAction(updated);
    router.refresh();
  };

  return (
    <div className="space-y-10">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-northfold-border bg-white shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-northfold-muted uppercase tracking-wider">
            <span>Total Studies</span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-3xl font-mono font-semibold text-northfold-ink">
            {caseStudies.length}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-northfold-border bg-white shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-700 uppercase tracking-wider">
            <span>Live Published</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-mono font-semibold text-emerald-800">
            {publishedCount}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-northfold-border bg-white shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-amber-700 uppercase tracking-wider">
            <span>Drafts</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-mono font-semibold text-amber-800">
            {draftCount}
          </div>
        </div>

        <Link
          href="/admin/messages"
          className="p-5 rounded-2xl border border-northfold-border bg-white shadow-sm space-y-1 hover:border-northfold-ink transition-colors block"
        >
          <div className="flex items-center justify-between text-xs font-mono text-northfold-muted uppercase tracking-wider">
            <span>Inquiries</span>
            <Inbox className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-semibold text-northfold-ink">
              {messages.length}
            </span>
            {unreadMessagesCount > 0 && (
              <span className="text-xs font-mono text-emerald-600 font-medium">
                ({unreadMessagesCount} unread)
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Main Controls & Table */}
      <div className="bg-white rounded-2xl border border-northfold-border overflow-hidden shadow-sm space-y-4">
        {/* Header Action Bar */}
        <div className="p-5 border-b border-northfold-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted mr-2">
              Filter:
            </span>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                statusFilter === "all"
                  ? "bg-northfold-ink text-white"
                  : "bg-northfold-surface text-northfold-muted hover:text-northfold-ink"
              }`}
            >
              All ({caseStudies.length})
            </button>
            <button
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                statusFilter === "published"
                  ? "bg-northfold-ink text-white"
                  : "bg-northfold-surface text-northfold-muted hover:text-northfold-ink"
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter("draft")}
              className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                statusFilter === "draft"
                  ? "bg-northfold-ink text-white"
                  : "bg-northfold-surface text-northfold-muted hover:text-northfold-ink"
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-northfold-faded" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search case studies..."
                className="w-full pl-9 pr-3 py-1.5 text-xs font-mono rounded-full border border-northfold-border bg-northfold-surface text-northfold-ink placeholder:text-northfold-faded focus:outline-none focus:border-northfold-ink"
              />
            </div>

            <Button asChild size="sm" className="rounded-full font-mono text-xs uppercase tracking-wider whitespace-nowrap">
              <Link href="/admin/new">
                <PlusCircle className="w-3.5 h-3.5 mr-1" /> New Study
              </Link>
            </Button>
          </div>
        </div>

        {/* Case Studies Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono divide-y divide-northfold-border">
            <thead className="bg-northfold-surface/50 text-northfold-muted uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Featured</th>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Domain / Topic</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-northfold-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-northfold-muted">
                    No case studies match your current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((cs) => (
                  <tr key={cs.id} className="hover:bg-neutral-50/80 transition-colors">
                    {/* Star Featured */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(cs)}
                        title={cs.featured ? "Featured on Home" : "Mark as Featured"}
                        className="p-1 rounded hover:bg-neutral-200 transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            cs.featured
                              ? "fill-amber-400 text-amber-500"
                              : "text-neutral-300 hover:text-neutral-500"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Title & Slug */}
                    <td className="py-4 px-4 space-y-1">
                      <Link
                        href={`/admin/edit/${cs.id}`}
                        className="font-sans font-semibold text-sm text-northfold-ink hover:underline block"
                      >
                        {cs.title}
                      </Link>
                      <span className="text-[11px] text-northfold-muted">
                        /work/{cs.slug}
                      </span>
                    </td>

                    {/* Topic */}
                    <td className="py-4 px-4">
                      <Badge variant="tag">{cs.topic_name || "Engineering"}</Badge>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {cs.status === "published" ? (
                        <Badge variant="statusPublished">Published</Badge>
                      ) : (
                        <Badge variant="statusDraft">Draft</Badge>
                      )}
                    </td>

                    {/* Display Order */}
                    <td className="py-4 px-4 text-northfold-muted">
                      #{cs.display_order}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right space-x-1 whitespace-nowrap">
                      {cs.status === "published" && (
                        <Link
                          href={`/work/${cs.slug}`}
                          target="_blank"
                          title="View Live Page"
                          className="p-1.5 rounded-lg border border-northfold-border hover:bg-northfold-surface inline-flex items-center text-northfold-muted hover:text-northfold-ink transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      <Link
                        href={`/admin/edit/${cs.id}`}
                        title="Edit Case Study"
                        className="p-1.5 rounded-lg border border-northfold-border hover:bg-northfold-surface inline-flex items-center text-northfold-muted hover:text-northfold-ink transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDuplicate(cs.id)}
                        disabled={actionLoading === `dup-${cs.id}`}
                        title="Duplicate Case Study"
                        className="p-1.5 rounded-lg border border-northfold-border hover:bg-northfold-surface inline-flex items-center text-northfold-muted hover:text-northfold-ink transition-colors"
                      >
                        {actionLoading === `dup-${cs.id}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(cs.id, cs.title)}
                        disabled={actionLoading === cs.id}
                        title="Delete Case Study"
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center transition-colors"
                      >
                        {actionLoading === cs.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
