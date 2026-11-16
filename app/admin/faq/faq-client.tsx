"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaqItem } from "@/lib/db";
import { saveFaqAction, deleteFaqAction } from "../actions";

export function FaqClient({ initialFaqs }: { initialFaqs: FaqItem[] }) {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const startNewFaq = () => {
    setEditingFaq({
      id: `faq-${Date.now()}`,
      question: "",
      answer: "",
      group_name: "Engagements",
      display_order: faqs.length + 1
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question || !editingFaq.answer) {
      alert("Question and Answer are required.");
      return;
    }

    setIsSaving(true);
    const res = await saveFaqAction(editingFaq);
    setIsSaving(false);

    if (res.success) {
      setFaqs((prev) => {
        const idx = prev.findIndex((f) => f.id === editingFaq.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = editingFaq;
          return next;
        }
        return [...prev, editingFaq];
      });
      setEditingFaq(null);
      router.refresh();
    } else {
      alert("Error saving FAQ: " + res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this FAQ entry?")) return;
    const res = await deleteFaqAction(id);
    if (res.success) {
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      router.refresh();
    } else {
      alert("Error deleting FAQ: " + res.error);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-northfold-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
            KNOWLEDGE BASE
          </span>
          <h1 className="text-3xl font-semibold text-northfold-ink mt-1">
            FAQ Entries Manager
          </h1>
          <p className="text-sm font-serif text-northfold-muted mt-1">
            Curate questions and answers displayed on the public FAQ accordion page.
          </p>
        </div>

        <Button
          onClick={startNewFaq}
          size="sm"
          className="rounded-full font-mono text-xs uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Question
        </Button>
      </div>

      {/* Editing Form */}
      {editingFaq && (
        <form onSubmit={handleSave} className="p-6 bg-white rounded-2xl border border-northfold-border shadow-md space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-northfold-ink font-semibold">
            {editingFaq.question ? "Edit FAQ Item" : "New FAQ Item"}
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-northfold-muted">Question *</label>
            <Input
              required
              value={editingFaq.question}
              onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
              placeholder="e.g. What is your turnaround time for architectural audits?"
              className="rounded-xl text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-northfold-muted">Category / Group</label>
              <Input
                value={editingFaq.group_name}
                onChange={(e) => setEditingFaq({ ...editingFaq, group_name: e.target.value })}
                placeholder="e.g. Engagements, Capabilities, Security"
                className="rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-northfold-muted">Display Order</label>
              <Input
                type="number"
                value={editingFaq.display_order}
                onChange={(e) => setEditingFaq({ ...editingFaq, display_order: parseInt(e.target.value, 10) || 0 })}
                className="rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-northfold-muted">Answer *</label>
            <Textarea
              rows={4}
              required
              value={editingFaq.answer}
              onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
              placeholder="Detailed answer explaining your policy or capability..."
              className="font-serif text-sm rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingFaq(null)}
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
              Save Item
            </Button>
          </div>
        </form>
      )}

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.map((f) => (
          <div
            key={f.id}
            className="p-5 bg-white rounded-2xl border border-northfold-border shadow-sm flex items-start justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-northfold-surface text-northfold-muted border border-northfold-border">
                  {f.group_name}
                </span>
                <span className="text-xs font-mono text-northfold-faded">
                  #{f.display_order}
                </span>
              </div>
              <h4 className="font-semibold text-northfold-ink text-base">{f.question}</h4>
              <p className="text-xs font-serif text-northfold-muted leading-relaxed line-clamp-2">
                {f.answer}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setEditingFaq(f)}
                className="p-1.5 rounded-lg border border-northfold-border hover:bg-northfold-surface text-northfold-muted hover:text-northfold-ink transition-colors"
                title="Edit FAQ"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(f.id)}
                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                title="Delete FAQ"
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
