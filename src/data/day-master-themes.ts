export interface DayMasterTheme {
  name: string;
  gradient: string;
  accentColor: string;
  particleColor: string;
  fogColor: string;
}

export const DAY_MASTER_THEMES: Record<string, DayMasterTheme> = {
  "Yang Wood": {
    name: "Towering Ancient Forest",
    gradient: "radial-gradient(ellipse at 50% 40%, #1a3a2a 0%, #0d2818 40%, #061a0e 70%, #030f08 100%)",
    accentColor: "#4a9e6a",
    particleColor: "#6abf8a",
    fogColor: "rgba(16, 60, 36, 0.4)",
  },
  "Yin Wood": {
    name: "Delicate Garden",
    gradient: "radial-gradient(ellipse at 50% 40%, #1e3828 0%, #152e1e 40%, #0c2014 70%, #06130a 100%)",
    accentColor: "#7bc48e",
    particleColor: "#a3d9b2",
    fogColor: "rgba(30, 70, 45, 0.35)",
  },
  "Yang Fire": {
    name: "Blazing Sunlit City",
    gradient: "radial-gradient(ellipse at 50% 30%, #4a2010 0%, #351508 40%, #200e06 70%, #140804 100%)",
    accentColor: "#e87040",
    particleColor: "#f0a070",
    fogColor: "rgba(80, 30, 10, 0.4)",
  },
  "Yin Fire": {
    name: "Candlelit Night",
    gradient: "radial-gradient(ellipse at 50% 50%, #2a1830 0%, #1e1028 40%, #140a20 70%, #0a0614 100%)",
    accentColor: "#d4944a",
    particleColor: "#e8b87a",
    fogColor: "rgba(50, 25, 50, 0.4)",
  },
  "Yang Earth": {
    name: "Grand Mountain Plateau",
    gradient: "radial-gradient(ellipse at 50% 40%, #3a2a18 0%, #2a1e10 40%, #1a1208 70%, #100a04 100%)",
    accentColor: "#c49a5a",
    particleColor: "#d4b480",
    fogColor: "rgba(60, 40, 20, 0.4)",
  },
  "Yin Earth": {
    name: "Rolling Farmland",
    gradient: "radial-gradient(ellipse at 50% 45%, #2e2a1a 0%, #222010 40%, #18160a 70%, #0e0c06 100%)",
    accentColor: "#a8946a",
    particleColor: "#c4b890",
    fogColor: "rgba(50, 45, 25, 0.35)",
  },
  "Yang Metal": {
    name: "Crystalline Cityscape",
    gradient: "radial-gradient(ellipse at 50% 35%, #1a2030 0%, #121828 40%, #0a1020 70%, #060a14 100%)",
    accentColor: "#8ab0d0",
    particleColor: "#b0d0e8",
    fogColor: "rgba(20, 30, 50, 0.4)",
  },
  "Yin Metal": {
    name: "Moonlit Silver",
    gradient: "radial-gradient(ellipse at 50% 40%, #22202e 0%, #181624 40%, #10101c 70%, #080810 100%)",
    accentColor: "#a8a0c8",
    particleColor: "#c8c0e0",
    fogColor: "rgba(30, 28, 50, 0.35)",
  },
  "Yang Water": {
    name: "Ocean Storm",
    gradient: "radial-gradient(ellipse at 50% 45%, #0a2030 0%, #081828 40%, #041018 70%, #020a10 100%)",
    accentColor: "#4a90b0",
    particleColor: "#70b0d0",
    fogColor: "rgba(10, 30, 50, 0.4)",
  },
  "Yin Water": {
    name: "Misty Lake",
    gradient: "radial-gradient(ellipse at 50% 50%, #141e28 0%, #0e1820 40%, #0a1218 70%, #060c10 100%)",
    accentColor: "#7aaac0",
    particleColor: "#a0c8d8",
    fogColor: "rgba(20, 35, 45, 0.35)",
  },
};
