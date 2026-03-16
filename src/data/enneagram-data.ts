import { EnneagramCenter, EnneagramType, EnneagramConfirmCard } from "@/lib/types";

export const ENNEAGRAM_CENTERS: EnneagramCenter[] = [
  {
    id: "gut",
    name: "Body",
    types: [8, 9, 1],
    description:
      "You lead with instinct. Your first response to the world is physical — a gut reaction. You know what's right before you can explain why, and your challenge is what to do with that certainty.",
  },
  {
    id: "heart",
    name: "Heart",
    types: [2, 3, 4],
    description:
      "You lead with feeling. Your first response to the world is emotional. You're tuned to how others see you and how you see yourself, and your challenge is finding who you are beneath those reflections.",
  },
  {
    id: "head",
    name: "Head",
    types: [5, 6, 7],
    description:
      "You lead with thinking. Your first response to the world is to analyze, question, or plan. You need to understand before you act, and your challenge is trusting that you know enough to move forward.",
  },
];

export const ENNEAGRAM_TYPES: EnneagramType[] = [
  // Gut center
  {
    number: 8,
    name: "The Challenger",
    centerId: "gut",
    description:
      "You move through the world with force and clarity. You protect what matters and refuse to be controlled.",
    coreFear: "Being harmed or controlled by others",
    coreDesire: "To protect yourself and determine your own path",
    growthDirection: "Toward vulnerability and tenderness (moves to 2)",
    label: "Fierce protector",
  },
  {
    number: 9,
    name: "The Peacemaker",
    centerId: "gut",
    description:
      "You create harmony wherever you go. You see every side and hold space for all of them.",
    coreFear: "Loss and separation, being shut out",
    coreDesire: "Inner stability and peace of mind",
    growthDirection: "Toward decisive action and self-assertion (moves to 3)",
    label: "Still water that runs deep",
  },
  {
    number: 1,
    name: "The Reformer",
    centerId: "gut",
    description:
      "You hold yourself to a high standard and feel a quiet responsibility to make things right.",
    coreFear: "Being corrupt, evil, or defective",
    coreDesire: "To be good, to have integrity, to be balanced",
    growthDirection: "Toward spontaneity and joyful acceptance (moves to 7)",
    label: "Quiet flame of integrity",
  },
  // Heart center
  {
    number: 2,
    name: "The Helper",
    centerId: "heart",
    description:
      "You feel others' needs as clearly as your own. Your warmth draws people in and holds them close.",
    coreFear: "Being unwanted or unworthy of love",
    coreDesire: "To feel loved and needed",
    growthDirection: "Toward self-care and honest self-recognition (moves to 4)",
    label: "Warmth that holds the room",
  },
  {
    number: 3,
    name: "The Achiever",
    centerId: "heart",
    description:
      "You shape yourself into what the moment needs. You move toward goals with focus and natural charm.",
    coreFear: "Being worthless or without inherent value",
    coreDesire: "To feel valuable and worthwhile",
    growthDirection: "Toward authenticity and cooperation (moves to 6)",
    label: "Light that refuses to dim",
  },
  {
    number: 4,
    name: "The Individualist",
    centerId: "heart",
    description:
      "You feel the full depth of human experience. What others skim, you dive into completely.",
    coreFear: "Having no identity or personal significance",
    coreDesire: "To find yourself and your significance",
    growthDirection: "Toward grounded action and equanimity (moves to 1)",
    label: "Depth the world rarely sees",
  },
  // Head center
  {
    number: 5,
    name: "The Investigator",
    centerId: "head",
    description:
      "You observe the world with clarity and precision. You gather knowledge like armor against uncertainty.",
    coreFear: "Being useless, helpless, or incapable",
    coreDesire: "To be capable and competent",
    growthDirection: "Toward confidence and decisive engagement (moves to 8)",
    label: "Mind like still water",
  },
  {
    number: 6,
    name: "The Loyalist",
    centerId: "head",
    description:
      "You see what could go wrong before anyone else does. Your loyalty runs deep once trust is built.",
    coreFear: "Being without support or guidance",
    coreDesire: "To have security and support",
    growthDirection: "Toward inner calm and relaxed optimism (moves to 9)",
    label: "Steadfast through the storm",
  },
  {
    number: 7,
    name: "The Enthusiast",
    centerId: "head",
    description:
      "You chase experience and possibility with infectious energy. The world is a buffet and you want to taste it all.",
    coreFear: "Being deprived or trapped in pain",
    coreDesire: "To be satisfied and content",
    growthDirection: "Toward focus and depth of experience (moves to 5)",
    label: "Spark that lights the room",
  },
];

