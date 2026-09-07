import { assertReviewSeedAllowed } from './review-seed-environment.guard';

describe('assertReviewSeedAllowed', () => {
  it('refuses fabricated review data in production', () => {
    expect(() => assertReviewSeedAllowed('production')).toThrow(
      'Review seed is disabled in production',
    );
  });

  it.each([undefined, 'development', 'test', 'staging'])(
    'allows review seed in %s',
    (nodeEnv) => {
      expect(() => assertReviewSeedAllowed(nodeEnv)).not.toThrow();
    },
  );
});
