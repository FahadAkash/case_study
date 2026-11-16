"use client";

import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { CaseStudy, Topic } from "@/lib/db";
import { CaseStudyCard } from "@/components/case-study-card";
import { Button } from "@/components/ui/button";

interface WorkClientProps {
  initialCaseStudies: CaseStudy[];
  topics: Topic[];
}

export function WorkClient({ initialCaseStudies, topics }: WorkClientProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter case studies based on selected topic pill and search query
  const filteredCaseStudies = useMemo(() => {
    return initialCaseStudies.filter((cs) => {
      // Topic match
      const matchesTopic =
        selectedTopic === "all" ||
        cs.topic_slug === selectedTopic ||
        cs.topic_id === selectedTopic;

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        cs.title.toLowerCase().includes(query) ||
        cs.outcome.toLowerCase().includes(query) ||
        cs.summary.toLowerCase().includes(query) ||
        cs.tags?.some((t) => t.toLowerCase().includes(query)) ||
        cs.stack?.some((s) => s.toLowerCase().includes(query));

      return matchesTopic && matchesSearch;
    });
  }, [initialCaseStudies, selectedTopic, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Controls Bar: Filter Pills + Search Box + "Showing X of Y" Counter */}
      <div className="space-y-6 pb-6 border-b border-northfold-border">
        {/* Topic Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedTopic === "all" ? "pillActive" : "pill"}
            size="sm"
            onClick={() => setSelectedTopic("all")}
          >
            All Disciplines
          </Button>

          {topics.map((t) => (
            <Button
              key={t.id}
              variant={selectedTopic === t.slug || selectedTopic === t.id ? "pillActive" : "pill"}
              size="sm"
              onClick={() => setSelectedTopic(t.slug)}
            >
              {t.name}
            </Button>
          ))}
        </div>

        {/* Search Input & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-northfold-faded pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, stack, or outcome..."
              className="w-full pl-10 pr-4 py-2 text-xs font-mono rounded-full border border-northfold-border bg-white text-northfold-ink placeholder:text-northfold-faded focus:outline-none focus:border-northfold-ink transition-colors"
            />
          </div>

          {/* Northfold Reference Counter */}
          <div className="text-xs font-mono text-northfold-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Showing{" "}
              <strong className="text-northfold-ink font-semibold">
                {filteredCaseStudies.length}
              </strong>{" "}
              of{" "}
              <strong className="text-northfold-ink font-semibold">
                {initialCaseStudies.length}
              </strong>{" "}
              case studies
            </span>
          </div>
        </div>
      </div>

      {/* Case Studies List */}
      {filteredCaseStudies.length === 0 ? (
        <div className="py-24 text-center space-y-4 border border-dashed border-northfold-border rounded-2xl bg-white/40">
          <SlidersHorizontal className="w-8 h-8 text-northfold-faded mx-auto" />
          <h3 className="text-lg font-semibold text-northfold-ink">
            No matching case studies found
          </h3>
          <p className="text-sm font-serif text-northfold-muted max-w-sm mx-auto">
            Try adjusting your search criteria or reset your filter to view all projects.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedTopic("all");
              setSearchQuery("");
            }}
            className="rounded-full font-mono text-xs uppercase tracking-wider"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-northfold-border">
          {filteredCaseStudies.map((cs, idx) => (
            <CaseStudyCard
              key={cs.id}
              caseStudy={cs}
              index={idx}
              total={filteredCaseStudies.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}
