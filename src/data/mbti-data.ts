import { MBTIDimension } from "@/lib/types";

export const MBTI_DIMENSIONS: MBTIDimension[] = [
  {
    key: "EI",
    left: "E",
    right: "I",
    leftLabel: "Energy from others",
    rightLabel: "Energy from within",
  },
  {
    key: "SN",
    left: "S",
    right: "N",
    leftLabel: "Trust what is",
    rightLabel: "Trust what could be",
  },
  {
    key: "TF",
    left: "T",
    right: "F",
    leftLabel: "Decide with logic",
    rightLabel: "Decide with heart",
  },
  {
    key: "JP",
    left: "J",
    right: "P",
    leftLabel: "Prefer a plan",
    rightLabel: "Prefer to adapt",
  },
];

export const MBTI_TYPE_DESCRIPTIONS: Record<string, string> = {
  ISTJ: "A quiet guardian of structure and detail, finding deep satisfaction in doing what's right and doing it well.",
  ISFJ: "A devoted protector who notices what others need before they ask, weaving warmth into the fabric of daily life.",
  INFJ: "A quiet visionary who sees beneath the surface, driven by deep convictions and a need to make meaning.",
  INTJ: "An independent architect of ideas, building intricate systems in the mind and bringing them to life with precision.",
  ISTP: "A calm analyst who understands how things work by taking them apart, thriving in the space between thought and action.",
  ISFP: "A gentle artist of experience, moving through the world with quiet intensity and an eye for hidden beauty.",
  INFP: "A dreamer guided by an inner compass, seeking authenticity and depth in everything and everyone.",
  INTP: "A restless thinker exploring the architecture of ideas, happiest when unraveling a puzzle no one else has noticed.",
  ESTP: "A bold improviser who reads the room instantly, turning every moment into an opportunity for action.",
  ESFP: "A radiant performer who brings joy wherever they go, living fully in the present with contagious energy.",
  ENFP: "A warm explorer of possibilities, connecting people and ideas with infectious enthusiasm.",
  ENTP: "A spirited challenger who loves to turn ideas upside down, thriving on debate and the thrill of what's next.",
  ESTJ: "A decisive organizer who gets things done, building order from chaos with confidence and follow-through.",
  ESFJ: "A generous host of community, creating belonging through care, tradition, and an instinct for what people need.",
  ENFJ: "A natural catalyst who draws out the best in others, leading with empathy and an unwavering belief in potential.",
  ENTJ: "A commanding strategist who sees the big picture and moves boldly toward it, inspiring others to rise to the challenge.",
};
