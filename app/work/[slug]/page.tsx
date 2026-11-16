import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Play,
  ShieldAlert,
  Calendar,
  Clock,
  Layers,
  UserCheck
} from "lucide-react";
import { getCaseStudyBySlug, getCaseStudies } from "@/lib/db";
import { BlockRenderer } from "@/components/block-renderer";
import { ImageLightbox } from "@/components/image-lightbox";
import { getSafeImageSrc, parseDriveUrl } from "@/lib/drive";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);

  if (!cs) {
    return { title: "Case Study Not Found" };
  }

  return {
    title: `${cs.seo_title || cs.title} • Fahad Systems`,
    description: cs.seo_description || cs.outcome,
    openGraph: {
      title: cs.seo_title || cs.title,
      description: cs.seo_description || cs.outcome,
      type: "article",
      images: cs.hero_media?.drive_id
        ? [`https://lh3.googleusercontent.com/d/${cs.hero_media.drive_id}`]
        : cs.hero_media?.fallback_url
        ? [cs.hero_media.fallback_url]
        : []
    }
  };
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);

  if (!cs || cs.status !== "published") {
    notFound();
  }

  // Fetch all case studies for next/prev navigation
  const allStudies = await getCaseStudies({ status: "published" });
  const currentIndex = allStudies.findIndex((item) => item.id === cs.id);
  const prevStudy = currentIndex > 0 ? allStudies[currentIndex - 1] : null;
  const nextStudy = currentIndex < allStudies.length - 1 ? allStudies[currentIndex + 1] : null;

  const heroImageSrc = getSafeImageSrc({
    directImageUrl: cs.hero_media?.drive_id
      ? `https://lh3.googleusercontent.com/d/${cs.hero_media.drive_id}`
      : undefined,
    fallback_url: cs.hero_media?.fallback_url,
    drive_id: cs.hero_media?.drive_id
  });

  return (
    <article className="w-full relative pb-28">
      {/* Top Breadcrumb & Back Link */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-northfold-muted hover:text-northfold-ink transition-colors pb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all work</span>
        </Link>
      </div>

      {/* Hero Header Section */}
      <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="tag">{cs.topic_name || "Case Study"}</Badge>
            <span className="text-xs font-mono text-northfold-muted">
              Project #{String(currentIndex + 1).padStart(2, "0")}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-northfold-ink leading-[1.1]">
            {cs.title}
          </h1>

          <p className="text-xl sm:text-2xl font-serif text-northfold-muted leading-relaxed">
            {cs.outcome}
          </p>
        </div>

        {/* Confidentiality Notice Alert (if NDA flag active) */}
        {cs.confidential_notice && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 text-xs font-mono leading-relaxed">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <span className="font-semibold uppercase tracking-wider block">
                NDA & Confidentiality Notice:
              </span>
              <span>{cs.confidential_notice}</span>
            </div>
          </div>
        )}

        {/* Header Facts Table (Topic, Role, Stack, Duration, Year, Status) */}
        <div className="rounded-xl border border-northfold-border bg-white overflow-hidden shadow-sm">
          <div className="px-6 py-3 bg-northfold-surface border-b border-northfold-border text-[11px] font-mono uppercase tracking-widest text-northfold-muted">
            Specification & Technical Metadata
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-northfold-border text-xs font-mono">
            {/* Topic */}
            <div className="p-4 space-y-1">
              <span className="text-[10px] text-northfold-faded uppercase block">Topic / Domain</span>
              <span className="font-semibold text-northfold-ink block">{cs.topic_name || "Engineering"}</span>
            </div>

            {/* Role */}
            <div className="p-4 space-y-1">
              <span className="text-[10px] text-northfold-faded uppercase block">Role</span>
              <span className="font-semibold text-northfold-ink block">{cs.role}</span>
            </div>

            {/* Duration */}
            <div className="p-4 space-y-1">
              <span className="text-[10px] text-northfold-faded uppercase block">Duration</span>
              <span className="font-semibold text-northfold-ink block">{cs.duration}</span>
            </div>

            {/* Year */}
            <div className="p-4 space-y-1">
              <span className="text-[10px] text-northfold-faded uppercase block">Year</span>
              <span className="font-semibold text-northfold-ink block">{cs.year}</span>
            </div>

            {/* Status */}
            <div className="p-4 space-y-1">
              <span className="text-[10px] text-northfold-faded uppercase block">Status</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Production
              </span>
            </div>

            {/* Stack count */}
            <div className="p-4 space-y-1">
              <span className="text-[10px] text-northfold-faded uppercase block">Stack</span>
              <span className="font-semibold text-northfold-ink block">
                {cs.stack?.length || 0} Core Techs
              </span>
            </div>
          </div>

          {/* Full Tech Stack Pills */}
          {cs.stack && cs.stack.length > 0 && (
            <div className="p-4 bg-northfold-surface/50 border-t border-northfold-border flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-northfold-muted mr-2">
                Tech Stack:
              </span>
              {cs.stack.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full border border-northfold-border bg-white text-xs font-mono text-northfold-ink"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* External Links Bar (Live Demo, GitHub, Video Walkthrough - only shown if populated) */}
        {(cs.links?.demo || cs.links?.github || cs.links?.video) && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {cs.links.demo && (
              <Button asChild size="sm" className="rounded-full font-mono text-xs uppercase tracking-wider">
                <a href={cs.links.demo} target="_blank" rel="noreferrer">
                  Live Interactive Demo <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </a>
              </Button>
            )}

            {cs.links.github && (
              <Button asChild variant="outline" size="sm" className="rounded-full font-mono text-xs uppercase tracking-wider">
                <a href={cs.links.github} target="_blank" rel="noreferrer">
                  <Github className="w-3.5 h-3.5 mr-1.5" /> Source Repository
                </a>
              </Button>
            )}

            {cs.links.video && (
              <Button asChild variant="secondary" size="sm" className="rounded-full font-mono text-xs uppercase tracking-wider">
                <a href={cs.links.video} target="_blank" rel="noreferrer">
                  <Play className="w-3.5 h-3.5 mr-1.5" /> Video Demonstration
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Hero Media Element */}
        <div className="pt-6">
          <ImageLightbox
            src={heroImageSrc}
            alt={cs.hero_media?.alt || cs.title}
            caption={cs.hero_media?.alt || `${cs.title} production capture`}
            aspectRatio="aspect-[16/9]"
          />
        </div>
      </header>

      {/* Main Content Blocks */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <BlockRenderer blocks={cs.blocks} />
      </main>

      {/* Prev / Next Navigation */}
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-12 border-t border-northfold-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Previous */}
          {prevStudy ? (
            <Link
              href={`/work/${prevStudy.slug}`}
              className="group p-6 rounded-xl border border-northfold-border bg-white hover:border-northfold-ink transition-colors space-y-2 block"
            >
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-northfold-muted group-hover:text-northfold-ink">
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Previous Case Study</span>
              </div>
              <h4 className="text-lg font-semibold text-northfold-ink line-clamp-1">
                {prevStudy.title}
              </h4>
            </Link>
          ) : (
            <div />
          )}

          {/* Next */}
          {nextStudy && (
            <Link
              href={`/work/${nextStudy.slug}`}
              className="group p-6 rounded-xl border border-northfold-border bg-white hover:border-northfold-ink transition-colors space-y-2 text-right block"
            >
              <div className="flex items-center justify-end gap-1.5 text-xs font-mono uppercase tracking-widest text-northfold-muted group-hover:text-northfold-ink">
                <span>Next Case Study</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
              <h4 className="text-lg font-semibold text-northfold-ink line-clamp-1">
                {nextStudy.title}
              </h4>
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
