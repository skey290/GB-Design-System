import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../app/**/*.mdx",
    "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.mdx",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  staticDirs: ["../public"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-designs",
    "storybook-dark-mode",
    // Lets hover, focus, and active be pinned on, so states that normally require a
    // mouse can be compared side by side with Figma.
    "storybook-addon-pseudo-states",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
