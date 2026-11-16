import { Metadata } from "next";
import { getContactMessages } from "@/lib/db";
import { MessagesClient } from "./messages-client";

export const metadata: Metadata = {
  title: "Inquiries Inbox • Northfold CMS",
  robots: { index: false, follow: false },
};

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  return <MessagesClient initialMessages={messages} />;
}
