import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within } from "storybook/test";

import { CompassSphere } from "./compass-sphere";

const FIGMA_URL =
  "https://www.figma.com/make/HdX0Ax0ci2ll4V2YMDsBTJ/%F0%9F%93%A6-GB_Interaction_Compass-Data-Visualization";

const meta = {
  title: "Compass/UI/CompassSphere",
  component: CompassSphere,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  decorators: [
    // The component is size-full, so the demo needs a fixed-height container.
    (Story) => (
      <div className="h-[480px] w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CompassSphere>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Verify the three.js canvas mounts and the default badge label is in the DOM */
export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const mount = canvasElement.querySelector("canvas");
    await expect(mount).toBeInTheDocument();
    await expect(canvas.getByText("Gabrielle.ai")).toBeInTheDocument();
  },
};
