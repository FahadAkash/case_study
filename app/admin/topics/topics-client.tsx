"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Topic } from "@/lib/db";
import { saveTopicAction, deleteTopicAction } from "../actions";

export function TopicsClient({ initialTopics }: { initialTopics: Topic[] }) {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const startNewTopic = () => {
    const newId = `topic-${Date.now()}`;
    setEditingTopic({
      id: newId,
      name: "",
      slug: "",
      description: "",
      template: [
        { type: "rich_text", title: "Overview & Objectives", content: "<p>Describe the core goals...</p>" },
        { type: "stats", title: "Key Metrics", stats: [{ label: "Efficiency", value: "+100%", detail: "Production" }] }
      ]
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic || !editingTopic.name || !editingTopic.slug) {
      alert("Name and Slug are required.");
      return;
    }

    setIsSaving(true);
    const res = await saveTopicAction(editingTopic);
    setIsSaving(false);

    if (res.success) {
      setTopics((prev) => {
        const idx = prev.findIndex((t) => t.id === editingTopic.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = editingTopic;
          return next;
        }
        return [...prev, editingTopic];
      });
      setEditingTopic(null);
      router.refresh();
    } else {
      alert("Error saving topic: " + res.error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete topic "${name}"? Case studies linked to this topic will remain safe.`)) {
      return;
    }
    const res = await deleteTopicAction(id);
    if (res.success) {
      setTopics((prev) => prev.filter((t) => t.id !== id));
      router.refresh();
    } else {
      alert("Error deleting topic: " + res.error);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between pb-6 border-b border-northfold-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
            DISCIPLINES & TEMPLATES
          </span>
          <h1 className="text-3xl font-semibold text-northfold-ink mt-1">
            Topic & Template Manager
          </h1>
          <p className="text-sm font-serif text-northfold-muted mt-1">
            Create new disciplines and customize the pre-filled template blocks provided to writers during case study creation.
          </p>
        </div>

        <Button
          onClick={startNewTopic}
          size="sm"
          className="rounded-full font-mono text-xs uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add New Topic
        </Button>
      </div>

      {/* Editing Modal / Drawer */}
      {editingTopic && (
        <form onSubmit={handleSave} className="p-6 bg-white rounded-2xl border border-northfold-border shadow-md space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-northfold-ink font-semibold">
            {editingTopic.name ? `Edit: ${editingTopic.name}` : "Create New Topic"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-northfold-muted">Topic Name *</label>
              <Input
                required
                value={editingTopic.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
                  setEditingTopic({
                    ...editingTopic,
                    name,
                    slug: editingTopic.slug || slug
                  });
                }}
                placeholder="e.g. Robotics & Simulation"
                className="rounded-xl text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-northfold-muted">URL Slug *</label>
              <Input
                required
                value={editingTopic.slug}
                onChange={(e) => setEditingTopic({ ...editingTopic, slug: e.target.value })}
                placeholder="e.g. robotics"
                className="rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-northfold-muted">Description</label>
            <Input
              value={editingTopic.description}
              onChange={(e) => setEditingTopic({ ...editingTopic, description: e.target.value })}
              placeholder="Brief description of this engineering domain..."
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-northfold-muted">
              Pre-filled Blocks (JSON Schema)
            </label>
            <Textarea
              rows={6}
              value={JSON.stringify(editingTopic.template, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setEditingTopic({ ...editingTopic, template: parsed });
                } catch {
                  // Keep typing
                }
              }}
              className="font-mono text-xs rounded-xl bg-neutral-900 text-neutral-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingTopic(null)}
              className="rounded-full font-mono text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSaving}
              className="rounded-full font-mono text-xs uppercase tracking-wider"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
              Save Topic
            </Button>
          </div>
        </form>
      )}

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((t) => (
          <div
            key={t.id}
            className="p-5 bg-white rounded-2xl border border-northfold-border shadow-sm flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-northfold-ink text-base">{t.name}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-northfold-surface text-northfold-muted">
                  /{t.slug}
                </span>
              </div>
              <p className="text-xs font-serif text-northfold-muted">
                {t.description || "No description set."}
              </p>
              <span className="text-[11px] font-mono text-northfold-faded block pt-1">
                {t.template?.length || 0} template blocks configured
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setEditingTopic(t)}
                className="p-1.5 rounded-lg border border-northfold-border hover:bg-northfold-surface text-northfold-muted hover:text-northfold-ink transition-colors"
                title="Edit Topic"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(t.id, t.name)}
                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                title="Delete Topic"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
