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
      suggestion: enneagram.suggestion?.number,
    };
  }
  if (mbti) req.mbti = mbti;

  return req;
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
    <div className="w-full max-w-sm text-center">
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
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-foreground/70">
            {narrative}
          </p>
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
