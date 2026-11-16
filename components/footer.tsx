"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Github, Linkedin, Twitter, FileText, Lock } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#111111] text-[#FBFBFA] pt-16 pb-12 border-t border-neutral-800 relative overflow-hidden">
      {/* Subtle halftone dots background on dark surface */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15 select-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-neutral-800">
          {/* Column 01 */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono text-neutral-400 tracking-widest uppercase">
              01 / Architecture & Craft
            </span>
            <p className="text-sm font-serif text-neutral-300 leading-relaxed max-w-xs">
              Meticulous systems engineering, real-time interactive simulations, and distributed cloud backends.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Available for Q1/Q2 Advisory
              </span>
            </div>
          </div>

          {/* Column 02: Navigation */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono text-neutral-400 tracking-widest uppercase">
              02 / Navigation
            </span>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/work" className="text-neutral-300 hover:text-white transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-300 hover:text-white transition-colors">
                  Engineering Story & Skills
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-300 hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors">
                  Start an Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 03: Socials & CV */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono text-neutral-400 tracking-widest uppercase">
              03 / Connect & Documents
            </span>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4 text-neutral-400" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-neutral-400" /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                >
                  <Twitter className="w-4 h-4 text-neutral-400" /> X (Twitter)
                </a>
              </li>
              <li>
                <Link
                  href="/about#cv"
                  className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4 text-neutral-400" /> Curriculum Vitae (PDF)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 04: Colophon & Top */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono text-neutral-400 tracking-widest uppercase">
                04 / System
              </span>
              <p className="text-xs font-mono text-neutral-400 pt-3 leading-relaxed">
                Rendered with Next.js App Router, GSAP, and Neon Serverless Postgres.
              </p>
            </div>
            <div className="flex items-center justify-between pt-6">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <Lock className="w-3 h-3" /> Admin Portal
              </Link>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-white border border-neutral-700 rounded-full px-3 py-1 hover:border-neutral-400 transition-colors"
              >
                <span>TOP</span>
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Northfold Systems Engineering. All rights reserved.</p>
          <p className="tracking-wide">LATENCY ZERO • SCALE UNBOUNDED</p>
        </div>
      </div>
    </footer>
  );
}
