import { Metadata } from "next";
import Link from "next/link";
import { Download, ArrowUpRight, Terminal, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HalftonePattern } from "@/components/halftone-pattern";
import { getSiteSettings } from "@/lib/db";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About & Engineering Philosophy • Fahad Systems",
  description:
    "Systems engineering, graphics pipelines, and spatial computing background. Download CV and view technical stack.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const storyText =
    settings.about_story ||
    `I began my journey disassembling graphics shaders and network protocols in C++, later scaling into full engine architecture and high-throughput backend infrastructure.\n\nMy philosophy: performance is never an afterthought—it is the foundational prerequisite for true user delight. Every millisecond shaved and every byte aligned directly elevates the creative experience.`;

  const cvUrl =
    settings.cv_url ||
    "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing";

  const skills = settings.skills_list || [
    "C# / Unity DOTS & Burst",
    "C++ / HLSL Graphics",
    "Go / Distributed Systems",
    "TypeScript / Next.js",
    "visionOS / OpenXR",
    "Postgres / ClickHouse / Kafka",
    "Docker / Kubernetes"
  ];

  const tools = [
    { name: "Unity 6 & DOTS", category: "Engine & Simulation" },
    { name: "Unreal Engine 5", category: "Virtual Production" },
    { name: "RenderDoc / Pix / NSight", category: "GPU Profiling" },
    { name: "JetBrains Rider", category: "IDE & Analyzers" },
    { name: "Docker & Kubernetes", category: "Infrastructure" },
    { name: "Kafka & ClickHouse", category: "Real-time Telemetry" },
    { name: "Figma", category: "Interface Architecture" }
  ];

  return (
    <div className="w-full relative py-12 md:py-20">
      <HalftonePattern opacity={0.12} spacing={14} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
            01 / BIOGRAPHY & PHILOSOPHY
          </span>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-northfold-ink">
            Systems Engineering, Real-Time Graphics & Spatial Scale.
          </h1>
          <p className="text-xl font-serif text-northfold-muted leading-relaxed">
            Bridging low-level runtime execution with ergonomic developer tooling.
          </p>
        </div>

        {/* Narrative & Story */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-t border-northfold-border pt-12">
          <div className="md:col-span-4 space-y-6">
            <div className="p-6 rounded-xl border border-northfold-border bg-white shadow-sm space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted block">
                Executive Profile
              </span>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-northfold-border/60">
                  <span className="text-northfold-faded">Focus:</span>
                  <span className="font-semibold text-northfold-ink">Engine & Scale</span>
                </div>
                <div className="flex justify-between py-1 border-b border-northfold-border/60">
                  <span className="text-northfold-faded">Experience:</span>
                  <span className="font-semibold text-northfold-ink">8+ Years</span>
                </div>
                <div className="flex justify-between py-1 border-b border-northfold-border/60">
                  <span className="text-northfold-faded">Location:</span>
                  <span className="font-semibold text-northfold-ink">Remote / Worldwide</span>
                </div>
              </div>

              {/* Download CV CTA */}
              <div className="pt-2" id="cv">
                <Button asChild className="w-full rounded-full font-mono text-xs uppercase tracking-wider">
                  <a href={cvUrl} target="_blank" rel="noreferrer">
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download CV (PDF)
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-6">
            <h3 className="text-2xl font-semibold text-northfold-ink">
              The Engineering Creed
            </h3>
            <div className="prose prose-neutral max-w-none font-serif text-lg text-northfold-muted leading-relaxed space-y-4">
              {storyText.split("\n\n").map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-northfold-border bg-white/70 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-northfold-ink font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Deterministic Execution</span>
                </div>
                <p className="text-xs font-serif text-northfold-muted">
                  Zero memory allocations in render and simulation loops.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-northfold-border bg-white/70 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-northfold-ink font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Zero-Compromise Security</span>
                </div>
                <p className="text-xs font-serif text-northfold-muted">
                  Strict client-server boundaries, encrypted state channels, and sanitized telemetry.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tools & Environment Matrix */}
        <div className="border-t border-northfold-border pt-12 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
                02 / TOOLCHAIN & STACK
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-northfold-ink mt-1">
                Production Weapons of Choice
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((t, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-northfold-border bg-white shadow-sm space-y-2 hover:border-northfold-ink transition-colors"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-northfold-faded block">
                  {t.category}
                </span>
                <h4 className="text-base font-semibold text-northfold-ink font-mono">
                  {t.name}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border-t border-northfold-border pt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold text-northfold-ink">
              Ready to explore collaboration?
            </h3>
            <p className="text-sm font-serif text-northfold-muted">
              I am open to select architecture, fractional lead, or full-project contracts.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full font-mono text-xs uppercase tracking-wider px-8 shadow-md">
            <Link href="/contact">
              Send an Inquiry <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
