import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-northfold-ink text-northfold-offwhite",
        secondary:
          "border-northfold-border bg-northfold-surface text-northfold-ink",
        outline:
          "border-northfold-border text-northfold-muted hover:border-northfold-ink",
        tag:
          "border-northfold-border/80 bg-white/80 text-northfold-ink text-[11px] uppercase tracking-wider",
        statusPublished:
          "border-emerald-600/30 bg-emerald-50 text-emerald-800",
        statusDraft:
          "border-amber-600/30 bg-amber-50 text-amber-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
