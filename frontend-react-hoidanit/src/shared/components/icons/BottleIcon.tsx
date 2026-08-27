export interface BottleIconProps {
  className?: string;
}

/** Stylized liquor bottle glyph — used as the placeholder illustration wherever a product has no real photo. */
export const BottleIcon = ({ className }: BottleIconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9 2h6" />
    <path d="M9 2v4.3c0 .5-.2 1-.6 1.4L7 9.3A3.5 3.5 0 0 0 6 11.8V19a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-7.2a3.5 3.5 0 0 0-1-2.5l-1.4-1.6a2 2 0 0 1-.6-1.4V2" />
    <path d="M8 12.5h8" />
    <path d="M9 16h6" />
  </svg>
);
