export interface ImageStyleOption {
  id: string;
  label: string;
  thumbnailSrc: string;
}

/**
 * Figma `Part/Asset Gallery` → `image style option` (node `8828:17517`) fixes
 * this at exactly these 4 styles, so this is a closed list, not a prop.
 */
export const IMAGE_STYLE_OPTIONS: readonly ImageStyleOption[] = [
  {
    id: "artistic-duotone",
    label: "Artistic Duotone",
    thumbnailSrc: "/images/styles/artistic-duotone.jpg",
  },
  {
    id: "monochrome",
    label: "Monochrome",
    thumbnailSrc: "/images/styles/monochrome.jpg",
  },
  {
    id: "editorial",
    label: "Editorial",
    thumbnailSrc: "/images/styles/editorial.jpg",
  },
  {
    id: "deep-chroma",
    label: "Deep Chroma",
    thumbnailSrc: "/images/styles/deep-chroma.jpg",
  },
];
