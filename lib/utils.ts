import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// List of custom typography utilities from src/tokens/text-styles.css (.text-xs-medium, etc).
// tailwind-merge infers conflict groups from the class name alone, and since these classes
// start with "text-", they were being mistaken for the same group as Tailwind's text color
// utilities (text-primary-foreground, etc), causing one of the two to get dropped. Registering
// them as a separate group prevents that.
const TYPOGRAPHY_SIZES = [
  "xxs",
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
];
const TYPOGRAPHY_WEIGHTS = [
  "thin",
  "extra-light",
  "light",
  "regular",
  "medium",
  "semi-bold",
  "bold",
  "extra-bold",
  "black",
];
const TYPOGRAPHY_PRESET_CLASSES = [
  ...TYPOGRAPHY_SIZES.flatMap((size) =>
    TYPOGRAPHY_WEIGHTS.map((weight) => `${size}-${weight}`),
  ),
  "time-stamp",
];

const twMerge = extendTailwindMerge<"gb-text-style">({
  extend: {
    classGroups: {
      "gb-text-style": [{ text: TYPOGRAPHY_PRESET_CLASSES }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
