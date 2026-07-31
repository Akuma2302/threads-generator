const VALID_SOURCES = ['affiliate', 'organic'];
const VALID_SUBTYPES = ['service', 'event', 'personal_life', 'volunteer', 'business'];

function validateGenerateRequest(body) {
  const errors = [];
  const {
    contentSource,
    subType,
    coreContext,
    contextLink,
    affiliateLink,
    strategy,
    threadLength,
    audience,
    language,
  } = body;

  if (!contentSource || !VALID_SOURCES.includes(contentSource)) {
    errors.push(`contentSource must be one of: ${VALID_SOURCES.join(', ')}`);
  }

  if (contentSource === 'organic') {
    if (subType && !VALID_SUBTYPES.includes(subType)) {
      errors.push(`subType must be one of: ${VALID_SUBTYPES.join(', ')}`);
    }
    if (!coreContext || !coreContext.trim()) {
      errors.push('coreContext (your raw notes) is required for organic content');
    }
  }

  if (contentSource === 'affiliate') {
    if (!affiliateLink && !coreContext) {
      errors.push('affiliateLink or coreContext is required for affiliate content');
    }
  }

  if (!strategy || !strategy.angle) {
    errors.push('strategy.angle (storytelling angle) is required');
  }

  if (!threadLength) {
    errors.push('threadLength is required');
  }

  if (!audience) {
    errors.push('audience is required');
  }

  if (!language) {
    errors.push('language is required');
  }

  if (contextLink) {
    try {
      // eslint-disable-next-line no-new
      new URL(contextLink);
    } catch {
      errors.push('contextLink must be a valid URL');
    }
  }

  return errors;
}

module.exports = { validateGenerateRequest, VALID_SOURCES, VALID_SUBTYPES };
