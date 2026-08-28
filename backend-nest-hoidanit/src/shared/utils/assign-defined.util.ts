/**
 * Safer alternative to `Object.assign(entity, dto)` for partial (PATCH) updates.
 *
 * DTO classes compiled at ES2022+ (`useDefineForClassFields`) declare every
 * optional field as an own property with value `undefined` even when the
 * request omitted it — plain `Object.assign` would blast those untouched
 * fields on the entity to `undefined`. This copies over only the keys the
 * caller actually provided.
 */
export function assignDefined<T extends object>(
  target: T,
  source: Partial<Record<keyof T, unknown>>,
): T {
  for (const [key, value] of Object.entries(source)) {
    if (value !== undefined) {
      (target as Record<string, unknown>)[key] = value;
    }
  }
  return target;
}
