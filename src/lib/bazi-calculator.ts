// ============================================================
// BaZi Calculator — single source of truth for all BaZi calculations
// Input: birthdate (YYYY-MM-DD string), gender ('male' | 'female')
// Output: structured chart object with pillars, hidden stems,
//         ten gods, elemental balance, luck pillars, branch
//         relationships, day master strength, and yin/yang balance
// Note: Hour pillar excluded (no birth time collected)
// ============================================================

import { LUNAR_NEW_YEAR } from "@/data/lunar-new-year";
import type {
  BaZiStem,
  BaZiBranch,
  BaZiPillar,
  BaZiChart,
  BaZiElementalBalance,
  BaZiLuckPillar,
  BaZiLuckPillars,
  BaZiBranchRelationships,
  BaZiDayMasterStrength,
  BaZiYinYangBalance,
  BaZiCurrentLuckPillar,
} from "./types";

// Re-export types for consumers that import from this file
export type {
  BaZiStem,
  BaZiBranch,
  BaZiPillar,
  BaZiChart,
  BaZiElementalBalance,
  BaZiLuckPillar,
  BaZiLuckPillars,
  BaZiBranchRelationships,
  BaZiDayMasterStrength,
  BaZiYinYangBalance,
  BaZiCurrentLuckPillar,
};

// ------------------------------------------------------------
// LOOKUP TABLES
// ------------------------------------------------------------

const STEMS: BaZiStem[] = [
  { id: 0, name: 'Jiǎ', element: 'Wood', polarity: 'Yang' },
  { id: 1, name: 'Yǐ',  element: 'Wood', polarity: 'Yin'  },
  { id: 2, name: 'Bǐng', element: 'Fire', polarity: 'Yang' },
  { id: 3, name: 'Dīng', element: 'Fire', polarity: 'Yin'  },
  { id: 4, name: 'Wù',  element: 'Earth', polarity: 'Yang' },
  { id: 5, name: 'Jǐ',  element: 'Earth', polarity: 'Yin'  },
  { id: 6, name: 'Gēng', element: 'Metal', polarity: 'Yang' },
  { id: 7, name: 'Xīn', element: 'Metal', polarity: 'Yin'  },
  { id: 8, name: 'Rén', element: 'Water', polarity: 'Yang' },
  { id: 9, name: 'Guǐ', element: 'Water', polarity: 'Yin'  },
];

const BRANCHES: BaZiBranch[] = [
  { id: 0,  name: 'Rat',     element: 'Water', polarity: 'Yang', zodiac: 'Rat'     },
  { id: 1,  name: 'Ox',      element: 'Earth', polarity: 'Yin',  zodiac: 'Ox'      },
  { id: 2,  name: 'Tiger',   element: 'Wood',  polarity: 'Yang', zodiac: 'Tiger'   },
  { id: 3,  name: 'Rabbit',  element: 'Wood',  polarity: 'Yin',  zodiac: 'Rabbit'  },
  { id: 4,  name: 'Dragon',  element: 'Earth', polarity: 'Yang', zodiac: 'Dragon'  },
  { id: 5,  name: 'Snake',   element: 'Fire',  polarity: 'Yin',  zodiac: 'Snake'   },
  { id: 6,  name: 'Horse',   element: 'Fire',  polarity: 'Yang', zodiac: 'Horse'   },
  { id: 7,  name: 'Goat',    element: 'Earth', polarity: 'Yin',  zodiac: 'Goat'    },
  { id: 8,  name: 'Monkey',  element: 'Metal', polarity: 'Yang', zodiac: 'Monkey'  },
  { id: 9,  name: 'Rooster', element: 'Metal', polarity: 'Yin',  zodiac: 'Rooster' },
  { id: 10, name: 'Dog',     element: 'Earth', polarity: 'Yang', zodiac: 'Dog'     },
  { id: 11, name: 'Pig',     element: 'Water', polarity: 'Yin',  zodiac: 'Pig'     },
];

