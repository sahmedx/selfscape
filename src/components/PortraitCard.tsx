"use client";

import { PortraitData } from "@/lib/types";
import { STEM_DESCRIPTORS, SIGN_DESCRIPTIONS } from "@/data/display-lookups";
import { getBigFiveProfile } from "@/lib/big-five-scoring";

interface PortraitCardProps {
  data: PortraitData;
}

interface CardSection {
  label: string;
  title: string;
  descriptor?: string;
  lines?: string[];
}

export default function PortraitCard({ data }: PortraitCardProps) {
  const bigFiveProfile = data.bigFiveScores
    ? getBigFiveProfile(data.bigFiveScores)
    : null;

  // Build all sections as a flat array, then assign delays by index
  const sections: CardSection[] = [
    {
      label: "Sun Sign",
      title: data.sunSign,
      descriptor: SIGN_DESCRIPTIONS[data.sunSign]
        ? `${data.sunElement} · ${SIGN_DESCRIPTIONS[data.sunSign]}`
        : data.sunElement,
    },
    {
      label: "Year Pillar",
      title: `${data.yearPillar.element} ${data.yearPillar.animal}`,
      descriptor: STEM_DESCRIPTORS[data.yearPillar.stem]
        ? `${STEM_DESCRIPTORS[data.yearPillar.stem]} · ${data.yearPillar.polarity}`
        : data.yearPillar.polarity,
    },
    {
      label: "Month Pillar",
      title: `${data.monthPillar.element} ${data.monthPillar.animal}`,
      descriptor: STEM_DESCRIPTORS[data.monthPillar.stem]
        ? `${STEM_DESCRIPTORS[data.monthPillar.stem]} · ${data.monthPillar.polarity}`
        : data.monthPillar.polarity,
    },
    {
      label: "Day Pillar",
      title: `${data.dayPillar.element} ${data.dayPillar.animal}`,
      descriptor: STEM_DESCRIPTORS[data.dayPillar.stem]
        ? `${STEM_DESCRIPTORS[data.dayPillar.stem]} · ${data.dayPillar.polarity}`
        : data.dayPillar.polarity,
    },
  ];

  if (data.enneagramType != null && data.enneagramName) {
    sections.push({
      label: "Enneagram",
      title: `Type ${data.enneagramType}`,
      descriptor: data.enneagramName,
    });
  }

  if (data.mbtiCode) {
    sections.push({ label: "MBTI", title: data.mbtiCode });
  }

  if (bigFiveProfile) {
    sections.push({
      label: "Big Five",
      title: "",
      lines: bigFiveProfile.map((dim) => dim.label),
    });
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 py-12">
      {/* Header */}
      <h1 className="animate-fade-up font-serif text-2xl italic text-gold/70">
        Your Personal SelfScape
      </h1>

      {/* All sections with sequential animation delays */}
      {sections.map((section, i) => (
        <div
          key={section.label}
          className="animate-fade-up text-center"
          style={{ animationDelay: `${0.15 + i * 0.12}s` }}
        >
          <p className="mb-1 text-xs uppercase tracking-widest text-gold/60">
            {section.label}
          </p>
          {section.title && (
            <h2 className="text-2xl font-light tracking-wide">
              {section.title}
            </h2>
          )}
          {section.descriptor && (
            <p className="mt-1 text-sm italic text-foreground/35">
              {section.descriptor}
            </p>
          )}
          {section.lines && (
            <div className="flex flex-col gap-1">
              {section.lines.map((line) => (
                <p key={line} className="text-sm italic text-foreground/50">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Discover Yours CTA */}
      <a
        href="/"
        className="animate-fade-up mt-4 text-base uppercase tracking-widest text-gold transition-colors hover:text-gold/80"
        style={{ animationDelay: `${0.15 + sections.length * 0.12 + 0.12}s` }}
      >
        Discover Yours
      </a>
    </div>
  );
}
