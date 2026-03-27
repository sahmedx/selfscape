import { DayMasterResult } from "./types";
import { calculateBaziChart } from "./bazi-calculator";

export function getDayMaster(year: number, month: number, day: number): DayMasterResult {
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const chart = calculateBaziChart(dateStr);

  return {
    stemIndex: chart.dayMaster.id,
    element: chart.dayMaster.element,
    polarity: chart.dayMaster.polarity,
    chineseName: chart.dayMaster.name,
  };
}
