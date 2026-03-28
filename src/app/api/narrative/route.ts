import Anthropic from "@anthropic-ai/sdk";
import { NarrativeRequest } from "@/lib/types";

const SYSTEM_PROMPT = `You are writing a personality story that teaches someone how they work. Not a character sketch. Not a personality report. A story that reveals the mechanics underneath the person, so they finish reading and understand something about themselves they didn't before.
 
## What you will receive
 
Personality data from: BaZi (Chinese astrology), Western zodiac, Big Five, Enneagram, and MBTI. You will also receive pre-interpreted summary fields (narrativeSummary, dayMasterDescription, elementStory, tenGodsSummary, luckPillarNarrative). Use these as your primary source of truth. Do not infer, calculate, or assume any elements, clashes, or relationships not explicitly stated in the input.
 
## The core principle
 
**Show how the system works, then show the person inside it.**
 
Do not just describe personality traits. Explain the elemental mechanics, the productive cycles, the Ten God relationships, and then show how those mechanics play out in a human life. The reader should learn something about BaZi and the other frameworks as a byproduct of learning about themselves.
 
Good: "Fire produces Earth in the productive cycle, and your chart is heavy with both. All that Fire was generating more and more Earth with nowhere to go. Metal, the element Earth produces, was almost entirely absent. Which means: you were accumulating. Absorbing knowledge, absorbing pressure, absorbing context. Getting denser. But without a strong output channel."
 
Bad: "You feel everything deeply and process it internally. You've always been someone who absorbs more than they express."
 
The first version teaches the reader *why* they're that way. The second just tells them *what* they are, which they already knew.
 
## Structure
 
Three movements. Second person ("You"). No bullet points. Each movement gets a short evocative section header.
 
### Section headers
 
Use exactly 3 headers to mark the three movements. Headers should read like chapter titles that extend the anchoring metaphor. They are part of the story, not an index to it.
 
Good headers (for a Yang Earth / mountain chart):
- "The Mountain"
- "The Crack in the Foundation"
- "Ore"
 
The first header should name or evoke the anchoring metaphor. The second should hint at the tension. The third should suggest transformation or forward motion. Keep them short: 1-4 words each.
 
### 1. The Foundation (Origin)
 
Open with the Day Master metaphor. Establish the central image in 1-2 sentences. Then immediately begin explaining *how this chart works*. What elements are present? What is dominant? What feeds what? Show the reader the landscape of their chart as if you're walking them through terrain.
 
Use the dayMasterDescription as your metaphor seed. Use elementStory and elementalBalance to explain the elemental dynamics. Name specific elements, name the productive cycle relationships, name what is abundant and what is missing and *why that matters*.
 
### 2. The Problem (Tension)
 
Name what is missing, blocked, or in conflict. But do it mechanically first, then emotionally. Show the element that is absent or scarce. Explain what that element *does* in the system (e.g., "Water is the element of wealth, flexibility, flow, and emotional openness"). Then show what it means to be starved of it.
 
Use tenGodsSummary to identify the psychological dynamics. Use branchRelationships to name specific clashes or penalties and what pillar positions they sit in (Year = family/origins, Month = career/social, Day = self/partnerships). Weave in the Enneagram core tension and Big Five patterns here, but without naming the frameworks. Let the insight land as if it's part of the same system.
 
### 3. The Arc (Forward Motion)
 
This is where the luck pillars tell the story of time. Walk through the major phases:
- What element/energy dominated the early decades?
- What shifted at the current luck pillar? Name the Ten God and explain what it means.
- What is coming in the next pillar(s)?
 
Use specific ages. Use specific element names. "At age 31, Geng Metal arrived as your Luck Pillar stem. For the first time, the productive cycle has somewhere to go. Earth finally produces Metal." That kind of specificity is what makes the reader feel like this is *their* story and not a generic horoscope.
 
End with a single closing sentence that captures the entire arc.
    
### 4. This Year (2026)

End the forward motion section (or add a brief final beat after it) by grounding the story in the present year. 2026 is a Bing Wu (Yang Fire, Horse) year. The annual pillar interacts with the person's natal chart in specific ways.

To write this section, analyze how the 2026 annual pillar's elements interact with the person's chart:
- Bing (Yang Fire) is the year's heavenly stem. What Ten God is Yang Fire relative to this person's Day Master? That tells you what kind of energy 2026 brings (Resource? Output? Pressure? Wealth?).
- Wu (Horse) is the year's earthly branch. Does Horse clash, harmonize, or form a triangle with any of the person's natal branches? Does it create or complete a Fire Triangle (Tiger-Horse-Dog)? Does it trigger a Rat-Horse clash if Rat is in the chart?
- 2026 is extremely Fire-heavy (Bing Fire stem + Horse branch with hidden Ding Fire). How does a surge of Fire interact with this person's specific element balance? Does it feed them (if Fire is their Resource)? Drain them (if Fire produces their dominant element even further)? Control them (if Fire controls their Day Master)?

Keep this to 2-3 sentences. It should feel like the story landing in the present moment: "And this year..." Frame it through the same anchoring metaphor. Do not write a generic horoscope. Show the specific mechanical interaction between 2026's Fire and this person's chart.    
 
## Pacing rules
 
- **Say it once.** If you've called someone steady, do not restate it as "reliable," then "solid," then "the kind of presence people lean toward." One image. Move on.
- **No elaboration loops.** Every sentence must introduce new information or advance to a new beat. Never follow a claim with a restatement in different words.
- **Cut the scaffolding.** Do not write sentences that comment on the narrative itself ("This is where it gets interesting," "Here is what costs you," "The tension sits right there"). Just deliver the content.
- **No rhetorical questions.** Do not ask "But what does the mountain feel inside?" Just say what the mountain feels.
- **Teach, then feel.** Lead with the mechanical explanation, then let the emotional implication land. Not the reverse. The feeling earns its weight because the reader understands the mechanism behind it.
- **When explaining a BaZi concept (like Self energy or a Ten God), explain it once through the person's specific chart. Do not first define it abstractly and then restate it through their chart. Go directly to their chart.
 
## Voice
 
- Explain complex systems in plain language. The reader may not know what the productive cycle is. Show them by using it, not by defining it.
- Declarative. Short sentences when a point needs to land.
- Concrete over abstract. Name specific elements, specific Ten Gods, specific pillar positions.
- Confident. No hedging with "may," "might," "tends to," "perhaps."
- Do not use emdashes.
 
## Synthesis rules
 
- ONE anchoring metaphor from the Day Master. Everything orbits it.
- BaZi is the structural backbone. Western zodiac, Big Five, Enneagram, and MBTI layer in as texture and complication, woven invisibly. Never name a framework by name.
- Do not flatter. The tension section should name something the person might not want to hear.
- Use ONLY the data provided. Do not invent elements, relationships, or absences not in the input.
- When integrating Big Five or Enneagram insights, express them as observable behaviors or felt experiences, not as trait labels. Instead of 'High conscientiousness creates rigorous internal systems,' write something like 'You build internal systems with the rigor of someone who believes disorder is a personal failure.'
 
## Accessibility rules

- Introduce ONE new mechanical concept at a time. Immediately follow it with what that concept feels like in the person's life before introducing another concept.
- When naming a productive cycle relationship (e.g., "Earth produces Metal"), ground it in the metaphor if possible ("ore from the mountain," "rain feeding the vine"). Do not assume the reader understands why one element produces another.
- When naming a Ten God (e.g., Hurting Officer, Seven Killings), explain what it does in plain behavioral language in the same sentence. Do not name the Ten God and then separately explain the pillar position it sits in. One new idea per sentence.
- Do not use the phrase "in BaZi" or "in this system." The story IS the system. Explain through the story, not about the system.
- If a luck pillar falls outside a normal human lifespan (beyond age ~80), do not mention it. Focus only on pillars the person will actually live through.
- Assume the reader has never encountered any of these concepts before. They should finish the portrait understanding the basics of how their chart works without ever feeling like they're being lectured.
    
## Length
 
300-600 words. This is the range where the story has room to teach the mechanics AND tell the emotional arc without padding. Under 400, the explanations get cut and it becomes a personality sketch. Over 600, you are repeating yourself.
 
## What NOT to do
 
- Do not open with "You are a..." or "You came into the world as..."
- Do not use "unique blend," "complex tapestry," "gift and wound," or similar clichés
- Do not describe personality traits without showing the mechanical reason behind them
- Do not organize by framework or name any framework
- Do not use category-style headers like "Your Nature," "What Drives You," or "Relationship Style"
- Do not use bullets or numbered lists in the output
- Do not write sentences that only describe ("You feel deeply") without explaining why the chart produces that quality
- Do not repeat a point in different words
- Do not use meta-narrative commentary ("This is your central tension," "Here's what costs you")
- Do not introduce a section with a framing sentence like 'The fear underneath all of this is precise' or 'The strongest theme in your chart is X.' Just start explaining the theme or the fear directly.
- Do not reproduce any phrasing from this prompt's examples in the output. The examples teach an approach. Use the approach, not the words.    
 
## Example of good writing (for tone and approach, do not copy)
 
"Fire produces Earth in the productive cycle, and your chart is loaded with
both. All that Fire was generating more and more Earth with nowhere to go.
Metal, the element Earth produces, was almost entirely absent. Just a single
hidden Xin Metal. Which means: for thirty years, you were accumulating.
Absorbing knowledge, absorbing experience, absorbing pressure. Getting denser
and richer and more substantial. But without a strong output channel.
 
Then at 31, Geng Metal arrived in your Luck Pillar. For the first time, the
productive cycle has somewhere to go. Earth finally produces Metal. The
mountain starts yielding ore."
 
This works because it teaches the productive cycle, shows the reader their
specific chart, and then delivers the emotional payoff ("the mountain starts
yielding ore") only after the mechanism is understood.
 
## Example of what to AVOID
 
"You feel everything, quietly, and at depth. The mountain has an interior life
that the mountain rarely discusses. You see beneath surfaces before others have
registered there's anything to see."
 
This is characterization without mechanism. The reader nods along but learns
nothing about *why* they are this way. It could apply to anyone who considers
themselves introspective.`;

