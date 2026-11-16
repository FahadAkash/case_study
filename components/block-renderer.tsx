"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check, Play, ExternalLink, Sparkles } from "lucide-react";
import { CaseStudyBlock } from "@/lib/db";
import { ImageLightbox } from "@/components/image-lightbox";
import { parseDriveUrl } from "@/lib/drive";
import { MermaidDiagram } from "@/components/mermaid-diagram";

interface BlockRendererProps {
  blocks: CaseStudyBlock[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-16">
      {blocks.map((block, idx) => (
        <section key={idx} className="block-section">
          {renderSingleBlock(block, idx)}
        </section>
      ))}
    </div>
  );
}

function renderSingleBlock(block: CaseStudyBlock, index: number) {
  switch (block.type) {
    case "rich_text":
      return (
        <div className="max-w-3xl space-y-4">
          {block.title && (
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-northfold-ink">
              {block.title}
            </h3>
          )}
          <div
            className="prose prose-neutral max-w-none font-serif text-lg text-northfold-muted leading-relaxed [&>p]:mb-4 [&>strong]:text-northfold-ink [&>strong]:font-semibold [&>code]:font-mono [&>code]:text-xs [&>code]:bg-northfold-surface [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:border [&>code]:border-northfold-border"
            dangerouslySetInnerHTML={{ __html: block.content || "" }}
          />
        </div>
      );

    case "stats":
      return (
        <div className="space-y-6">
          {block.title && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-northfold-ink" />
              <h4 className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
                {block.title}
              </h4>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {block.stats?.map((stat, sIdx) => (
              <div
                key={sIdx}
                className="p-6 rounded-xl border border-northfold-border bg-white space-y-2 shadow-sm hover:border-northfold-ink transition-colors"
              >
                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-northfold-ink font-mono">
                  {stat.value}
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-northfold-muted">
                  {stat.label}
                </div>
                {stat.detail && (
                  <div className="text-xs font-serif text-northfold-faded pt-1 border-t border-northfold-border/40">
                    {stat.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case "code":
      return <CodeSnippetBlock block={block} />;

    case "image": {
      const parsed = block.url ? parseDriveUrl(block.url, "image") : null;
      const src = parsed?.directImageUrl || block.url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80";
      return (
        <div className="space-y-3">
          {block.title && (
            <h4 className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
              {block.title}
            </h4>
          )}
          <ImageLightbox
            src={src}
            alt={block.title || block.caption || "Case study figure"}
            caption={block.caption}
            aspectRatio="aspect-[16/9]"
          />
        </div>
      );
    }

    case "gallery":
      return (
        <div className="space-y-4">
          {block.title && (
            <h4 className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
              {block.title}
            </h4>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {block.images?.map((img, iIdx) => {
              const parsed = img.url ? parseDriveUrl(img.url, "image") : null;
              const src = parsed?.directImageUrl || img.url;
              return (
                <ImageLightbox
                  key={iIdx}
                  src={src}
                  alt={img.alt || `Gallery image ${iIdx + 1}`}
                  caption={img.caption}
                  aspectRatio="aspect-[4/3]"
                />
              );
            })}
          </div>
        </div>
      );

    case "video":
      return <DriveVideoBlock block={block} />;

    case "architecture":
      return (
        <MermaidDiagram
          chart={
            block.diagram && (block.diagram.includes("flowchart") || block.diagram.includes("graph") || block.diagram.includes("erDiagram") || block.diagram.includes("sequenceDiagram") || block.diagram.includes("stateDiagram") || block.diagram.includes("classDiagram"))
              ? block.diagram
              : `flowchart LR
    A["${(block.diagram || "Clients").split("->")[0]?.trim()}"] --> B["${(block.diagram || "Edge").split("->")[1]?.trim() || "Processing Core"}"]
    B --> C["${(block.diagram || "Storage").split("->")[2]?.trim() || "Data Store"}"]`
          }
          title={block.title || "System Architecture & Topology"}
          caption={block.caption}
        />
      );

    case "quote":
      return (
        <div className="my-8 border-l-2 border-northfold-ink pl-6 py-2 space-y-2">
          <blockquote className="text-xl sm:text-2xl font-serif italic text-northfold-ink leading-relaxed">
            "{block.quote}"
          </blockquote>
          {block.author && (
            <p className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
              — {block.author}
            </p>
          )}
        </div>
      );

    case "divider":
      return <hr className="border-t border-northfold-border my-12" />;

    default:
      return null;
  }
}

function CodeSnippetBlock({ block }: { block: CaseStudyBlock }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (block.code) {
      navigator.clipboard.writeText(block.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      {block.title && (
        <h4 className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
          {block.title}
        </h4>
      )}
      <div className="rounded-xl border border-neutral-800 bg-[#0C0C0C] text-neutral-100 overflow-hidden shadow-lg font-mono text-xs sm:text-sm">
        {/* Code Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            {block.language || "source"}
          </span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded-md hover:bg-neutral-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-4 sm:p-6 overflow-x-auto leading-relaxed text-neutral-200">
          <code>{block.code}</code>
        </pre>
      </div>
    </div>
  );
}

function DriveVideoBlock({ block }: { block: CaseStudyBlock }) {
  const [playing, setPlaying] = useState(false);
  const parsed = block.url ? parseDriveUrl(block.url, "video") : null;
  const embedUrl = parsed?.embedVideoUrl || block.url;

  return (
    <div className="space-y-3">
      {block.title && (
        <h4 className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
          {block.title}
        </h4>
      )}

      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-northfold-border bg-black shadow-md">
        {playing ? (
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={block.title || "Video Demonstration"}
          />
        ) : (
          <div
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-neutral-900 text-white select-none transition-all hover:bg-neutral-800"
          >
            {/* Click-to-load thumbnail satisfying performance requirement */}
            <div className="w-16 h-16 rounded-full border border-white/30 bg-black/60 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:border-white transition-all shadow-xl">
              <Play className="w-6 h-6 ml-1 text-white fill-white" />
            </div>
            <p className="mt-4 text-xs font-mono uppercase tracking-widest text-neutral-300">
              Click to load Google Drive Video Walkthrough
            </p>
            <span className="mt-1 text-[11px] font-mono text-neutral-500">
              Interactive embed • 1080p
            </span>
          </div>
        )}
      </div>

      {block.caption && (
        <p className="text-xs font-mono text-northfold-muted text-center tracking-wide">
          {block.caption}
        </p>
      )}
    </div>
  );
}
