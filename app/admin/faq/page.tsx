import { Metadata } from "next";
import { getFaqs } from "@/lib/db";
import { FaqClient } from "./faq-client";

export const metadata: Metadata = {
  title: "FAQ Manager • Northfold CMS",
  robots: { index: false, follow: false },
};

export default async function AdminFaqPage() {
  const faqs = await getFaqs();
  return <FaqClient initialFaqs={faqs} />;
}
