import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, HelpCircle } from "lucide-react";
import { getFaqs } from "@/lib/db";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HalftonePattern } from "@/components/halftone-pattern";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Frequently Asked Questions • Fahad Systems",
  description: "Questions people frequently ask before hiring or partnering on technical architecture.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  // Group FAQs by group_name
  const grouped = faqs.reduce((acc, item) => {
    const group = item.group_name || "General";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <div className="w-full relative py-12 md:py-20">
      <HalftonePattern opacity={0.12} spacing={14} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted">
            01 / FAQ & CLEAR CLARITY
          </span>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-northfold-ink">
            Questions People Ask Before Hiring Me
          </h1>
          <p className="text-lg sm:text-xl font-serif text-northfold-muted leading-relaxed max-w-2xl">
            Everything you need to know about working together, intellectual property protections, engineering workflows, and availability.
          </p>
        </div>

        {/* Grouped Accordions */}
        <div className="space-y-12">
          {Object.entries(grouped).map(([groupName, items], gIdx) => (
            <div key={groupName} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-northfold-border pb-2">
                <span className="text-xs font-mono text-northfold-muted">
                  0{gIdx + 1}
                </span>
                <h3 className="text-sm font-mono uppercase tracking-widest text-northfold-ink font-semibold">
                  {groupName}
                </h3>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {items.map((item, idx) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-base sm:text-lg font-semibold text-northfold-ink">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Bottom Contact Prompt */}
        <div className="p-8 rounded-2xl border border-northfold-border bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-semibold text-northfold-ink">
              Have a question not listed here?
            </h4>
            <p className="text-sm font-serif text-northfold-muted">
              Direct inquiries are typically answered within 24 hours.
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
