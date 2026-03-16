import { EnneagramConfirmCard, EnneagramResult, EnneagramType, SwipeResponse } from "./types";
import { ENNEAGRAM_TYPES } from "@/data/enneagram-data";

function getTypeByNumber(num: number): EnneagramType {
  const t = ENNEAGRAM_TYPES.find((t) => t.number === num);
  if (!t) throw new Error(`Unknown Enneagram type: ${num}`);
  return t;
}

export function scoreEnneagram(
  selectedTypeNumber: number,
  confirmCards: EnneagramConfirmCard[],
  confirmResponses: SwipeResponse[]
): EnneagramResult {
  const primaryType = getTypeByNumber(selectedTypeNumber);

  // Count which type each confirmation swipe points toward
  const typeCounts: Record<number, number> = {};
  for (const type of ENNEAGRAM_TYPES.filter((t) => t.centerId === primaryType.centerId)) {
    typeCounts[type.number] = 0;
  }

  for (const response of confirmResponses) {
    const card = confirmCards.find((c) => c.id === response.cardId);
    if (!card) continue;

    if (response.direction === "right") {
      // Right swipe indicates the card's rightType
      typeCounts[card.rightType] = (typeCounts[card.rightType] || 0) + 1;
    } else {
      // Left swipe distributes to the other two types in the center
      const otherTypes = Object.keys(typeCounts)
        .map(Number)
        .filter((n) => n !== card.rightType);
      for (const ot of otherTypes) {
        typeCounts[ot] = (typeCounts[ot] || 0) + 0.5;
      }
    }
  }

  // Find the type most supported by confirmation swipes
  const sortedTypes = Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([num]) => Number(num));

  const topConfirmType = sortedTypes[0];

  // If confirmation agrees with selection, no suggestion
  // If confirmation points elsewhere, suggest that type
  let suggestion: EnneagramType | null = null;
  if (topConfirmType !== selectedTypeNumber) {
    suggestion = getTypeByNumber(topConfirmType);
  }

  return { primaryType, suggestion };
}
