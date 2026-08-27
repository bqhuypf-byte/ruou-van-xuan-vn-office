export interface VariantAttributeGroup {
  name: string;
  values: string[];
  /** Optional per-value thumbnail (only meaningful for the first/primary group), keyed by the value string. */
  images?: Record<string, string>;
}
