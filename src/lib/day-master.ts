import { DayMasterResult } from "./types";

interface HeavenlyStem {
  name: string;
  element: string;
  polarity: string;
}

const STEMS: HeavenlyStem[] = [
  { name: "Jiǎ", element: "Wood", polarity: "Yang" },
  { name: "Yǐ", element: "Wood", polarity: "Yin" },
  { name: "Bǐng", element: "Fire", polarity: "Yang" },
  { name: "Dīng", element: "Fire", polarity: "Yin" },
  { name: "Wù", element: "Earth", polarity: "Yang" },
  { name: "Jǐ", element: "Earth", polarity: "Yin" },
  { name: "Gēng", element: "Metal", polarity: "Yang" },
  { name: "Xīn", element: "Metal", polarity: "Yin" },
  { name: "Rén", element: "Water", polarity: "Yang" },
  { name: "Guǐ", element: "Water", polarity: "Yin" },
];

// Reference: Jan 1, 2000 = stem index 4 (Wu, Yang Earth)
const REF_DATE = new Date(2000, 0, 1); // months are 0-indexed
const REF_STEM_INDEX = 4;

export function getDayMaster(year: number, month: number, day: number): DayMasterResult {
  const targetDate = new Date(year, month - 1, day);
  const daysDiff = Math.round(
    (targetDate.getTime() - REF_DATE.getTime()) / 86_400_000
  );
  const stemIndex = ((REF_STEM_INDEX + daysDiff) % 10 + 10) % 10;
  const stem = STEMS[stemIndex];

  return {
    stemIndex,
    element: stem.element,
    polarity: stem.polarity,
    chineseName: stem.name,
  };
}
