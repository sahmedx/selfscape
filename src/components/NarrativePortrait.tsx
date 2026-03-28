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
import { calculateBaziChart, getTenGod } from "@/lib/bazi-calculator";
import { getBigFiveProfile } from "@/lib/big-five-scoring";
import { ENNEAGRAM_CENTERS, ENNEAGRAM_TYPES } from "@/data/enneagram-data";
import { MBTI_TYPE_DESCRIPTIONS } from "@/data/mbti-data";
import { DAY_MASTER_DESCRIPTIONS, ENNEAGRAM_TENSIONS } from "@/data/narrative-lookups";
import {
  generateTenGodsSummary,
  generateElementStory,
  generateLuckPillarNarrative,
  generateBranchRelationshipSummary,
  generateBigFiveSummary,
  generateNarrativeSummary,
} from "@/lib/narrative-summaries";

type NarrativeState = "idle" | "loading" | "streaming" | "complete" | "error";

interface NarrativePortraitProps {
  result: BirthdateResult;
}

function buildRequest(result: BirthdateResult): NarrativeRequest {
  const bigFiveScores = loadFromSession<BigFiveScores>(SESSION_KEYS.bigFiveScores);
  const enneagram = loadFromSession<EnneagramResult>(SESSION_KEYS.enneagramResult);
  const mbtiCode = loadFromSession<string>(SESSION_KEYS.mbtiResult);

  // Calculate full BaZi chart
  const dateStr = `${result.year}-${String(result.month).padStart(2, '0')}-${String(result.day).padStart(2, '0')}`;
  const chart = calculateBaziChart(dateStr);

  // Day Master description
  const dayMasterDescription = DAY_MASTER_DESCRIPTIONS[chart.dayMaster.name] || "";

  // Ten Gods summary
  const tenGodsSummary = generateTenGodsSummary(chart.tenGods);

  // Element story
  const elementStory = generateElementStory(chart.dayMaster.element, {
    percentages: chart.elementalBalance.percentages,
    dominant: chart.elementalBalance.dominant,
    scarce: chart.elementalBalance.scarce,
    absent: chart.elementalBalance.absent,
  });

  // Luck pillar narrative
  const luckPillarNarrative = generateLuckPillarNarrative(
    chart.luckPillars.pillars,
    chart.currentLuckPillar,
    chart.dayMaster,
  );

  // Branch relationship summary
  const branchRelationshipSummary = generateBranchRelationshipSummary(chart.branchRelationships);

  // Luck pillars with Ten Gods and current flag
  const currentAge = chart.currentLuckPillar?.pillar.age;
  const luckPillarsWithGods = chart.luckPillars.pillars.map(p => ({
    age: p.age,
    stem: { name: p.stem.name, element: p.stem.element, polarity: p.stem.polarity },
    branch: { name: p.branch.name, element: p.branch.element },
    naYin: p.naYin,
    stemTenGod: getTenGod(chart.dayMaster, p.stem),
    isCurrent: p.age === currentAge,
  }));

  // Build Big Five expanded data
  let bigFiveData: NarrativeRequest["bigFive"];
  let bigFiveSummary = "";
  if (bigFiveScores) {
    const dimensions = getBigFiveProfile(bigFiveScores);
    bigFiveSummary = generateBigFiveSummary(dimensions);
    bigFiveData = {
      scores: bigFiveScores,
      dimensions: dimensions.map(d => ({
        key: d.key,
        name: d.name,
        score: d.score,
        level: d.level,
        label: d.label,
      })),
      summary: bigFiveSummary,
    };
  }

  // Build Enneagram expanded data
  let enneagramData: NarrativeRequest["enneagram"];
  let enneagramTension = "";
  if (enneagram) {
    const typeData = ENNEAGRAM_TYPES.find(t => t.number === enneagram.primaryType.number);
    const center = ENNEAGRAM_CENTERS.find(c => c.id === enneagram.primaryType.centerId);
    enneagramTension = ENNEAGRAM_TENSIONS[enneagram.primaryType.number] || "";
    enneagramData = {
      primaryType: enneagram.primaryType.number,
      primaryName: enneagram.primaryType.name,
      label: typeData?.label || "",
      center: center?.name || "",
      centerDescription: center?.description || "",
      coreFear: enneagram.primaryType.coreFear,
      coreDesire: enneagram.primaryType.coreDesire,
      growthDirection: enneagram.primaryType.growthDirection,
      coreTension: enneagramTension,
      suggestion: enneagram.suggestion?.number,
    };
  }

  // Build MBTI expanded data
  let mbtiData: NarrativeRequest["mbti"];
  let mbtiDescription = "";
  if (mbtiCode) {
    mbtiDescription = MBTI_TYPE_DESCRIPTIONS[mbtiCode] || "";
    mbtiData = { code: mbtiCode, description: mbtiDescription };
  }

  // Master narrative summary
  const narrativeSummary = generateNarrativeSummary({
    dayMasterDescription,
    elementStory,
    tenGodsSummary,
    luckPillarNarrative,
    branchRelationshipSummary,
    bigFiveSummary,
    enneagramTension,
    mbtiDescription,
    westernZodiac: result.western,
    dayMasterStrength: chart.dayMasterStrength,
  });

  return {
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
    bigFive: bigFiveData,
    enneagram: enneagramData,
    mbti: mbtiData,
    bazi: {
      dayMasterDescription,
      tenGods: chart.tenGods,
      tenGodsSummary,
      elementalBalance: {
        percentages: chart.elementalBalance.percentages,
        dominant: chart.elementalBalance.dominant,
        scarce: chart.elementalBalance.scarce,
        absent: chart.elementalBalance.absent,
      },
      elementStory,
      luckPillars: {
        startingAge: chart.luckPillars.startingAge,
        isForward: chart.luckPillars.isForward,
        pillars: luckPillarsWithGods,
      },
      luckPillarNarrative,
      naYin: {
        year: chart.pillars.year.naYin,
        month: chart.pillars.month.naYin,
        day: chart.pillars.day.naYin,
      },
      branchRelationships: chart.branchRelationships,
      branchRelationshipSummary,
      dayMasterStrength: chart.dayMasterStrength,
      yinYangBalance: chart.yinYangBalance,
      currentLuckPillar: chart.currentLuckPillar ? {
        age: chart.currentLuckPillar.pillar.age,
        stem: { name: chart.currentLuckPillar.pillar.stem.name, element: chart.currentLuckPillar.pillar.stem.element, polarity: chart.currentLuckPillar.pillar.stem.polarity },
        branch: { name: chart.currentLuckPillar.pillar.branch.name, element: chart.currentLuckPillar.pillar.branch.element },
        naYin: chart.currentLuckPillar.pillar.naYin,
        ageInPillar: chart.currentLuckPillar.ageInPillar,
      } : null,
    },
    narrativeSummary,
  };
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
          <div className="animate-fade-up rounded-xl border border-gold/20 p-6 text-left">
            {narrative.split("\n").map((line, i) => {
              const headerMatch = line.match(/^#{1,4}\s+(.*)/);
              if (headerMatch) {
                return (
                  <p key={i} className="mt-6 mb-3 text-sm uppercase tracking-widest text-gold/60 first:mt-0">
                    {headerMatch[1]}
                  </p>
                );
              }
              const trimmed = line.trim();
              if (!trimmed) return null;
              return (
                <p key={i} className="text-sm leading-relaxed text-foreground/70 mb-2">
                  {trimmed}
                </p>
              );
            })}
          </div>
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
