import { WesternZodiacResult } from "./types";

interface ZodiacSign {
  sign: string;
  element: string;
  modality: string;
  startMonth: number;
  startDay: number;
}

const SIGNS: ZodiacSign[] = [
  { sign: "Capricorn", element: "Earth", modality: "Cardinal", startMonth: 12, startDay: 22 },
  { sign: "Aquarius", element: "Air", modality: "Fixed", startMonth: 1, startDay: 20 },
  { sign: "Pisces", element: "Water", modality: "Mutable", startMonth: 2, startDay: 19 },
  { sign: "Aries", element: "Fire", modality: "Cardinal", startMonth: 3, startDay: 21 },
  { sign: "Taurus", element: "Earth", modality: "Fixed", startMonth: 4, startDay: 20 },
  { sign: "Gemini", element: "Air", modality: "Mutable", startMonth: 5, startDay: 21 },
  { sign: "Cancer", element: "Water", modality: "Cardinal", startMonth: 6, startDay: 21 },
  { sign: "Leo", element: "Fire", modality: "Fixed", startMonth: 7, startDay: 23 },
  { sign: "Virgo", element: "Earth", modality: "Mutable", startMonth: 8, startDay: 23 },
  { sign: "Libra", element: "Air", modality: "Cardinal", startMonth: 9, startDay: 23 },
  { sign: "Scorpio", element: "Water", modality: "Fixed", startMonth: 10, startDay: 23 },
  { sign: "Sagittarius", element: "Fire", modality: "Mutable", startMonth: 11, startDay: 22 },
];

export function getWesternZodiac(month: number, day: number): WesternZodiacResult {
  // Iterate in reverse: find the last sign whose start date is <= the given date
  // Special handling: Capricorn starts Dec 22, wraps to Jan 19
  for (let i = SIGNS.length - 1; i >= 0; i--) {
    const s = SIGNS[i];
    if (month > s.startMonth || (month === s.startMonth && day >= s.startDay)) {
      return { sign: s.sign, element: s.element, modality: s.modality };
    }
  }
  // If no sign matched (Jan 1–19), it's Capricorn
  return { sign: SIGNS[0].sign, element: SIGNS[0].element, modality: SIGNS[0].modality };
}
