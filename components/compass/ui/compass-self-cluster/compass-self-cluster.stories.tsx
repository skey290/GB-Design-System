import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import {
  CompassSelfCluster,
  type CompassSelfClusterProps,
} from "./compass-self-cluster";

const FIGMA_URL =
  "https://www.figma.com/design/C34HOpbSASmThFA1iYFm8D/%E2%9D%84%EF%B8%8F-GB_Compass?node-id=8003-11059";

const DEMO_IMAGES = [
  "/images/personas/entrepreneur.jpg",
  "/images/personas/fashion-editor.jpg",
  "/images/personas/fashionista.jpg",
  "/images/personas/novelist.jpg",
  "/images/personas/self-default.jpg",
  "/images/personas/team-leader.jpg",
  "/images/personas/vegan-chef.jpg",
  "/images/personas/yoga-meditator.jpg",
];

const EIGHT_SELVES = DEMO_IMAGES.map((image, i) => ({
  image,
  imageAlt: `Self ${i + 1}`,
  growth: (i + 1) * 10,
  estimate: i % 2 === 0,
}));

interface CompassSelfClusterPlaygroundProps extends Omit<
  CompassSelfClusterProps,
  "selves"
> {
  /** How many Selves to show. `selves` is filled to this length before rendering. */
  selfCount: number;
}

function CompassSelfClusterPlayground({
  selfCount,
  ...args
}: CompassSelfClusterPlaygroundProps) {
  return (
    <CompassSelfCluster {...args} selves={EIGHT_SELVES.slice(0, selfCount)} />
  );
}

const meta = {
  title: "Compass/UI/CompassSelfCluster",
  component: CompassSelfClusterPlayground,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  // The potential-growth decorations (ring, connector, badge) are designed without
  // clipping and deliberately overflow the 413×415 frame by up to ~130px in the Figma
  // original — generous padding keeps them from being cut off on the Storybook canvas.
  decorators: [
    (Story) => (
      <div className="dark bg-[var(--background-default)] p-[160px]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: "radio",
      options: [
        "reach-or-engagement",
        "potential",
        "potential-estimate",
        "potential-error",
      ],
    },
    label: { control: "text" },
    selfCount: {
      control: { type: "range", min: 1, max: 8, step: 1 },
    },
  },
  args: {
    variant: "potential-estimate",
    label: "Reach",
    selfCount: 3,
    onSelfClick: fn(),
    onEmptySlotClick: fn(),
    onRetry: fn(),
  },
} satisfies Meta<typeof CompassSelfClusterPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