// Hidden stems per branch: [mainQi, middleQi?, residualQi?]
const HIDDEN_STEMS: Record<number, number[]> = {
  0:  [9],           // Rat:     Gui Water
  1:  [5, 9, 6],    // Ox:      Ji Earth, Gui Water, Xin Metal
  2:  [0, 2, 4],    // Tiger:   Jia Wood, Bing Fire, Wu Earth
  3:  [1],           // Rabbit:  Yi Wood
  4:  [4, 1, 9],    // Dragon:  Wu Earth, Yi Wood, Gui Water
  5:  [2, 4, 6],    // Snake:   Bing Fire, Wu Earth, Geng Metal
  6:  [2, 5],        // Horse:   Bing Fire, Ji Earth
  7:  [5, 3, 1],    // Goat:    Ji Earth, Ding Fire, Yi Wood
  8:  [6, 8, 4],    // Monkey:  Geng Metal, Ren Water, Wu Earth
  9:  [6, 7],        // Rooster: Geng Metal, Xin Metal
  10: [4, 7, 0],    // Dog:     Wu Earth, Xin Metal, Jia Wood
  11: [8, 0],        // Pig:     Ren Water, Jia Wood
};

// Qi weights for hidden stems: main qi, middle qi, residual qi
const HIDDEN_STEM_WEIGHTS = [3, 2, 1];

// Na Yin elements -- 30 pairs covering the full 60-cycle
const NA_YIN: string[] = [
  'Sea Metal', 'Sea Metal',
  'Furnace Fire', 'Furnace Fire',
  'Great Forest Wood', 'Great Forest Wood',
  'Sand Road Earth', 'Sand Road Earth',
  'Sword Blade Metal', 'Sword Blade Metal',
  'Mountain Head Fire', 'Mountain Head Fire',
  'Cliffside Earth', 'Cliffside Earth',
  'Thunderbolt Fire', 'Thunderbolt Fire',
  'Sand in the Earth', 'Sand in the Earth',
  'Heavenly River Water', 'Heavenly River Water',
  'Pomegranate Wood', 'Pomegranate Wood',
  'Mountain Earth', 'Mountain Earth',
  'Gold Foil Metal', 'Gold Foil Metal',
  'Covering Lamp Fire', 'Covering Lamp Fire',
  'Large Forest Wood', 'Large Forest Wood',
  'Sand Earth', 'Sand Earth',
  'Heavenly Fire', 'Heavenly Fire',
  'Flat Land Wood', 'Flat Land Wood',
  'Well Spring Water', 'Well Spring Water',
  'Pine Cypress Wood', 'Pine Cypress Wood',
  'Long Flow Water', 'Long Flow Water',
  'Rooftop Earth', 'Rooftop Earth',
  'Pomegranate Wood', 'Pomegranate Wood',
  'Hairpin Gold Metal', 'Hairpin Gold Metal',
  'Mulberry Wood', 'Mulberry Wood',
  'Great Creek Water', 'Great Creek Water',
  'Furnace Fire', 'Furnace Fire',
  'Willow Wood', 'Willow Wood',
  'Well Spring Water', 'Well Spring Water',
  'Thunderbolt Fire', 'Thunderbolt Fire',
];

// ------------------------------------------------------------
// FIVE ELEMENT RELATIONSHIPS
// ------------------------------------------------------------

