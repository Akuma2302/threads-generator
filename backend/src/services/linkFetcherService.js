const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetches a URL (e.g. a Shopee/Lazada/TikTok Shop product link) and pulls out
 * whatever basic metadata is available so the creator doesn't have to
 * retype the product title/description/price by hand.
 */
async function fetchLinkPreview(url) {
  const { data: html } = await axios.get(url, {
    timeout: 8000,
    maxContentLength: 5 * 1024 * 1024,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    },
  });

  const $ = cheerio.load(html);

  const pick = (...selectors) => {
    for (const sel of selectors) {
      const val = $(sel).attr('content') || $(sel).text();
      if (val && val.trim()) return val.trim();
    }
    return '';
  };

  const title = pick(
    'meta[property="og:title"]',
    'meta[name="twitter:title"]',
    'title'
  );

  const description = pick(
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
    'meta[name="description"]'
  );

  const image = pick('meta[property="og:image"]', 'meta[name="twitter:image"]');

  const siteName = pick('meta[property="og:site_name"]') || new URL(url).hostname;

  // Very loose price sniff — looks for common currency patterns in the description.
  const priceMatch = description.match(/(RM|MYR|USD|\$)\s?\d+(?:[.,]\d{1,2})?/i);

  return {
    title,
    description,
    image,
    siteName,
    price: priceMatch ? priceMatch[0] : '',
    url,
  };
}

module.exports = { fetchLinkPreview };
