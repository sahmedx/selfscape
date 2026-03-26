"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  BirthdateResult,
  BigFiveScores,
  EnneagramResult,
  NarrativeRequest,
} from "@/lib/types";
import {
  loadFromSession,
  saveToSession,
  removeFromSession,
  SESSION_KEYS,
} from "@/lib/session";
import { calculateBaziChart } from "@/lib/bazi-calculator";

type NarrativeState = "idle" | "loading" | "streaming" | "complete" | "error";

interface NarrativePortraitProps {
  result: BirthdateResult;
}

function buildRequest(result: BirthdateResult): NarrativeRequest {
  const bigFive = loadFromSession<BigFiveScores>(SESSION_KEYS.bigFiveScores);
  const enneagram = loadFromSession<EnneagramResult>(SESSION_KEYS.enneagramResult);
  const mbti = loadFromSession<string>(SESSION_KEYS.mbtiResult);

  const req: NarrativeRequest = {
    westernZodiac: result.western,
    chineseZodiac: {
      animal: result.chinese.animal,
      yearPillar: result.chinese.year,
      monthPillar: result.chinese.month,
      dayPillar: result.chinese.day,
    },
    dayMaster: {
      element: result.dayMaster.element,
      polarity: result.dayMaster.polarity,
    },
  };

  if (bigFive) req.bigFive = bigFive;
  if (enneagram) {
    req.enneagram = {
      primaryType: enneagram.primaryType.number,
      primaryName: enneagram.primaryType.name,
      coreFear: enneagram.primaryType.coreFear,
      coreDesire: enneagram.primaryType.coreDesire,
      growthDirection: enneagram.primaryType.growthDirection,
      suggestion: enneagram.suggestion?.number,
    };
  }
  if (mbti) req.mbti = mbti;

  // Calculate full BaZi chart
  const dateStr = `${result.year}-${String(result.month).padStart(2, '0')}-${String(result.day).padStart(2, '0')}`;
  const chart = calculateBaziChart(dateStr);
  req.bazi = {
    tenGods: chart.tenGods,
    elementalBalance: {
      percentages: chart.elementalBalance.percentages,
      dominant: chart.elementalBalance.dominant,
      scarce: chart.elementalBalance.scarce,
      absent: chart.elementalBalance.absent,
    },
    luckPillars: {
      startingAge: chart.luckPillars.startingAge,
      isForward: chart.luckPillars.isForward,
      pillars: chart.luckPillars.pillars.map(p => ({
        age: p.age,
        stem: { name: p.stem.name, element: p.stem.element, polarity: p.stem.polarity },
        branch: { name: p.branch.name, element: p.branch.element },
        naYin: p.naYin,
      })),
    },
    naYin: {
      year: chart.pillars.year.naYin,
      month: chart.pillars.month.naYin,
      day: chart.pillars.day.naYin,
    },
  };

  return req;
}

const SECTION_LABELS = ["Your Portrait", "What Drives You", "How You Think", "Relationship Style", "Internal Conflict", "Misread As"];

interface NarrativeSection {
  label: string;
  text: string;
}

function parseNarrative(raw: string): NarrativeSection[] {
  const sections: NarrativeSection[] = [];
  let remaining = raw;

  // Skip any text before the first section marker
  const firstMarkerIndex = SECTION_LABELS.reduce((min, label) => {
    const pattern = new RegExp(`\\*\\*${label}\\*\\*`);
    const match = remaining.match(pattern);
    if (match && match.index !== undefined && match.index < min) return match.index;
    return min;
  }, remaining.length);
  remaining = remaining.slice(firstMarkerIndex);

  // Extract each labeled section
  for (let i = 0; i < SECTION_LABELS.length; i++) {
    const label = SECTION_LABELS[i];
    const pattern = new RegExp(`\\*\\*${label}\\*\\*`);
    const match = remaining.match(pattern);
    if (!match || match.index === undefined) continue;

    const contentStart = match.index + match[0].length;
    // Find the next section marker
    let nextMarkerIndex = remaining.length;
    for (let j = i + 1; j < SECTION_LABELS.length; j++) {
      const nextPattern = new RegExp(`\\*\\*${SECTION_LABELS[j]}\\*\\*`);
      const nextMatch = remaining.match(nextPattern);
      if (nextMatch && nextMatch.index !== undefined) {
        nextMarkerIndex = nextMatch.index;
        break;
      }
    }

    const text = remaining.slice(contentStart, nextMarkerIndex).trim();
    if (text) {
      sections.push({ label, text });
    }
    remaining = remaining.slice(nextMarkerIndex);
  }

  // If no sections were parsed (e.g. during early streaming), show as single block
  if (sections.length === 0 && raw.trim()) {
    sections.push({ label: "Your Portrait", text: raw.trim() });
  }

  return sections;
}

export default function NarrativePortrait({ result }: NarrativePortraitProps) {
  const [state, setState] = useState<NarrativeState>("idle");
  const [narrative, setNarrative] = useState("");
  const isGenerating = useRef(false);

  // Load cached narrative on mount
  useEffect(() => {
    const cached = loadFromSession<string>(SESSION_KEYS.narrativeResult);
    if (cached) {
      setNarrative(cached);
      setState("complete");
    }
  }, []);

  const generate = useCallback(async () => {
    if (isGenerating.current) return;
    isGenerating.current = true;
    setState("loading");
    setNarrative("");
    removeFromSession(SESSION_KEYS.narrativeResult);

    try {
      const response = await fetch("/api/narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRequest(result)),
      });

      if (!response.ok || !response.body) {
        setState("error");
        return;
      }

      setState("streaming");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setNarrative(fullText);
      }

      saveToSession(SESSION_KEYS.narrativeResult, fullText);
      setState("complete");
    } catch {
      setState("error");
    } finally {
      isGenerating.current = false;
    }
  }, [result]);

  const sections = parseNarrative(narrative);

  return (
    <div className="w-full max-w-xs text-center">
      {state === "idle" && (
        <button
          onClick={generate}
          className="cursor-pointer text-sm font-serif tracking-wide text-gold/70 transition-colors hover:text-gold"
        >
          Generate My Portrait
        </button>
      )}

      {state === "loading" && (
        <p className="animate-pulse text-sm tracking-wide text-foreground/40">
          Composing your portrait&hellip;
        </p>
      )}

      {(state === "streaming" || state === "complete") && (
        <div className="flex flex-col gap-4">
          {sections.map((section, i) => (
            <div
              key={section.label}
              className="animate-fade-up rounded-xl border border-gold/20 p-5"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <p className="mb-3 text-sm uppercase tracking-widest text-gold/60">
                {section.label}
              </p>
              <p className="text-sm leading-relaxed text-foreground/70">
                {section.text}
              </p>
            </div>
          ))}
          {state === "complete" && (
            <button
              onClick={generate}
              className="cursor-pointer text-xs tracking-wide text-foreground/30 transition-colors hover:text-foreground/50"
            >
              Regenerate
            </button>
          )}
        </div>
      )}

      {state === "error" && (
        <div className="space-y-3">
          <p className="text-sm text-foreground/40">Something went wrong</p>
          <button
            onClick={generate}
            className="cursor-pointer text-xs tracking-wide text-foreground/30 transition-colors hover:text-foreground/50"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
