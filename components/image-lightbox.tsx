"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectRatio?: string;
}

export function ImageLightbox({
  src,
  alt,
  caption,
  className = "",
  aspectRatio = "aspect-[16/9]"
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fallbackSrc = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80";
  const displaySrc = imgError ? fallbackSrc : src;

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`group relative cursor-zoom-in overflow-hidden rounded-xl border border-northfold-border bg-northfold-surface ${className}`}
      >
        <div className={`relative w-full ${aspectRatio}`}>
          <Image
            src={displaySrc}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        </div>

        {/* Hover zoom pill badge */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 pointer-events-none">
          <Maximize2 className="w-3 h-3" />
          <span>EXPAND</span>
        </div>
      </div>

      {caption && (
        <p className="mt-2 text-xs font-mono text-northfold-muted text-center tracking-wide">
          {caption}
        </p>
      )}

      {/* Modal Dialog Lightbox */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl p-2 bg-neutral-950 border-neutral-800 text-white overflow-hidden">
          <div className="relative w-full h-[75vh]">
            <Image
              src={displaySrc}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          {caption && (
            <div className="p-3 text-center border-t border-neutral-800 text-xs font-mono text-neutral-400">
              {caption}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
