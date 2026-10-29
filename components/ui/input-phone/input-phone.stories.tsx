import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { InputPhone, type InputPhoneProps } from "./input-phone";
import { makeStatusSource } from "../../../.storybook/status-source";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3525-8236";

/** Matched 1:1 with the values of the Figma `Status` axis. */
type InputPhoneStatus = "default" | "filled" | "disabled" | "error";

const STATUS_PROPS: Record<InputPhoneStatus, Partial<InputPhoneProps>> = {
  default: {},
  filled: { defaultValue: "248-685-5641", defaultCountryCode: "us" },
  disabled: { disabled: true },
  // `error` itself has no prop — InputPhoneErrorPreview below supplies the
  // base props per `errorType` instead (see ERROR_TYPE_SCENARIOS).
  error: {},
};

/** The three ways a keystroke gets rejected (`PhoneValidationField` in
 * input-phone.tsx), each with its own message — kept selectable here so a
 * consumer can preview all three without reading the source. */
type ErrorType = "noCountry" | "digitLimit" | "nonNumeric";

const ERROR_TYPE_SCENARIOS: Record<
  ErrorType,
  { props: Partial<InputPhoneProps>; keystroke: string }
> = {
  noCountry: { props: {}, keystroke: "2" },
  digitLimit: {
    props: { defaultCountryCode: "us", defaultValue: "248-685-5641" },
    keystroke: "9",
  },
  nonNumeric: { props: { defaultCountryCode: "us" }, keystroke: "a" },
};

/**
 * `error` isn't a settable prop — it's validation feedback from a real
 * keystroke. This simulates typing the rejected keystroke for the chosen
 * `errorType` on mount, bypassing React's controlled-input setter the same
 * way a real keypress would, and re-fires it every 1.5s since the real
 * component auto-dismisses the warning after 2s of no further typing.
 */
function InputPhoneErrorPreview(
  props: InputPhoneProps & { errorType: ErrorType },
) {
  const { errorType, ...rest } = props;
  const scenario = ERROR_TYPE_SCENARIOS[errorType];
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const input =
      rootRef.current?.querySelector<HTMLInputElement>('input[type="tel"]');
    if (!input) return;
    const setNativeValue = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )!.set!;
    // Appends to whatever's currently rendered, like a real keystroke at the
    // end of the field — not a full replace, or digitLimit (which needs an
    // already-maxed-out value to overflow) would never actually overflow.
    const type = (keystroke: string) => {
      setNativeValue.call(input, input.value + keystroke);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };

    input.focus();
    type(scenario.keystroke);
    const intervalId = window.setInterval(() => type(scenario.keystroke), 1500);
    return () => window.clearInterval(intervalId);
  }, [scenario.keystroke]);

  return (
    <div ref={rootRef}>
      <InputPhone {...rest} {...scenario.props} />
    </div>
  );
}

type StoryArgs = Omit<
  InputPhoneProps,
  "defaultValue" | "defaultCountryCode" | "disabled"
> & {
  status: InputPhoneStatus;
  errorType: ErrorType;
};

const meta = {
  title: "UI/InputPhone",
  component: InputPhone,
  tags: ["autodocs"],
  parameters: {
    // Hide the duplicate controls since `status` drives them instead
    controls: { exclude: ["disabled", "defaultValue", "defaultCountryCode"] },
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      // Verbatim text from the Figma component's description field
      description: {
        component:
          "A labelled phone-number field — a country-code dropdown on the left and the number input on the right. The dropdown is a Select, defaulting to the full country list from libphonenumber-js; the consumer can narrow it with countryCodeOptions.",
      },
      source: {
        transform: makeStatusSource("InputPhone", STATUS_PROPS, {
          omit: ["errorType"],
          noPropNotes: {
            error:
              "`error` has no prop — use the errorType control to preview each rejected-keystroke case.",
          },
        }),
      },
    },
  },
  render: ({ status, errorType, ...args }) =>
    status === "error" ? (
      <InputPhoneErrorPreview
        key={`${status}-${errorType}`}
        {...args}
        errorType={errorType}
      />
    ) : (
      <InputPhone key={status} {...args} {...STATUS_PROPS[status]} />
    ),
  argTypes: {
    shouldFitContainer: {
      control: "boolean",
      description: "Fill the parent width instead of the fixed 320px",
    },
    label: { control: "text" },
    placeholder: { control: "text" },
    searchPlaceholder: {
      control: "text",
      description: "Placeholder for the country search box",
    },
    status: {
      control: "radio",
      options: Object.keys(STATUS_PROPS),
      description:
        "Figma `Status` axis. `error` previews the live-validation warning by simulating an invalid keystroke",
    },
    errorType: {
      control: "radio",
      options: Object.keys(ERROR_TYPE_SCENARIOS),
      description:
        "Which rejected keystroke to simulate — only shown when status is `error`",
      if: { arg: "status", eq: "error" },
    },
    value: { control: false },
    countryCode: { control: false },
    countryCodeOptions: { control: false },
  },
  args: {
    placeholder: "248-685-5641",
    status: "default",
    errorType: "nonNumeric",
    onCountryCodeChange: fn(),
    onValueChange: fn(),
  },
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
