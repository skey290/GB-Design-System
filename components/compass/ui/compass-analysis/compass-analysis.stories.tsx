import type { Meta, StoryObj } from "@storybook/nextjs";
import { within, expect } from "storybook/test";

import {
  CompassAnalysis,
  type CompassAnalysisProps,
  type CompassAnalysisSelf,
} from "./compass-analysis";

const FIGMA_URL =
  "https://www.figma.com/design/C34HOpbSASmThFA1iYFm8D/%E2%9D%84%EF%B8%8F-GB_Compass?node-id=8175-10959";

const DEMO_SELVES: CompassAnalysisSelf[] = [
  {
    id: "data-scientist",
    image: "/images/personas/self-default.jpg",
    imageAlt: "Data Scientist",
    qualifiedReach: 8340,
    engagementIntensity: 14.3,
    growth: 55,
  },
  {
    id: "yoga-meditator",
    image: "/images/personas/yoga-meditator.jpg",
    imageAlt: "Yoga Meditator",
    qualifiedReach: 6453,
    engagementIntensity: 1.8,
    growth: 20,
  },
  {
    id: "novelist",
    image: "/images/personas/novelist.jpg",
    imageAlt: "Novelist",
    qualifiedReach: 4784,
    engagementIntensity: 0.4,
    growth: 30,
  },
  {
    id: "entrepreneur",
    image: "/images/personas/entrepreneur.jpg",
    imageAlt: "Entrepreneur",
    qualifiedReach: 978,
    engagementIntensity: 2.0,
    growth: 45,
  },
  {
    id: "fashionista",
    image: "/images/personas/fashionista.jpg",
    imageAlt: "Fashionista",
    qualifiedReach: 6782,
    engagementIntensity: 0.3,
    growth: 10,
  },
  {
    id: "fashion-editor",
    image: "/images/personas/fashion-editor.jpg",
    imageAlt: "Fashion Editor",
    qualifiedReach: 125,
    engagementIntensity: 3.7,
    growth: 65,
  },
  {
    id: "team-leader",
    image: "/images/personas/team-leader.jpg",
    imageAlt: "Team Leader",
    qualifiedReach: 8006,
    engagementIntensity: 0.5,
    growth: 15,
  },
  {
    id: "vegan-chef",
    image: "/images/personas/vegan-chef.jpg",
    imageAlt: "Vegan Chef",
    qualifiedReach: 5431,
    engagementIntensity: 1.9,
    growth: 25,
  },
];

interface CompassAnalysisPlaygroundProps extends Omit<
  CompassAnalysisProps,
  "selves"
> {
  /** How many Selves to show. `selves` is filled to this length before rendering. */
  selfCount: number;
}

function CompassAnalysisPlayground({
  selfCount,
  ...args
}: CompassAnalysisPlaygroundProps) {
  return <CompassAnalysis {...args} selves={DEMO_SELVES.slice(0, selfCount)} />;
}

const meta = {
  title: "Compass/UI/CompassAnalysis",
  component: CompassAnalysisPlayground,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  decorators: [
    // CompassDial's tick lines are pinned to --border-static-white, so they are
    // only visible on a dark surface (same rule as compass-dial.stories.tsx).
    (Story) => (
      <div className="dark bg-[var(--background-default)] p-[var(--spacing-24)]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    type: {
      control: "radio",
      options: ["potential", "reach", "engagement", "reach-and-engagement"],
    },
    potentialVariant: {
      control: "radio",
      options: ["potential", "potential-estimate", "potential-error"],
    },
    isDataCollected: { control: "boolean" },
    label: { control: "text" },
    selfCount: {
      control: { type: "range", min: 1, max: 8, step: 1 },
    },
  },
  args: {
    type: "reach-and-engagement",
    isDataCollected: true,
    selfCount: 8,
  },
} satisfies Meta<typeof CompassAnalysisPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("1st")).toBeInTheDocument();
  },
};
