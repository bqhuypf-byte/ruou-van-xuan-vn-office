import provinces from 'sub-vn/json_data/provinces.json';
import districts from 'sub-vn/json_data/districts.json';

export interface Province {
  code: string;
  name: string;
  unit: string;
}

export interface District {
  code: string;
  name: string;
  unit: string;
  province_code: string;
  province_name: string;
  full_name: string;
}

export interface Ward {
  code: string;
  name: string;
  unit: string;
  district_code: string;
  district_name: string;
  province_code: string;
  province_name: string;
  full_name: string;
}

/**
 * Old 3-tier Vietnam administrative divisions (tỉnh/thành → quận/huyện → phường/xã),
 * as of the last full 63-province structure before the 2025 merger. Source: `sub-vn` (MIT).
 * Wards (~3.4MB JSON) are dynamically imported so they never bloat the main bundle.
 */
export const vietnamProvinces: Province[] = provinces;

export const getDistrictsByProvinceCode = (provinceCode: string): District[] =>
  districts.filter((d) => d.province_code === provinceCode);

export const getWardsByDistrictCode = async (districtCode: string): Promise<Ward[]> => {
  const wardsModule = await import('sub-vn/json_data/wards.json');
  const wards = wardsModule.default as Ward[];
  return wards.filter((w) => w.district_code === districtCode);
};

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const escapeRegex = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const containsWholeWord = (haystackNormalized: string, needleRaw: string): boolean => {
  const needle = normalize(needleRaw);
  if (!needle) return false;
  return new RegExp(`\\b${escapeRegex(needle)}\\b`).test(haystackNormalized);
};

export interface DetectedAddress {
  province: Province;
  district: District;
  ward: Ward | null;
}

/**
 * Best-effort detection of Tỉnh/Quận/Phường from a free-typed street address, e.g.
 * "183 HT44 phường Hiệp Thành Quận 12" → Quận 12, Phường Hiệp Thành, TP. Hồ Chí Minh.
 * Matching is diacritic/case-insensitive and word-boundary aware to avoid partial hits
 * (e.g. "Quận 1" must not match inside "Quận 12").
 */
export const detectAddressFromText = async (text: string): Promise<DetectedAddress | null> => {
  const normalizedInput = normalize(text);
  if (!normalizedInput) return null;

  const districtCandidates = districts
    .filter((d) => containsWholeWord(normalizedInput, d.name))
    .sort((a, b) => b.name.length - a.name.length);

  if (districtCandidates.length === 0) return null;

  let fallback: District | null = null;

  for (const district of districtCandidates) {
    if (!fallback) fallback = district;

    const wards = await getWardsByDistrictCode(district.code);
    const wardCandidates = wards
      .filter((w) => containsWholeWord(normalizedInput, w.name))
      .sort((a, b) => b.name.length - a.name.length);

    if (wardCandidates.length > 0) {
      const province = vietnamProvinces.find((p) => p.code === district.province_code);
      if (!province) continue;
      return { province, district, ward: wardCandidates[0] };
    }
  }

  const province = vietnamProvinces.find((p) => p.code === fallback?.province_code);
  if (!fallback || !province) return null;
  return { province, district: fallback, ward: null };
};

/**
 * Removes a matched ward/district mention from the street text (best-effort, literal
 * case-insensitive match only) so the composed address line doesn't repeat it.
 */
export const stripDetectedPortion = (streetText: string, detected: DetectedAddress): string => {
  let result = streetText;
  const names = [detected.ward?.name, detected.district.name].filter((n): n is string => !!n);
  for (const name of names) {
    result = result.replace(new RegExp(escapeRegex(name), 'i'), ' ');
  }
  return result.replace(/\s+/g, ' ').replace(/[,\s]+$/, '').trim();
};
