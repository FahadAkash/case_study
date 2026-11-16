import { Metadata } from "next";
import { getAllTopics } from "@/lib/db";
import { TemplateSelectorClient } from "./template-selector-client";

export const metadata: Metadata = {
  title: "New Case Study • Template Selection",
  robots: { index: false, follow: false },
};

export default async function NewCaseStudyPage() {
  const topics = await getAllTopics();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
          STEP 01 / WORKFLOW
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-northfold-ink mt-1">
          Select a Discipline Template
        </h1>
        <p className="text-sm font-serif text-northfold-muted mt-2">
          Each template automatically pre-populates specialized section blocks, technical prompt guidelines, and metrics structures for your engineering discipline.
        </p>
      </div>

      <TemplateSelectorClient topics={topics} />
    </div>
  );
}
