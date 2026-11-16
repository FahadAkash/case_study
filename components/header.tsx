"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Work", href: "/work", number: "01" },
  { label: "About", href: "/about", number: "02" },
  { label: "FAQ", href: "/faq", number: "03" },
  { label: "Contact", href: "/contact", number: "04" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 border-b",
          scrolled
            ? "bg-[#FBFBFA]/90 backdrop-blur-md border-northfold-border/80 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
            : "bg-[#FBFBFA] border-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="group flex items-center gap-3 text-northfold-ink font-mono font-medium tracking-tight text-sm sm:text-base"
          >
            <div className="w-6 h-6 rounded-full border border-northfold-ink flex items-center justify-center text-[10px] font-mono group-hover:bg-northfold-ink group-hover:text-white transition-colors">
              NF
            </div>
            <span className="font-semibold tracking-tight">FAHAD.SYSTEMS</span>
            <span className="hidden sm:inline-block text-xs font-mono text-northfold-faded">
              / ARCHITECT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || (item.href === "/work" && pathname.startsWith("/work"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors py-1 group flex items-center gap-1.5",
                    active ? "text-northfold-ink font-semibold" : "text-northfold-muted hover:text-northfold-ink"
                  )}
                >
                  <span className="text-[10px] font-mono opacity-50 group-hover:opacity-100 transition-opacity">
                    {item.number}
                  </span>
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[1.5px] bg-northfold-ink rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right CTA & Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="default"
              size="sm"
              className="hidden sm:inline-flex rounded-full text-xs font-mono uppercase tracking-wider px-5"
            >
              <Link href="/contact">
                Inquire <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>

            {/* Mobile "Menu" Pill Button (matches user screenshot) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-northfold-border bg-white text-xs font-mono uppercase tracking-wider text-northfold-ink hover:bg-northfold-surface transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </>
              ) : (
                <>
                  <Menu className="w-3.5 h-3.5" />
                  <span>Menu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-[#FBFBFA] pt-24 pb-8 px-6 flex flex-col justify-between md:hidden animate-in fade-in duration-200">
          <div className="flex flex-col space-y-6">
            <div className="text-xs font-mono text-northfold-muted uppercase tracking-widest border-b border-northfold-border pb-2">
              Navigation
            </div>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-baseline justify-between text-2xl font-semibold tracking-tight text-northfold-ink hover:pl-2 transition-all border-b border-northfold-border/50 pb-4"
              >
                <span>{item.label}</span>
                <span className="text-xs font-mono text-northfold-muted">{item.number}</span>
              </Link>
            ))}
            <Link
              href="/admin"
              className="flex items-baseline justify-between text-sm font-mono text-northfold-muted hover:text-northfold-ink pt-2"
            >
              <span>Admin CMS</span>
              <span className="text-xs">05</span>
            </Link>
          </div>

          <div className="space-y-4 pt-6 border-t border-northfold-border">
            <Button asChild className="w-full rounded-full py-6 text-sm font-mono uppercase tracking-wider">
              <Link href="/contact">
                Send an Inquiry <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
            <div className="text-center">
              <p className="text-xs font-mono text-northfold-faded">
                Based in UTC+6 • Worldwide Remote
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