const PRODUCES: Record<string, string> = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
const PRODUCED_BY: Record<string, string> = { Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal', Wood: 'Water' };
const CONTROLS: Record<string, string> = { Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire' };
const CONTROLLED_BY: Record<string, string> = { Earth: 'Wood', Metal: 'Fire', Water: 'Earth', Wood: 'Metal', Fire: 'Water' };

// ------------------------------------------------------------
// TEN GODS
// ------------------------------------------------------------

function getTenGod(dayMaster: BaZiStem, target: BaZiStem): string {
  const sameElement = dayMaster.element === target.element;
  const samePolarity = dayMaster.polarity === target.polarity;

  if (sameElement) {
    return samePolarity ? 'Companion' : 'Rob Wealth';
  }
  if (PRODUCES[dayMaster.element] === target.element) {
    return samePolarity ? 'Eating God' : 'Hurting Officer';
  }
  if (CONTROLS[dayMaster.element] === target.element) {
    return samePolarity ? 'Direct Wealth' : 'Indirect Wealth';
  }
  if (CONTROLLED_BY[dayMaster.element] === target.element) {
    return samePolarity ? 'Seven Killings' : 'Direct Officer';
  }
  if (PRODUCED_BY[dayMaster.element] === target.element) {
    return samePolarity ? 'Direct Resource' : 'Indirect Resource';
  }

  return 'Unknown';
}

// ------------------------------------------------------------
// SOLAR TERMS
// ------------------------------------------------------------

const SOLAR_TERM_STARTS: Record<number, [number, number]> = {
  2:  [2,  4],  // Tiger:   Lichun,    ~Feb 4
  3:  [3,  6],  // Rabbit:  Jingzhe,   ~Mar 6
  4:  [4,  5],  // Dragon:  Qingming,  ~Apr 5
  5:  [5,  6],  // Snake:   Lixia,     ~May 6
  6:  [6,  6],  // Horse:   Mangzhong, ~Jun 6
  7:  [7,  7],  // Goat:    Xiaoshu,   ~Jul 7
  8:  [8,  7],  // Monkey:  Liqiu,     ~Aug 7
  9:  [9,  8],  // Rooster: Bailu,     ~Sep 8
  10: [10, 8],  // Dog:     Hanlu,     ~Oct 8
  11: [11, 7],  // Pig:     Lidong,    ~Nov 7
  0:  [12, 7],  // Rat:     Daxue,     ~Dec 7
  1:  [1,  6],  // Ox:      Xiaohan,   ~Jan 6
};

// ------------------------------------------------------------
// BRANCH RELATIONSHIPS
// ------------------------------------------------------------

const SIX_CLASHES: [number, number][] = [
  [0, 6],   // Rat - Horse
  [1, 7],   // Ox - Goat
  [2, 8],   // Tiger - Monkey
  [3, 9],   // Rabbit - Rooster
  [4, 10],  // Dragon - Dog
  [5, 11],  // Snake - Pig
];

const SIX_HARMONIES: [number, number][] = [
  [0, 1],   // Rat - Ox
  [2, 11],  // Tiger - Pig
  [3, 10],  // Rabbit - Dog
  [4, 9],   // Dragon - Rooster
  [5, 8],   // Snake - Monkey
  [6, 7],   // Horse - Goat
];

const THREE_HARMONIES: [number, number, number, string][] = [
  [8, 0, 4, 'Water'],    // Monkey - Rat - Dragon
  [2, 6, 10, 'Fire'],    // Tiger - Horse - Dog
  [5, 9, 1, 'Metal'],    // Snake - Rooster - Ox
  [11, 3, 7, 'Wood'],    // Pig - Rabbit - Goat
];

const SELF_PENALTY_BRANCHES = new Set([0, 6, 4, 9, 3]); // Rat, Horse, Dragon, Rooster, Rabbit

const GROUP_PENALTIES: number[][] = [
  [1, 7, 10],    // Ox - Goat - Dog (Ungrateful Penalty)
  [2, 5, 8],     // Tiger - Snake - Monkey (Graceless Penalty)
];

const PILLAR_LABELS = ['Year', 'Month', 'Day'];

function getBranchRelationships(pillars: BaZiPillar[]): BaZiBranchRelationships {
  const branchIds = pillars.map(p => p.branch.id);
  const clashes: string[] = [];
  const harmonies: string[] = [];
  const threeHarmonies: string[] = [];
  const penalties: string[] = [];

  // Check all pairs
  for (let i = 0; i < branchIds.length; i++) {
    for (let j = i + 1; j < branchIds.length; j++) {
      const a = branchIds[i];
      const b = branchIds[j];
      const label = `${PILLAR_LABELS[i]}-${PILLAR_LABELS[j]}`;

      for (const [c1, c2] of SIX_CLASHES) {
        if ((a === c1 && b === c2) || (a === c2 && b === c1)) {
          clashes.push(`${label}: ${BRANCHES[a].zodiac}-${BRANCHES[b].zodiac}`);
        }
      }

      for (const [h1, h2] of SIX_HARMONIES) {
        if ((a === h1 && b === h2) || (a === h2 && b === h1)) {
          harmonies.push(`${label}: ${BRANCHES[a].zodiac}-${BRANCHES[b].zodiac}`);
        }
      }
    }
  }

  // Self-penalties (same branch in two pillars)
  for (let i = 0; i < branchIds.length; i++) {
    for (let j = i + 1; j < branchIds.length; j++) {
      if (branchIds[i] === branchIds[j] && SELF_PENALTY_BRANCHES.has(branchIds[i])) {
        penalties.push(`${PILLAR_LABELS[i]}-${PILLAR_LABELS[j]} Self-Penalty: ${BRANCHES[branchIds[i]].zodiac}`);
      }
    }
  }

  // Group penalties (need at least 2 of 3 members present)
  for (const group of GROUP_PENALTIES) {
    const present = group.filter(id => branchIds.includes(id));
    if (present.length >= 2) {
      const names = present.map(id => BRANCHES[id].zodiac).join('-');
      penalties.push(`Group Penalty: ${names}`);
    }
  }

  // Three Harmonies (need at least 2 of 3 members present)
  for (const [a, b, c, element] of THREE_HARMONIES) {
    const members = [a, b, c];
    const present = members.filter(id => branchIds.includes(id));
    if (present.length >= 2) {
      const names = present.map(id => BRANCHES[id].zodiac).join('-');
      const full = present.length === 3 ? 'Full' : 'Partial';
      threeHarmonies.push(`${full} ${element} Triangle: ${names}`);
    }
  }

  return { clashes, harmonies, threeHarmonies, penalties };
}

// ------------------------------------------------------------
// YIN/YANG BALANCE
// ------------------------------------------------------------

function getYinYangBalance(pillars: BaZiPillar[]): BaZiYinYangBalance {
  let yin = 0;
  let yang = 0;

  for (const pillar of pillars) {
    if (pillar.stem.polarity === 'Yang') yang++; else yin++;
    if (pillar.branch.polarity === 'Yang') yang++; else yin++;
  }

  let ratio: string;
  if (yang - yin >= 4) ratio = 'Strongly Yang';
  else if (yang - yin >= 2) ratio = 'Yang-dominant';
  else if (yin - yang >= 4) ratio = 'Strongly Yin';
  else if (yin - yang >= 2) ratio = 'Yin-dominant';
  else ratio = 'Balanced';

  return { yin, yang, ratio };
}

// ------------------------------------------------------------
// DAY MASTER STRENGTH
// ------------------------------------------------------------

function getDayMasterStrength(dayMaster: BaZiStem, pillars: BaZiPillar[]): BaZiDayMasterStrength {
  const dmElement = dayMaster.element;
  const resourceElement = PRODUCED_BY[dmElement];

  let supportWeight = 0;
  let drainWeight = 0;

  function classifyStem(stemIndex: number, weight: number) {
    const el = STEMS[stemIndex].element;
    if (el === dmElement || el === resourceElement) {
      supportWeight += weight;
    } else {
      drainWeight += weight;
    }
  }

  for (const pillar of pillars) {
    // Visible stems (skip day master itself for the day pillar)
    if (pillar.label !== 'day') {
      classifyStem(pillar.stem.id, 2);
    }

    // Hidden stems
    const hidden = HIDDEN_STEMS[pillar.branch.id];
    const weights = HIDDEN_STEM_WEIGHTS;
    hidden.forEach((stemIdx, i) => classifyStem(stemIdx, weights[i]));
  }

  // Seasonal modifier: month branch's main qi element
  const monthBranch = pillars[1].branch;
  if (monthBranch.element === dmElement || monthBranch.element === resourceElement) {
    supportWeight += 3;
  }

  let assessment: 'strong' | 'weak' | 'balanced';
  const ratio = supportWeight / (supportWeight + drainWeight || 1);
  if (ratio >= 0.55) assessment = 'strong';
  else if (ratio <= 0.40) assessment = 'weak';
  else assessment = 'balanced';

  return { assessment, supportScore: supportWeight, drainScore: drainWeight };
}

// ------------------------------------------------------------
// CURRENT LUCK PILLAR
// ------------------------------------------------------------

function getCurrentLuckPillar(
  birthDateStr: string,
  luckPillars: BaZiLuckPillars,
  currentDate: Date = new Date()
): BaZiCurrentLuckPillar | null {
  const birth = new Date(birthDateStr + 'T12:00:00Z');
  const ageMs = currentDate.getTime() - birth.getTime();
  const age = Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000));

  if (age < 0 || luckPillars.pillars.length === 0) return null;

  // Find the luck pillar whose age range covers the current age
  for (let i = luckPillars.pillars.length - 1; i >= 0; i--) {
    if (age >= luckPillars.pillars[i].age) {
      return {
        pillar: luckPillars.pillars[i],
        ageInPillar: age - luckPillars.pillars[i].age,
      };
    }
  }

  return null;
}

