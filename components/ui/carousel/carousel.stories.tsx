import type { Meta, StoryObj } from "@storybook/nextjs";

import { Carousel } from "./carousel";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=479-736";

/** 스토리 데모용 슬라이드 콘텐츠. Figma Slot 크기(318×360)를 그대로 재현합니다. */
function DemoSlide({ label }: { label: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-[var(--radius-scale-lg)] border-[length:var(--border-1)] border-border bg-accent text-sm-medium text-foreground"
      data-testid={`slide-${label}`}
    >
      {label}
    </div>
  );
}

const meta = {
  title: "UI/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    showPreviousButton: { control: "boolean" },
    showNextButton: { control: "boolean" },
    previousDisabled: { control: "boolean" },
    nextDisabled: { control: "boolean" },
  },
  args: {
    // `render`가 항상 자체 DemoSlide 목록을 렌더링하므로 실제로는 사용되지 않지만,
    // `children`이 필수 prop이라 CSF3 meta 타입을 만족시키기 위한 placeholder입니다.
    children: null,
    showPreviousButton: true,
    showNextButton: true,
  },
  render: (args) => (
    <div className="h-[360px] w-[318px]">
      <Carousel {...args}>
        <DemoSlide label="Slide 1" />
        <DemoSlide label="Slide 2" />
        <DemoSlide label="Slide 3" />
      </Carousel>
    </div>
  ),
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
