const VALID_MODES = ['post_biasa', 'post_jualan', 'post_engagement'];
const VALID_COUNTS = [1, 3, 5, 10];

function validateGenerateRequest(body) {
  const errors = [];
  const { mode, postAbout, platform, captionLanguage, length, postCount, threadPerPost, hookTypes, productLink } =
    body;

  if (!mode || !VALID_MODES.includes(mode)) {
    errors.push(`mode must be one of: ${VALID_MODES.join(', ')}`);
  }

  if (!postAbout || !postAbout.trim()) {
    errors.push('postAbout (what the post is about) is required');
  }

  if (!platform) errors.push('platform is required');
  if (!captionLanguage) errors.push('captionLanguage is required');
  if (!length) errors.push('length is required');

  if (!postCount || !VALID_COUNTS.includes(Number(postCount))) {
    errors.push(`postCount must be one of: ${VALID_COUNTS.join(', ')}`);
  }

  if (!threadPerPost || !VALID_COUNTS.includes(Number(threadPerPost))) {
    errors.push(`threadPerPost must be one of: ${VALID_COUNTS.join(', ')}`);
  }

  if (!Array.isArray(hookTypes) || hookTypes.length === 0) {
    errors.push('hookTypes must have at least one selected hook type');
  }

  if (productLink) {
    try {
      // eslint-disable-next-line no-new
      new URL(productLink);
    } catch {
      errors.push('productLink must be a valid URL');
    }
  }

  return errors;
}

module.exports = { validateGenerateRequest, VALID_MODES, VALID_COUNTS };
