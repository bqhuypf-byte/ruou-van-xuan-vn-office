export function assertReviewSeedAllowed(nodeEnv = process.env.NODE_ENV): void {
  if (nodeEnv?.trim().toLowerCase() === 'production') {
    throw new Error(
      'Review seed is disabled in production to prevent publishing fabricated customer reviews.',
    );
  }
}
