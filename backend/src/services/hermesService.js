const Anthropic = require('@anthropic-ai/sdk');
const { anthropicApiKey, claudeModel } = require('../config/env');
const { buildThreadPrompt } = require('../utils/promptBuilder');

const client = new Anthropic({ apiKey: anthropicApiKey });

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
 * Calls Claude (the "Hermes" copywriting agent) to generate the Threads
 * content based on the creator's inputs.
 */
async function generateThreadContent(input) {
  const { system, user } = buildThreadPrompt(input);

  const contentBlocks = [{ type: 'text', text: user }];

  // If the creator uploaded a poster/image as base64, hand it to Claude as
  // an image block so the copy can reference what's actually on the flyer.
  if (input.imageBase64 && input.imageMediaType) {
    contentBlocks.unshift({
      type: 'image',
      source: {
        type: 'base64',
        media_type: input.imageMediaType,
        data: input.imageBase64,
      },
    });
  }

  const response = await client.messages.create({
    model: claudeModel,
    max_tokens: 2000,
    system,
    messages: [{ role: 'user', content: contentBlocks }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  const raw = textBlock ? stripCodeFences(textBlock.text) : '{}';

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
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
