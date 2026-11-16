import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HalftonePattern } from "@/components/halftone-pattern";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center relative overflow-hidden py-24">
      <HalftonePattern opacity={0.15} spacing={12} />

      <div className="max-w-md mx-auto px-4 text-center relative z-10 space-y-6">
        <div className="font-mono text-7xl sm:text-8xl font-bold tracking-tighter text-northfold-ink">
          404
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-northfold-muted block">
            ERR_COORD_NOT_FOUND
          </span>
          <h2 className="text-2xl font-semibold text-northfold-ink">
            Page Does Not Exist
          </h2>
          <p className="text-sm font-serif text-northfold-muted leading-relaxed">
            The requested trajectory or project record could not be located in this coordinate space.
          </p>
        </div>

        <div className="pt-2">
          <Button asChild className="rounded-full font-mono text-xs uppercase tracking-wider px-6">
            <Link href="/">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Return to Origin (Home)
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
