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
}

export type SwipeDirection = "left" | "right";

export interface SwipeResponse {
  cardId: string;
  direction: SwipeDirection;
}
