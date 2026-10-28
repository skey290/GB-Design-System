import type { Preview } from "@storybook/nextjs";
import * as React from "react";
import { useEffect } from "react";
import { DocsContainer } from "@storybook/addon-docs/blocks";
import { useDarkMode } from "storybook-dark-mode";
import { themes } from "storybook/theming";
import { Bitcount_Grid_Single, Inter } from "next/font/google";
import {
  decorators as pseudoStateDecorators,
  initialGlobals as pseudoStateInitialGlobals,
} from "storybook-addon-pseudo-states/preview";
import "../app/globals.css";

// Same reason as app/layout.tsx (--font-sans → --font-inter, referenced by the text
// styles in text-styles.css) — Storybook does not go through app/layout.tsx, so it
// has to be loaded separately.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Same reason as app/layout.tsx (--font-time-stamp, referenced by .text-time-stamp)
// — Storybook does not go through app/layout.tsx, so it has to be loaded separately.
const bitcountGridSingle = Bitcount_Grid_Single({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-time-stamp",
  display: "swap",
});

// The real value of --background-default, so the Docs body shares the story canvas background.
const docsDarkTheme = {
  ...themes.dark,
  appBg: "#0a0a0a",
  appContentBg: "#0a0a0a",
};
const docsLightTheme = {
  ...themes.light,
  appBg: "#ffffff",
  appContentBg: "#ffffff",
};

function ThemedDocsContainer(
  props: React.ComponentProps<typeof DocsContainer>,
) {
  const isDark = useDarkMode();
  return (
    <DocsContainer {...props} theme={isDark ? docsDarkTheme : docsLightTheme} />
  );
}

const preview: Preview = {
  tags: ["autodocs"],
  initialGlobals: {
    ...pseudoStateInitialGlobals,
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      stylePreview: true,
      dark: { ...themes.dark, appPreviewBg: "#0a0a0a" },
      light: { ...themes.light, appPreviewBg: "#ffffff" },
    },
    // The background, border, and code-block colors of the Docs body
    // (.sbdocs-wrapper) are decided by the DocsContainer theme inside the preview
    // iframe. Without passing a theme it stays pinned to a white background even in
    // dark mode, hiding the white text that follows the `.dark` tokens.
    docs: {
      container: ThemedDocsContainer,
    },
  },
  decorators: [
    (Story) => {
      const isDark = useDarkMode();
      useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        document.documentElement.classList.add(
          inter.variable,
          bitcountGridSingle.variable,
        );
      }, [isDark]);
      return Story();
    },
    ...pseudoStateDecorators,
  ],
};

export default preview;