// ------------------------------------------------------------
// PILLAR CALCULATIONS
// ------------------------------------------------------------

function getYearPillarIndex(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let chineseYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    chineseYear -= 1;
  }

  const anchor = 1984;
  let index = (chineseYear - anchor) % 60;
  if (index < 0) index += 60;
  return index;
}

function getMonthBranchIndex(date: Date): number {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const branchOrder = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

  for (let i = branchOrder.length - 1; i >= 0; i--) {
    const branchId = branchOrder[i];
    const [termMonth, termDay] = SOLAR_TERM_STARTS[branchId];
    if (month > termMonth || (month === termMonth && day >= termDay)) {
      return branchId;
    }
  }

  return 1;
}

function getMonthStemIndex(yearStemIndex: number, monthBranchIndex: number): number {
  const tigerStemStarts = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0];
  const tigerStem = tigerStemStarts[yearStemIndex];

  const branchOrderFromTiger = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];
  const monthPosition = branchOrderFromTiger.indexOf(monthBranchIndex);

  return (tigerStem + monthPosition) % 10;
}

// Jan 1, 2000 = sexagenary index 54 (Wù Horse, 戊午)
function getDayPillarIndex(date: Date): number {
  const anchor = new Date(Date.UTC(2000, 0, 1));
  const msPerDay = 86400000;
  const dayDiff = Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - anchor.getTime()) / msPerDay);
  let index = (54 + dayDiff) % 60;
  if (index < 0) index += 60;
  return index;
}

