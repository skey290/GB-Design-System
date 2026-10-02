import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import { InputPhone } from "./input-phone";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%E2%9D%84%EF%B8%8F-GB_Design-System-%E2%80%94-Atom?node-id=3525-8236";

const COUNTRY_CODE_OPTIONS = [
  { value: "kr", label: "South Korea", code: "+82" },
  { value: "us", label: "United States", code: "+1" },
  { value: "jp", label: "Japan", code: "+81" },
  { value: "cn", label: "China", code: "+86" },
];

const meta = {
  title: "UI/InputPhone",
  component: InputPhone,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  args: {
    countryCodeOptions: COUNTRY_CODE_OPTIONS,
    onCountryCodeChange: fn(),
    onValueChange: fn(),
  },
  argTypes: {
    value: { control: false },
    countryCode: { control: false },
  },
} satisfies Meta<typeof InputPhone>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `status=default` — 예시 텍스트는 실제 값이 아니라 네이티브
 * `placeholder`(`muted-foreground` 색상)로 표시됩니다. */
export const Default: Story = {
  args: {
    defaultCountryCode: "cn",
    placeholder: "248-685-5641",
  },
};

/** Figma `status=active` — 실제로는 prop이 아니라 전화번호 `<input>`의
 * `:hover`/`:focus` CSS 상태입니다(2026-08-02부터, 이전엔 `:focus-visible`).
 * placeholder만 있는 빈 필드를 클릭하면(지울 값 자체가 없으므로) 곧바로 빈
 * 캐럿이 깜빡입니다. `:focus`는 마우스 클릭에서도 정상적으로 발생하므로
 * `userEvent.click()`만으로 실제 시각 상태를 재현할 수 있어, 이전에 쓰던
 * `storybook-addon-pseudo-states` 강제 표시 우회는 더 이상 필요하지 않습니다. */
export const Active: Story = {
  args: {
    defaultCountryCode: "cn",
    placeholder: "248-685-5641",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const phoneInput = canvas.getByRole("textbox");

    await userEvent.click(phoneInput);

    await expect(phoneInput).toHaveFocus();
  },
};

/** 사용자가 이미 입력해 둔 실제 값이 있는 경우 — placeholder와 달리 클릭해도
 * 지워지지 않고, 클릭한 위치에 캐럿이 위치합니다(브라우저 기본 동작). */
export const FilledValue: Story = {
  name: "Filled (User Value)",
  args: {
    defaultCountryCode: "cn",
    defaultValue: "248-685-5641",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const phoneInput = canvas.getByDisplayValue("248-685-5641");

    await userEvent.click(phoneInput);

    await expect(phoneInput).toHaveFocus();
    await expect(phoneInput).toHaveValue("248-685-5641");
  },
};

export const Disabled: Story = {
  args: {
    defaultCountryCode: "cn",
    placeholder: "248-685-5641",
    disabled: true,
  },
};

export const TypingInteraction: Story = {
  name: "Typing / Interaction",
  args: {
    defaultCountryCode: "us",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const phoneInput = canvas.getByRole("textbox");

    await userEvent.type(phoneInput, "555-0100");

    await expect(args.onValueChange).toHaveBeenCalled();
    await expect(phoneInput).toHaveValue("555-0100");
  },
};
