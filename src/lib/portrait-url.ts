// src/lib/portrait-url.ts

import { PortraitData } from "./types";

export function encodePortraitHash(data: PortraitData): string {
  const params = new URLSearchParams();
  params.set("s", data.sunSign.toLowerCase());
  params.set("se", data.sunElement.toLowerCase());
  params.set("yp", `${data.yearPillar.element}-${data.yearPillar.animal}`.toLowerCase());
  params.set("ys", data.yearPillar.stem);
  params.set("ypo", data.yearPillar.polarity.toLowerCase());
  params.set("mp", `${data.monthPillar.element}-${data.monthPillar.animal}`.toLowerCase());
  params.set("ms", data.monthPillar.stem);
  params.set("mpo", data.monthPillar.polarity.toLowerCase());
  params.set("dp", `${data.dayPillar.element}-${data.dayPillar.animal}`.toLowerCase());
  params.set("ds", data.dayPillar.stem);
  params.set("dpo", data.dayPillar.polarity.toLowerCase());
  if (data.enneagramType != null && data.enneagramName) {
    params.set("en", String(data.enneagramType));
    params.set("enn", data.enneagramName);
  }
  if (data.mbtiCode) params.set("mb", data.mbtiCode.toLowerCase());
  if (data.bigFiveScores) {
    const { o, c, e, a, n } = data.bigFiveScores;
    params.set("bf", [o, c, e, a, n].join(","));
  }
  return params.toString();
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function decodePortraitHash(hash: string): PortraitData | null {
  try {
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const sunSign = params.get("s");
    const sunElement = params.get("se");
    const yp = params.get("yp");
    const mp = params.get("mp");
    const dp = params.get("dp");
    if (!sunSign || !sunElement || !yp || !mp || !dp) return null;

    function parsePillar(
      pillarParam: string,
      stemParam: string | null,
      polarityParam: string | null
    ) {
      const [element, animal] = pillarParam.split("-");
      return {
        element: capitalize(element),
        animal: capitalize(animal),
        stem: stemParam ?? "",
        polarity: capitalize(polarityParam ?? ""),
      };
    }

    const data: PortraitData = {
      sunSign: capitalize(sunSign),
      sunElement: capitalize(sunElement),
      yearPillar: parsePillar(yp, params.get("ys"), params.get("ypo")),
      monthPillar: parsePillar(mp, params.get("ms"), params.get("mpo")),
      dayPillar: parsePillar(dp, params.get("ds"), params.get("dpo")),
    };

    const en = params.get("en");
    const enn = params.get("enn");
    if (en && enn) {
      data.enneagramType = parseInt(en, 10);
      data.enneagramName = enn;
    }

    const mb = params.get("mb");
    if (mb) data.mbtiCode = mb.toUpperCase();

    const bf = params.get("bf");
    if (bf) {
      const [o, c, e, a, n] = bf.split(",").map(Number);
      data.bigFiveScores = { o, c, e, a, n };
    }

    return data;
  } catch {
    return null;
  }
}
