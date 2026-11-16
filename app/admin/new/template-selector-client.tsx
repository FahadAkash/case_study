"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, Eye, Server, Cpu, Wrench, FilePlus, ArrowRight, Loader2, Briefcase, Cloud } from "lucide-react";
import { Topic } from "@/lib/db";
import { saveCaseStudyAction } from "../actions";

const ICONS: Record<string, any> = {
  game: Gamepad2,
  "ar-vr": Eye,
  backend: Server,
  ai: Cpu,
  tools: Wrench,
  fde: Briefcase,
  "cloud-infra": Cloud,
  blank: FilePlus,
};

export function TemplateSelectorClient({ topics }: { topics: Topic[] }) {
  const router = useRouter();
  const [loadingTopic, setLoadingTopic] = useState<string | null>(null);

  const handleSelectTopic = async (topic: Topic) => {
    setLoadingTopic(topic.id);

    const newId = `cs-${Date.now()}`;
    const slug = `untitled-${topic.slug}-${Math.random().toString(36).substring(2, 6)}`;
    const title = `Untitled ${topic.name} Case Study`;

    const res = await saveCaseStudyAction({
      id: newId,
      slug,
      title,
      outcome: "Enter a high-impact, one-sentence outcome statement describing what was accomplished.",
      summary: "Short technical summary of the engineering hurdles, architecture, and impact.",
      topic_id: topic.id,
      tags: [topic.name],
      role: "Lead Systems Architect",
      duration: "6 months",
      year: new Date().getFullYear().toString(),
      stack: [],
      links: {},
      hero_media: {
        type: "image",
        drive_id: "",
        drive_url: "",
        fallback_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
        alt: `${title} Hero Graphic`
      },
      blocks: topic.template || [],
      featured: false,
      display_order: 0,
      status: "draft"
    });

    if (res.success) {
      router.push(`/admin/edit/${newId}`);
    } else {
      alert("Failed to initialize draft: " + res.error);
      setLoadingTopic(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((t) => {
        const Icon = ICONS[t.slug] || FilePlus;
        const isLoading = loadingTopic === t.id;

        return (
          <div
            key={t.id}
            onClick={() => !loadingTopic && handleSelectTopic(t)}
            className={`group p-6 rounded-2xl border border-northfold-border bg-white shadow-sm cursor-pointer transition-all hover:border-northfold-ink hover:shadow-md space-y-4 flex flex-col justify-between ${
              isLoading ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-northfold-surface border border-northfold-border flex items-center justify-center text-northfold-ink group-hover:bg-northfold-ink group-hover:text-white transition-colors">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              <h3 className="text-lg font-semibold text-northfold-ink tracking-tight">
                {t.name}
              </h3>

              <p className="text-xs font-serif text-northfold-muted leading-relaxed">
                {t.description || "Pre-structured technical blocks and prompts."}
              </p>
            </div>

            <div className="pt-3 border-t border-northfold-border/60 flex items-center justify-between text-xs font-mono text-northfold-muted group-hover:text-northfold-ink">
              <span>{t.template?.length || 0} pre-filled blocks</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
