import { ChineseZodiacResult, ChinesePillar } from "./types";
import { LUNAR_NEW_YEAR } from "@/data/lunar-new-year";

const STEMS = [
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

const BRANCHES = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
];

// Solar term approximate start dates for each Ba Zi month (month, day)
// Month 1 (Tiger) starts ~Feb 4, Month 2 (Rabbit) ~Mar 6, etc.
const SOLAR_MONTH_STARTS: [number, number][] = [
  [2, 4],   // Month 1 - Tiger
  [3, 6],   // Month 2 - Rabbit
  [4, 5],   // Month 3 - Dragon
  [5, 6],   // Month 4 - Snake
  [6, 6],   // Month 5 - Horse
  [7, 7],   // Month 6 - Goat
  [8, 8],   // Month 7 - Monkey
  [9, 8],   // Month 8 - Rooster
  [10, 8],  // Month 9 - Dog
  [11, 7],  // Month 10 - Pig
  [12, 7],  // Month 11 - Rat
  [1, 6],   // Month 12 - Ox (next year's Jan)
];

// Five Tiger Escape: maps year stem index (mod 5) to month 1's stem index
const MONTH_1_STEM: Record<number, number> = {
  0: 2,  // Jiǎ/Jǐ year → Bǐng
  1: 4,  // Yǐ/Gēng year → Wù
  2: 6,  // Bǐng/Xīn year → Gēng
  3: 8,  // Dīng/Rén year → Rén
  4: 0,  // Wù/Guǐ year → Jiǎ
};

// Reference for day pillar: Jan 1, 2000 = stem 4 (Wù), branch 6 (Horse)
const REF_DATE = new Date(2000, 0, 1);
const REF_DAY_STEM = 4;
const REF_DAY_BRANCH = 6;

function makePillar(stemIndex: number, branchIndex: number): ChinesePillar {
  const stem = STEMS[stemIndex];
  return {
    stem: stem.name,
    stemElement: stem.element,
    stemPolarity: stem.polarity,
    branch: BRANCHES[branchIndex],
  };
}

function getSolarMonth(month: number, day: number): number {
  // Walk backwards through solar month starts to find which Ba Zi month we're in
  // Returns 1-12 (Ba Zi month number, 1 = Tiger month)
  for (let i = SOLAR_MONTH_STARTS.length - 1; i >= 0; i--) {
    const [startMonth, startDay] = SOLAR_MONTH_STARTS[i];
    if (month > startMonth || (month === startMonth && day >= startDay)) {
      return i + 1;
    }
  }
  // Before Jan 6 → still in month 12 (Ox) of previous year
  return 12;
}

export function getChineseZodiac(
  year: number,
  month: number,
  day: number
): ChineseZodiacResult {
  // --- Year pillar ---
  // Ba Zi year changes at Lichun (~Feb 4), not lunar new year
  let effectiveYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    effectiveYear = year - 1;
  }

  const yearStemIndex = ((effectiveYear - 4) % 10 + 10) % 10;
  const yearBranchIndex = ((effectiveYear - 4) % 12 + 12) % 12;
  const yearPillar = makePillar(yearStemIndex, yearBranchIndex);

  // --- Month pillar ---
  const solarMonth = getSolarMonth(month, day);
  // Month branch: month 1 = Tiger (index 2), month 2 = Rabbit (3), ...
  const monthBranchIndex = (solarMonth + 1) % 12;
  // Month stem: Five Tiger Escape formula
  const month1Stem = MONTH_1_STEM[yearStemIndex % 5];
  const monthStemIndex = (month1Stem + solarMonth - 1) % 10;
  const monthPillar = makePillar(monthStemIndex, monthBranchIndex);

  // --- Day pillar ---
  const targetDate = new Date(year, month - 1, day);
  const daysDiff = Math.round(
    (targetDate.getTime() - REF_DATE.getTime()) / 86_400_000
  );
  const dayStemIndex = ((REF_DAY_STEM + daysDiff) % 10 + 10) % 10;
  const dayBranchIndex = ((REF_DAY_BRANCH + daysDiff) % 12 + 12) % 12;
  const dayPillar = makePillar(dayStemIndex, dayBranchIndex);

  // Animal for backward compat: use lunar new year adjustment for the popular zodiac animal
  let animalYear = year;
  const lny = LUNAR_NEW_YEAR[year];
  if (lny) {
    const [lnyMonth, lnyDay] = lny;
    if (month < lnyMonth || (month === lnyMonth && day < lnyDay)) {
      animalYear = year - 1;
    }
  }
  const animalIndex = ((animalYear - 4) % 12 + 12) % 12;

  return {
    animal: BRANCHES[animalIndex],
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
  };
}
