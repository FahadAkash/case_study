"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAdminAction } from "../actions";
import { HalftonePattern } from "@/components/halftone-pattern";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginAdminAction(password);
      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Authentication failed. Check your password.");
      }
    } catch {
      setError("An unexpected server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden py-16 px-4">
      <HalftonePattern opacity={0.15} spacing={12} />

      <div className="max-w-md w-full bg-white rounded-2xl border border-northfold-border p-8 shadow-xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-northfold-surface border border-northfold-border flex items-center justify-center mx-auto text-northfold-ink">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-northfold-ink">
            Admin CMS Authentication
          </h2>
          <p className="text-xs font-mono text-northfold-muted">
            Secure administrative control portal for Northfold Case Studies.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-900 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs font-mono uppercase tracking-wider text-northfold-ink font-medium"
            >
              Master Access Key
            </label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password..."
              className="rounded-xl font-mono text-sm"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full font-mono text-xs uppercase tracking-wider py-6 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Unlock Control Center</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="pt-4 border-t border-northfold-border text-center">
          <p className="text-[11px] font-mono text-northfold-faded">
            Protected by Server-Side Session Guard & Neon Postgres RLS
          </p>
        </div>
      </div>
    </div>
  );
}
