"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BirthdateResult, BigFiveScores, EnneagramResult } from "@/lib/types";
import { loadFromSession, SESSION_KEYS } from "@/lib/session";
import { getChineseZodiac } from "@/lib/chinese-zodiac";
import { DAY_MASTER_THEMES } from "@/data/day-master-themes";
import MapParticles from "@/components/map/MapParticles";
import PortraitCenter from "@/components/map/PortraitCenter";
import WorldNode from "@/components/map/WorldNode";

interface WorldMapProps {
  result: BirthdateResult;
  onReset: () => void;
}

const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: "\u2648",
  Taurus: "\u2649",
  Gemini: "\u264A",
  Cancer: "\u264B",
  Leo: "\u264C",
  Virgo: "\u264D",
  Libra: "\u264E",
  Scorpio: "\u264F",
  Sagittarius: "\u2650",
  Capricorn: "\u2651",
  Aquarius: "\u2652",
  Pisces: "\u2653",
};

export default function WorldMap({ result, onReset }: WorldMapProps) {
  const router = useRouter();

  const [bigFiveScores, setBigFiveScores] = useState<BigFiveScores | null>(null);
  const [enneagramResult, setEnneagramResult] = useState<EnneagramResult | null>(null);
  const [mbtiResult, setMbtiResult] = useState<string | null>(null);
  const [expandedZodiac, setExpandedZodiac] = useState<"western" | "chinese" | null>(null);
  const [loaded, setLoaded] = useState(false);

  const chinese = useMemo(
    () =>
      result.chinese.year
        ? result.chinese
        : getChineseZodiac(result.year, result.month, result.day),
    [result]
  );

  const themeKey = `${result.dayMaster.polarity} ${result.dayMaster.element}`;
  const theme = DAY_MASTER_THEMES[themeKey] ?? DAY_MASTER_THEMES["Yang Wood"];

  useEffect(() => {
    setBigFiveScores(loadFromSession<BigFiveScores>(SESSION_KEYS.bigFiveScores));
    setEnneagramResult(loadFromSession<EnneagramResult>(SESSION_KEYS.enneagramResult));
    setMbtiResult(loadFromSession<string>(SESSION_KEYS.mbtiResult));
    setLoaded(true);
  }, []);

  const completedCount =
    2 + // zodiac worlds are always completed
    (bigFiveScores ? 1 : 0) +
    (enneagramResult ? 1 : 0) +
    (mbtiResult ? 1 : 0);

  const sunIcon = ZODIAC_SYMBOLS[result.western.sign] ?? "\u2609";

  if (!loaded) {
    return <div className="min-h-svh" style={{ background: theme.gradient }} />;
  }

  return (
    <div
      className="relative min-h-svh overflow-hidden"
      style={{ background: theme.gradient }}
      onClick={() => {
        if (expandedZodiac) setExpandedZodiac(null);
      }}
    >
      <MapParticles color={theme.particleColor} />

      {/* Day master label */}
      <div className="animate-fade-up relative z-10 pt-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-foreground/30">
          {result.dayMaster.polarity} {result.dayMaster.element}
        </p>
        <p className="mt-1 text-sm font-light text-foreground/50">
          {theme.name}
        </p>
      </div>

      {/* World map container */}
      <div className="relative mx-auto aspect-square w-full max-w-lg">
        {/* Portrait center */}
        <PortraitCenter
          completedCount={completedCount}
          accentColor={theme.accentColor}
        />

        {/* Sun Sign */}
        <WorldNode
          label="Sun Sign"
          icon={sunIcon}
          completed
          accentColor={theme.accentColor}
          position={{ top: "8%", left: "20%" }}
          onClick={(e) => {
            e.stopPropagation();
            setExpandedZodiac(expandedZodiac === "western" ? null : "western");
          }}
          expanded={expandedZodiac === "western"}
        >
          <h3 className="text-xl font-light tracking-wide">
            {result.western.sign}
          </h3>
          <p className="mt-1 text-xs text-foreground/50">
            {result.western.element} &middot; {result.western.modality}
          </p>
        </WorldNode>

        {/* Ba Zi */}
        <WorldNode
          label="Ba Zi"
          icon="\u262F"
          completed
          accentColor={theme.accentColor}
          position={{ top: "8%", left: "65%" }}
          onClick={(e) => {
            e.stopPropagation();
            setExpandedZodiac(expandedZodiac === "chinese" ? null : "chinese");
          }}
          expanded={expandedZodiac === "chinese"}
        >
          <div className="space-y-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gold/60">
                Year
              </p>
              <p className="text-sm">
                {chinese.year.branch}{" "}
                <span className="text-foreground/50">
                  {chinese.year.stemPolarity} {chinese.year.stemElement}
                </span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gold/60">
                Month
              </p>
              <p className="text-sm">
                {chinese.month.branch}{" "}
                <span className="text-foreground/50">
                  {chinese.month.stemPolarity} {chinese.month.stemElement}
                </span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gold/60">
                Day
              </p>
              <p className="text-sm">
                {chinese.day.branch}{" "}
                <span className="text-foreground/50">
                  {chinese.day.stemPolarity} {chinese.day.stemElement}
                </span>
              </p>
            </div>
          </div>
        </WorldNode>

        {/* Big Five */}
        <WorldNode
          label="Big Five"
          icon="\u2618"
          completed={!!bigFiveScores}
          accentColor={theme.accentColor}
          position={{ top: "45%", left: "5%" }}
          onClick={() => router.push("/big-five")}
        />

        {/* Enneagram */}
        <WorldNode
          label="Enneagram"
          icon="\u2742"
          completed={!!enneagramResult}
          accentColor={theme.accentColor}
          position={{ top: "45%", left: "75%" }}
          onClick={() => router.push("/enneagram")}
        />

        {/* MBTI */}
        <WorldNode
          label="MBTI"
          icon="\u2B1A"
          completed={!!mbtiResult}
          accentColor={theme.accentColor}
          position={{ top: "82%", left: "42%" }}
          onClick={() => router.push("/mbti")}
        />
      </div>

      {/* Start Over */}
      <div className="animate-fade-up relative z-10 pb-10 text-center" style={{ animationDelay: "0.3s" }}>
        <button
          onClick={onReset}
          className="cursor-pointer text-sm tracking-wide text-foreground/30 transition-colors hover:text-foreground/50"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
