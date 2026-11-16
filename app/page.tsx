import Link from "next/link";
import { ArrowUpRight, Terminal, Cpu, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseStudyCard } from "@/components/case-study-card";
import { HalftoneHeroOrb, HalftonePattern } from "@/components/halftone-pattern";
import { getCaseStudies, getSiteSettings } from "@/lib/db";

export const revalidate = 60; // On-demand revalidation / ISR

export default async function HomePage() {
  const [caseStudies, settings] = await Promise.all([
    getCaseStudies({ featuredOnly: true }),
    getSiteSettings()
  ]);

  const heroHeadline =
    settings.hero_headline ||
    "Engineering high-performance game engines, spatial systems & distributed scale.";

  const heroIntro =
    settings.hero_intro ||
    "Bridging low-level systems engineering with obsessive interactive polish. 8+ years architecting AAA graphics pipelines, spatial computing platforms, and distributed systems handling millions of events.";

  const skillsList = settings.skills_list || [
    "C# / Unity DOTS & Burst",
    "C++ / HLSL Graphics",
    "Go / Distributed Systems",
    "TypeScript / Next.js",
    "visionOS / OpenXR",
    "Postgres / ClickHouse / Kafka"
  ];

  return (
    <div className="w-full relative">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 border-b border-northfold-border overflow-hidden">
        <HalftonePattern opacity={0.18} spacing={12} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-northfold-border bg-white text-xs font-mono uppercase tracking-widest text-northfold-muted shadow-sm">
                <span className="w-2 h-2 rounded-full bg-northfold-ink animate-pulse" />
                SYSTEMS ARCHITECT & INTERACTIVE ENGINEER
              </div>

              {/* Big Headline in One Sentence */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-northfold-ink leading-[1.05]">
                {heroHeadline}
              </h1>

              {/* Short Intro Paragraph */}
              <p className="text-lg sm:text-xl font-serif text-northfold-muted leading-relaxed max-w-2xl">
                {heroIntro}
              </p>

              {/* Two Pill Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button asChild size="lg" className="rounded-full font-mono text-xs uppercase tracking-wider px-8 shadow-md">
                  <Link href="/contact">
                    Send an Inquiry <ArrowUpRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="rounded-full font-mono text-xs uppercase tracking-wider px-8">
                  <Link href="/work">
                    See All Work ({caseStudies.length})
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Hero Visual: Northfold Halftone Hero Orb */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-square rounded-2xl border border-northfold-border/80 bg-white/60 p-6 flex items-center justify-center backdrop-blur-sm shadow-xl">
                <HalftoneHeroOrb className="w-full h-full" />
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] font-mono text-northfold-muted border-t border-northfold-border/60 pt-2">
                  <span>COORD. 47.6062° N</span>
                  <span>BURST-COMPILED • SIMD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Studies Section */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-12 border-b border-northfold-border">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
              01 / SELECTED WORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-northfold-ink mt-2">
              Featured Case Studies
            </h2>
          </div>
          <Link
            href="/work"
            className="group flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-northfold-muted hover:text-northfold-ink transition-colors"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Case Studies List */}
        <div className="divide-y divide-northfold-border">
          {caseStudies.map((cs, idx) => (
            <CaseStudyCard
              key={cs.id}
              caseStudy={cs}
              index={idx}
              total={caseStudies.length}
            />
          ))}
        </div>
      </section>

      {/* Skills / Tech Stack Strip */}
      <section className="py-16 bg-[#111111] text-[#FBFBFA] border-y border-neutral-800 relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-10 select-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "12px 12px"
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-1 md:max-w-xs">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                02 / CORE CAPABILITIES
              </span>
              <h3 className="text-xl font-semibold text-white">
                Technical Stack & Disciplines
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 md:max-w-3xl">
              {skillsList.map((skill: string, sIdx: number) => (
                <span
                  key={sIdx}
                  className="px-4 py-2 rounded-full border border-neutral-700 bg-neutral-900/80 text-xs font-mono tracking-wide text-neutral-200 hover:border-neutral-400 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        <HalftonePattern opacity={0.12} spacing={14} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
            03 / INITIATE CONTACT
          </span>

          <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight text-northfold-ink leading-tight">
            Have a critical system or immersive engine to build?
          </h2>

          <p className="text-lg font-serif text-northfold-muted max-w-xl mx-auto">
            Available for select technical leadership, engine architecture, and high-load contract engagements.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full font-mono text-xs uppercase tracking-wider px-10 shadow-lg">
              <Link href="/contact">
                Start a Conversation <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full font-mono text-xs uppercase tracking-wider px-8">
              <Link href="/about">
                Read About Philosophy
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
