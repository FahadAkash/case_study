import { Metadata } from "next";
import { getSiteSettings } from "@/lib/db";
import { SettingsClient } from "./settings-client";

export const metadata: Metadata = {
  title: "Site Settings • Northfold CMS",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsClient initialSettings={settings} />;
}
