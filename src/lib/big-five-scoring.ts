import {
  BigFiveCardData,
  BigFiveScores,
  BigFiveDimension,
  BigFiveDimensionKey,
  SwipeResponse,
} from "./types";

const DIMENSION_NAMES: Record<BigFiveDimensionKey, string> = {
  o: "Openness",
  c: "Conscientiousness",
  e: "Extraversion",
  a: "Agreeableness",
  n: "Neuroticism",
};

const LABELS: Record<BigFiveDimensionKey, Record<number, string>> = {
  o: { 2: "Boundlessly curious", 1: "Leaning curious", 0: "Balanced", [-1]: "Leaning grounded", [-2]: "Deeply grounded" },
  c: { 2: "Deliberately structured", 1: "Leaning structured", 0: "Balanced", [-1]: "Leaning spontaneous", [-2]: "Freely spontaneous" },
  e: { 2: "Energized by connection", 1: "Leaning outward", 0: "Balanced", [-1]: "Leaning inward", [-2]: "Powered by solitude" },
  a: { 2: "Naturally trusting", 1: "Leaning trusting", 0: "Balanced", [-1]: "Leaning independent", [-2]: "Fiercely independent" },
  n: { 2: "Deeply feeling", 1: "Leaning feeling", 0: "Balanced", [-1]: "Leaning steady", [-2]: "Unshakably steady" },
};

const LEVELS: Record<number, BigFiveDimension["level"]> = {
  2: "high",
  1: "moderate-high",
  0: "moderate",
  [-1]: "moderate-low",
  [-2]: "low",
};

export function scoreBigFive(
  cards: BigFiveCardData[],
  responses: SwipeResponse[]
): BigFiveScores {
  const scores: BigFiveScores = { o: 0, c: 0, e: 0, a: 0, n: 0 };

  for (const response of responses) {
    const card = cards.find((c) => c.id === response.cardId);
    if (!card) continue;
    scores[card.dimension] += response.direction === "right" ? 1 : -1;
  }

  return scores;
}

export function getBigFiveProfile(scores: BigFiveScores): BigFiveDimension[] {
  const keys: BigFiveDimensionKey[] = ["o", "c", "e", "a", "n"];

  return keys.map((key) => ({
    key,
    name: DIMENSION_NAMES[key],
    score: scores[key],
    level: LEVELS[scores[key]] ?? "moderate",
    label: LABELS[key][scores[key]] ?? "Balanced",
  }));
}
