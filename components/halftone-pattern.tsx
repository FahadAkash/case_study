import React from "react";
import { cn } from "@/lib/utils";

interface HalftonePatternProps {
  className?: string;
  dotSize?: number;
  spacing?: number;
  opacity?: number;
  dark?: boolean;
}

export function HalftonePattern({
  className,
  dotSize = 1.5,
  spacing = 10,
  opacity = 0.25,
  dark = false
}: HalftonePatternProps) {
  const dotColor = dark ? "rgba(255, 255, 255, 0.4)" : "rgba(17, 17, 17, 0.35)";

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 select-none overflow-hidden", className)}
      style={{
        backgroundImage: `radial-gradient(${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        opacity
      }}
      aria-hidden="true"
    />
  );
}

export function HalftoneHeroOrb({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      {/* Concentric halftone rings */}
      <svg
        className="w-full h-full max-w-[480px] max-h-[480px] text-northfold-ink animate-pulse duration-1000"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="halftone-dot-grid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="3" fill="currentColor" fillOpacity="0.4" />
            <circle cx="0" cy="0" r="1.5" fill="currentColor" fillOpacity="0.2" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" fillOpacity="0.2" />
          </pattern>
          <mask id="orb-mask">
            <circle cx="200" cy="200" r="170" fill="white" />
            <circle cx="200" cy="200" r="90" fill="black" />
          </mask>
        </defs>

        {/* Outer dotted disk */}
        <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" opacity="0.3" />
        <circle cx="200" cy="200" r="170" fill="url(#halftone-dot-grid)" mask="url(#orb-mask)" />
        <circle cx="200" cy="200" r="88" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        
        {/* Core sphere with halftone coordinates */}
        <circle cx="200" cy="200" r="70" fill="#111111" />
        <circle cx="195" cy="195" r="50" fill="none" stroke="#FBFBFA" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="190" cy="190" r="30" fill="none" stroke="#FBFBFA" strokeWidth="0.75" strokeDasharray="2 4" opacity="0.4" />
        
        {/* Northfold signature coordinates label */}
        <text x="200" y="204" textAnchor="middle" fill="#FBFBFA" fontSize="10" fontFamily="monospace" letterSpacing="0.2em">
          SYS.01
        </text>
      </svg>
    </div>
  );
}
