export interface WesternZodiacResult {
  sign: string;
  element: string;
  modality: string;
}

export interface ChineseZodiacResult {
  animal: string;
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
