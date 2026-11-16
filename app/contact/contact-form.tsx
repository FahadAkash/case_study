"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
  onSubmitAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export function ContactForm({ onSubmitAction }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await onSubmitAction(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try reaching out directly via email.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-950 space-y-4 text-center animate-in fade-in duration-300">
        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">
          Message Received Successfully
        </h3>
        <p className="text-sm font-serif text-emerald-800 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. Your inquiry has been securely stored in the system database. I will review your requirements and reply within 24 hours.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSuccess(false)}
          className="rounded-full font-mono text-xs uppercase tracking-wider mt-2 border-emerald-400 hover:bg-emerald-100"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field for anti-spam (hidden from visual users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_hp">Leave this empty</label>
        <input type="text" id="website_hp" name="website_hp" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl border border-red-200 bg-red-50 text-red-900 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-northfold-ink font-medium">
            Your Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            placeholder="John Doe"
            className="rounded-xl bg-white"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-northfold-ink font-medium">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="john@studio.com"
            className="rounded-xl bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Company */}
        <div className="space-y-2">
          <label htmlFor="company" className="text-xs font-mono uppercase tracking-wider text-northfold-muted">
            Company / Organization
          </label>
          <Input
            id="company"
            name="company"
            type="text"
            placeholder="Apex Studios Inc."
            className="rounded-xl bg-white"
          />
        </div>

        {/* Project Type */}
        <div className="space-y-2">
          <label htmlFor="project_type" className="text-xs font-mono uppercase tracking-wider text-northfold-muted">
            Project Discipline
          </label>
          <select
            id="project_type"
            name="project_type"
            defaultValue="Game Engine / Real-time"
            className="flex h-10 w-full rounded-xl border border-northfold-border bg-white px-3 py-2 text-xs font-mono text-northfold-ink focus:outline-none focus:ring-1 focus:ring-northfold-ink"
          >
            <option value="Game Engine / Real-time">Game Engine / Real-Time Graphics</option>
            <option value="AR / VR Spatial App">AR / VR & Spatial Computing</option>
            <option value="Distributed Backend">Distributed Backend & Systems</option>
            <option value="AI / ML Systems">AI / ML Tooling</option>
            <option value="Custom DevTool">Editor Tooling / Engine Plugin</option>
            <option value="Advisory / Consultation">Fractional Advisory</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-xs font-mono uppercase tracking-wider text-northfold-ink font-medium">
          Project Scope & Timeline <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Briefly describe your objectives, technical hurdles, desired timeline, and team setup..."
          className="rounded-xl bg-white resize-y"
        />
      </div>

      {/* Submit Button */}
      <div>
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full sm:w-auto rounded-full font-mono text-xs uppercase tracking-wider px-8 shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Transmitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              <span>Submit Inquiry</span>
            </>
          )}
        </Button>
      </div>

      {/* Privacy Notice */}
      <p className="text-[11px] font-mono text-northfold-faded leading-relaxed">
        * Privacy note: Your details are solely used for direct email correspondence regarding this inquiry. They are never shared or monetized.
      </p>
    </form>
  );
}
