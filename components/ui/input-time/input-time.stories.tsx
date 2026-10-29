import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputTime, type InputTimeProps } from "./input-time";
import { makeStatusSource } from "../../../.storybook/status-source";

/** Matched 1:1 with the values of the Figma `Status` axis. */
type InputTimeStatus = "default" | "filled" | "active" | "disabled" | "error";

/** Which rejected keystroke `error` previews — an out-of-range digit for
 * hours/minutes, or a non-digit character (both show the same message, but
 * are rejected by different code paths). */
type InputTimeErrorType = "hours" | "minutes" | "nonDigit";

const STATUS_PROPS: Record<InputTimeStatus, Partial<InputTimeProps>> = {
  default: { defaultValue: "" },
  filled: { defaultValue: "1100" },
  active: {
    className:
      "pseudo-focus pseudo-focus-all pseudo-focus-within pseudo-focus-within-all",
  },
  disabled: { defaultValue: "1100", disabled: true },
  // `error` has no prop (it only happens live, from typing an out-of-range
  // value) — InputTimeErrorPreview below simulates that keystroke instead.
  error: {},
};

/** Native keystrokes (see InputTimeErrorPreview) that land on each message —
 * "13" rejects as an out-of-range hour, "12" + "7" as an out-of-range
 * minute, and a bare "a" rejects as a non-digit character. */
const ERROR_TYPE_KEYSTROKES: Record<InputTimeErrorType, string[]> = {
  hours: ["1__:__", "13_:__"],
  minutes: ["1__:__", "12_:__", "12:7__"],
  nonDigit: ["a__:__"],
};

/**
 * `error` isn't a settable prop — it's validation feedback from a real
 * keystroke, so `defaultValue` alone can't reproduce it (the initial value
 * is never validated). This simulates typing an out-of-range hour or minute
 * on mount (picked by the story-only `errorType` control), bypassing React's
 * controlled-input setter the same way a real keypress would, and re-fires
 * it every 1.5s since the real component auto-dismisses the warning after
 * 2s of no further typing.
 */
function InputTimeErrorPreview({
  errorType,
  ...props
}: InputTimeProps & { errorType: InputTimeErrorType }) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const input = rootRef.current?.querySelector("input");
    if (!input) return;
    const setNativeValue = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )!.set!;
    const type = (value: string) => {
      setNativeValue.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const keystrokes = ERROR_TYPE_KEYSTROKES[errorType];
    const triggerRejection = () => keystrokes.forEach(type);

    input.focus();
    triggerRejection();
    const intervalId = window.setInterval(triggerRejection, 1500);
    return () => window.clearInterval(intervalId);
  }, [errorType]);

  return (
    <div ref={rootRef} key={errorType}>
      <InputTime {...props} />
    </div>
  );
}

type StoryArgs = Omit<InputTimeProps, "defaultValue" | "disabled"> & {
  status: InputTimeStatus;
  errorType: InputTimeErrorType;
};

const meta = {
  title: "UI/InputTime",
  component: InputTime,
  tags: ["autodocs"],
  parameters: {
    // Hide the duplicate controls since `status` drives them instead
    controls: { exclude: ["disabled", "defaultValue"] },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=588-108",
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A labelled time field — a masked hh:mm input plus an AM/PM toggle. Typing is constrained so only valid hours (1–12) and minutes (00–59) can be entered. Use Date select for a calendar date.",
      },
      source: {
        transform: makeStatusSource("InputTime", STATUS_PROPS, {
          cssOnly: ["active"],
          omit: ["errorType"],
          noPropNotes: {
            error:
              "`error` has no prop — pick errorType above to preview the hours/minutes message, or type an out-of-range value yourself.",
          },
        }),
      },
    },
  },
  render: ({ status, errorType, ...args }) =>
    status === "error" ? (
      <InputTimeErrorPreview key={status} errorType={errorType} {...args} />
    ) : (
      <InputTime key={status} {...args} {...STATUS_PROPS[status]} />
    ),
  args: {
    label: "Time to post",
    status: "default",
    errorType: "hours",
    defaultPeriod: "AM",
    showDelete: false,
    showTitle: true,
    onValueChange: fn(),
    onPeriodChange: fn(),
    onDelete: fn(),
  },
  argTypes: {
    shouldFitContainer: {
      control: "boolean",
      description: "Fill the parent width instead of the fixed 320px",
    },
    label: { control: "text" },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `active` is the focus CSS state; `error` previews the live-validation warning by simulating an invalid keystroke",
    },
    errorType: {
      control: "radio",
      options: ["hours", "minutes", "nonDigit"] satisfies InputTimeErrorType[],
      if: { arg: "status", eq: "error" },
      description:
        "Story-only: which rejected keystroke `error` previews — an out-of-range digit, or a non-digit character",
    },
    showDelete: { control: "boolean" },
    showTitle: { control: "boolean" },
    defaultPeriod: {
      control: "radio",
      options: ["AM", "PM"],
    },
    value: { control: false },
    period: { control: false },
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
