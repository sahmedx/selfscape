"use client";

import { MBTI_DIMENSIONS, MBTI_TYPE_DESCRIPTIONS } from "@/data/mbti-data";

interface MBTIResultsProps {
  type: string;
  onBack: () => void;
}

export default function MBTIResults({ type, onBack }: MBTIResultsProps) {
  const letters = type.split("");
  const delay = (index: number) => `${(index + 1) * 0.15}s`;

  return (
    <div className="flex flex-col items-center gap-10 px-6">
      <h2
        className="animate-fade-up text-sm uppercase tracking-widest text-gold/60"
        style={{ animationDelay: delay(0) }}
      >
        Your Type
      </h2>

      <div
        className="animate-fade-up text-center"
        style={{ animationDelay: delay(1) }}
      >
        <h3 className="text-4xl font-light tracking-wide sm:text-5xl">
          {type}
        </h3>
      </div>

      <div
        className="animate-fade-up flex flex-col items-center gap-4"
        style={{ animationDelay: delay(2) }}
      >
        {MBTI_DIMENSIONS.map((dim, i) => {
          const letter = letters[i];
          const label = letter === dim.left ? dim.leftLabel : dim.rightLabel;
          return (
            <div key={dim.key} className="text-center">
              <p className="text-sm uppercase tracking-widest text-gold/50">
                {letter}
              </p>
              <p className="text-foreground/50 text-sm">{label}</p>
            </div>
          );
        })}
      </div>

      <p
        className="animate-fade-up text-center text-foreground/60 leading-relaxed max-w-sm"
        style={{ animationDelay: delay(3) }}
      >
        {MBTI_TYPE_DESCRIPTIONS[type]}
      </p>

      <button
        onClick={onBack}
        className="animate-fade-up cursor-pointer text-sm tracking-wide text-foreground/40 transition-colors hover:text-foreground/70"
        style={{ animationDelay: delay(4) }}
      >
        Back to Results
      </button>
    </div>
  );
}