function sexagenary(index: number): { stem: BaZiStem; branch: BaZiBranch; sexagenaryIndex: number } {
  const stemIndex = index % 10;
  const branchIndex = index % 12;
  return {
    stem: STEMS[stemIndex],
    branch: BRANCHES[branchIndex],
    sexagenaryIndex: index,
  };
}

function findSexagenaryIndex(stemIndex: number, branchIndex: number): number {
  for (let i = 0; i < 60; i++) {
    if (i % 10 === stemIndex && i % 12 === branchIndex) {
      return i;
    }
  }
  throw new Error(`Invalid stem/branch combination: stem ${stemIndex}, branch ${branchIndex}`);
}

// ------------------------------------------------------------
// LUCK PILLARS
// ------------------------------------------------------------

function getLuckPillars(birthDate: Date, gender: string, yearStemIndex: number, monthPillarIndex: number): BaZiLuckPillars {
  const yearStemPolarity = STEMS[yearStemIndex % 10].polarity;

  const isForward =
    (yearStemPolarity === 'Yang' && gender === 'male') ||
    (yearStemPolarity === 'Yin' && gender === 'female');

  const birthMs = Date.UTC(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  function getSolarTermDate(year: number, branchId: number): number {
    const [termMonth, termDay] = SOLAR_TERM_STARTS[branchId];
    return Date.UTC(year, termMonth - 1, termDay);
  }

  const branchOrder = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];
  const currentMonthBranch = monthPillarIndex % 12;
  const currentPos = branchOrder.indexOf(currentMonthBranch);

  let daysToTerm: number;

  if (isForward) {
    let nextTermMs = Infinity;
    for (let step = 1; step <= 12; step++) {
      const candidatePos = (currentPos + step) % 12;
      const candidateBranch = branchOrder[candidatePos];
      for (const yearOffset of [0, 1]) {
        const candidateMs = getSolarTermDate(birthDate.getFullYear() + yearOffset, candidateBranch);
        if (candidateMs > birthMs && candidateMs < nextTermMs) {
          nextTermMs = candidateMs;
          break;
        }
      }
    }
    daysToTerm = Math.round((nextTermMs - birthMs) / 86400000);
  } else {
    let curTermMs = getSolarTermDate(birthDate.getFullYear(), currentMonthBranch);
    if (curTermMs > birthMs) {
      curTermMs = getSolarTermDate(birthDate.getFullYear() - 1, currentMonthBranch);
    }
    daysToTerm = Math.round((birthMs - curTermMs) / 86400000);
  }

  const startingAge = Math.round(daysToTerm / 3);

  const pillars: BaZiLuckPillar[] = [];
  const monthSexagIndex = monthPillarIndex;

  for (let i = 0; i < 8; i++) {
    const offset = isForward ? i + 1 : -(i + 1);
    let idx = (monthSexagIndex + offset) % 60;
    if (idx < 0) idx += 60;
    pillars.push({
      age: startingAge + i * 10,
      ...sexagenary(idx),
      naYin: NA_YIN[idx],
    });
  }

  return { startingAge, isForward, pillars };
}

// ------------------------------------------------------------
// ELEMENTAL BALANCE
// ------------------------------------------------------------

