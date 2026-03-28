// Deterministic summary generators for narrative pre-digestion.
// Each function takes computed data and returns a plain-language string.
// No LLM calls. Pure string building.

import type { BigFiveDimension, BaZiStem, BaZiLuckPillar, BaZiCurrentLuckPillar, BaZiDayMasterStrength, BaZiBranchRelationships } from "./types";
import {
  TEN_GOD_CATEGORIES,
  PILLAR_POSITIONS,
  ELEMENT_CYCLES,
} from "@/data/narrative-lookups";
import { getTenGod } from "./bazi-calculator";

// ----------------------------------------------------------------
// Ten Gods Summary
// ----------------------------------------------------------------

export function generateTenGodsSummary(
  tenGods: Record<string, string>
): string {
  const categoryCounts: Record<string, number> = { Self: 0, Output: 0, Wealth: 0, Authority: 0, Resource: 0 };
  const positionDetails: string[] = [];

  for (const [position, god] of Object.entries(tenGods)) {
    if (god === "Day Master") continue;
    const info = TEN_GOD_CATEGORIES[god];
    if (!info) continue;
    categoryCounts[info.category]++;

    // Flag notable placements
    if (god === "Seven Killings" && position === "month_stem") {
      positionDetails.push("Seven Killings in the Month Stem brings intense external pressure from career and social environments");
    }
    if (god === "Rob Wealth" && position === "day_branch") {
      positionDetails.push("Rob Wealth in the Day Branch suggests competition or tension in closest relationships");
    }
    if (god === "Hurting Officer") {
      const posLabel = PILLAR_POSITIONS[position];
      if (posLabel) {
        positionDetails.push(`Hurting Officer in ${position.replace("_", " ")} (${posLabel}) brings unconventional expression and friction with authority`);
      }
    }
  }

  const parts: string[] = [];

  // Dominant category
  const sorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const [topCat, topCount] = sorted[0];
  if (topCount >= 3) {
    const meaning = topCat === "Self" ? "independence and self-reliance"
      : topCat === "Output" ? "producing, expressing, and giving"
      : topCat === "Wealth" ? "acquiring resources and tangible results"
      : topCat === "Authority" ? "structure, discipline, and external pressure"
      : "learning, absorption, and being supported";
    parts.push(`This chart is dominated by ${topCat} energy (${topCount} placements), meaning the person is oriented toward ${meaning}.`);
  } else if (topCount >= 2) {
    parts.push(`${topCat} energy is the strongest theme (${topCount} placements).`);
  }

  // Absent categories
  const absent = sorted.filter(([, c]) => c === 0).map(([cat]) => cat);
  if (absent.length > 0) {
    for (const cat of absent) {
      const meaning = cat === "Resource" ? "no natural replenishment cycle — gives from reserves rather than overflow"
        : cat === "Wealth" ? "resources are not naturally attracted — must be actively created"
        : cat === "Output" ? "expression does not come easily — energy turns inward"
        : cat === "Authority" ? "little external pressure or structure — self-directed"
        : "limited peer support — operates independently";
      parts.push(`${cat} energy is completely absent: ${meaning}.`);
    }
  }

  // Notable placements
  parts.push(...positionDetails.slice(0, 2).map(d => d + "."));

  return parts.join(" ");
}

// ----------------------------------------------------------------
// Element Story
// ----------------------------------------------------------------

export function generateElementStory(
  dayMasterElement: string,
  elementBalance: {
    percentages: Record<string, number>;
    dominant: string[];
    scarce: string[];
    absent: string[];
  }
): string {
  const cycle = ELEMENT_CYCLES[dayMasterElement];
  if (!cycle) return "";

  const parts: string[] = [];

  // What feeds the Day Master (Resource element)
  const resourceEl = cycle.producedBy;
  if (elementBalance.absent.includes(resourceEl)) {
    parts.push(`${dayMasterElement} is fed by ${resourceEl}, but ${resourceEl} is entirely absent from this chart. The ${dayMasterElement.toLowerCase()} burns without a fuel source.`);
  } else if (elementBalance.scarce.includes(resourceEl)) {
    parts.push(`${dayMasterElement} is fed by ${resourceEl}, but ${resourceEl} is scarce in this chart — limited replenishment.`);
  } else if (elementBalance.dominant.includes(resourceEl)) {
    parts.push(`${dayMasterElement} is well-fed by abundant ${resourceEl}, providing strong natural replenishment.`);
  }

  // What the Day Master produces (Output element)
  const outputEl = cycle.produces;
  if (elementBalance.dominant.includes(outputEl)) {
    parts.push(`${dayMasterElement} produces ${outputEl}, and ${outputEl} is the dominant element here — heavy output energy, the chart is constantly giving.`);
  }

  // What controls the Day Master
  const controlEl = cycle.controlledBy;
  if (elementBalance.dominant.includes(controlEl)) {
    parts.push(`${controlEl} controls ${dayMasterElement} and is dominant — strong external pressure bearing down.`);
  } else if (!elementBalance.absent.includes(controlEl) && !elementBalance.scarce.includes(controlEl)) {
    parts.push(`${controlEl} controls ${dayMasterElement} and is present, bringing some external pressure.`);
  }

  // Absent elements
  const otherAbsent = elementBalance.absent.filter(e => e !== resourceEl);
  if (otherAbsent.length > 0) {
    parts.push(`${otherAbsent.join(" and ")} ${otherAbsent.length === 1 ? "is" : "are"} absent from the chart entirely.`);
  }

  return parts.join(" ");
}

