const axios = require('axios');
const {
  openrouterApiKey,
  openrouterModel,
  openrouterFallbackModels,
  openrouterSiteUrl,
  openrouterAppName,
} = require('../config/env');
const { buildThreadPrompt } = require('../utils/promptBuilder');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Strips accidental markdown code fences in case the model wraps its JSON
 * in ```json ... ``` despite instructions not to.
 */
function stripCodeFences(text) {
  return text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```\s*$/, '')
    .trim();
}

/**
 * Calls the Hermes agent (currently backed by a free model on OpenRouter,
 * e.g. openai/gpt-oss-120b:free) to generate the Threads content based on
 * the creator's inputs. Uses the OpenAI-compatible chat completions schema,
 * which is what OpenRouter expects regardless of which underlying model
 * you point OPENROUTER_MODEL at.
 */
async function generateThreadContent(input) {
  const { system, user } = buildThreadPrompt(input);
  const userContent = user;

  const modelsToTry = [openrouterModel, ...openrouterFallbackModels];
  const attemptErrors = [];

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await axios.post(
        OPENROUTER_URL,
        {
          model,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: userContent },
          ],
          temperature: 0.9,
          max_tokens: 2000,
        },
        {
          headers: {
            Authorization: `Bearer ${openrouterApiKey}`,
            'Content-Type': 'application/json',
            // OpenRouter uses these to attribute traffic / unlock some free-tier rate limits.
            'HTTP-Referer': openrouterSiteUrl,
            'X-Title': openrouterAppName,
          },
          timeout: 30000,
        }
      );

      const raw = stripCodeFences(response.data?.choices?.[0]?.message?.content || '{}');
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed.variations) || parsed.variations.length === 0) {
        throw new Error('Model returned no variations');
      }

      const variations = parsed.variations.map((v) => ({
        hookType: v.hookType || '',
        hook: v.hook || (Array.isArray(v.parts) ? v.parts[0] : ''),
        parts: Array.isArray(v.parts) ? v.parts : [],
      }));

      if (variations.some((v) => v.parts.length === 0)) {
        throw new Error('A variation was returned with no parts');
      }

      if (i > 0) {
        console.warn(`[hermes] Primary model failed, succeeded on fallback: ${model}`);
      }

      return { variations };
    } catch (err) {
      const providerMessage = err.response?.data?.error?.message || err.message;
      console.error(`[hermes] Model "${model}" failed: ${providerMessage}`);
      attemptErrors.push(`${model}: ${providerMessage}`);
      // Try the next model in the list.
    }
  }

  // Every model in the list failed.
  const error = new Error(
    `Hermes couldn't generate a thread right now — every configured model failed (${attemptErrors.join(
      '; '
    )}). Please try again shortly.`
  );
  error.status = 502;
  throw error;
}

module.exports = { generateThreadContent };
