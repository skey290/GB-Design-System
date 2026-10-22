import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Archive, Eraser, FileText, Goal } from "lucide-react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

import { DropdownList, type DropdownListOption } from "./dropdown-list";
import { InputSearch } from "@/components/ui/input-search";

const countryDisplayNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=8094-1187";

type DropdownContentType =
  "menu" | "self" | "social media" | "timeframe" | "mbti" | "phone number";

const MENU_OPTIONS: DropdownListOption[] = [
  { value: "create-a-post", label: "Create a Post", icon: FileText },
  { value: "edit-asset-image", label: "Edit Asset Image", icon: Eraser },
  { value: "move-to-archive", label: "Move to Archive", icon: Archive },
  { value: "edit-goal", label: "Edit Goal", icon: Goal },
];

const SELF_OPTIONS: DropdownListOption[] = [
  { value: "data-scientist", label: "Data Scientist" },
  { value: "morning-jogger", label: "Morning Jogger" },
  { value: "workflow-sculptor", label: "Workflow Sculptor" },
  { value: "sunday-baker", label: "Sunday Baker" },
  { value: "vintage-curator", label: "Vintage Curator" },
  { value: "brooklyn-observer", label: "Brooklyn Observer" },
];

const SOCIAL_MEDIA_OPTIONS: DropdownListOption[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "x-twitter", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "thread", label: "Thread" },
];

const TIMEFRAME_OPTIONS: DropdownListOption[] = [
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
  { value: "months", label: "Months" },
];

const MBTI_OPTIONS: DropdownListOption[] = [
  { value: "istj", label: "ISTJ" },
  { value: "isfj", label: "ISFJ" },
  { value: "intj", label: "INTJ" },
  { value: "infj", label: "INFJ" },
  { value: "istp", label: "ISTP" },
  { value: "isfp", label: "ISFP" },
  { value: "infp", label: "INFP" },
  { value: "intp", label: "INTP" },
  { value: "estp", label: "ESTP" },
  { value: "esfp", label: "ESFP" },
  { value: "enfp", label: "ENFP" },
  { value: "entp", label: "ENTP" },
  { value: "estj", label: "ESTJ" },
  { value: "esfj", label: "ESFJ" },
  { value: "enfj", label: "ENFJ" },
  { value: "entj", label: "ENTJ" },
];

/** Every ITU-assigned country/region, sourced from libphonenumber-js — not a hand-picked sample. */
const PHONE_NUMBER_OPTIONS: DropdownListOption[] = getCountries()
  .map((country) => ({
    value: country.toLowerCase(),
    label: countryDisplayNames?.of(country) ?? country,
    code: `+${getCountryCallingCode(country)}`,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const TYPE_TO_OPTIONS: Record<DropdownContentType, DropdownListOption[]> = {
  menu: MENU_OPTIONS,
  self: SELF_OPTIONS,
  "social media": SOCIAL_MEDIA_OPTIONS,
  timeframe: TIMEFRAME_OPTIONS,
  mbti: MBTI_OPTIONS,
  "phone number": PHONE_NUMBER_OPTIONS,
};

function DropdownListPreview(
  props: Omit<
    React.ComponentProps<typeof DropdownList>,
    "options" | "highlightedIndex" | "onHighlightChange" | "onCommit" | "value"
  > & { type: DropdownContentType },
) {
  const { type, ...rest } = props;
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const [query, setQuery] = React.useState("");
  const isSearchable = type === "phone number";
  const options = isSearchable
    ? TYPE_TO_OPTIONS[type].filter((option) =>
        option.label.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : TYPE_TO_OPTIONS[type];

  return (
    <div className="flex w-[210px] flex-col gap-[length:var(--gb-spacing-1)]">
      {isSearchable ? (
        <InputSearch
          value={query}
          onValueChange={setQuery}
          placeholder="Search country"
          shouldFitContainer
        />
      ) : null}
      <div className="overflow-hidden rounded-[var(--gb-radius-scale-md)] border-[length:var(--gb-border-1)] border-[var(--gb-border-default)] border-solid bg-[var(--gb-background-surface)] text-[var(--gb-text-default)] shadow-[var(--gb-shadow-md)]">
        <DropdownList
          {...rest}
          options={options}
          value={value}
          highlightedIndex={highlightedIndex}
          onHighlightChange={setHighlightedIndex}
          onCommit={(option) => {
            if (option.disabled) return;
            setValue(option.value);
          }}
        />
      </div>
    </div>
  );
}

const meta = {
  title: "UI/DropdownList",
  component: DropdownListPreview,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: { type: "figma", url: FIGMA_URL },
    // Verbatim text from Figma's description field
    docs: {
      description: {
        component:
          "Reference for the content design of the options rendered inside Select's dropdown panel, implemented as DropdownList in components/ui/dropdown-list. The six Type showcases (menu / self / social media / timeframe / mbti / phone number) are reference examples rather than a real variant axis, and the list scrolls past six options.",
      },
    },
  },
  render: (args) => <DropdownListPreview {...args} />,
  argTypes: {
    type: {
      control: "select",
      options: [
        "menu",
        "self",
        "social media",
        "timeframe",
        "mbti",
        "phone number",
      ],
    },
    listboxId: { control: false },
    getOptionId: { control: false },
  },
} satisfies Meta<typeof DropdownListPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    type: "menu",
    listboxId: "dropdown-list-playground",
    getOptionId: (value: string) => `dropdown-list-playground-option-${value}`,
  },
};
