import { Metadata } from "next";
import { getCaseStudies, getContactMessages } from "@/lib/db";
import { AdminDashboardClient } from "./admin-dashboard-client";

export const metadata: Metadata = {
  title: "Admin Dashboard • Northfold CMS",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [caseStudies, messages] = await Promise.all([
    getCaseStudies({ status: "all" }),
    getContactMessages(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
          CONTROL CENTER
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-northfold-ink mt-1">
          Case Studies & System Administration
        </h1>
      </div>

      <AdminDashboardClient
        initialCaseStudies={caseStudies}
        messages={messages}
      />
    </div>
  );
}
