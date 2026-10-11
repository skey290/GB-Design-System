import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Input, type InputProps } from "./input";
import { makeStatusSource } from "../../../.storybook/status-source";

const MBTI_OPTIONS = [
  { value: "ISTJ", label: "ISTJ" },
  { value: "ISFJ", label: "ISFJ" },
  { value: "INTJ", label: "INTJ" },
  { value: "INFJ", label: "INFJ" },
  { value: "ISTP", label: "ISTP" },
  { value: "ISFP", label: "ISFP" },
];

/** Figma `Status` 축의 값과 1:1로 맞춘 목록. */
type InputStatus = "default" | "active" | "filled";

const STATUS_PROPS: Record<InputStatus, Partial<InputProps>> = {
  default: {},
  active: { className: "pseudo-focus-within pseudo-focus-within-all" },
  filled: {
    textfieldValue: "gabrielle",
    file: new File([], "File.pdf", { type: "application/pdf" }),
    selectValue: "INTJ",
    linkValue: "https://gabrielle.ai",
  },
};

/** 네 행의 값은 모두 제어 prop이라, 스토리에서도 타이핑·선택이 되도록 상태를 쥐어 준다. */
function ControlledInput({
  textfieldValue,
  selectValue,
  linkValue,
  file,
  onTextfieldValueChange,
  onSelectValueChange,
  onLinkValueChange,
  onFileChange,
  ...props
}: InputProps) {
  const [textfield, setTextfield] = React.useState(textfieldValue ?? "");
  const [select, setSelect] = React.useState(selectValue ?? "");
  const [link, setLink] = React.useState(linkValue ?? "");
  const [currentFile, setCurrentFile] = React.useState<File | null>(
    file ?? null,
  );

  return (
    <Input
      {...props}
      textfieldValue={textfield}
      onTextfieldValueChange={(value) => {
        setTextfield(value);
        onTextfieldValueChange?.(value);
      }}
      selectValue={select}
      onSelectValueChange={(value) => {
        setSelect(value);
        onSelectValueChange?.(value);
      }}
      linkValue={link}
      onLinkValueChange={(value) => {
        setLink(value);
        onLinkValueChange?.(value);
      }}
      file={currentFile}
      onFileChange={(next) => {
        setCurrentFile(next);
        onFileChange?.(next);
      }}
    />
  );
}

type StoryArgs = Omit<
  InputProps,
  "textfieldValue" | "selectValue" | "linkValue" | "file"
> & {
  status: InputStatus;
};

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    // `status`가 대신 제어하므로 중복 컨트롤을 숨긴다
    controls: {
      exclude: ["textfieldValue", "selectValue", "linkValue", "file"],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=5084-3716",
    },
    docs: {
      // Figma 컴포넌트 description 필드 원문
      description: { component: "A labelled single-line text field — a label above and the input box (Part/Input) below. Use Input search for a search query, Input time for a time value, and Input phone for a number with a country code." },
      source: {
        transform: makeStatusSource("Input", STATUS_PROPS, {
          cssOnly: ["active"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <ControlledInput key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` 축. `active`는 행별 `:focus-within` CSS 상태라 캔버스에서 직접 클릭해 봐도 된다",
    },
    showTextfield: { control: "boolean" },
    showUpload: { control: "boolean" },
    showSelect: { control: "boolean" },
    showLink: { control: "boolean" },
    textfieldPlaceholder: { control: "text" },
    uploadPlaceholder: { control: "text" },
    selectPlaceholder: { control: "text" },
    linkPlaceholder: { control: "text" },
    selectOptions: { control: false },
  },
  args: {
    status: "default",
    showTextfield: true,
    showUpload: true,
    showSelect: true,
    showLink: true,
    selectOptions: MBTI_OPTIONS,
    onFileChange: fn(),
    onTextfieldValueChange: fn(),
    onSelectValueChange: fn(),
    onLinkValueChange: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
