"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CaseStudy } from "@/lib/db";
import { getSafeImageSrc } from "@/lib/drive";
import { cn } from "@/lib/utils";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  index: number;
  total?: number;
}

export function CaseStudyCard({ caseStudy, index, total }: CaseStudyCardProps) {
  const [imgError, setImgError] = useState(false);
  const formattedIndex = (index + 1).toString().padStart(2, "0");
  const formattedTotal = total ? total.toString().padStart(2, "0") : undefined;

  const imgSrc = getSafeImageSrc({
    directImageUrl: caseStudy.hero_media?.drive_id
      ? `https://lh3.googleusercontent.com/d/${caseStudy.hero_media.drive_id}`
      : undefined,
    fallback_url: caseStudy.hero_media?.fallback_url,
    drive_id: caseStudy.hero_media?.drive_id
  });

  const displaySrc = imgError
    ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
    : imgSrc;

  return (
    <article className="group relative border-b border-northfold-border py-12 first:pt-4 transition-colors">
      <Link href={`/work/${caseStudy.slug}`} className="block">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Number & Metadata */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col justify-between items-baseline lg:items-start gap-4">
            <div className="font-mono text-2xl lg:text-3xl font-light text-northfold-muted group-hover:text-northfold-ink transition-colors">
              {formattedIndex}
              {formattedTotal && (
                <span className="text-xs text-northfold-faded ml-1">
                  / {formattedTotal}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-northfold-faded uppercase tracking-widest block">
                {caseStudy.year || "2024"}
              </span>
              <span className="text-xs font-mono text-northfold-muted block">
                {caseStudy.role || "Lead Architect"}
              </span>
            </div>
          </div>

          {/* Middle Column: Title & Outcome & Tags */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="tag">{caseStudy.topic_name || "Engineering"}</Badge>
              {caseStudy.featured && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-northfold-ink text-white">
                  Featured
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-northfold-ink group-hover:text-neutral-700 transition-colors">
              {caseStudy.title}
            </h3>

            <p className="text-base sm:text-lg font-serif text-northfold-muted leading-relaxed">
              {caseStudy.outcome}
            </p>

            {/* Stack Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {caseStudy.tags?.slice(0, 5).map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-xs font-mono text-northfold-muted bg-northfold-surface px-2.5 py-1 rounded-full border border-northfold-border/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Thumbnail with Halftone-to-Color Hover Effect */}
          <div className="lg:col-span-4 relative">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-northfold-border bg-northfold-surface">
              <Image
                src={displaySrc}
                alt={caseStudy.hero_media?.alt || caseStudy.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-all duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
              />

              {/* Northfold Halftone dot overlay that softens/dissolves on hover */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-40 group-hover:opacity-0"
                style={{
                  backgroundImage: "radial-gradient(#111111 1.2px, transparent 1.2px)",
                  backgroundSize: "6px 6px"
                }}
              />

              {/* View Project Arrow Indicator */}
              <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 shadow-md">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
