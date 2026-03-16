"use client";

import { BigFiveDimension } from "@/lib/types";

interface BigFiveResultsProps {
  profile: BigFiveDimension[];
  onBack: () => void;
}

export default function BigFiveResults({ profile, onBack }: BigFiveResultsProps) {
  return (
    <div className="flex flex-col items-center gap-10 px-6">
      <h2
        className="animate-fade-up text-sm uppercase tracking-widest text-gold/60"
      >
        Your Nature
      </h2>

      {profile.map((dim, i) => (
        <div
          key={dim.key}
          className="animate-fade-up text-center"
          style={{ animationDelay: `${(i + 1) * 0.15}s` }}
        >
          <p className="mb-1 text-sm uppercase tracking-widest text-gold/60">
            {dim.name}
          </p>
          <h3 className="text-3xl font-light tracking-wide sm:text-4xl">
            {dim.label}
          </h3>
        </div>
      ))}

      <button
        onClick={onBack}
        className="animate-fade-up cursor-pointer text-sm tracking-wide text-foreground/40 transition-colors hover:text-foreground/70"
        style={{ animationDelay: `${(profile.length + 1) * 0.15}s` }}
      >
        Back to Results
      </button>
    </div>
  );
}
