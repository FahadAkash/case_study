import { notFound } from "next/navigation";
import { getCaseStudyById, getAllTopics } from "@/lib/db";
import { CaseStudyEditor } from "../../case-study-editor";

interface EditCaseStudyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCaseStudyPage({ params }: EditCaseStudyPageProps) {
  const { id } = await params;
  const [caseStudy, topics] = await Promise.all([
    getCaseStudyById(id),
    getAllTopics()
  ]);

  if (!caseStudy) {
    notFound();
  }

  return <CaseStudyEditor initialCaseStudy={caseStudy} topics={topics} />;
}
