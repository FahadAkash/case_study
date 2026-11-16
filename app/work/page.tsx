import { Metadata } from "next";
import { getCaseStudies, getAllTopics } from "@/lib/db";
import { WorkClient } from "./work-client";
import { HalftonePattern } from "@/components/halftone-pattern";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Work & Case Studies • Fahad Systems",
  description:
    "Explore in-depth engineering post-mortems across game development, spatial computing, high-throughput distributed backends, and developer tooling.",
};

export default async function WorkPage() {
  const [caseStudies, topics] = await Promise.all([
    getCaseStudies({ status: "published" }),
    getAllTopics()
  ]);

  return (
    <div className="w-full relative py-12 md:py-20">
      <HalftonePattern opacity={0.12} spacing={14} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
            INDEX / ARCHIVE
          </span>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-northfold-ink">
            Selected Case Studies
          </h1>
          <p className="text-lg sm:text-xl font-serif text-northfold-muted leading-relaxed">
            In-depth architectural breakdowns, performance profiling logs, and post-mortems from production game engines and high-scale systems.
          </p>
        </div>

        {/* Client Interactive Filter & List */}
        <WorkClient initialCaseStudies={caseStudies} topics={topics} />
      </div>
    </div>
  );
}
