"use client";

import { EnneagramResult } from "@/lib/types";

interface EnneagramResultsProps {
  result: EnneagramResult;
  onBack: () => void;
}

export default function EnneagramResults({ result, onBack }: EnneagramResultsProps) {
  const { primaryType, suggestion } = result;

  // Sections for computed stagger delays (matching BigFiveResults pattern)
  const sections = [
    "heading", "type", "description", "details",
    ...(suggestion ? ["suggestion"] : []),
    "back",
  ];
  const delay = (index: number) => `${(index + 1) * 0.15}s`;

  return (
    <div className="flex flex-col items-center gap-10 px-6">
      <h2
        className="animate-fade-up text-sm uppercase tracking-widest text-gold/60"
        style={{ animationDelay: delay(0) }}
      >
        Your Inner World
      </h2>

      <div
        className="animate-fade-up text-center"
        style={{ animationDelay: delay(1) }}
      >
        <p className="mb-1 text-sm uppercase tracking-widest text-gold/50">
          Type {primaryType.number}
        </p>
        <h3 className="text-3xl font-light tracking-wide sm:text-4xl">
          {primaryType.name}
        </h3>
        <p className="mt-3 text-lg italic text-gold/70">
          {primaryType.label}
        </p>
      </div>

      <div
        className="animate-fade-up text-center max-w-sm"
        style={{ animationDelay: delay(2) }}
      >
        <p className="text-foreground/60 leading-relaxed">
          {primaryType.description}
        </p>
      </div>

      <div
        className="animate-fade-up text-center max-w-sm space-y-3"
        style={{ animationDelay: delay(3) }}
      >
        <div>
          <p className="text-xs uppercase tracking-widest text-gold/40 mb-1">
            Core Fear
          </p>
          <p className="text-sm text-foreground/50">{primaryType.coreFear}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gold/40 mb-1">
            Core Desire
          </p>
          <p className="text-sm text-foreground/50">{primaryType.coreDesire}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gold/40 mb-1">
            Growth Direction
          </p>
          <p className="text-sm text-foreground/50">{primaryType.growthDirection}</p>
        </div>
      </div>

      {suggestion && (
        <div
          className="animate-fade-up text-center max-w-sm border border-gold/10 rounded-xl p-5"
          style={{ animationDelay: delay(4) }}
        >
          <p className="text-xs uppercase tracking-widest text-gold/40 mb-2">
            You might also resonate with
          </p>
          <p className="text-lg font-light">
            Type {suggestion.number} &mdash; {suggestion.name}
          </p>
          <p className="mt-1 text-sm italic text-foreground/40">
            {suggestion.label}
          </p>
        </div>
      )}

      <button
        onClick={onBack}
        className="animate-fade-up cursor-pointer text-sm tracking-wide text-foreground/40 transition-colors hover:text-foreground/70"
        style={{ animationDelay: delay(sections.length - 1) }}
      >
        Back to Results
      </button>
    </div>
  );
}
