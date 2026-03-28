"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { MBTI_DIMENSIONS } from "@/data/mbti-data";
import { saveToSession, SESSION_KEYS } from "@/lib/session";
import MBTIResults from "@/components/MBTIResults";

export default function MBTIPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"input" | "results">("input");
  const [selections, setSelections] = useState<Record<string, string>>({});

  const allSelected = MBTI_DIMENSIONS.every((dim) => selections[dim.key]);

  function handleSelect(dimKey: string, letter: string) {
    setSelections((prev) => ({ ...prev, [dimKey]: letter }));
  }

  const resultType = selections.EI + selections.SN + selections.TF + selections.JP;

  function handleContinue() {
    if (!allSelected) return;
    saveToSession(SESSION_KEYS.mbtiResult, resultType);
    setPhase("results");
  }

  if (phase === "results") {
    return (
      <main className="flex min-h-svh items-center justify-center px-4">
        <MBTIResults type={resultType} onBack={() => router.push("/")} />
      </main>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="flex flex-col items-center gap-10">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gold">Know Your Type?</h1>
          <p className="mt-2 text-sm text-foreground/40">
            Select each letter, or skip if you&apos;re not sure
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {MBTI_DIMENSIONS.map((dim, i) => (
            <motion.div
              key={dim.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex gap-4">
                {[dim.left, dim.right].map((letter) => {
                  const selected = selections[dim.key] === letter;
                  return (
                    <button
                      key={letter}
                      onClick={() => handleSelect(dim.key, letter)}
                      className={`cursor-pointer rounded-xl border px-8 py-4 text-3xl font-serif tracking-widest transition-colors ${
                        selected
                          ? "border-gold bg-gold/20 text-gold"
                          : "border-gold/20 text-foreground/30 hover:border-gold/40 hover:text-foreground/50"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-foreground/40">
                {dim.leftLabel} / {dim.rightLabel}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <button
            onClick={handleContinue}
            disabled={!allSelected}
            className={`cursor-pointer rounded-lg border border-gold/30 px-6 py-3 font-serif text-sm tracking-wide text-gold/70 transition-colors hover:border-gold hover:text-gold ${
              !allSelected ? "opacity-30 !cursor-not-allowed" : ""
            }`}
          >
            Continue
          </button>

          <button
            onClick={() => router.push("/")}
            className="cursor-pointer text-sm text-foreground/40 transition-colors hover:text-foreground/70"
          >
            I&apos;ll discover this later
          </button>
        </motion.div>
      </div>
    </main>
  );
}
