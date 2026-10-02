import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, userEvent, within } from "storybook/test";

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

/** Figma 기본 구성: 좌/우 버튼 모두 노출. 다음 버튼 클릭 시 슬라이드가 전환됩니다. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const track = canvasElement.querySelector(
      '[data-slot="carousel-track"]',
    ) as HTMLElement;
    const nextButton = canvas.getByRole("button", { name: "Next slide" });
    const previousButton = canvas.getByRole("button", {
      name: "Previous slide",
    });

    // 첫 슬라이드에서는 이전 버튼이 disabled 상태여야 합니다.
    await expect(previousButton).toBeDisabled();
    await expect(track.style.transform).toBe("translateX(-0%)");

    await userEvent.click(nextButton);
    await expect(track.style.transform).toBe("translateX(-100%)");
    await expect(previousButton).not.toBeDisabled();

    await userEvent.click(previousButton);
    await expect(track.style.transform).toBe("translateX(-0%)");
  },
};

/** Figma `leftButton=false`에 대응 — 이전 버튼만 숨김(다음 버튼만 노출) */
export const NextButtonOnly: Story = {
  args: {
    showPreviousButton: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.queryByRole("button", { name: "Previous slide" }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Next slide" }),
    ).toBeInTheDocument();
  },
};

/** Figma `rightButton=false`에 대응 — 다음 버튼만 숨김(이전 버튼만 노출) */
export const PreviousButtonOnly: Story = {
  args: {
    showNextButton: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.queryByRole("button", { name: "Next slide" }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Previous slide" }),
    ).toBeInTheDocument();
  },
};

/** `previousDisabled`/`nextDisabled`로 두 버튼을 강제 비활성화한 상태 */
export const Disabled: Story = {
  args: {
    previousDisabled: true,
    nextDisabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const track = canvasElement.querySelector(
      '[data-slot="carousel-track"]',
    ) as HTMLElement;
    const nextButton = canvas.getByRole("button", { name: "Next slide" });
    const previousButton = canvas.getByRole("button", {
      name: "Previous slide",
    });

    await expect(nextButton).toBeDisabled();
    await expect(previousButton).toBeDisabled();

    // disabled 상태에서는 클릭해도 슬라이드가 전환되지 않아야 합니다.
    await userEvent.click(nextButton, { pointerEventsCheck: 0 });
    await expect(track.style.transform).toBe("translateX(-0%)");
  },
};
