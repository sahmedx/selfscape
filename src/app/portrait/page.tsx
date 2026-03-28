"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadFromSession, SESSION_KEYS } from "@/lib/session";
import { BirthdateResult, BigFiveScores, EnneagramResult, PortraitData } from "@/lib/types";
import { encodePortraitHash, decodePortraitHash } from "@/lib/portrait-url";
import { getChineseZodiac } from "@/lib/chinese-zodiac";
import PortraitCard from "@/components/PortraitCard";

function buildPortraitDataFromSession(): PortraitData | null {
  const birthdate = loadFromSession<BirthdateResult>(SESSION_KEYS.birthdateResult);
  if (!birthdate) return null;

  // Recompute Chinese zodiac if session has stale data without pillar fields
  const chinese = birthdate.chinese.year
    ? birthdate.chinese
    : getChineseZodiac(birthdate.year, birthdate.month, birthdate.day);

  const data: PortraitData = {
    sunSign: birthdate.western.sign,
    sunElement: birthdate.western.element,
    yearPillar: {
      element: chinese.year.stemElement,
      animal: chinese.year.branch,
      stem: chinese.year.stem,
      polarity: chinese.year.stemPolarity,
    },
    monthPillar: {
      element: chinese.month.stemElement,
      animal: chinese.month.branch,
      stem: chinese.month.stem,
      polarity: chinese.month.stemPolarity,
    },
    dayPillar: {
      element: chinese.day.stemElement,
      animal: chinese.day.branch,
      stem: chinese.day.stem,
      polarity: chinese.day.stemPolarity,
    },
  };

  const enneagram = loadFromSession<EnneagramResult>(SESSION_KEYS.enneagramResult);
  if (enneagram) {
    data.enneagramType = enneagram.primaryType.number;
    data.enneagramName = enneagram.primaryType.name;
  }

  const mbti = loadFromSession<string>(SESSION_KEYS.mbtiResult);
  if (mbti) data.mbtiCode = mbti;

  const bigFive = loadFromSession<BigFiveScores>(SESSION_KEYS.bigFiveScores);
  if (bigFive) data.bigFiveScores = bigFive;

  return data;
}

export default function PortraitPage() {
  const [portraitData, setPortraitData] = useState<PortraitData | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check URL hash first — shared links should always show the shared data,
    // even if the recipient has their own session
    const hash = window.location.hash;
    if (hash) {
      const decoded = decodePortraitHash(hash);
      if (decoded) {
        setPortraitData(decoded);
        setIsCreator(false);
        setLoading(false);
        return;
      }
    }

    // No hash (or invalid hash) — try session data (portrait creator)
    const sessionData = buildPortraitDataFromSession();
    if (sessionData) {
      setPortraitData(sessionData);
      setIsCreator(true);
      // Encode data into URL hash for sharing
      const encodedHash = encodePortraitHash(sessionData);
      window.history.replaceState(null, "", `#${encodedHash}`);
    }

    setLoading(false);
  }, []);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Selfscape Portrait", url });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="animate-pulse text-foreground/30">Loading...</p>
      </div>
    );
  }

  if (!portraitData) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6">
        <p className="text-foreground/50">No portrait data found.</p>
        <Link
          href="/"
          className="text-sm uppercase tracking-widest text-gold transition-colors hover:text-gold/80"
        >
          Create Your Portrait
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Back button — only for portrait creator */}
      {isCreator && (
        <div className="absolute left-4 top-6 z-10">
          <Link
            href="/"
            className="text-sm text-foreground/30 transition-colors hover:text-foreground/50"
          >
            ← Back
          </Link>
        </div>
      )}

      <PortraitCard data={portraitData} />

      {/* Share button — only for portrait creator */}
      {isCreator && (
        <div className="flex justify-center pb-12">
          <button
            onClick={handleShare}
            className="animate-fade-up cursor-pointer rounded-xl border border-gold/20 px-8 py-3 text-sm uppercase tracking-widest text-gold transition-colors hover:border-gold/40 hover:text-gold/80"
            style={{ animationDelay: "1.5s" }}
          >
            {shared ? "Link Copied!" : "Share"}
          </button>
        </div>
      )}
    </div>
  );
}
