"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BirthdateResult, BigFiveScores, EnneagramResult } from "@/lib/types";
import { loadFromSession, removeFromSession, SESSION_KEYS } from "@/lib/session";
import { getBigFiveProfile } from "@/lib/big-five-scoring";
import { MBTI_TYPE_DESCRIPTIONS } from "@/data/mbti-data";
import { STEM_DESCRIPTORS, SIGN_DESCRIPTIONS } from "@/data/display-lookups";
import { getChineseZodiac } from "@/lib/chinese-zodiac";
import NarrativePortrait from "./NarrativePortrait";

interface ResultsDisplayProps {
  result: BirthdateResult;
  onReset: () => void;
}

export default function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const { western, dayMaster } = result;

  // Recompute Chinese zodiac if session has stale data without pillar fields
  const chinese = useMemo(
    () =>
      result.chinese.year
        ? result.chinese
        : getChineseZodiac(result.year, result.month, result.day),
    [result]
  );

  const [bigFiveScores, setBigFiveScores] = useState<BigFiveScores | null>(null);
  const [enneagramResult, setEnneagramResult] = useState<EnneagramResult | null>(null);
  const [mbtiResult, setMbtiResult] = useState<string | null>(null);

  useEffect(() => {
    setBigFiveScores(loadFromSession<BigFiveScores>(SESSION_KEYS.bigFiveScores));
    setEnneagramResult(loadFromSession<EnneagramResult>(SESSION_KEYS.enneagramResult));
    setMbtiResult(loadFromSession<string>(SESSION_KEYS.mbtiResult));
  }, []);

  return (
    <div className="flex flex-col items-center gap-12 px-6">
      {/* Page Header */}
      <h1 className="animate-fade-up text-center font-serif text-2xl tracking-wide text-gold sm:text-3xl">
        Your Personal SelfScape
      </h1>

      {/* Western Zodiac */}
      <div className="animate-fade-up text-center">
        <p className="mb-1 text-sm uppercase tracking-widest text-gold/60">
          Sun Sign
        </p>
        <h2 className="text-4xl font-light tracking-wide sm:text-4xl">
          {western.sign}
        </h2>
        {SIGN_DESCRIPTIONS[western.sign] && (
          <p className="mt-2 text-base italic text-foreground/40">
            {western.element} &middot; {SIGN_DESCRIPTIONS[western.sign]}
          </p>
        )}
      </div>

      {/* Chinese Zodiac — Year Pillar */}
      <div
        className="animate-fade-up text-center"
        style={{ animationDelay: "0.3s" }}
      >
        <p className="mb-1 text-sm uppercase tracking-widest text-gold/60">
          Year Pillar
        </p>
        <h2 className="text-4xl font-light tracking-wide sm:text-4xl">
          {chinese.year.stemElement} {chinese.year.branch}
        </h2>
        {STEM_DESCRIPTORS[chinese.year.stem] && (
          <p className="mt-2 text-base italic text-foreground/40">
            {STEM_DESCRIPTORS[chinese.year.stem]} &middot; {chinese.year.stemPolarity}
          </p>
        )}
      </div>

      {/* Chinese Zodiac — Month Pillar */}
      <div
        className="animate-fade-up text-center"
        style={{ animationDelay: "0.45s" }}
      >
        <p className="mb-1 text-sm uppercase tracking-widest text-gold/60">
          Month Pillar
        </p>
        <h2 className="text-4xl font-light tracking-wide sm:text-4xl">
          {chinese.month.stemElement} {chinese.month.branch}
        </h2>
        {STEM_DESCRIPTORS[chinese.month.stem] && (
          <p className="mt-2 text-base italic text-foreground/40">
            {STEM_DESCRIPTORS[chinese.month.stem]} &middot; {chinese.month.stemPolarity}
          </p>
        )}
      </div>

      {/* Chinese Zodiac — Day Pillar */}
      <div
        className="animate-fade-up text-center"
        style={{ animationDelay: "0.6s" }}
      >
        <p className="mb-1 text-sm uppercase tracking-widest text-gold/60">
          Day Pillar
        </p>
        <h2 className="text-4xl font-light tracking-wide sm:text-4xl">
          {chinese.day.stemElement} {chinese.day.branch}
        </h2>
        {STEM_DESCRIPTORS[chinese.day.stem] && (
          <p className="mt-2 text-base italic text-foreground/40">
            {STEM_DESCRIPTORS[chinese.day.stem]} &middot; {chinese.day.stemPolarity}
          </p>
        )}
      </div>

      {/* Change Birthdate */}
      <button
        onClick={() => {
          removeFromSession(SESSION_KEYS.narrativeResult);
          onReset();
        }}
        className="animate-fade-up cursor-pointer text-xs tracking-wide text-foreground/30 transition-colors hover:text-foreground/50"
        style={{ animationDelay: "0.9s" }}
      >
        Change Birthdate
      </button>

      {/* Big Five World Card */}
      <div
        className={`animate-fade-up w-full max-w-xs rounded-xl border p-5 text-center ${
          bigFiveScores ? "border-gold/20" : "border-gold/10"
        }`}
        style={{ animationDelay: "1.2s" }}
      >
        {bigFiveScores ? (
          <>
            <p className="mb-3 text-sm uppercase tracking-widest text-gold/60">
              Your Nature
            </p>
            <div className="flex flex-col gap-1.5">
              {getBigFiveProfile(bigFiveScores).map((dim) => (
                <p key={dim.key} className="text-sm text-foreground/50">
                  {dim.label}
                </p>
              ))}
            </div>
            <Link
              href="/big-five"
              className="mt-4 inline-block text-xs text-foreground/30 transition-colors hover:text-foreground/50"
            >
              Retake
            </Link>
          </>
        ) : (
          <Link
            href="/big-five"
            className="inline-block px-6 py-3 text-lg font-serif tracking-wide text-gold/70 transition-colors hover:text-gold"
          >
            Discover Your Nature
          </Link>
        )}
      </div>

      {/* Enneagram World Card */}
      <div
        className={`animate-fade-up w-full max-w-xs rounded-xl border p-5 text-center ${
          enneagramResult ? "border-gold/20" : "border-gold/10"
        }`}
        style={{ animationDelay: "1.5s" }}
      >
        {enneagramResult ? (
          <>
            <p className="mb-3 text-sm uppercase tracking-widest text-gold/60">
              Your Inner World
            </p>
            <h3 className="text-3xl font-light tracking-wide">
              Type {enneagramResult.primaryType.number}
            </h3>
            <p className="mt-1 text-sm text-foreground/50">
              {enneagramResult.primaryType.name}
            </p>
            <p className="mt-1 text-sm italic text-gold/70">
              {enneagramResult.primaryType.label}
            </p>
            <div className="mt-4 flex flex-col gap-2 text-left">
              <p className="text-xs text-foreground/40">
                <span className="uppercase tracking-wider text-gold/50">Core Fear</span>
                <br />
                <span className="text-foreground/50">{enneagramResult.primaryType.coreFear}</span>
              </p>
              <p className="text-xs text-foreground/40">
                <span className="uppercase tracking-wider text-gold/50">Core Desire</span>
                <br />
                <span className="text-foreground/50">{enneagramResult.primaryType.coreDesire}</span>
              </p>
              <p className="text-xs text-foreground/40">
                <span className="uppercase tracking-wider text-gold/50">Growth Direction</span>
                <br />
                <span className="text-foreground/50">{enneagramResult.primaryType.growthDirection}</span>
              </p>
            </div>
            <Link
              href="/enneagram"
              className="mt-4 inline-block text-xs text-foreground/30 transition-colors hover:text-foreground/50"
            >
              Retake
            </Link>
          </>
        ) : (
          <Link
            href="/enneagram"
            className="inline-block px-6 py-3 text-lg font-serif tracking-wide text-gold/70 transition-colors hover:text-gold"
          >
            Discover Your Inner World
          </Link>
        )}
      </div>

      {/* MBTI World Card */}
      <div
        className={`animate-fade-up w-full max-w-xs rounded-xl border p-5 text-center ${
          mbtiResult ? "border-gold/20" : "border-gold/10"
        }`}
        style={{ animationDelay: "1.8s" }}
      >
        {mbtiResult ? (
          <>
            <p className="mb-3 text-sm uppercase tracking-widest text-gold/60">
              Your Type
            </p>
            <h3 className="text-3xl font-light tracking-wide">
              {mbtiResult}
            </h3>
            {MBTI_TYPE_DESCRIPTIONS[mbtiResult] && (
              <p className="mt-2 text-sm text-foreground/50">
                {MBTI_TYPE_DESCRIPTIONS[mbtiResult]}
              </p>
            )}
            <Link
              href="/mbti"
              className="mt-4 inline-block text-xs text-foreground/30 transition-colors hover:text-foreground/50"
            >
              Retake
            </Link>
          </>
        ) : (
          <Link
            href="/mbti"
            className="inline-block px-6 py-3 text-lg font-serif tracking-wide text-gold/70 transition-colors hover:text-gold"
          >
            Enter Your Type
          </Link>
        )}
      </div>

      {/* Personality Narrative */}
      <div
        className="animate-fade-up"
        style={{ animationDelay: "2.1s" }}
      >
        <NarrativePortrait result={result} />
      </div>

      {/* Share Portrait */}
      <Link
        href="/portrait"
        className="animate-fade-up rounded-xl border border-gold/20 px-8 py-3 text-center text-sm uppercase tracking-widest text-gold transition-colors hover:border-gold/40 hover:text-gold/80"
        style={{ animationDelay: "2.25s" }}
      >
        Share Your Portrait
      </Link>

      {/* Start Over */}
      <button
        onClick={() => {
          removeFromSession(SESSION_KEYS.narrativeResult);
          onReset();
        }}
        className="animate-fade-up cursor-pointer text-sm tracking-wide text-foreground/40 transition-colors hover:text-foreground/70"
        style={{ animationDelay: "2.4s" }}
      >
        Start Over
      </button>
    </div>
  );
}
