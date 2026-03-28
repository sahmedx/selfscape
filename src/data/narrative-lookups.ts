// Static lookup tables for narrative pre-digestion.
// These provide plain-language interpretive context so the LLM
// doesn't have to derive meaning from raw data.

// Maps Day Master heavenly stem to a poetic description that seeds the anchoring metaphor.
export const DAY_MASTER_DESCRIPTIONS: Record<string, string> = {
  "Jiǎ":  "Yang Wood: the tall tree, the oak. Upright, ambitious, reaching for light, rigid under pressure.",
  "Yǐ":   "Yin Wood: the vine, the wildflower. Flexible, adaptive, gentle persistence, finds a way around any obstacle.",
  "Bǐng": "Yang Fire: the sun. Radiant, generous, impossible to ignore, burns everything it touches with equal warmth.",
  "Dīng": "Yin Fire: the candle flame. Warm, precise, illuminating, vulnerable to wind but capable of lighting a whole room.",
  "Wù":   "Yang Earth: the mountain. Immovable, stable, reliable, massive. The thing everything else is built on.",
  "Jǐ":   "Yin Earth: the garden soil. Nurturing, fertile, quietly productive. Grows things without needing credit.",
  "Gēng": "Yang Metal: the axe, the raw ore. Sharp, principled, unyielding, cuts through ambiguity.",
  "Xīn":  "Yin Metal: the jewel, the silver mirror. Refined, sensitive, reflective, beautiful and easily scratched.",
  "Rén":  "Yang Water: the ocean, the great river. Expansive, restless, ambitious, deep beyond sounding.",
  "Guǐ":  "Yin Water: the rain, the dew, the mist. Gentle, intuitive, nourishing, quietly persistent.",
};

// Central inner conflict per Enneagram type.
export const ENNEAGRAM_TENSIONS: Record<number, string> = {
  1: "The tension between the need for moral perfection and the impossibility of achieving it without becoming rigid.",
  2: "The tension between genuine care for others and the unacknowledged need to be needed.",
  3: "The tension between authentic self and the performing self that knows exactly what the room wants.",
  4: "The tension between longing for what is missing and the inability to fully inhabit what is present.",
  5: "The tension between the desire to understand everything and the fear that engagement will deplete what little energy there is.",
  6: "The tension between seeking security and the awareness that no amount of preparation eliminates uncertainty.",
  7: "The tension between the hunger for experience and the avoidance of the pain that gives experience its depth.",
  8: "The tension between the need to be strong and the vulnerability that strength is built to protect.",
  9: "The tension between the desire for peace and the self-erasure that false peace requires.",
};

// Maps each Ten God to its functional category and meaning.
export const TEN_GOD_CATEGORIES: Record<string, { category: string; meaning: string }> = {
  "Companion":       { category: "Self",      meaning: "peer energy, independence, self-reliance" },
  "Rob Wealth":      { category: "Self",      meaning: "competition, assertiveness, taking initiative" },
  "Eating God":      { category: "Output",    meaning: "creative expression, giving, producing, gentle output" },
  "Hurting Officer": { category: "Output",    meaning: "sharp expression, unconventional output, challenging authority" },
  "Direct Wealth":   { category: "Wealth",    meaning: "stable income, tangible resources, practical gains" },
  "Indirect Wealth": { category: "Wealth",    meaning: "unexpected gains, side income, resourcefulness" },
  "Direct Officer":  { category: "Authority", meaning: "structure, discipline, conventional success, external recognition" },
  "Seven Killings":  { category: "Authority", meaning: "intense pressure, high standards, demanding environments, transformation" },
  "Direct Resource":   { category: "Resource",  meaning: "nourishment, support, learning, mentorship, being cared for" },
  "Indirect Resource": { category: "Resource",  meaning: "unconventional learning, self-taught knowledge, hidden support" },
};

// What each pillar position represents in a person's life.
export const PILLAR_POSITIONS: Record<string, string> = {
  "year_stem":   "social persona, inherited traits, early environment",
  "year_branch": "family of origin, ancestral energy, early childhood",
  "month_stem":  "career, social role, how the world sees you",
  "month_branch":"work environment, peers, social expectations",
  "day_stem":    "core self (Day Master)",
  "day_branch":  "spouse palace, closest relationships, inner emotional life",
};

// Five element productive and controlling cycles.
export const ELEMENT_CYCLES: Record<string, { producedBy: string; produces: string; controlledBy: string; controls: string }> = {
  "Wood":  { producedBy: "Water", produces: "Fire",  controlledBy: "Metal", controls: "Earth" },
  "Fire":  { producedBy: "Wood",  produces: "Earth", controlledBy: "Water", controls: "Metal" },
  "Earth": { producedBy: "Fire",  produces: "Metal", controlledBy: "Wood",  controls: "Water" },
  "Metal": { producedBy: "Earth", produces: "Water", controlledBy: "Fire",  controls: "Wood" },
  "Water": { producedBy: "Metal", produces: "Wood",  controlledBy: "Earth", controls: "Fire" },
};
