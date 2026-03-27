import { ChineseZodiacResult } from "./types";
import { calculateBaziChart } from "./bazi-calculator";

export function getChineseZodiac(
  year: number,
  month: number,
  day: number
): ChineseZodiacResult {
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const chart = calculateBaziChart(dateStr);

  function toPillar(p: typeof chart.pillars.year) {
    return {
      stem: p.stem.name,
      stemElement: p.stem.element,
      stemPolarity: p.stem.polarity,
      branch: p.branch.zodiac,
    };
  }

  return {
    animal: chart.animal,
    year: toPillar(chart.pillars.year),
    month: toPillar(chart.pillars.month),
    day: toPillar(chart.pillars.day),
  };
}
