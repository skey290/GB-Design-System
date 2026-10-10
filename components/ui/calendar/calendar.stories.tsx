import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Calendar, type CalendarRangeValue } from "./calendar";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7219-10699";

interface PlaygroundArgs {
  mode: "single" | "range";
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  events?: Record<string, "published" | "reserved" | "draft">;
  onValueChange?: (value: Date | CalendarRangeValue) => void;
}

// mode가 바뀌면 value의 타입 자체가 Date ↔ {from,to}로 바뀌므로, 두 모드의 상태를
// 각각 들고 있다가 현재 mode에 맞는 쪽만 Calendar에 넘긴다.
function ControlledCalendar({ mode, onValueChange, ...rest }: PlaygroundArgs) {
  const [singleValue, setSingleValue] = React.useState<Date | undefined>(
    new Date(2026, 8, 13),
  );
  const [rangeValue, setRangeValue] = React.useState<
    CalendarRangeValue | undefined
  >({ from: new Date(2026, 8, 5), to: new Date(2026, 8, 20) });

  if (mode === "range") {
    return (
      <Calendar
        {...rest}
        mode="range"
        value={rangeValue}
        onValueChange={(next) => {
          setRangeValue(next);
          onValueChange?.(next);
        }}
      />
    );
  }

  return (
    <Calendar
      {...rest}
      mode="single"
      value={singleValue}
      onValueChange={(next) => {
        setSingleValue(next);
        onValueChange?.(next);
      }}
    />
  );
}

const meta = {
  title: "UI/Calendar",
  component: ControlledCalendar,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  argTypes: {
    mode: {
      control: "radio",
      options: ["single", "range"],
    },
  },
  args: {
    mode: "single",
    events: {
      "2026-09-01": "published",
      "2026-09-09": "reserved",
      "2026-09-17": "draft",
    },
    onValueChange: fn(),
  },
} satisfies Meta<typeof ControlledCalendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
