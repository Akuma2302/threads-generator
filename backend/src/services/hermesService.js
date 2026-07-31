const axios = require('axios');
const { openrouterApiKey, openrouterModel, openrouterSiteUrl, openrouterAppName } = require('../config/env');
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

  const userContent = [{ type: 'text', text: user }];

  // Only attach the image if the selected model supports vision input.
  // Most free-tier text models (like gpt-oss-120b) do NOT accept images —
  // if one was uploaded, its filename/context is still captured in the
  // prompt text (see promptBuilder), just not the pixels themselves.
  if (input.imageBase64 && input.imageMediaType && input.enableVisionInput) {
    userContent.push({
      type: 'image_url',
      image_url: { url: `data:${input.imageMediaType};base64,${input.imageBase64}` },
    });
  }

  let response;
  try {
    response = await axios.post(
      OPENROUTER_URL,
      {
        model: openrouterModel,
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
  } catch (err) {
    const status = err.response?.status || 502;
    const providerMessage = err.response?.data?.error?.message;
    const error = new Error(
      providerMessage
        ? `Hermes (OpenRouter) error: ${providerMessage}`
        : 'Could not reach the Hermes model provider. Please try again.'
    );
    error.status = status === 401 ? 500 : status;
    throw error;
  }

  const raw = stripCodeFences(response.data?.choices?.[0]?.message?.content || '{}');

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const error = new Error('Hermes returned a response that could not be parsed. Please try again.');
    error.status = 502;
    throw error;
  }

  if (!Array.isArray(parsed.posts) || parsed.posts.length === 0) {
    const error = new Error('Hermes did not return any thread posts. Please try again.');
    error.status = 502;
    throw error;
  }

  return {
    posts: parsed.posts,
    suggestedFirstComment: parsed.suggestedFirstComment || '',
  };
}

module.exports = { generateThreadContent };
