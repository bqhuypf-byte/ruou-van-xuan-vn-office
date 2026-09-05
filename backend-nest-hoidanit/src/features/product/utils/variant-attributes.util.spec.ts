import {
  findLowestPricedVariant,
  getDisplayedVariantPrice,
  matchesVariantAttributes,
} from './variant-attributes.util';

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

  it('finds the lowest price only among configured variants', () => {
    const variants = [
      { attributes: { 'Độ(Vol)': '45 độ' }, price: '22.00', salePrice: null },
      {
        attributes: { 'Độ(Vol)': '40 độ' },
        price: '40000.00',
        salePrice: null,
      },
      {
        attributes: { 'Độ(Vol)': '30 độ' },
        price: '35000.00',
        salePrice: null,
      },
    ];

    expect(findLowestPricedVariant(variants, groups)?.price).toBe('35000.00');
  });

  it('uses a valid sale price when it is the lowest displayed price', () => {
    const variants = [
      {
        attributes: { 'Độ(Vol)': '30 độ' },
        price: '35000.00',
        salePrice: null,
      },
      {
        attributes: { 'Độ(Vol)': '40 độ' },
        price: '40000.00',
        salePrice: '32000.00',
      },
    ];

    expect(findLowestPricedVariant(variants, groups)?.salePrice).toBe(
      '32000.00',
    );
  });

  it('ignores a sale price higher than the regular price', () => {
    expect(
      getDisplayedVariantPrice({
        attributes: { 'Độ(Vol)': '30 độ' },
        price: '35000.00',
        salePrice: '39999.99',
      }),
    ).toBe(35000);
  });
});
