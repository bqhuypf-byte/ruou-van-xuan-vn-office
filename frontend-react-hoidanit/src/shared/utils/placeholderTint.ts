const PLACEHOLDER_TINTS = [
  '#5b2333',
  '#7a4b1e',
  '#2e2a1f',
  '#8a5a2a',
  '#96863f',
  '#52525b',
  '#1f1f1f',
  '#6b3f2a',
];

/** Deterministic flat-color tile for products without a real photo — matches the brand's "no photography" placeholder style. */
export const getPlaceholderTint = (id: number): string =>
  PLACEHOLDER_TINTS[id % PLACEHOLDER_TINTS.length];
