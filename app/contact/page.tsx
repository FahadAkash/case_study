import { Metadata } from "next";
import { Mail, Github, Linkedin, Twitter, Clock, ShieldCheck } from "lucide-react";
import { ContactForm } from "./contact-form";
import { submitContactInquiry } from "./actions";
import { HalftonePattern } from "@/components/halftone-pattern";
import { getSiteSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Contact & Inquiries • Fahad Systems",
  description:
    "Send an inquiry for game engine architecture, spatial computing systems, and distributed backend engagements.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const contactEmail = settings.contact_email || "fahad@northfold-portfolio.dev";
  const githubUrl = settings.social_github || "https://github.com";
  const linkedinUrl = settings.social_linkedin || "https://linkedin.com";
  const twitterUrl = settings.social_twitter || "https://x.com";

  return (
    <div className="w-full relative py-12 md:py-20">
      <HalftonePattern opacity={0.12} spacing={14} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
            01 / INITIATE ENGAGEMENT
          </span>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-northfold-ink">
            Let's Engineer Something Exceptional.
          </h1>
          <p className="text-lg sm:text-xl font-serif text-northfold-muted leading-relaxed">
            Fill out the form below with your project requirements or reach out directly via secure channels.
          </p>
        </div>

        {/* Content Split: Form vs Direct Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-t border-northfold-border pt-12">
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-northfold-border shadow-sm">
            <h3 className="text-xl font-semibold text-northfold-ink mb-6">
              Project Specification Form
            </h3>
            <ContactForm onSubmitAction={submitContactInquiry} />
          </div>

          {/* Right Direct Links & Details */}
          <div className="lg:col-span-5 space-y-8">
            {/* Direct Email Card */}
            <div className="p-6 rounded-2xl border border-northfold-border bg-white shadow-sm space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted block">
                Direct Communication
              </span>
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3 text-lg font-mono font-medium text-northfold-ink hover:underline"
              >
                <Mail className="w-5 h-5 text-northfold-muted shrink-0" />
                <span className="break-all">{contactEmail}</span>
              </a>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <Clock className="w-3.5 h-3.5" />
                <span>Response time: &lt; 24 business hours</span>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="p-6 rounded-2xl border border-northfold-border bg-white shadow-sm space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted block">
                Engineering Networks
              </span>
              <div className="space-y-3 font-mono text-xs">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-northfold-border hover:border-northfold-ink hover:bg-northfold-surface transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-4 h-4" /> GitHub / Repositories
                  </span>
                  <span className="text-northfold-muted">View Code →</span>
                </a>

                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-northfold-border hover:border-northfold-ink hover:bg-northfold-surface transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn / Profile
                  </span>
                  <span className="text-northfold-muted">Connect →</span>
                </a>

                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-northfold-border hover:border-northfold-ink hover:bg-northfold-surface transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-sky-500" /> X (Twitter)
                  </span>
                  <span className="text-northfold-muted">Follow →</span>
                </a>
              </div>
            </div>

            {/* NDA Assurance Note */}
            <div className="p-6 rounded-2xl border border-northfold-border bg-northfold-surface space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-northfold-ink font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>NDA & Confidentiality</span>
              </div>
              <p className="text-xs font-serif text-northfold-muted leading-relaxed">
                Standard Mutual Non-Disclosure Agreements (MNDAs) can be executed before sharing proprietary repos, design docs, or unreleased titles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
