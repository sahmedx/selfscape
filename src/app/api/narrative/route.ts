import Anthropic from "@anthropic-ai/sdk";
import { NarrativeRequest } from "@/lib/types";

const SYSTEM_PROMPT = `You are writing a short personality profile for a single person based on the following inputs:

A fully calculated BaZi chart including day master, three pillars, hidden stems, ten gods, elemental balance, and luck pillars
Western zodiac sun sign
Enneagram type
Myers-Briggs type
Big Five traits

Your job is to synthesize these systems into a single coherent portrait -- not list them back. The BaZi chart is the backbone. It provides the elemental identity, the relational dynamics (ten gods), and the life arc (luck pillars). The other systems texture and confirm what the chart already suggests.
Each section should feel like it could only have been written about this specific combination. If a section could apply to anyone, rewrite it.

Structure
Write six sections using these exact labels, verbatim:

**Your Portrait** -- a two to three sentence opening summary. Grounded and specific. This is the thesis of the whole profile.
**What Drives You** -- the core motivation. Draw on the day master element, Enneagram type, and dominant or absent elements in the chart.
**How You Think** -- cognitive style and decision-making. Draw on MBTI, Big Five, and output or resource ten gods in the chart.
**Relationship Style** -- how they show up with others. Reference the Spouse Palace branch if notable, relational ten gods, and Western zodiac where it adds texture.
**Internal Conflict** -- one or two sentences naming the central tension this combination produces. Look for it in elemental imbalances, conflicting ten gods, or the gap between the natal chart and the current luck pillar.
**Misread As** -- how this person is commonly misperceived, and what is actually true underneath.

On luck pillars
If the person's current age falls within a luck pillar that introduces a new element or ten god not present in the natal chart, note what is opening up for them in the relevant section. This is what gives the profile a sense of timing -- not just who someone is, but what is becoming available now.

Voice and style

Second person throughout ("you," not "they")
Short sentences. Two to three sentences per section maximum. No sentence should exceed 20 words.
Use these exact labels as written above. Do not rename, reword, or reorder them.
No closing affirmation or reframe -- end on "Misread As"
Plainspoken and direct. Insight over atmosphere.
Total length: roughly 150-180 words

Constraints

Do not use emdashes
Do not use any of the following phrases: "The real question is," "Here's the thing nobody is talking about," "That's the real story here," "But here's the catch," "Here's the thing most people miss," "What most people miss," "But here's what nobody is saying," "It's not just about X, it's about Y," "The reality is," "This is where it gets interesting"

If any of the inputs are missing, still write the profile using whatever data is available. Adapt the synthesis to work with fewer systems.`;

function buildUserMessage(data: NarrativeRequest): string {
  const parts: string[] = [];

  parts.push(`Western Zodiac: ${data.westernZodiac.sign} (${data.westernZodiac.element}, ${data.westernZodiac.modality})`);
  parts.push(`Chinese Zodiac: ${data.chineseZodiac.animal}`);
  parts.push(`Day Master: ${data.dayMaster.polarity} ${data.dayMaster.element}`);
  parts.push(`Year Pillar: ${data.chineseZodiac.yearPillar.stemPolarity} ${data.chineseZodiac.yearPillar.stemElement} ${data.chineseZodiac.yearPillar.branch}`);
  parts.push(`Month Pillar: ${data.chineseZodiac.monthPillar.stemPolarity} ${data.chineseZodiac.monthPillar.stemElement} ${data.chineseZodiac.monthPillar.branch}`);
  parts.push(`Day Pillar: ${data.chineseZodiac.dayPillar.stemPolarity} ${data.chineseZodiac.dayPillar.stemElement} ${data.chineseZodiac.dayPillar.branch}`);

  if (data.bigFive) {
    const { o, c, e, a, n } = data.bigFive;
    parts.push(`Big Five scores (scale -2 to +2): Openness=${o}, Conscientiousness=${c}, Extraversion=${e}, Agreeableness=${a}, Neuroticism=${n}`);
  }

  if (data.enneagram) {
    let line = `Enneagram: Type ${data.enneagram.primaryType} (${data.enneagram.primaryName})`;
    if (data.enneagram.suggestion) {
      line += `, with wing toward Type ${data.enneagram.suggestion}`;
    }
    line += `. Core fear: ${data.enneagram.coreFear}. Core desire: ${data.enneagram.coreDesire}. Growth direction: ${data.enneagram.growthDirection}`;
    parts.push(line);
  }

  if (data.mbti) {
    parts.push(`MBTI: ${data.mbti}`);
  }

  if (data.bazi) {
    // Elemental balance
    const pct = data.bazi.elementalBalance.percentages;
    parts.push(`Elemental balance: Wood ${pct.Wood}%, Fire ${pct.Fire}%, Earth ${pct.Earth}%, Metal ${pct.Metal}%, Water ${pct.Water}%`);
    if (data.bazi.elementalBalance.dominant.length > 0) {
      parts.push(`Dominant elements: ${data.bazi.elementalBalance.dominant.join(', ')}`);
    }
    if (data.bazi.elementalBalance.scarce.length > 0) {
      parts.push(`Scarce elements: ${data.bazi.elementalBalance.scarce.join(', ')}`);
    }
    if (data.bazi.elementalBalance.absent.length > 0) {
      parts.push(`Absent elements: ${data.bazi.elementalBalance.absent.join(', ')}`);
    }

    // Ten gods
    const gods = data.bazi.tenGods;
    const godEntries = Object.entries(gods)
      .filter(([, v]) => v !== 'Day Master')
      .map(([k, v]) => `${k}: ${v}`);
    parts.push(`Ten Gods: ${godEntries.join(', ')}`);

    // Na Yin
    parts.push(`Na Yin: Year=${data.bazi.naYin.year}, Month=${data.bazi.naYin.month}, Day=${data.bazi.naYin.day}`);

    // Luck pillars (first 4 for brevity)
    const lp = data.bazi.luckPillars;
    const lpSummary = lp.pillars.slice(0, 4).map(p => `Age ${p.age}: ${p.stem.element} ${p.branch.name} (${p.naYin})`).join('; ');
    parts.push(`Luck pillars (${lp.isForward ? 'forward' : 'backward'}): ${lpSummary}`);
  }

  return parts.join("\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const data: NarrativeRequest = await request.json();
  const client = new Anthropic({ apiKey });

  const stream = await client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserMessage(data) }],
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
