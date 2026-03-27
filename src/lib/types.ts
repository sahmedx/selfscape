export interface WesternZodiacResult {
  sign: string;
  element: string;
  modality: string;
}

export interface ChinesePillar {
  stem: string;         // e.g., "Jiǎ"
  stemElement: string;  // e.g., "Wood"
  stemPolarity: string; // e.g., "Yang"
  branch: string;       // e.g., "Rat"
}

export interface ChineseZodiacResult {
  animal: string;       // year animal (kept for convenience)
  year: ChinesePillar;
  month: ChinesePillar;
  day: ChinesePillar;
}

export interface DayMasterResult {
  stemIndex: number;
  element: string;
  polarity: string;
  chineseName: string;
}

export interface BirthdateResult {
  month: number;
  day: number;
  year: number;
  western: WesternZodiacResult;
  chinese: ChineseZodiacResult;
  dayMaster: DayMasterResult;
}

export interface SwipeCardData {
  id: string;
  leftLabel: string;
  rightLabel: string;
  prompt?: string;
  leftDragLabel?: string;
  rightDragLabel?: string;
}

export type SwipeDirection = "left" | "right";

export interface SwipeResponse {
  cardId: string;
  direction: SwipeDirection;
}

export type BigFiveDimensionKey = "o" | "c" | "e" | "a" | "n";

export interface BigFiveCardData extends SwipeCardData {
  dimension: BigFiveDimensionKey;
}

export interface BigFiveScores {
  o: number;
  c: number;
  e: number;
  a: number;
  n: number;
}

export interface BigFiveDimension {
  key: BigFiveDimensionKey;
  name: string;
  score: number;
  level: "high" | "moderate-high" | "moderate" | "moderate-low" | "low";
  label: string;
}

// Enneagram types

export interface EnneagramCenter {
  id: string;
  name: string;
  types: number[];
  description: string;
}

export interface EnneagramType {
  number: number;
  name: string;
  centerId: string;
  description: string;
  coreFear: string;
  coreDesire: string;
  growthDirection: string;
  label: string;
}

export interface EnneagramConfirmCard extends SwipeCardData {
  centerId: string;
  rightType: number;
}

export interface EnneagramResult {
  primaryType: EnneagramType;
  suggestion: EnneagramType | null;
}

// MBTI types

export interface MBTIDimension {
  key: string;
  left: string;
  right: string;
  leftLabel: string;
  rightLabel: string;
}

export type MBTIResult = string; // 4-letter string like "INFJ"

// BaZi types

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

export interface BaZiBranchRelationships {
  clashes: string[];
  harmonies: string[];
  threeHarmonies: string[];
  penalties: string[];
}

export interface BaZiDayMasterStrength {
  assessment: 'strong' | 'weak' | 'balanced';
  supportScore: number;
  drainScore: number;
}

export interface BaZiYinYangBalance {
  yin: number;
  yang: number;
  ratio: string;
}

export interface BaZiCurrentLuckPillar {
  pillar: BaZiLuckPillar;
  ageInPillar: number;
}

export interface BaZiChart {
  birthDate: string;
  gender: string;
  animal: string;
  dayMaster: BaZiStem;
  pillars: {
    year: BaZiPillar;
    month: BaZiPillar;
    day: BaZiPillar;
  };
  tenGods: Record<string, string>;
  elementalBalance: BaZiElementalBalance;
  luckPillars: BaZiLuckPillars;
  branchRelationships: BaZiBranchRelationships;
  dayMasterStrength: BaZiDayMasterStrength;
  yinYangBalance: BaZiYinYangBalance;
  currentLuckPillar: BaZiCurrentLuckPillar | null;
}

// Narrative types

export interface NarrativeRequest {
  westernZodiac: { sign: string; element: string; modality: string };
  chineseZodiac: {
    animal: string;
    yearPillar: ChinesePillar;
    monthPillar: ChinesePillar;
    dayPillar: ChinesePillar;
  };
  dayMaster: { element: string; polarity: string };
  bigFive?: { o: number; c: number; e: number; a: number; n: number };
  enneagram?: { primaryType: number; primaryName: string; coreFear: string; coreDesire: string; growthDirection: string; suggestion?: number };
  mbti?: string;
  bazi?: {
    tenGods: Record<string, string>;
    elementalBalance: {
      percentages: Record<string, number>;
      dominant: string[];
      scarce: string[];
      absent: string[];
    };
    luckPillars: {
      startingAge: number;
      isForward: boolean;
      pillars: Array<{
        age: number;
        stem: { name: string; element: string; polarity: string };
        branch: { name: string; element: string };
        naYin: string;
      }>;
    };
    naYin: { year: string; month: string; day: string };
    branchRelationships?: BaZiBranchRelationships;
    dayMasterStrength?: BaZiDayMasterStrength;
    yinYangBalance?: BaZiYinYangBalance;
    // Flattened shape for the API payload — pillar fields inlined with narrowed stem/branch
    currentLuckPillar?: {
      age: number;
      stem: { name: string; element: string; polarity: string };
      branch: { name: string; element: string };
      naYin: string;
      ageInPillar: number;
    } | null;
  };
}