// ----------------------------------------------------------------
// Luck Pillar Narrative
// ----------------------------------------------------------------

export function generateLuckPillarNarrative(
  luckPillars: BaZiLuckPillar[],
  currentLuckPillar: BaZiCurrentLuckPillar | null,
  dayMaster: BaZiStem
): string {
  if (luckPillars.length === 0) return "";

  // Compute Ten God for each luck pillar's stem
  const pillarsWithGods = luckPillars.map(lp => ({
    ...lp,
    stemTenGod: getTenGod(dayMaster, lp.stem),
  }));

  const currentIdx = currentLuckPillar
    ? pillarsWithGods.findIndex(p => p.age === currentLuckPillar.pillar.age)
    : -1;

  const parts: string[] = [];

  // Past pillars
  if (currentIdx > 0) {
    const pastGods = pillarsWithGods.slice(0, currentIdx).map(p => p.stemTenGod);
    const pastCategories = pastGods.map(g => TEN_GOD_CATEGORIES[g]?.category).filter(Boolean);
    const categoryCounts: Record<string, number> = {};
    for (const cat of pastCategories) {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
    const topPast = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
    if (topPast) {
      parts.push(`The earlier decades were shaped primarily by ${topPast[0]} energy.`);
    }
  }

  // Current pillar
  if (currentIdx >= 0) {
    const current = pillarsWithGods[currentIdx];
    const god = current.stemTenGod;
    const category = TEN_GOD_CATEGORIES[god]?.category || "";
    const meaning = TEN_GOD_CATEGORIES[god]?.meaning || "";
    parts.push(`The current pillar (age ${current.age}-${current.age + 9}) brings ${god} energy (${category}: ${meaning}).`);
  }

  // Next pillar
  if (currentIdx >= 0 && currentIdx + 1 < pillarsWithGods.length) {
    const next = pillarsWithGods[currentIdx + 1];
    const god = next.stemTenGod;
    const category = TEN_GOD_CATEGORIES[god]?.category || "";
    parts.push(`The next pillar (age ${next.age}-${next.age + 9}) introduces ${god} (${category}), suggesting a shift ahead.`);
  }

  return parts.join(" ");
}

// ----------------------------------------------------------------
// Branch Relationship Summary
// ----------------------------------------------------------------

export function generateBranchRelationshipSummary(
  branchRelationships: BaZiBranchRelationships
): string {
  const { clashes, harmonies, threeHarmonies, penalties } = branchRelationships;
  if (clashes.length === 0 && harmonies.length === 0 && threeHarmonies.length === 0 && penalties.length === 0) {
    return "";
  }

  const parts: string[] = [];

  for (const clash of clashes) {
    // Format: "Year-Day: Rat-Horse"
    const [positions, animals] = clash.split(": ");
    const [pos1, pos2] = positions.split("-");
    const area1 = pos1 === "Year" ? "family origins/external world" : pos1 === "Month" ? "career/social sphere" : "self/intimate partnerships";
    const area2 = pos2 === "Year" ? "family origins/external world" : pos2 === "Month" ? "career/social sphere" : "self/intimate partnerships";
    parts.push(`The ${animals} clash between ${pos1} and ${pos2} creates tension between ${area1} and ${area2}.`);
  }

  for (const harmony of harmonies) {
    const [positions, animals] = harmony.split(": ");
    const [pos1, pos2] = positions.split("-");
    parts.push(`The ${animals} harmony between ${pos1} and ${pos2} creates natural flow and mutual support.`);
  }

  for (const triangle of threeHarmonies) {
    parts.push(`${triangle} amplifies that element's presence in the chart.`);
  }

  for (const penalty of penalties) {
    if (penalty.startsWith("Group")) {
      parts.push(`${penalty} indicates recurring friction and self-sabotage patterns.`);
    } else {
      parts.push(`${penalty} indicates internal friction in that life area.`);
    }
  }

  return parts.slice(0, 3).join(" ");
}

// ----------------------------------------------------------------
// Big Five Summary
// ----------------------------------------------------------------

const BIG_FIVE_PAIRINGS: Array<{
  condition: (dims: Record<string, BigFiveDimension>) => boolean;
  description: string;
}> = [
  {
    condition: (d) => d.o.score >= 1 && d.e.score <= -1,
    description: "High openness paired with low extraversion: deeply curious but processes internally rather than through social engagement.",
  },
  {
    condition: (d) => d.c.score >= 1 && d.n.score >= 1,
    description: "High conscientiousness paired with high neuroticism: disciplined and structured but driven by anxiety about getting it right.",
  },
  {
    condition: (d) => d.a.score >= 1 && d.n.score <= -1,
    description: "High agreeableness with low neuroticism: a steady, warm presence that absorbs conflict without being destabilized.",
  },
  {
    condition: (d) => d.o.score >= 1 && d.a.score <= -1,
    description: "High openness with low agreeableness: intellectually independent and willing to challenge consensus.",
  },
  {
    condition: (d) => d.o.score <= -1 && d.c.score >= 1,
    description: "Low openness with high conscientiousness: structured, conventional, and deeply reliable.",
  },
  {
    condition: (d) => d.e.score >= 1 && d.n.score >= 1,
    description: "High extraversion with high neuroticism: socially driven but emotionally volatile — the energy swings.",
  },
];

export function generateBigFiveSummary(
  dimensions: BigFiveDimension[]
): string {
  const byKey: Record<string, BigFiveDimension> = {};
  for (const dim of dimensions) {
    byKey[dim.key] = dim;
  }

  // Check for notable pairings
  for (const pairing of BIG_FIVE_PAIRINGS) {
    if (pairing.condition(byKey)) {
      // Add context about the most extreme score
      const extreme = dimensions.filter(d => Math.abs(d.score) === 2);
      if (extreme.length > 0) {
        const ext = extreme[0];
        return `${pairing.description} ${ext.name} is at the extreme (${ext.label}).`;
      }
      return pairing.description;
    }
  }

  // No notable pairing — describe the most extreme dimension
  const extremes = dimensions.filter(d => Math.abs(d.score) === 2);
  if (extremes.length > 0) {
    return extremes.map(d => `${d.name}: ${d.label} (extreme).`).join(" ");
  }

  // All moderate
  const nonZero = dimensions.filter(d => d.score !== 0);
  if (nonZero.length === 0) {
    return "All Big Five dimensions are moderate — a balanced, adaptable personality profile with no strong pulls in any direction.";
  }

  return nonZero.map(d => `${d.name}: ${d.label}.`).join(" ");
}

// ----------------------------------------------------------------
// Master Narrative Summary
// ----------------------------------------------------------------

export function generateNarrativeSummary(params: {
  dayMasterDescription: string;
  elementStory: string;
  tenGodsSummary: string;
  luckPillarNarrative: string;
  branchRelationshipSummary: string;
  bigFiveSummary: string;
  enneagramTension: string;
  mbtiDescription: string;
  westernZodiac: { sign: string; element: string; modality: string };
  dayMasterStrength: BaZiDayMasterStrength;
}): string {
  const parts: string[] = [];

  // Day Master identity
  parts.push(params.dayMasterDescription);

  // Day Master strength
  const strength = params.dayMasterStrength.assessment;
  if (strength === "strong") {
    parts.push("The Day Master is strong — capable of handling pressure and wielding the chart's energies actively.");
  } else if (strength === "weak") {
    parts.push("The Day Master is weak — easily overwhelmed by the chart's demands, needs support and resource to function.");
  } else {
    parts.push("The Day Master is balanced — neither dominant nor depleted, responsive to circumstances.");
  }

  // Element dynamics
  if (params.elementStory) {
    parts.push(params.elementStory);
  }

  // Ten Gods
  if (params.tenGodsSummary) {
    parts.push(params.tenGodsSummary);
  }

  // Enneagram tension
  if (params.enneagramTension) {
    parts.push(`Enneagram: ${params.enneagramTension}`);
  }

  // Big Five + MBTI texture
  if (params.bigFiveSummary) {
    parts.push(params.bigFiveSummary);
  }
  if (params.mbtiDescription) {
    parts.push(`MBTI: ${params.mbtiDescription}`);
  }

  // Western zodiac
  parts.push(`Western zodiac: ${params.westernZodiac.sign} (${params.westernZodiac.element}, ${params.westernZodiac.modality}).`);

  // Luck pillar arc
  if (params.luckPillarNarrative) {
    parts.push(params.luckPillarNarrative);
  }

  // Branch relationships
  if (params.branchRelationshipSummary) {
    parts.push(params.branchRelationshipSummary);
  }

  return parts.join(" ");
}
