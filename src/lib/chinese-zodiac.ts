import { ChineseZodiacResult } from "./types";
import { LUNAR_NEW_YEAR } from "@/data/lunar-new-year";

const ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
];

export function getChineseZodiac(year: number, month: number, day: number): ChineseZodiacResult {
  let effectiveYear = year;

  const lny = LUNAR_NEW_YEAR[year];
  if (lny) {
    const [lnyMonth, lnyDay] = lny;
    if (month < lnyMonth || (month === lnyMonth && day < lnyDay)) {
      effectiveYear = year - 1;
    }
  }

  const animalIndex = ((effectiveYear - 4) % 12 + 12) % 12;
  return { animal: ANIMALS[animalIndex] };
}
