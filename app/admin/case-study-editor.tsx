"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Save,
  Globe,
  Eye,
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Code as CodeIcon,
  Video as VideoIcon,
  Quote,
  BarChart2,
  GitBranch,
  Minus,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Loader2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CaseStudy, CaseStudyBlock, Topic } from "@/lib/db";
import { parseDriveUrl, getSafeImageSrc } from "@/lib/drive";
import { saveCaseStudyAction } from "./actions";
import { BlockRenderer } from "@/components/block-renderer";
import { MermaidDiagram } from "@/components/mermaid-diagram";

interface CaseStudyEditorProps {
  initialCaseStudy: CaseStudy;
  topics: Topic[];
}

export function CaseStudyEditor({ initialCaseStudy, topics }: CaseStudyEditorProps) {
  const router = useRouter();

  // State
  const [data, setData] = useState<CaseStudy>(initialCaseStudy);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Tag inputs
  const [newTag, setNewTag] = useState("");
  const [newStack, setNewStack] = useState("");

  // Drive Link Preview state
  const [driveWarning, setDriveWarning] = useState<string | null>(null);
  const [drivePreviewUrl, setDrivePreviewUrl] = useState<string>("");

  // Update drive preview when hero_media changes
  useEffect(() => {
    const rawUrl = data.hero_media?.drive_url || data.hero_media?.drive_id || "";
    if (rawUrl) {
      const parsed = parseDriveUrl(rawUrl, data.hero_media?.type || "image");
      if (parsed.isValid) {
        setDrivePreviewUrl(parsed.directImageUrl);
        setDriveWarning(parsed.warning || null);
      } else {
        setDrivePreviewUrl(data.hero_media?.fallback_url || "");
        setDriveWarning(parsed.warning || null);
      }
    } else {
      setDrivePreviewUrl(data.hero_media?.fallback_url || "");
      setDriveWarning(null);
    }
  }, [data.hero_media]);

  // Autosave timer (every 35 seconds if unsaved changes exist)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleSave(false);
    }, 35000);

    return () => clearTimeout(timer);
  }, [hasUnsavedChanges, data]);

  // Slug auto-generation helper
  const handleTitleChange = (newTitle: string) => {
    setHasUnsavedChanges(true);
    // If slug was previously empty or untitled, auto-slugify
    const isAutoSlug = data.slug.startsWith("untitled") || !data.slug;
    const generatedSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setData((prev) => ({
      ...prev,
      title: newTitle,
      slug: isAutoSlug ? generatedSlug : prev.slug,
      seo_title: prev.seo_title || newTitle
    }));
  };

  // Main Save handler (draft vs published)
  const handleSave = async (publish = false) => {
    setIsSaving(true);

    const studyToSave: CaseStudy = {
      ...data,
      status: publish ? "published" : data.status,
      // Auto-fill SEO image from hero if blank
      seo_image: data.seo_image || (data.hero_media?.drive_id ? `https://lh3.googleusercontent.com/d/${data.hero_media.drive_id}` : data.hero_media?.fallback_url)
    };

    const res = await saveCaseStudyAction(studyToSave);
    setIsSaving(false);

    if (res.success) {
      setData(studyToSave);
      setHasUnsavedChanges(false);
      setLastSavedTime(new Date().toLocaleTimeString());
      if (publish) {
        alert("Case study successfully published to the live site!");
        router.refresh();
      }
    } else {
      alert("Save failed: " + res.error);
    }
  };

  // Tag & Stack helpers
  const addTag = () => {
    if (!newTag.trim()) return;
    if (!data.tags.includes(newTag.trim())) {
      setData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setHasUnsavedChanges(true);
    }
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
    setHasUnsavedChanges(true);
  };

  const addStack = () => {
    if (!newStack.trim()) return;
    if (!data.stack.includes(newStack.trim())) {
      setData((prev) => ({ ...prev, stack: [...prev.stack, newStack.trim()] }));
      setHasUnsavedChanges(true);
    }
    setNewStack("");
  };

  const removeStack = (tech: string) => {
    setData((prev) => ({ ...prev, stack: prev.stack.filter((s) => s !== tech) }));
    setHasUnsavedChanges(true);
  };

  // -------------------------------------------------------------
  // Block Management Helpers
  // -------------------------------------------------------------
  const addBlock = (type: CaseStudyBlock["type"]) => {
    const newBlock: CaseStudyBlock = {
      type,
      title: getDefaultBlockTitle(type),
      content: type === "rich_text" ? "<p>Enter in-depth technical analysis and implementation details...</p>" : undefined,
      code: type === "code" ? "// Enter code snippet here" : undefined,
      language: type === "code" ? "csharp" : undefined,
      stats: type === "stats" ? [{ label: "Throughput", value: "100%", detail: "Production verified" }] : undefined,
      quote: type === "quote" ? "A striking technical takeaway or architectural verdict." : undefined,
      diagram: type === "architecture" ? `flowchart TD
    Client["Client App / Web"] --> Gateway["API Gateway"]
    Gateway --> Service["Core Microservice"]
    Service --> DB[("Neon Postgres DB")]
    Service --> Cache[("Redis Cache")]` : undefined
    };

    setData((prev) => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
    setHasUnsavedChanges(true);
  };

  const updateBlock = (index: number, updated: Partial<CaseStudyBlock>) => {
    setData((prev) => {
      const nextBlocks = [...prev.blocks];
      nextBlocks[index] = { ...nextBlocks[index], ...updated };
      return { ...prev, blocks: nextBlocks };
    });
    setHasUnsavedChanges(true);
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.blocks.length) return;

    setData((prev) => {
      const next = [...prev.blocks];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return { ...prev, blocks: next };
    });
    setHasUnsavedChanges(true);
  };

  const deleteBlock = (index: number) => {
    if (!window.confirm("Remove this section block?")) return;
    setData((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, idx) => idx !== index)
    }));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Top Header & Save / Publish Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-northfold-border sticky top-16 bg-[#FBFBFA]/95 backdrop-blur-md z-20 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-full border border-northfold-border hover:bg-white text-northfold-muted hover:text-northfold-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
                CASE STUDY EDITOR
              </span>
              <Badge variant={data.status === "published" ? "statusPublished" : "statusDraft"}>
                {data.status === "published" ? "Live" : "Draft"}
              </Badge>
              {lastSavedTime && (
                <span className="text-[11px] font-mono text-northfold-faded">
                  • Saved at {lastSavedTime}
                </span>
              )}
            </div>
            <h1 className="text-xl font-semibold text-northfold-ink truncate max-w-lg">
              {data.title || "Untitled Case Study"}
            </h1>
          </div>
        </div>

        {/* View Modes & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Editor vs Preview Mode Toggle */}
          <div className="flex rounded-full border border-northfold-border bg-white p-0.5 text-xs font-mono">
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                activeTab === "edit" ? "bg-northfold-ink text-white" : "text-northfold-muted hover:text-northfold-ink"
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                activeTab === "preview" ? "bg-northfold-ink text-white" : "text-northfold-muted hover:text-northfold-ink"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={isSaving}
            onClick={() => handleSave(false)}
            className="rounded-full font-mono text-xs uppercase tracking-wider"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
            Save Draft
          </Button>

          <Button
            size="sm"
            disabled={isSaving}
            onClick={() => handleSave(true)}
            className="rounded-full font-mono text-xs uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Globe className="w-3.5 h-3.5 mr-1" />}
            Publish
          </Button>
        </div>
      </div>

      {/* Mode 1: LIVE PREVIEW TAB */}
      {activeTab === "preview" ? (
        <div className="bg-white rounded-2xl border border-northfold-border p-6 sm:p-12 shadow-sm space-y-12">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-mono text-amber-900 flex items-center justify-between">
            <span>PREVIEW MODE: This matches exactly how the case study renders on the public site.</span>
            <button
              onClick={() => setActiveTab("edit")}
              className="underline font-semibold hover:text-black"
            >
              Return to editing
            </button>
          </div>

          {/* Render Actual Facts Table & Blocks */}
          <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-northfold-ink">
              {data.title}
            </h1>
            <p className="text-xl font-serif text-northfold-muted">
              {data.outcome}
            </p>

            {/* Hero Image preview */}
            {drivePreviewUrl && (
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-northfold-border">
                <Image
                  src={drivePreviewUrl}
                  alt={data.hero_media?.alt || data.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="pt-6">
              <BlockRenderer blocks={data.blocks} />
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: FULL BLOCK EDITOR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column: Core Fields & Section Blocks */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Core Metadata Card */}
            <div className="p-6 bg-white rounded-2xl border border-northfold-border shadow-sm space-y-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-northfold-ink font-semibold">
                01 / Primary Case Study Details
              </h3>

              {/* Title & Slug */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-northfold-muted">
                    Project Title *
                  </label>
                  <Input
                    type="text"
                    value={data.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Aetherfall: Flight Dynamics Engine"
                    className="font-sans font-semibold text-base rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-northfold-muted">
                      URL Slug * (clean link /work/slug)
                    </label>
                    <Input
                      type="text"
                      value={data.slug}
                      onChange={(e) => {
                        setData({ ...data, slug: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="font-mono text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-northfold-muted">
                      Discipline Topic
                    </label>
                    <select
                      value={data.topic_id || ""}
                      onChange={(e) => {
                        const t = topics.find((item) => item.id === e.target.value);
                        setData({
                          ...data,
                          topic_id: e.target.value,
                          topic_name: t?.name
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="flex h-10 w-full rounded-xl border border-northfold-border bg-white px-3 py-2 text-xs font-mono text-northfold-ink focus:outline-none focus:ring-1 focus:ring-northfold-ink"
                    >
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Outcome Statement */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-northfold-muted">
                    One-Line Outcome Statement * (Displayed on Work grid & Hero)
                  </label>
                  <Input
                    type="text"
                    value={data.outcome}
                    onChange={(e) => {
                      setData({ ...data, outcome: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="e.g. Delivered 120 FPS deterministic aerodynamics and custom volumetric cloud shading on PC."
                    className="font-serif text-sm rounded-xl"
                  />
                </div>

                {/* Executive Summary */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-northfold-muted">
                    Technical Summary / Abstract
                  </label>
                  <Textarea
                    rows={3}
                    value={data.summary}
                    onChange={(e) => {
                      setData({ ...data, summary: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Brief description of the challenge, solution, and quantitative outcome..."
                    className="font-serif text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* 2. Google Drive Media Setup & Preview */}
            <div className="p-6 bg-white rounded-2xl border border-northfold-border shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono uppercase tracking-widest text-northfold-ink font-semibold">
                  02 / Google Drive Media Resolver
                </h3>
                <span className="text-[10px] font-mono text-northfold-faded">
                  Auto-converts to lh3.googleusercontent.com CDN
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-northfold-muted">
                    Paste Google Drive Link or File ID
                  </label>
                  <Input
                    type="text"
                    value={data.hero_media?.drive_url || data.hero_media?.drive_id || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parsed = parseDriveUrl(val, data.hero_media?.type || "image");
                      const mediaType: "image" | "video" = parsed.type === "video" ? "video" : "image";
                      setData((prev) => ({
                        ...prev,
                        hero_media: {
                          ...prev.hero_media,
                          drive_url: val,
                          drive_id: parsed.fileId || "",
                          type: mediaType
                        }
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing"
                    className="font-mono text-xs rounded-xl"
                  />
                </div>

                {/* Warning note if Drive link isn't publicly shared */}
                {driveWarning && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-mono">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <span>{driveWarning}</span>
                  </div>
                )}

                {/* Live Preview of Drive Media */}
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-northfold-border bg-northfold-surface flex items-center justify-center">
                  {drivePreviewUrl ? (
                    <Image
                      src={drivePreviewUrl}
                      alt="Hero Drive Media Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-center space-y-2 p-6">
                      <ImageIcon className="w-8 h-8 text-northfold-faded mx-auto" />
                      <p className="text-xs font-mono text-northfold-muted">
                        Paste a valid Drive link above to view instant live preview.
                      </p>
                    </div>
                  )}
                </div>

                {/* Fallback image URL */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-northfold-muted">
                    Fallback Image URL (used if Drive is ever rate-limited or private)
                  </label>
                  <Input
                    type="text"
                    value={data.hero_media?.fallback_url || ""}
                    onChange={(e) => {
                      setData((prev) => ({
                        ...prev,
                        hero_media: {
                          ...prev.hero_media,
                          fallback_url: e.target.value
                        }
                      }));
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="font-mono text-xs rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* 3. Block-Based Section Builder */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-northfold-ink font-semibold">
                    03 / Structured Content Blocks ({data.blocks.length})
                  </h3>
                  <p className="text-xs font-serif text-northfold-muted">
                    Reorder, customize, and add rich sections for this case study.
                  </p>
                </div>
              </div>

              {/* Block List */}
              <div className="space-y-4">
                {data.blocks.map((block, index) => (
                  <div
                    key={index}
                    className="p-5 bg-white rounded-2xl border border-northfold-border shadow-sm space-y-4 hover:border-northfold-ink/40 transition-colors"
                  >
                    {/* Block Toolbar Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-northfold-border/60">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-northfold-surface text-[10px] font-mono font-semibold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-xs font-mono uppercase font-semibold text-northfold-ink">
                          {block.type.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveBlock(index, "up")}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 text-northfold-muted"
                          title="Move block up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => moveBlock(index, "down")}
                          disabled={index === data.blocks.length - 1}
                          className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 text-northfold-muted"
                          title="Move block down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteBlock(index)}
                          className="p-1 rounded hover:bg-red-50 text-red-500"
                          title="Delete block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Block Title */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-northfold-muted">
                        Section Heading
                      </label>
                      <Input
                        type="text"
                        value={block.title || ""}
                        onChange={(e) => updateBlock(index, { title: e.target.value })}
                        placeholder="e.g. 01 / Technical Bottlenecks"
                        className="rounded-xl font-medium"
                      />
                    </div>

                    {/* Dynamic Fields by Block Type */}
                    {block.type === "rich_text" && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono uppercase text-northfold-muted">
                          Rich HTML Content
                        </label>
                        <Textarea
                          rows={6}
                          value={block.content || ""}
                          onChange={(e) => updateBlock(index, { content: e.target.value })}
                          className="font-serif text-sm rounded-xl"
                        />
                      </div>
                    )}

                    {block.type === "code" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-mono uppercase text-northfold-muted">
                              Language (csharp, go, typescript, hlsl, rust)
                            </label>
                            <Input
                              type="text"
                              value={block.language || "csharp"}
                              onChange={(e) => updateBlock(index, { language: e.target.value })}
                              className="font-mono text-xs rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono uppercase text-northfold-muted">
                            Code Snippet
                          </label>
                          <Textarea
                            rows={8}
                            value={block.code || ""}
                            onChange={(e) => updateBlock(index, { code: e.target.value })}
                            className="font-mono text-xs rounded-xl bg-neutral-900 text-neutral-100 p-4"
                          />
                        </div>
                      </div>
                    )}

                    {block.type === "stats" && (
                      <div className="space-y-3">
                        <label className="text-[11px] font-mono uppercase text-northfold-muted block">
                          Performance Metric Cards
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {block.stats?.map((stat, sIdx) => (
                            <div key={sIdx} className="p-3 border rounded-xl space-y-2 bg-neutral-50">
                              <Input
                                placeholder="Value (e.g. 120 FPS or 2.4M req/s)"
                                value={stat.value}
                                onChange={(e) => {
                                  const updated = [...(block.stats || [])];
                                  updated[sIdx].value = e.target.value;
                                  updateBlock(index, { stats: updated });
                                }}
                                className="font-mono font-bold"
                              />
                              <Input
                                placeholder="Label (e.g. Framerate)"
                                value={stat.label}
                                onChange={(e) => {
                                  const updated = [...(block.stats || [])];
                                  updated[sIdx].label = e.target.value;
                                  updateBlock(index, { stats: updated });
                                }}
                                className="font-mono text-xs"
                              />
                              <Input
                                placeholder="Detail (e.g. 99th percentile)"
                                value={stat.detail || ""}
                                onChange={(e) => {
                                  const updated = [...(block.stats || [])];
                                  updated[sIdx].detail = e.target.value;
                                  updateBlock(index, { stats: updated });
                                }}
                                className="font-serif text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {block.type === "architecture" && (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-[11px] font-mono uppercase text-northfold-muted">
                            Mermaid.js Diagram Syntax (Flowchart, ER Diagram, Sequence)
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-northfold-faded">Templates:</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateBlock(index, {
                                  diagram: `flowchart TD
    Client["Client / SDK"] --> Ingress["API Gateway (Envoy)"]
    Ingress --> Workers["Processing Cluster (Go/Rust)"]
    Workers --> NeonDB[("Neon Postgres Serverless")]
    Workers --> Storage[("ClickHouse Analytics")]`
                                })
                              }
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-northfold-surface hover:bg-neutral-200 border border-northfold-border"
                            >
                              Flowchart
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateBlock(index, {
                                  diagram: `erDiagram
    CASE_STUDIES ||--o{ BLOCKS : contains
    TOPICS ||--o{ CASE_STUDIES : categorizes
    CASE_STUDIES {
        string id PK
        string slug UK
        string title
        jsonb hero_media
        string status
    }
    BLOCKS {
        string type
        string title
        string content
    }`
                                })
                              }
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-northfold-surface hover:bg-neutral-200 border border-northfold-border"
                            >
                              ER Database
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateBlock(index, {
                                  diagram: `sequenceDiagram
    autonumber
    Client->>Server: Heartbeat & InputPacket(tick)
    Server->>Physics: ComputeAerodynamics()
    Physics-->>Server: VectorForces
    Server-->>Client: ReconcileState(pos, rot)`
                                })
                              }
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-northfold-surface hover:bg-neutral-200 border border-northfold-border"
                            >
                              Sequence
                            </button>
                          </div>
                        </div>

                        <Textarea
                          rows={6}
                          value={block.diagram || ""}
                          onChange={(e) => updateBlock(index, { diagram: e.target.value })}
                          className="font-mono text-xs rounded-xl bg-neutral-900 text-neutral-100 p-4"
                          placeholder="flowchart TD\n  A --> B"
                        />

                        {/* Live preview in the editor */}
                        {block.diagram && (
                          <div className="border border-northfold-border rounded-xl p-3 bg-neutral-50/50 space-y-1">
                            <span className="text-[10px] font-mono uppercase text-northfold-faded block">
                              Live Diagram Preview
                            </span>
                            <MermaidDiagram chart={block.diagram} />
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === "quote" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[11px] font-mono uppercase text-northfold-muted">
                            Pull Quote
                          </label>
                          <Textarea
                            rows={3}
                            value={block.quote || ""}
                            onChange={(e) => updateBlock(index, { quote: e.target.value })}
                            className="font-serif text-sm rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono uppercase text-northfold-muted">
                            Author Attribution
                          </label>
                          <Input
                            type="text"
                            value={block.author || ""}
                            onChange={(e) => updateBlock(index, { author: e.target.value })}
                            placeholder="e.g. VP of Engineering"
                            className="text-xs rounded-xl"
                          />
                        </div>
                      </div>
                    )}

                    {block.type === "image" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono uppercase text-northfold-muted">
                            Google Drive Image Link or Image URL
                          </label>
                          <Input
                            type="text"
                            value={block.url || ""}
                            onChange={(e) => updateBlock(index, { url: e.target.value })}
                            placeholder="https://drive.google.com/file/d/..."
                            className="font-mono text-xs rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono uppercase text-northfold-muted">
                            Caption
                          </label>
                          <Input
                            type="text"
                            value={block.caption || ""}
                            onChange={(e) => updateBlock(index, { caption: e.target.value })}
                            placeholder="Figure 1: Aerodynamic force breakdown"
                            className="text-xs rounded-xl"
                          />
                        </div>
                      </div>
                    )}

                    {block.type === "video" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono uppercase text-northfold-muted">
                            Google Drive Video URL (embed preview will be generated)
                          </label>
                          <Input
                            type="text"
                            value={block.url || ""}
                            onChange={(e) => updateBlock(index, { url: e.target.value })}
                            placeholder="https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview"
                            className="font-mono text-xs rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono uppercase text-northfold-muted">
                            Video Caption
                          </label>
                          <Input
                            type="text"
                            value={block.caption || ""}
                            onChange={(e) => updateBlock(index, { caption: e.target.value })}
                            placeholder="Live simulation footage at 120 FPS"
                            className="text-xs rounded-xl"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Block Selector Bar */}
              <div className="p-4 bg-white rounded-2xl border border-dashed border-northfold-border space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-northfold-muted block">
                  + Add New Block to Case Study
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock("rich_text")}
                    className="rounded-full text-xs font-mono"
                  >
                    + Rich Text
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock("stats")}
                    className="rounded-full text-xs font-mono"
                  >
                    + Metric Stat Cards
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock("code")}
                    className="rounded-full text-xs font-mono"
                  >
                    + Code Snippet
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock("architecture")}
                    className="rounded-full text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-300"
                  >
                    + Architecture & Database Diagram (Mermaid)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock("image")}
                    className="rounded-full text-xs font-mono"
                  >
                    + Image (Drive Link)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock("video")}
                    className="rounded-full text-xs font-mono"
                  >
                    + Video Embed
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock("quote")}
                    className="rounded-full text-xs font-mono"
                  >
                    + Pull Quote
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock("divider")}
                    className="rounded-full text-xs font-mono"
                  >
                    + Divider
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Facts Table Settings & Publishing Checklist */}
          <div className="lg:col-span-4 space-y-6">
            {/* Header Facts Fields */}
            <div className="p-6 bg-white rounded-2xl border border-northfold-border shadow-sm space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-northfold-ink font-semibold">
                Facts Table Settings
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-northfold-muted uppercase">Your Role</label>
                  <Input
                    type="text"
                    value={data.role}
                    onChange={(e) => {
                      setData({ ...data, role: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="e.g. Lead Systems Architect"
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-northfold-muted uppercase">Duration</label>
                    <Input
                      type="text"
                      value={data.duration}
                      onChange={(e) => {
                        setData({ ...data, duration: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="e.g. 14 months"
                      className="rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-northfold-muted uppercase">Year</label>
                    <Input
                      type="text"
                      value={data.year}
                      onChange={(e) => {
                        setData({ ...data, year: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="2024"
                      className="rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Display Order & Featured */}
                <div className="pt-2 flex items-center justify-between border-t border-northfold-border/60">
                  <span className="text-northfold-muted uppercase">Featured on Home:</span>
                  <input
                    type="checkbox"
                    checked={data.featured}
                    onChange={(e) => {
                      setData({ ...data, featured: e.target.checked });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-4 h-4 accent-black"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-northfold-muted uppercase">Display Order (Rank):</span>
                  <Input
                    type="number"
                    value={data.display_order}
                    onChange={(e) => {
                      setData({ ...data, display_order: parseInt(e.target.value, 10) || 0 });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-20 rounded-xl text-xs text-right font-mono"
                  />
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="p-6 bg-white rounded-2xl border border-northfold-border shadow-sm space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-northfold-ink font-semibold">
                Project Links (Optional)
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-northfold-muted uppercase">Live Demo Link</label>
                  <Input
                    type="text"
                    value={data.links?.demo || ""}
                    onChange={(e) => {
                      setData({ ...data, links: { ...data.links, demo: e.target.value } });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="https://..."
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-northfold-muted uppercase">GitHub / Repo</label>
                  <Input
                    type="text"
                    value={data.links?.github || ""}
                    onChange={(e) => {
                      setData({ ...data, links: { ...data.links, github: e.target.value } });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="https://github.com/..."
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-northfold-muted uppercase">Video Walkthrough</label>
                  <Input
                    type="text"
                    value={data.links?.video || ""}
                    onChange={(e) => {
                      setData({ ...data, links: { ...data.links, video: e.target.value } });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Drive preview link..."
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Tags & Tech Stack Pills */}
            <div className="p-6 bg-white rounded-2xl border border-northfold-border shadow-sm space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-northfold-ink font-semibold">
                Tech Stack & Filter Tags
              </h3>

              {/* Tech Stack */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-northfold-muted">
                  Core Technologies
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newStack}
                    onChange={(e) => setNewStack(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addStack())}
                    placeholder="e.g. Unity 6, C#, HLSL"
                    className="rounded-xl text-xs"
                  />
                  <Button type="button" size="sm" onClick={addStack} className="rounded-xl">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {data.stack?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-northfold-surface border border-northfold-border text-xs font-mono flex items-center gap-1.5"
                    >
                      <span>{tech}</span>
                      <button
                        onClick={() => removeStack(tech)}
                        className="text-northfold-muted hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Filter Tags */}
              <div className="space-y-2 pt-2 border-t border-northfold-border/60">
                <label className="text-xs font-mono uppercase text-northfold-muted">
                  Keywords & Badges
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="e.g. DOTS, WebSockets"
                    className="rounded-xl text-xs"
                  />
                  <Button type="button" size="sm" onClick={addTag} className="rounded-xl">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {data.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-northfold-surface border border-northfold-border text-xs font-mono flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-northfold-muted hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Confidentiality / NDA Checklist */}
            <div className="p-6 bg-white rounded-2xl border border-northfold-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-northfold-ink font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>NDA & Confidentiality</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-northfold-muted">
                  Confidentiality Notice (Optional banner on detail page)
                </label>
                <Textarea
                  rows={2}
                  value={data.confidential_notice || ""}
                  onChange={(e) => {
                    setData({ ...data, confidential_notice: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="e.g. Specific aerodynamic coefficient curves have been redacted under studio NDA."
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5 pt-2 text-[11px] font-mono text-northfold-muted border-t border-northfold-border/60">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="nda-names" className="accent-black" />
                  <label htmlFor="nda-names">Client proprietary names anonymized</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="nda-keys" className="accent-black" />
                  <label htmlFor="nda-keys">API keys & production endpoints sanitized</label>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="p-6 bg-white rounded-2xl border border-northfold-border shadow-sm space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-northfold-ink font-semibold">
                SEO & OpenGraph Metadata
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-northfold-muted uppercase">Meta Title</label>
                  <Input
                    type="text"
                    value={data.seo_title || ""}
                    onChange={(e) => {
                      setData({ ...data, seo_title: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Custom SEO title..."
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-northfold-muted uppercase">Meta Description</label>
                  <Textarea
                    rows={2}
                    value={data.seo_description || ""}
                    onChange={(e) => {
                      setData({ ...data, seo_description: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Custom search description..."
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getDefaultBlockTitle(type: CaseStudyBlock["type"]): string {
  switch (type) {
    case "rich_text":
      return "01 / Engineering Architecture";
    case "stats":
      return "Performance Benchmarks";
    case "code":
      return "Core Kernel Implementation";
    case "architecture":
      return "System Topology Graph";
    case "quote":
      return "Architectural Post-Mortem";
    case "image":
      return "System Diagram Capture";
    case "video":
      return "Real-Time Demonstration";
    case "gallery":
      return "Production Screenshots";
    default:
      return "Section Block";
  }
}
