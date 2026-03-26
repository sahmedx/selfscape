// ============================================================
// BaZi Calculator
// Input: birthdate (YYYY-MM-DD string), gender ('male' | 'female')
// Output: structured chart object with pillars, hidden stems,
//         ten gods, elemental balance, and luck pillars
// Note: Hour pillar excluded (no birth time collected)
// ============================================================

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------

export interface BaZiStem {
  id: number;
  name: string;
  element: string;
  polarity: string;
}

export interface BaZiBranch {
  id: number;
  name: string;
  element: string;
  polarity: string;
  zodiac: string;
}

export interface BaZiPillar {
  label: string;
  stem: BaZiStem;
  branch: BaZiBranch;
  sexagenaryIndex: number;
  naYin: string;
}

export interface BaZiElementalBalance {
  raw: Record<string, number>;
  percentages: Record<string, number>;
  dominant: string[];
  scarce: string[];
  absent: string[];
}

export interface BaZiLuckPillar {
  age: number;
  stem: BaZiStem;
  branch: BaZiBranch;
  sexagenaryIndex: number;
  naYin: string;
}

export interface BaZiLuckPillars {
  startingAge: number;
  isForward: boolean;
  pillars: BaZiLuckPillar[];
}

export interface BaZiChart {
  birthDate: string;
  gender: string;
  dayMaster: BaZiStem;
  pillars: {
    year: BaZiPillar;
    month: BaZiPillar;
    day: BaZiPillar;
  };
  tenGods: Record<string, string>;
  elementalBalance: BaZiElementalBalance;
  luckPillars: BaZiLuckPillars;
}

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
// Each entry is a stem index (0-9)
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

// Ten Gods lookup
function getTenGod(dayMaster: BaZiStem, target: BaZiStem): string {
  const sameElement = dayMaster.element === target.element;
  const samePolarity = dayMaster.polarity === target.polarity;

  const produces: Record<string, string> = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
  const controls: Record<string, string> = { Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire' };
  const controlledBy: Record<string, string> = { Earth: 'Wood', Metal: 'Fire', Water: 'Earth', Wood: 'Metal', Fire: 'Water' };
  const producedBy: Record<string, string> = { Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal', Wood: 'Water' };

  if (sameElement) {
    return samePolarity ? 'Companion' : 'Rob Wealth';
  }
  if (produces[dayMaster.element] === target.element) {
    return samePolarity ? 'Eating God' : 'Hurting Officer';
  }
  if (controls[dayMaster.element] === target.element) {
    return samePolarity ? 'Direct Wealth' : 'Indirect Wealth';
  }
  if (controlledBy[dayMaster.element] === target.element) {
    return samePolarity ? 'Seven Killings' : 'Direct Officer';
  }
  if (producedBy[dayMaster.element] === target.element) {
    return samePolarity ? 'Direct Resource' : 'Indirect Resource';
  }

  return 'Unknown';
}

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
// SOLAR TERMS
// ------------------------------------------------------------

// Solar term start dates (month, approx day) indexed by branch
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

function getDayPillarIndex(date: Date): number {
  const anchor = new Date(Date.UTC(2000, 0, 1));
  const msPerDay = 86400000;
  const dayDiff = Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - anchor.getTime()) / msPerDay);
  let index = (16 + dayDiff) % 60;
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
    const weights = [3, 2, 1];
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
// MAIN EXPORT
// ------------------------------------------------------------

export function calculateBaziChart(birthDateStr: string, gender: string = 'male'): BaZiChart {
  const date = new Date(birthDateStr + 'T12:00:00Z');

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

  const pillars = [yearPillar, monthPillar, dayPillar];
  const dayMaster = dayPillar.stem;

  // Ten Gods
  const tenGods = getTenGods(dayMaster, pillars);

  // Elemental Balance
  const elementalBalance = getElementalBalance(pillars);

  // Luck Pillars
  const luckPillars = getLuckPillars(date, gender, yearPillar.stem.id, monthSexagIndexAccurate);

  return {
    birthDate: birthDateStr,
    gender,
    dayMaster,
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
    },
    tenGods,
    elementalBalance,
    luckPillars,
  };
}
