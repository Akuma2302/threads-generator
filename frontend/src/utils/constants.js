export const WRITING_MODES = [
  {
    value: 'post_biasa',
    icon: '📝',
    title: 'Post Biasa',
    description: 'Sharing & informasi, tiada CTA',
  },
  {
    value: 'post_jualan',
    icon: '🛒',
    title: 'Post Jualan',
    description: 'Fokus convert & jual produk',
  },
  {
    value: 'post_engagement',
    icon: '💬',
    title: 'Post Engagement',
    description: 'Tanya soalan & tingkat interaksi',
  },
];

export const PLATFORMS = ['Threads', 'X (Twitter)', 'Instagram Caption', 'TikTok Caption'];

export const CAPTION_LANGUAGES = [
  'Bahasa Melayu',
  'English',
  'Bahasa Melayu + English (rojak)',
  'Chinese (简体中文)',
];

export const LENGTHS = ['Pendek', 'Sederhana', 'Panjang'];

export const COUNT_OPTIONS = [1, 3, 5, 10];

export const HOOK_TYPES = [
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'fomo', label: 'FOMO' },
  { value: 'problem_solution', label: 'Problem-Solution' },
  { value: 'curiosity', label: 'Curiosity' },
  { value: 'social_proof', label: 'Social Proof' },
  { value: 'transformation', label: 'Transformation' },
  { value: 'vulnerable', label: 'Vulnerable' },
  { value: 'bold_statement', label: 'Bold Statement' },
  { value: 'relatable_struggle', label: 'Relatable Struggle' },
  { value: 'negative_reverse', label: 'Negative / Reverse' },
  { value: 'result_first', label: 'Result First' },
  { value: 'controversy_spike', label: 'Controversy Spike' },
];

export function hookLabel(value) {
  return HOOK_TYPES.find((h) => h.value === value)?.label || value;
}
