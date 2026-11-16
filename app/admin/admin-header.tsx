"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  Sliders,
  Settings,
  HelpCircle,
  Inbox,
  Download,
  ExternalLink,
  LogOut,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAdminAction } from "./actions";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { label: "Case Studies", href: "/admin", icon: FileText },
  { label: "Topics & Templates", href: "/admin/topics", icon: Sliders },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
  { label: "FAQ Entries", href: "/admin/faq", icon: HelpCircle },
  { label: "Inquiries", href: "/admin/messages", icon: Inbox },
];

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't render navigation on login page
  if (pathname === "/admin/login") return null;

  const handleLogout = async () => {
    await logoutAdminAction();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="border-b border-northfold-border bg-white sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-northfold-ink"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Northfold CMS</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-colors",
                      active
                        ? "bg-northfold-surface text-northfold-ink font-semibold border border-northfold-border"
                        : "text-northfold-muted hover:text-northfold-ink hover:bg-neutral-50"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              className="rounded-full font-mono text-xs uppercase tracking-wider"
            >
              <Link href="/admin/new">
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> New Case Study
              </Link>
            </Button>

            <a
              href="/api/admin/export"
              download="case-study-backup.json"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-northfold-muted hover:text-northfold-ink px-3 py-1.5 rounded-full border border-northfold-border hover:bg-northfold-surface transition-colors"
              title="Export all data as JSON backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON Backup</span>
            </a>

            <Link
              href="/work"
              target="_blank"
              className="text-northfold-muted hover:text-northfold-ink p-2 rounded-full hover:bg-northfold-surface transition-colors"
              title="View Public Site in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-northfold-muted hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation strip */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-2 border-t border-northfold-border/60 scrollbar-none">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono whitespace-nowrap",
                  active
                    ? "bg-northfold-ink text-white"
                    : "text-northfold-muted hover:text-northfold-ink bg-neutral-100"
                )}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
