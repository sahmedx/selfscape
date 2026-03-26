import Anthropic from "@anthropic-ai/sdk";
import { NarrativeRequest } from "@/lib/types";

const SYSTEM_PROMPT = `You are writing a personality portrait for someone. You will receive their results from one or more personality frameworks (Western zodiac, Chinese zodiac/Ba Zi, Big Five, Enneagram, MBTI). Weave together whatever data is available into a single cohesive narrative. Do not list frameworks separately — find the threads that connect them and tell the person who they are in a way that feels both true and surprising. Write in second person ("You..."). Be specific and concrete, not vague. Use literary language but stay grounded. If only zodiac data is available, craft a compelling portrait from that alone. The last line should be a single memorable sentence that captures their essence. Keep it between 100 and 200 words.`;

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
    parts.push(line);
  }

  if (data.mbti) {
    parts.push(`MBTI: ${data.mbti}`);
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
    model: "claude-sonnet-4-20250514",
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
