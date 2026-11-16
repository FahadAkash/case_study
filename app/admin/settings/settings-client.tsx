"use client";

import React, { useState } from "react";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveSiteSettingsAction } from "../actions";

export function SettingsClient({ initialSettings }: { initialSettings: Record<string, any> }) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await saveSiteSettingsAction(settings);
    setSaving(false);

    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert("Error saving settings: " + res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-northfold-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
            GLOBAL CONFIGURATION
          </span>
          <h1 className="text-3xl font-semibold text-northfold-ink mt-1">
            Site-Wide Settings
          </h1>
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="rounded-full font-mono text-xs uppercase tracking-wider px-6 shadow-md"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-1.5" />
          ) : (
            <Save className="w-4 h-4 mr-1.5" />
          )}
          {saved ? "Saved" : "Save Changes"}
        </Button>
      </div>

      {/* Hero Section Copy */}
      <div className="p-6 bg-white rounded-2xl border border-northfold-border shadow-sm space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-northfold-ink font-semibold">
          01 / Home Hero Copy
        </h3>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-northfold-muted">
              Headline Statement (One sentence)
            </label>
            <Input
              value={settings.hero_headline || ""}
              onChange={(e) => setSettings({ ...settings, hero_headline: e.target.value })}
              className="font-medium text-sm rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-northfold-muted">
              Intro Paragraph
            </label>
            <Textarea
              rows={3}
              value={settings.hero_intro || ""}
              onChange={(e) => setSettings({ ...settings, hero_intro: e.target.value })}
              className="font-serif text-sm rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* About Narrative */}
      <div className="p-6 bg-white rounded-2xl border border-northfold-border shadow-sm space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-northfold-ink font-semibold">
          02 / About Page Story & Philosophy
        </h3>

        <div className="space-y-1">
          <label className="text-xs font-mono uppercase text-northfold-muted">
            Engineering Creed (separate paragraphs with blank lines)
          </label>
          <Textarea
            rows={6}
            value={settings.about_story || ""}
            onChange={(e) => setSettings({ ...settings, about_story: e.target.value })}
            className="font-serif text-sm rounded-xl"
          />
        </div>
      </div>

      {/* Contact & Social Links */}
      <div className="p-6 bg-white rounded-2xl border border-northfold-border shadow-sm space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-northfold-ink font-semibold">
          03 / Direct Channels & Documents
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1">
            <label className="text-northfold-muted uppercase">Contact Email</label>
            <Input
              value={settings.contact_email || ""}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-northfold-muted uppercase">Curriculum Vitae (Drive Link)</label>
            <Input
              value={settings.cv_url || ""}
              onChange={(e) => setSettings({ ...settings, cv_url: e.target.value })}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-northfold-muted uppercase">GitHub Profile URL</label>
            <Input
              value={settings.social_github || ""}
              onChange={(e) => setSettings({ ...settings, social_github: e.target.value })}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-northfold-muted uppercase">LinkedIn Profile URL</label>
            <Input
              value={settings.social_linkedin || ""}
              onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-northfold-muted uppercase">X (Twitter) Profile URL</label>
            <Input
              value={settings.social_twitter || ""}
              onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
              className="rounded-xl text-xs"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
