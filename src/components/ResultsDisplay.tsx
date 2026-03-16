"use client";

import Link from "next/link";
import { BirthdateResult } from "@/lib/types";

interface ResultsDisplayProps {
  result: BirthdateResult;
  onReset: () => void;
}

export default function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const { western, chinese, dayMaster } = result;

  return (
    <div className="flex flex-col items-center gap-12 px-6">
      {/* Western Zodiac */}
      <div className="animate-fade-up text-center">
        <p className="mb-1 text-sm uppercase tracking-widest text-gold/60">
          Sun Sign
        </p>
        <h2 className="text-4xl font-light tracking-wide sm:text-5xl">
          {western.sign}
        </h2>
        <p className="mt-2 text-base text-foreground/50">
          {western.element} &middot; {western.modality}
        </p>
      </div>

      {/* Chinese Zodiac */}
      <div
        className="animate-fade-up text-center"
        style={{ animationDelay: "0.3s" }}
      >
        <p className="mb-1 text-sm uppercase tracking-widest text-gold/60">
          Chinese Zodiac
        </p>
        <h2 className="text-4xl font-light tracking-wide sm:text-5xl">
          {chinese.animal}
        </h2>
      </div>

      {/* Day Master */}
      <div
        className="animate-fade-up text-center"
        style={{ animationDelay: "0.6s" }}
      >
        <p className="mb-1 text-sm uppercase tracking-widest text-gold/60">
          Day Master
        </p>
        <h2 className="text-4xl font-light tracking-wide sm:text-5xl">
          {dayMaster.polarity} {dayMaster.element}
        </h2>
        <p className="mt-2 text-base italic text-foreground/50">
          {dayMaster.chineseName}
        </p>
      </div>

      {/* Start Over */}
      <button
        onClick={onReset}
        className="animate-fade-up cursor-pointer text-sm tracking-wide text-foreground/40 transition-colors hover:text-foreground/70"
        style={{ animationDelay: "0.9s" }}
      >
        Start Over
      </button>

      {/* Navigate to Big Five */}
      <Link
        href="/big-five"
        className="animate-fade-up inline-block mt-4 px-6 py-3 border border-gold/30 rounded-lg text-gold/70 hover:text-gold hover:border-gold transition-colors font-serif text-sm tracking-wide"
        style={{ animationDelay: "1.2s" }}
      >
        Discover Your Nature
      </Link>
    </div>
  );
}
