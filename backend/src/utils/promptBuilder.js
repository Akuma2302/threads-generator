// Human-readable descriptions for each writing mode and hook type so the
// model gets real guidance instead of just a slug.

const MODE_GUIDE = {
  post_biasa: 'A regular, informational sharing post. No sales pitch, no call-to-action — just genuinely useful or interesting sharing.',
  post_jualan: 'A sales-focused post. The goal is to convert readers into buyers/leads for the product or service, while still feeling native and not like a corporate ad.',
  post_engagement: 'An engagement-focused post. The goal is to spark replies, questions, and interaction — not to sell.',
};

const HOOK_GUIDE = {
  storytelling: 'Opens as a narrative, pulling the reader into a story.',
  fomo: 'Leans on urgency/scarcity — limited time, limited stock, act now.',
  problem_solution: 'Opens with a relatable problem, then positions this as the solution.',
  curiosity: 'Opens with an open loop or curiosity gap the reader needs closed.',
  social_proof: 'Leads with proof — numbers, testimonials, "everyone is already doing this".',
  transformation: 'Frames a before/after transformation.',
  vulnerable: 'Opens with an honest, vulnerable admission or personal low point.',
  bold_statement: 'Opens with a bold, confident claim that reframes the product/topic.',
  relatable_struggle: 'Opens by naming a struggle the audience will instantly recognize in themselves.',
  negative_reverse: 'Opens with a "don\'t do X" or reverse-psychology warning hook.',
  result_first: 'Leads with the end result/outcome before explaining how it was achieved.',
  controversy_spike: 'Opens with a mildly controversial or contrarian take to spark reaction.',
};

// Per-language grammar/tone rules. Free-tier models tend to default to
// stiff, literally-translated phrasing unless told explicitly how native
// speakers actually write on social media — this closes that gap.
// Add a new language here any time a new option is added to the frontend's
// CAPTION_LANGUAGES list; the key must match that string exactly.
const LANGUAGE_GUIDE = {
  'Bahasa Melayu': `Write in natural, conversational Bahasa Melayu the way real Malaysians post on social media — \
NOT a stiff, literal English-to-Malay translation and NOT overly formal Bahasa Baku unless the audience calls for it. \
Use correct SPOK sentence structure (Subjek-Predikat-Objek-Keterangan). Use natural particles where they'd genuinely occur ("lah", "kan", "je", "kot") — sparingly, not on every line. \
Default to "korang" or "awak" for casual addressing unless the audience/brand voice implies something more formal ("anda"). \
Get spelling and word choice right (e.g. "kalau" not "kalu", "sebab" not "sbb" unless deliberately casual shorthand). \
Avoid Indonesian-isms unless asked.`,
  English: `Write in natural, idiomatic English the way a real person posts on Threads — contractions are fine, \
sentence fragments for punch are fine, but grammar must be correct. Avoid stiff or overly formal phrasing unless the \
audience/mode calls for it.`,
  'Bahasa Melayu + English (rojak)': `Write in authentic Malaysian "rojak" code-switching — the way Malaysians \
actually mix Malay and English in real speech and social posts, not random word substitution. Keep sentence structure \
grammatically sound in whichever language carries each clause; don't force English grammar onto Malay words or vice \
versa. This should read exactly like a real Malaysian creator's caption, not a translation exercise.`,
  'Chinese (简体中文)': `Write in natural, conversational Simplified Chinese (简体中文) appropriate for social media — \
correct grammar and word order, natural modal particles (吧, 呢, 啊) used sparingly where they'd genuinely occur, and \
phrasing a native speaker would actually write, not a literal translation from English.`,
};

function languageGuide(language) {
  return LANGUAGE_GUIDE[language] || `Write in fluent, grammatically correct, natural ${language}, the way a native speaker would actually write on social media — never a stiff or literal translation.`;
}

function describeList(map, keys) {
  if (!keys || keys.length === 0) return '';
  return keys.map((k) => `${k} (${map[k] || k.replace(/_/g, ' ')})`).join(', ');
}

/**
 * Builds the system + user prompt for the Threspert content engine.
 * Returns { system, user }.
 */
function buildThreadPrompt(input) {
  const {
    mode,
    postAbout,
    platform,
    captionLanguage,
    length,
    audience,
    postCount,
    threadPerPost,
    hookTypes,
    productLink,
  } = input;

  const modeDesc = MODE_GUIDE[mode] || mode;
  const hookDesc = describeList(HOOK_GUIDE, hookTypes);
  const langGuide = languageGuide(captionLanguage);

  const system = `You are Threspert, an expert short-form social copywriter and growth strategist for platforms like Threads. \
You write native-feeling, scroll-stopping posts for creators and small businesses that read like a real person wrote them — \
never like corporate marketing copy. You write with native-level fluency and correct grammar in whatever language is \
requested — never a stiff or literal translation. You never use hashtags. \
Always return your output as strict JSON only, with no markdown fences and no commentary outside the JSON.`;

  const user = `Write ${postCount} distinct post variation(s) for ${platform} using the details below. \
Each variation must use a DIFFERENT angle/wording so they don't feel repetitive, even though they're about the same topic.

POST DETAILS
- Writing mode: ${mode} — ${modeDesc}
- Post is about: ${postAbout}
- Platform: ${platform}
- Caption language: ${captionLanguage}
- Length: ${length}
- Target audience: ${audience} — tailor tone, references, and word choice to genuinely resonate with this group.
${productLink ? `- Product link (weave in naturally near the end if this is a sales post, never in the hook): ${productLink}` : ''}

HOOK TYPES TO BLEND (choose one primary style per variation from this set, blending naturally — do not label it clumsily in the text itself)
${hookDesc}

LANGUAGE STYLE — ${captionLanguage}
${langGuide}

STRUCTURE
- Each variation is a thread of exactly ${threadPerPost} connected part(s). If ${threadPerPost} is 1, it's a single standalone post.
- Part 1 of each variation is the HOOK — it alone must be strong enough to stop the scroll and stand on its own.
- Parts 2+ build on the hook, deliver value/story/proof, and (for post_jualan mode) close with a natural CTA.
- Follow the LANGUAGE STYLE rules above exactly — grammar and natural phrasing matter as much as the content itself.
- No hashtags. No emojis unless they genuinely fit a natural voice (use sparingly).

Return ONLY valid JSON in this exact shape:
{
  "variations": [
    {
      "hookType": "one of the hook type slugs used for this variation, e.g. negative_reverse",
      "hook": "the hook text (same as parts[0])",
      "parts": ["part 1 (hook)", "part 2", "... exactly ${threadPerPost} total"]
    }
  ]
}
The "variations" array must contain exactly ${postCount} item(s).`;

  return { system, user };
}

module.exports = { buildThreadPrompt };
