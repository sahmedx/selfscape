"use client";

interface PortraitCenterProps {
  completedCount: number;
  accentColor: string;
}

const RING_SIZES = [
  "w-28 h-28 sm:w-36 sm:h-36",
  "w-22 h-22 sm:w-28 sm:h-28",
  "w-16 h-16 sm:w-20 sm:h-20",
  "w-10 h-10 sm:w-14 sm:h-14",
  "w-6 h-6 sm:w-8 sm:h-8",
];

export default function PortraitCenter({
  completedCount,
  accentColor,
}: PortraitCenterProps) {
  return (
    <div className="animate-fade-up absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
      {RING_SIZES.map((size, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${size} ${
            i < completedCount
              ? "border-2"
              : "border border-dashed opacity-15"
          }`}
          style={
            i < completedCount
              ? { borderColor: accentColor }
              : { borderColor: "var(--color-foreground)" }
          }
        />
      ))}
      <div className="relative z-10 text-center">
        <p className="text-xs font-light uppercase tracking-widest text-foreground/40">
          {completedCount}/5
        </p>
        {completedCount >= 3 && (
          <p className="mt-1 text-[10px] tracking-wide text-foreground/25">
            View Portrait
          </p>
        )}
      </div>
    </div>
  );
}
