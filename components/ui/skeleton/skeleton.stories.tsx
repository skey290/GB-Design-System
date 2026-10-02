import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect } from "storybook/test";

import { Skeleton } from "./skeleton";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=76-10492";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  args: {
    shape: "rect",
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `Type=Rect` (226x157, rounded-2xl) */
export const Rect: Story = {
  args: {
    shape: "rect",
  },
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('[data-slot="skeleton"]');

    await expect(skeleton).toBeInTheDocument();
    await expect(skeleton?.className).toContain(
      "animate-[shimmer_2s_ease-in-out_infinite]",
    );
    await expect(skeleton?.getAttribute("aria-hidden")).toBe("true");
  },
};

/** Figma `Type=Text` (226x27, rounded-md) */
export const Text: Story = {
  args: {
    shape: "text",
  },
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('[data-slot="skeleton"]');

    await expect(skeleton?.className).toContain(
      "rounded-[var(--radius-scale-md)]",
    );
  },
};

/** Figma `Type=Circle` (27x27, rounded-full) */
export const Circle: Story = {
  args: {
    shape: "circle",
  },
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('[data-slot="skeleton"]');

    await expect(skeleton?.className).toContain(
      "rounded-[var(--radius-scale-full)]",
    );
  },
};

/**
 * Figma "Skeleton text" 합성 예시(아바타 + 텍스트 2줄) — 별도 컴포넌트로 export하지 않고
 * 기본 `Skeleton` primitive를 조합해 재현합니다.
 */
export const ListItem: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--spacing-3)]">
      <Skeleton shape="circle" className="size-[32px]" />
      <div className="flex min-w-px flex-1 flex-col items-start gap-[var(--spacing-2)]">
        <Skeleton shape="text" className="h-[15px] w-full" />
        <Skeleton shape="text" className="h-[15px] w-[150px]" />
      </div>
    </div>
  ),
};

/**
 * Figma "Skeleton card" 합성 예시(이미지 + 텍스트 2줄) — 별도 컴포넌트로 export하지 않고
 * 기본 `Skeleton` primitive를 조합해 재현합니다.
 */
export const Card: Story = {
  render: () => (
    <div className="flex w-[261px] flex-col items-start gap-[var(--spacing-3)]">
      <Skeleton shape="rect" className="aspect-[153/89] h-auto w-full" />
      <div className="flex w-full flex-col items-start gap-[var(--spacing-2)]">
        <Skeleton shape="text" className="h-[15px] w-full" />
        <Skeleton shape="text" className="h-[15px] w-[150px]" />
      </div>
    </div>
  ),
};
