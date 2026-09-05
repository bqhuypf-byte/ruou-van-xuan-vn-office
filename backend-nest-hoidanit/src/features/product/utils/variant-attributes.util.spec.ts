import { matchesVariantAttributes } from './variant-attributes.util';

describe('matchesVariantAttributes', () => {
  const groups = [{ name: 'Độ(Vol)', values: ['30 độ', '40 độ', '50 độ'] }];

  it('accepts a configured classification value', () => {
    expect(matchesVariantAttributes({ 'Độ(Vol)': '40 độ' }, groups)).toBe(true);
  });

  it('rejects removed and unclassified variants', () => {
    expect(matchesVariantAttributes({ 'Độ(Vol)': '35 độ' }, groups)).toBe(
      false,
    );
    expect(matchesVariantAttributes(null, groups)).toBe(false);
  });

  it('rejects variants with attributes outside the configured groups', () => {
    expect(
      matchesVariantAttributes(
        { 'Độ(Vol)': '40 độ', 'Dung tích': '1 lít' },
        groups,
      ),
    ).toBe(false);
  });
});
