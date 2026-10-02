import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { InputBasic } from "./input-basic";

const meta = {
  title: "UI/InputBasic",
  component: InputBasic,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=588-108",
    },
  },
  args: {
    onValueChange: fn(),
    onPeriodChange: fn(),
    onDelete: fn(),
  },
  argTypes: {
    value: { control: false },
    period: { control: false },
  },
} satisfies Meta<typeof InputBasic>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `Status=default` (node-id 3764:11821) */
export const Default: Story = {};

/** Figma `Status=active` (node-id 3764:11827) — 실제로는 prop이 아니라
 * `Input`의 `:hover`/`:focus` CSS 상태입니다. 스토리에서 포커스를 강제로
 * 트리거해 시각적으로 확인합니다. */
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Time to post");

    await userEvent.click(input);

    await expect(input).toHaveFocus();
    await expect(input).toHaveValue("__:__");
  },
};

/** Figma `Status=filled` (node-id 4930:6507) — 실제 값이 입력되면 예시
 * placeholder 색(muted)이 아니라 기본 텍스트 색으로 표시됩니다. */
export const Filled: Story = {
  args: {
    defaultValue: "1100",
    defaultPeriod: "AM",
  },
};

/** Figma `Status=disabled` (node-id 4927:7332) */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "1100",
  },
};

/** Figma `propDelete=true` (숨은 nested 인스턴스 `7329:4687`, `Status=default`
 * 조합) — 행 우측 끝에 원형 X 삭제 버튼이 추가로 나타납니다. 클릭하면
 * `onDelete`만 호출되고, 실제 필드 제거는 부모(스토리 밖)의 책임입니다. */
export const Deletable: Story = {
  args: {
    showDelete: true,
    defaultValue: "1100",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const deleteButton = canvas.getByRole("button", { name: "Delete" });

    await userEvent.click(deleteButton);

    await expect(args.onDelete).toHaveBeenCalledTimes(1);
  },
};

/** Figma `propDelete=true` + `Status=disabled` (숨은 nested 인스턴스
 * `7329:4675`) — 삭제 버튼도 함께 disabled 룩(옅은 배경/보더, 흐린 아이콘)으로
 * 바뀌고, 클릭해도 `onDelete`가 호출되지 않습니다. */
export const DisabledDeletable: Story = {
  args: {
    disabled: true,
    showDelete: true,
    defaultValue: "1100",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const deleteButton = canvas.getByRole("button", { name: "Delete" });

    await expect(deleteButton).toBeDisabled();

    await userEvent.click(deleteButton);

    await expect(args.onDelete).not.toHaveBeenCalled();
  },
};

/** Figma `Status=error` (node-id 4723:1249) — 분(0~59) 범위를 벗어난 입력은
 * 마스크에 채워지지 않고 에러 보더/문구가 표시됩니다. */
export const MinutesOutOfRange: Story = {
  name: "Minutes Out of Range",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText<HTMLInputElement>("Time to post");

    await userEvent.click(input);
    await userEvent.keyboard("126"); // 분 십의 자리는 0~5만 허용, "6"은 거부되어야 함

    await expect(input).toHaveValue("12:__");
    await expect(
      canvas.getByText("Minutes must be between 0 and 59."),
    ).toBeInTheDocument();
  },
};

/** 시(1~12) 범위를 벗어난 입력도 동일하게 거부됩니다. */
export const HoursOutOfRange: Story = {
  name: "Hours Out of Range",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText<HTMLInputElement>("Time to post");

    await userEvent.click(input);
    await userEvent.keyboard("13"); // "1" 유효, "3"은 10~19 범위라 거부되어야 함

    await expect(input).toHaveValue("1_:__");
    await expect(
      canvas.getByText("Hours must be between 1 and 12."),
    ).toBeInTheDocument();
  },
};

/** Figma에는 없지만 명백히 상호 배타적인 선택지라 실제로 동작하는
 * radiogroup으로 구현한 AM/PM 토글 — 클릭으로 선택값이 바뀌는지 확인합니다. */
export const PeriodToggleInteraction: Story = {
  name: "AM/PM Toggle Interaction",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const pmButton = canvas.getByRole("radio", { name: "PM" });

    await expect(canvas.getByRole("radio", { name: "AM" })).toHaveAttribute(
      "aria-checked",
      "true",
    );

    await userEvent.click(pmButton);

    await expect(pmButton).toHaveAttribute("aria-checked", "true");
    await expect(args.onPeriodChange).toHaveBeenLastCalledWith("PM");
  },
};

/** default(비포커스)일 땐 예시 시간 placeholder를 보여주다가, 클릭(포커스)
 * 하면 빈 자리가 `_`로 표시되는 HH:MM 숫자 마스크로 전환됩니다 — 숫자만
 * 좌측부터 채워지고, backspace는 마지막으로 채운 자리 하나만 지웁니다. 빈 값
 * 상태에서는 어디를 클릭해도 캐럿이 항상 맨 앞(0)에 위치해야 합니다(클릭
 * 좌표를 따라가는 건 이미 값이 있을 때만). */
export const TimeMaskInteraction: Story = {
  name: "HH:MM Mask Interaction",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText<HTMLInputElement>("Time to post");

    await expect(input).toHaveValue("");
    await expect(input).toHaveAttribute("placeholder", "11:00");

    // 오른쪽 끝 쪽을 클릭해도(레이스 컨디션 재현 조건) 캐럿은 항상 0이어야 함
    await userEvent.pointer({
      keys: "[MouseLeft]",
      target: input,
      coords: { x: input.getBoundingClientRect().width - 4, y: 8 },
    });
    await expect(input).toHaveValue("__:__");
    await expect(input.selectionStart).toBe(0);
    await expect(input.selectionEnd).toBe(0);

    await userEvent.keyboard("12a3");

    await expect(input).toHaveValue("12:3_");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("12:3_");

    await userEvent.keyboard("{Backspace}");

    await expect(input).toHaveValue("12:__");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("12:__");
  },
};