// Confirmation swipe cards — 4 per center, designed to discriminate between the 3 types
// Convention: right swipe = leans toward rightType

export const ENNEAGRAM_CONFIRM_CARDS: Record<string, EnneagramConfirmCard[]> = {
  gut: [
    {
      id: "gut-c1",
      centerId: "gut",
      rightType: 8,
      prompt: "When something feels wrong...",
      leftLabel: "You hold back and keep the peace",
      rightLabel: "You confront it head-on",
      leftDragLabel: "Hold back",
      rightDragLabel: "Confront",
    },
    {
      id: "gut-c2",
      centerId: "gut",
      rightType: 1,
      prompt: "What drives you more?",
      leftLabel: "Keeping things comfortable and easy",
      rightLabel: "Making things correct and fair",
      leftDragLabel: "Comfort",
      rightDragLabel: "Correctness",
    },
    {
      id: "gut-c3",
      centerId: "gut",
      rightType: 9,
      prompt: "In a group disagreement...",
      leftLabel: "You take a strong stance",
      rightLabel: "You see merit in every side",
      leftDragLabel: "Strong stance",
      rightDragLabel: "Every side",
    },
    {
      id: "gut-c4",
      centerId: "gut",
      rightType: 8,
      prompt: "Power to you means...",
      leftLabel: "Having inner discipline and principles",
      rightLabel: "Having the strength to protect what matters",
      leftDragLabel: "Discipline",
      rightDragLabel: "Strength",
    },
  ],
  heart: [
    {
      id: "heart-c1",
      centerId: "heart",
      rightType: 2,
      prompt: "You feel most alive when...",
      leftLabel: "You've expressed something deeply personal",
      rightLabel: "You've made someone feel truly cared for",
      leftDragLabel: "Express",
      rightDragLabel: "Care for",
    },
    {
      id: "heart-c2",
      centerId: "heart",
      rightType: 3,
      prompt: "What matters more?",
      leftLabel: "Being understood for who you really are",
      rightLabel: "Being recognized for what you've accomplished",
      leftDragLabel: "Understood",
      rightDragLabel: "Recognized",
    },
    {
      id: "heart-c3",
      centerId: "heart",
      rightType: 4,
      prompt: "When you feel unseen...",
      leftLabel: "You work harder to prove your worth",
      rightLabel: "You withdraw into your inner world",
      leftDragLabel: "Prove worth",
      rightDragLabel: "Withdraw",
    },
    {
      id: "heart-c4",
      centerId: "heart",
      rightType: 2,
      prompt: "Your instinct in relationships...",
      leftLabel: "You shape yourself to what's needed",
      rightLabel: "You give generously without being asked",
      leftDragLabel: "Adapt",
      rightDragLabel: "Give",
    },
  ],
  head: [
    {
      id: "head-c1",
      centerId: "head",
      rightType: 5,
      prompt: "When facing the unknown...",
      leftLabel: "You leap in and figure it out",
      rightLabel: "You research until you feel prepared",
      leftDragLabel: "Leap in",
      rightDragLabel: "Research",
    },
    {
      id: "head-c2",
      centerId: "head",
      rightType: 7,
      prompt: "Discomfort makes you...",
      leftLabel: "Prepare for worst-case scenarios",
      rightLabel: "Seek something more exciting",
      leftDragLabel: "Prepare",
      rightDragLabel: "Seek",
    },
    {
      id: "head-c3",
      centerId: "head",
      rightType: 6,
      prompt: "You trust most...",
      leftLabel: "Your own observations and analysis",
      rightLabel: "A proven system or trusted authority",
      leftDragLabel: "Own analysis",
      rightDragLabel: "Trusted system",
    },
    {
      id: "head-c4",
      centerId: "head",
      rightType: 5,
      prompt: "Your energy is best spent...",
      leftLabel: "Building connections and experiences",
      rightLabel: "Going deep into what fascinates you",
      leftDragLabel: "Breadth",
      rightDragLabel: "Depth",
    },
  ],
};
