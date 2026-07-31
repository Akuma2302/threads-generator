// Human-readable descriptions for each pill so the model gets real guidance
// instead of just a slug like "trend_hop".
const ANGLE_GUIDE = {
  honest_review: 'An honest, first-person review sharing real pros/cons and experience.',
  comparison: 'Compares the option against alternatives to show why it wins.',
  problem_solution: 'Opens with a relatable problem, then presents this as the solution.',
  trend_hop: 'Ties the content to a current trend, sound, or meme format.',
  value_deal: 'Leads with the deal/value angle — price, discount, or bang-for-buck.',
  status_flex: 'Aspirational, flex-the-upgrade tone — how this elevates the reader\'s status.',
  question_poll: 'Opens with a question or poll to spark replies and engagement.',
  story_time: 'Told as a narrative, "story time" style, with a beginning/middle/twist.',
  hook_shock: 'Opens with a shocking or pattern-interrupting hook in the first line.',
  fomo_urgency: 'Leans on urgency/scarcity — limited time, limited slots, act now.',
  myth_buster: 'Busts a common myth or misconception related to the topic.',
  dupe: 'Positions this as a cheaper "dupe" or alternative to a pricier known option.',
};

const VIRAL_FORMULA_GUIDE = {
  dont_gatekeep: 'Uses the "I won\'t gatekeep this" confessional-sharing framing.',
  pov: 'Written in second-person "POV:" format.',
  confession: 'Framed as a personal confession or admission.',
  hot_take: 'Opens with a bold, slightly controversial hot take.',
  psa: 'Framed as a public service announcement, "PSA:" style.',
  challenge: 'Frames the content as a challenge or dare to the reader.',
  trust_me: '"Trust me" / take-my-word-for-it reassuring tone.',
};

const SUBTYPE_GUIDE = {
  service: 'a service being offered',
  event: 'an upcoming event',
  personal_life: 'a personal life update or story',
  volunteer: 'volunteer work or a cause',
  business: 'a general business update or offering',
};

function describe(map, key, fallback) {
  if (!key) return fallback;
  return map[key] || key.replace(/_/g, ' ');
}

/**
 * Builds the full system + user prompt combo for the Hermes agent.
 * Returns { system, user } strings ready to send to Claude.
 */
function buildThreadPrompt(input) {
  const {
    contentSource,
    subType,
    coreContext,
    contextLink,
    affiliateLink,
    productInfo, // { title, description, price, siteName } scraped from affiliateLink
    strategy,
    threadLength,
    audience,
    audienceDetail,
    language,
  } = input;

  const angleDesc = describe(ANGLE_GUIDE, strategy?.angle);
  const viralDesc = strategy?.viralFormula
    ? describe(VIRAL_FORMULA_GUIDE, strategy.viralFormula)
    : null;
  const subTypeDesc = contentSource === 'organic' ? describe(SUBTYPE_GUIDE, subType) : null;

  const postCountMatch = /(\d+)/.exec(threadLength || '');
  const postCount = postCountMatch ? Number(postCountMatch[1]) : 4;

  const system = `You are Hermes, an expert Threads (by Instagram) copywriter and social growth strategist. \
You write short-form, native-feeling Threads content for creators, affiliates, and small businesses who want \
to turn posts into leads and sales without sounding like an ad. \
You write in a natural, scroll-stopping voice appropriate to the requested language and audience. \
You NEVER use hashtags (Threads discovery does not reward them), you avoid corporate marketing language, \
and every thread should feel like a real person posted it. \
Always return your output as strict JSON only, with no markdown fences and no commentary outside the JSON.`;

  const contextLines = [];

  if (contentSource === 'affiliate') {
    contextLines.push(`Content source: Affiliate marketing post.`);
    if (affiliateLink) contextLines.push(`Affiliate link: ${affiliateLink}`);
    if (productInfo?.title) contextLines.push(`Product title (scraped): ${productInfo.title}`);
    if (productInfo?.description)
      contextLines.push(`Product description (scraped): ${productInfo.description}`);
    if (productInfo?.price) contextLines.push(`Price (scraped): ${productInfo.price}`);
    if (coreContext) contextLines.push(`Creator's raw notes: ${coreContext}`);
  } else {
    contextLines.push(`Content source: Organic post.`);
    if (subTypeDesc) contextLines.push(`Sub-type: ${subTypeDesc}`);
    contextLines.push(`Creator's raw notes / core context:\n${coreContext}`);
    if (contextLink) contextLines.push(`Reference link for extra context: ${contextLink}`);
  }

  const user = `Write a Threads content thread using the details below.

${contextLines.join('\n')}

STRATEGY & STYLE
- Storytelling angle: ${strategy?.angle} — ${angleDesc}
${viralDesc ? `- Viral formula overlay: ${strategy.viralFormula} — ${viralDesc}` : ''}
- Thread length: ${postCount} posts
- Target audience: ${audience}${audienceDetail ? ` (${audienceDetail})` : ''}
- Language: ${language}

OUTPUT RULES
- Write exactly ${postCount} posts.
- Each post must stand alone under Threads' ~500 character limit, but read as one continuous thread when posted back-to-back.
- Post 1 is the hook — it must earn the tap to "see more" / keep scrolling.
- If this is affiliate content, weave the link/CTA in naturally near the end, never in the first post.
- No hashtags. No emojis unless they genuinely fit the creator's natural voice (use sparingly).
- Match the requested language exactly.

Return ONLY valid JSON in this exact shape:
{
  "posts": ["post 1 text", "post 2 text", "..."],
  "suggestedFirstComment": "an optional short first-comment to add extra CTA or link, or empty string if not needed"
}`;

  return { system, user };
}

module.exports = { buildThreadPrompt };