function getElementalBalance(pillars: BaZiPillar[]): BaZiElementalBalance {
  const elements: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  function addStem(stemIndex: number, weight = 1) {
    elements[STEMS[stemIndex].element] += weight;
  }

  function addBranchHiddenStems(branchIndex: number) {
    const hidden = HIDDEN_STEMS[branchIndex];
    const weights = HIDDEN_STEM_WEIGHTS;
    hidden.forEach((stemIdx, i) => addStem(stemIdx, weights[i]));
  }

  pillars.forEach(pillar => {
    addStem(pillar.stem.id, 2);
    addBranchHiddenStems(pillar.branch.id);
  });

  const total = Object.values(elements).reduce((a, b) => a + b, 0);
  const percentages: Record<string, number> = {};
  for (const el in elements) {
    percentages[el] = Math.round((elements[el] / total) * 100);
  }

  const sorted = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
  const absent = sorted.filter(([, v]) => v === 0).map(([k]) => k);
  const scarce = sorted.filter(([, v]) => v > 0 && v <= 10).map(([k]) => k);
  const dominant = sorted.filter(([, v]) => v >= 25).map(([k]) => k);

  return { raw: elements, percentages, dominant, scarce, absent };
}

// ------------------------------------------------------------
// TEN GODS FOR FULL CHART
// ------------------------------------------------------------

function getTenGods(dayMasterStem: BaZiStem, pillars: BaZiPillar[]): Record<string, string> {
  const result: Record<string, string> = {};
  pillars.forEach(pillar => {
    result[`${pillar.label}_stem`] = pillar.stem.id === dayMasterStem.id
      ? 'Day Master'
      : getTenGod(dayMasterStem, pillar.stem);

    const hidden = HIDDEN_STEMS[pillar.branch.id];
    result[`${pillar.label}_branch_main`] = getTenGod(dayMasterStem, STEMS[hidden[0]]);
    if (hidden[1] !== undefined) {
      result[`${pillar.label}_branch_mid`] = getTenGod(dayMasterStem, STEMS[hidden[1]]);
    }
    if (hidden[2] !== undefined) {
      result[`${pillar.label}_branch_residual`] = getTenGod(dayMasterStem, STEMS[hidden[2]]);
    }
  });
  return result;
}

// ------------------------------------------------------------
// LUNAR ZODIAC ANIMAL
// ------------------------------------------------------------

function getLunarAnimal(year: number, month: number, day: number): string {
  let animalYear = year;
  const lny = LUNAR_NEW_YEAR[year];
  if (lny) {
    const [lnyMonth, lnyDay] = lny;
    if (month < lnyMonth || (month === lnyMonth && day < lnyDay)) {
      animalYear = year - 1;
    }
  }
  const animalIndex = ((animalYear - 4) % 12 + 12) % 12;
  return BRANCHES[animalIndex].zodiac;
}

// ------------------------------------------------------------
// MAIN EXPORT
// ------------------------------------------------------------

export function calculateBaziChart(birthDateStr: string, gender: string = 'male'): BaZiChart {
  const date = new Date(birthDateStr + 'T12:00:00Z');
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  // Year Pillar
  const yearSexagIndex = getYearPillarIndex(date);
  const yearPillar: BaZiPillar = { label: 'year', ...sexagenary(yearSexagIndex), naYin: NA_YIN[yearSexagIndex] };

  // Month Pillar
  const monthBranchIndex = getMonthBranchIndex(date);
  const monthStemIndex = getMonthStemIndex(yearPillar.stem.id, monthBranchIndex);
  const monthSexagIndexAccurate = findSexagenaryIndex(monthStemIndex, monthBranchIndex);
  const monthPillar: BaZiPillar = { label: 'month', ...sexagenary(monthSexagIndexAccurate), naYin: NA_YIN[monthSexagIndexAccurate] };

  // Day Pillar
  const daySexagIndex = getDayPillarIndex(date);
  const dayPillar: BaZiPillar = { label: 'day', ...sexagenary(daySexagIndex), naYin: NA_YIN[daySexagIndex] };

  const pillarArray = [yearPillar, monthPillar, dayPillar];
  const dayMaster = dayPillar.stem;

  const tenGods = getTenGods(dayMaster, pillarArray);
  const elementalBalance = getElementalBalance(pillarArray);
  const luckPillars = getLuckPillars(date, gender, yearPillar.stem.id, monthSexagIndexAccurate);
  const animal = getLunarAnimal(year, month, day);
  const branchRelationships = getBranchRelationships(pillarArray);
  const yinYangBalance = getYinYangBalance(pillarArray);
  const dayMasterStrength = getDayMasterStrength(dayMaster, pillarArray);
  const currentLuckPillar = getCurrentLuckPillar(birthDateStr, luckPillars);

  return {
    birthDate: birthDateStr,
    gender,
    animal,
    dayMaster,
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
    },
    tenGods,
    elementalBalance,
    luckPillars,
    branchRelationships,
    dayMasterStrength,
    yinYangBalance,
    currentLuckPillar,
  };
}
