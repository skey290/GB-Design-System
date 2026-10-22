import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputForm, type InputFormProps } from "./input-form";
import { makeStatusSource } from "../../../.storybook/status-source";

const MBTI_OPTIONS = [
  { value: "ISTJ", label: "ISTJ" },
  { value: "ISFJ", label: "ISFJ" },
  { value: "INTJ", label: "INTJ" },
  { value: "INFJ", label: "INFJ" },
  { value: "ISTP", label: "ISTP" },
  { value: "ISFP", label: "ISFP" },
];

/** Matched 1:1 with the values of the Figma `Status` axis. */
type InputFormStatus = "default" | "active" | "filled";

const STATUS_PROPS: Record<InputFormStatus, Partial<InputFormProps>> = {
  default: {},
  active: { className: "pseudo-focus-within pseudo-focus-within-all" },
  filled: {
    textfieldValue: "gabrielle",
    file: new File([], "File.pdf", { type: "application/pdf" }),
    selectValue: "INTJ",
    linkValue: "https://gabrielle.ai",
  },
};

/** All four rows are controlled props, so the story holds state to keep typing and selecting working. */
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
}: InputFormProps) {
  const [textfield, setTextfield] = React.useState(textfieldValue ?? "");
  const [select, setSelect] = React.useState(selectValue ?? "");
  const [link, setLink] = React.useState(linkValue ?? "");
  const [currentFile, setCurrentFile] = React.useState<File | null>(
    file ?? null,
  );

  return (
    <InputForm
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
  InputFormProps,
  "textfieldValue" | "selectValue" | "linkValue" | "file"
> & {
  status: InputFormStatus;
};

const meta = {
  title: "UI/InputForm",
  component: InputForm,
  tags: ["autodocs"],
  parameters: {
    // Hide the duplicate controls since `status` drives them instead
    controls: {
      exclude: ["textfieldValue", "selectValue", "linkValue", "file"],
    },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=5084-3716",
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A labelled single-line text field — a label above and the input box (Part/Input) below. Use Input search for a search query, Input time for a time value, and Input phone for a number with a country code.",
      },
      source: {
        transform: makeStatusSource("InputForm", STATUS_PROPS, {
          cssOnly: ["active"],
        }),
      },
    },
  },
  render: ({ status, ...args }) => (
    <ControlledInput key={status} {...args} {...STATUS_PROPS[status]} />
  ),
  argTypes: {
    shouldFitContainer: {
      control: "boolean",
      description: "Fill the parent width instead of the fixed 320px",
    },
    title: { control: "text" },
    description: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `active` is each row's `:focus-within` CSS state — click the canvas directly to see it",
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
