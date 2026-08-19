import { ValueTransformer } from 'typeorm';

/**
 * mysql2 returns BIGINT columns as strings to avoid precision loss on values
 * beyond Number.MAX_SAFE_INTEGER. Our ids stay well under that range, so we
 * coerce back to number — without this, strict equality checks against
 * numeric ids (e.g. category ancestor/descendant lookups) silently fail.
 */
export const bigintTransformer: ValueTransformer = {
  to: (value?: number) => value,
  from: (value: string | null): number | null =>
    value === null ? null : Number(value),
};
