"use client";

import { useState } from "react";
import BirthdatePicker from "@/components/BirthdatePicker";
import ResultsDisplay from "@/components/ResultsDisplay";
import { getWesternZodiac } from "@/lib/western-zodiac";
import { getChineseZodiac } from "@/lib/chinese-zodiac";
import { getDayMaster } from "@/lib/day-master";
import { BirthdateResult } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<BirthdateResult | null>(null);

  function handleSubmit(month: number, day: number, year: number) {
    const western = getWesternZodiac(month, day);
    const chinese = getChineseZodiac(year, month, day);
    const dayMaster = getDayMaster(year, month, day);
    setResult({ month, day, year, western, chinese, dayMaster });
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      {result ? (
        <ResultsDisplay result={result} onReset={() => setResult(null)} />
      ) : (
        <BirthdatePicker onSubmit={handleSubmit} />
      )}
    </div>
  );
}
