import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { Archive, Eraser, FileText, Goal } from "lucide-react";

import { DropdownList, type DropdownListOption } from "./dropdown-list";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=8094-1187";

type DropdownContentType =
  | "menu"
  | "self"
  | "social media"
  | "timeframe"
  | "mbti"
  | "phone number";

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
  { value: "infj", label: "INFJ" },
  { value: "intj", label: "INTJ" },
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

const PHONE_NUMBER_OPTIONS: DropdownListOption[] = [
  { value: "us-ca", label: "USA / Canada", code: "+1" },
  { value: "ar", label: "Argentina", code: "+54" },
  { value: "au", label: "Australia", code: "+61" },
  { value: "br", label: "Brazil", code: "+55" },
  { value: "cn", label: "China", code: "+86" },
  { value: "eg", label: "Egypt", code: "+20" },
  { value: "fr", label: "France", code: "+33" },
  { value: "de", label: "Germany", code: "+49" },
  { value: "gr", label: "Greece", code: "+30" },
  { value: "in", label: "India", code: "+91" },
  { value: "id", label: "Indonesia", code: "+62" },
  { value: "ie", label: "Ireland", code: "+353" },
  { value: "it", label: "Italy", code: "+39" },
  { value: "jp", label: "Japan", code: "+81" },
  { value: "mx", label: "Mexico", code: "+52" },
  { value: "nl", label: "Netherlands", code: "+31" },
  { value: "nz", label: "New Zealand", code: "+64" },
  { value: "ng", label: "Nigeria", code: "+234" },
  { value: "no", label: "Norway", code: "+47" },
  { value: "ph", label: "Philippines", code: "+63" },
  { value: "pl", label: "Poland", code: "+48" },
  { value: "pt", label: "Portugal", code: "+351" },
  { value: "ru", label: "Russia", code: "+7" },
  { value: "sa", label: "Saudi Arabia", code: "+966" },
  { value: "sg", label: "Singapore", code: "+65" },
  { value: "za", label: "South Africa", code: "+27" },
  { value: "kr", label: "South Korea", code: "+82" },
  { value: "es", label: "Spain", code: "+34" },
  { value: "se", label: "Sweden", code: "+46" },
  { value: "ch", label: "Switzerland", code: "+41" },
  { value: "th", label: "Thailand", code: "+66" },
  { value: "tr", label: "Turkey", code: "+90" },
  { value: "ae", label: "United Arab Emirates", code: "+971" },
  { value: "gb", label: "United Kingdom", code: "+44" },
  { value: "vn", label: "Vietnam", code: "+84" },
];

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
  const options = TYPE_TO_OPTIONS[type];

  return (
    <div className="w-[210px] overflow-hidden rounded-[var(--gb-radius-scale-md)] border-[length:var(--gb-border-1)] border-[var(--gb-border-default)] border-solid bg-[var(--gb-background-surface)] text-[var(--gb-text-default)] shadow-[var(--gb-shadow-md)]">
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
          "Select의 드롭다운 패널 안에 렌더링되는 옵션의 콘텐츠 디자인 참고용. components/ui/dropdown-list의 DropdownList로 구현된다. 6개의 Type 변형(menu/self/social media/timeframe/mbti/phone number)은 참고용 쇼케이스일 뿐 실제 variant 축이 아니며, 옵션이 6개를 넘으면 스크롤된다.",
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
