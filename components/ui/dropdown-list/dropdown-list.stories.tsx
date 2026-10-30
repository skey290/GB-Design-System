import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Archive, FileText, Goal, Images } from "lucide-react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

import { DropdownList, type DropdownListOption } from "./dropdown-list";
import { InputSearch } from "@/components/ui/input-search";

const countryDisplayNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=8094-1187";

type DropdownContentType = "with Icon" | "default" | "with search";

const WITH_ICON_OPTIONS: DropdownListOption[] = [
  { value: "create-a-post", label: "Create a Post", icon: FileText },
  { value: "go-to-asset-gallery", label: "Go to Asset Gallery", icon: Images },
  { value: "move-to-archive", label: "Move to Archive", icon: Archive },
  { value: "edit-goal", label: "Edit Goal", icon: Goal },
];

const DEFAULT_OPTIONS: DropdownListOption[] = [
  { value: "data-scientist", label: "Data Scientist" },
  { value: "morning-jogger", label: "Morning Jogger" },
  { value: "workflow-sculptor", label: "Workflow Sculptor" },
  { value: "sunday-baker", label: "Sunday Baker" },
  { value: "vintage-curator", label: "Vintage Curator" },
  { value: "brooklyn-observer", label: "Brooklyn Observer" },
];

/** Every ITU-assigned country/region, sourced from libphonenumber-js — not a hand-picked sample. */
const WITH_SEARCH_OPTIONS: DropdownListOption[] = getCountries()
  .map((country) => ({
    value: country.toLowerCase(),
    label: countryDisplayNames?.of(country) ?? country,
    code: `+${getCountryCallingCode(country)}`,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const TYPE_TO_OPTIONS: Record<DropdownContentType, DropdownListOption[]> = {
  "with Icon": WITH_ICON_OPTIONS,
  default: DEFAULT_OPTIONS,
  "with search": WITH_SEARCH_OPTIONS,
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
  const isSearchable = type === "with search";
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
        {isSearchable && options.length === 0 ? (
          <p className="px-[var(--gb-spacing-2)] py-[var(--gb-spacing-3)] text-center font-[family-name:var(--gb-font-sans)] text-[length:var(--gb-text-sm)] leading-[var(--gb-leading-5)] tracking-[var(--gb-tracking-normal)] text-[var(--gb-text-subtle)]">
            No results found
          </p>
        ) : (
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
        )}
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
    docs: {
      description: {
        // Verbatim text from Figma's description field
        component:
          "Design reference for the content rendered inside Select's dropdown panel. Implemented as DropdownList in components/ui/dropdown-list. The 3 Type variants (with Icon/default/with search) are a real variant property — with Icon is 4-row with no scrollbar, default is 6-row with a scrollbar, and with search adds a search input above a 6-row scrollable list. The list scrolls once options exceed 6.",
        story:
          "Canvas wraps DropdownList in a demo-only preview (container chrome + highlight/value/search state) for standalone viewing. The code below is what a real page writes — see docs/components/dropdown-list.md.",
      },
      source: {
        type: "code",
        code: `<DropdownList
  options={options}
  value={currentValue}
  highlightedIndex={highlightedIndex}
  onHighlightChange={setHighlightedIndex}
  onCommit={(option) => { ... }}
  listboxId={listboxId}
  getOptionId={(value) => \`\${id}-option-\${value}\`}
/>`,
      },
    },
  },
  render: (args) => <DropdownListPreview {...args} />,
  argTypes: {
    type: {
      control: "select",
      options: ["with Icon", "default", "with search"],
    },
    listboxId: { control: false },
    getOptionId: { control: false },
  },
} satisfies Meta<typeof DropdownListPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    type: "default",
    listboxId: "dropdown-list-playground",
    getOptionId: (value: string) => `dropdown-list-playground-option-${value}`,
  },
};