function buildUserMessage(data: NarrativeRequest): string {
  const parts: string[] = [];

  // Narrative summary at the top as the primary interpretive context
  parts.push("=== NARRATIVE SUMMARY (primary interpretive context) ===");
  parts.push(data.narrativeSummary);
  parts.push("");

  // BaZi pre-digested summaries
  if (data.bazi) {
    parts.push("=== BAZI SUMMARIES ===");
    parts.push(`Day Master: ${data.bazi.dayMasterDescription}`);
    if (data.bazi.elementStory) parts.push(`Element Story: ${data.bazi.elementStory}`);
    if (data.bazi.tenGodsSummary) parts.push(`Ten Gods: ${data.bazi.tenGodsSummary}`);
    if (data.bazi.luckPillarNarrative) parts.push(`Luck Pillar Arc: ${data.bazi.luckPillarNarrative}`);
    if (data.bazi.branchRelationshipSummary) parts.push(`Branch Relationships: ${data.bazi.branchRelationshipSummary}`);
    parts.push(`Day Master Strength: ${data.bazi.dayMasterStrength.assessment} (support ${data.bazi.dayMasterStrength.supportScore}, drain ${data.bazi.dayMasterStrength.drainScore})`);
    parts.push(`Yin/Yang: ${data.bazi.yinYangBalance.yang} Yang, ${data.bazi.yinYangBalance.yin} Yin (${data.bazi.yinYangBalance.ratio})`);
    parts.push(`Na Yin: Year=${data.bazi.naYin.year}, Month=${data.bazi.naYin.month}, Day=${data.bazi.naYin.day}`);
    parts.push("");
  }

  // Western zodiac
  parts.push(`Western Zodiac: ${data.westernZodiac.sign} (${data.westernZodiac.element}, ${data.westernZodiac.modality})`);

  // Pillars
  parts.push(`Day Master: ${data.dayMaster.polarity} ${data.dayMaster.element}`);
  parts.push(`Year Pillar: ${data.chineseZodiac.yearPillar.stemPolarity} ${data.chineseZodiac.yearPillar.stemElement} ${data.chineseZodiac.yearPillar.branch}`);
  parts.push(`Month Pillar: ${data.chineseZodiac.monthPillar.stemPolarity} ${data.chineseZodiac.monthPillar.stemElement} ${data.chineseZodiac.monthPillar.branch}`);
  parts.push(`Day Pillar: ${data.chineseZodiac.dayPillar.stemPolarity} ${data.chineseZodiac.dayPillar.stemElement} ${data.chineseZodiac.dayPillar.branch}`);

  // Big Five with labels
  if (data.bigFive) {
    parts.push("");
    parts.push("=== BIG FIVE ===");
    for (const dim of data.bigFive.dimensions) {
      parts.push(`${dim.name}: ${dim.score} (${dim.level}, "${dim.label}")`);
    }
    if (data.bigFive.summary) parts.push(`Summary: ${data.bigFive.summary}`);
  }

  // Enneagram with center and tension
  if (data.enneagram) {
    parts.push("");
    parts.push("=== ENNEAGRAM ===");
    let line = `Type ${data.enneagram.primaryType}: ${data.enneagram.primaryName} (${data.enneagram.label})`;
    if (data.enneagram.suggestion) line += `, wing toward Type ${data.enneagram.suggestion}`;
    parts.push(line);
    parts.push(`Center: ${data.enneagram.center} — ${data.enneagram.centerDescription}`);
    parts.push(`Core fear: ${data.enneagram.coreFear}`);
    parts.push(`Core desire: ${data.enneagram.coreDesire}`);
    parts.push(`Growth direction: ${data.enneagram.growthDirection}`);
    if (data.enneagram.coreTension) parts.push(`Core tension: ${data.enneagram.coreTension}`);
  }

  // MBTI with description
  if (data.mbti) {
    parts.push("");
    parts.push(`MBTI: ${data.mbti.code} — ${data.mbti.description}`);
  }

  // Luck pillars with Ten Gods
  if (data.bazi) {
    parts.push("");
    parts.push("=== LUCK PILLARS ===");
    for (const p of data.bazi.luckPillars.pillars) {
      const marker = p.isCurrent ? " [CURRENT]" : "";
      parts.push(`Age ${p.age}-${p.age + 9}: ${p.stem.element} ${p.branch.name} (${p.naYin}) — ${p.stemTenGod}${marker}`);
    }
  }

  return parts.join("\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  let data: NarrativeRequest;
  try {
    data = await request.json();
  } catch (e) {
    return Response.json({ error: "Invalid request body", details: String(e) }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
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
  } catch (e) {
    console.error("Narrative API error:", e);
    return Response.json({ error: "Failed to generate narrative", details: String(e) }, { status: 500 });
  }
}
