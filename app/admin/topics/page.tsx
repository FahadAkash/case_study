import { Metadata } from "next";
import { getAllTopics } from "@/lib/db";
import { TopicsClient } from "./topics-client";

export const metadata: Metadata = {
  title: "Topic & Template Manager • Northfold CMS",
  robots: { index: false, follow: false },
};

export default async function AdminTopicsPage() {
  const topics = await getAllTopics();
  return <TopicsClient initialTopics={topics} />;
}
