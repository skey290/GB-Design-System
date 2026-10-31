import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, fn, userEvent, within } from "storybook/test";

import {
  ProfileCard,
  type ProfileCardProps,
  type SelectOption,
} from "./ProfileCard";

const FIGMA_URL =
  "https://www.figma.com/design/Wp6AZNGqC4qf2Sz5zQ2PzQ/%F0%9F%93%8C-GB_UXUI--261002-?node-id=8127-92033";

// Story-only demo wrapper: ProfileCard is a fully controlled component (no
// internal `open` state), so the real app owns a useState that flips `open`
// on toggle. This wrapper reproduces that so Storybook's canvas visibly
// expands/collapses on click too — real pages should wire their own state,
// not copy this wrapper.
function ProfileCardDemo({
  open: openProp,
  onToggleOpen,
  ...rest
}: ProfileCardProps) {
  const [open, setOpen] = React.useState(openProp);

  React.useEffect(() => setOpen(openProp), [openProp]);

  const handleToggleOpen = () => {
    setOpen((prev) => !prev);
    onToggleOpen?.();
  };

  return <ProfileCard {...rest} open={open} onToggleOpen={handleToggleOpen} />;
}

const JOB_TITLE_OPTIONS: SelectOption[] = [
  { value: "data-scientist", label: "Data Scientist" },
  { value: "product-manager", label: "Product Manager" },
  { value: "ux-designer", label: "UX Designer" },
];

const meta = {
  title: "ContentStudio/UI/ProfileCard",
  component: ProfileCard,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
    docs: {
      description: {
        component:
          "ProfileCard is a fully controlled component with no edit modal of its own — see docs/components/profile-card.md for full prop reference and how a real page wires its own open/completion state and Goal-edit modal.",
      },
      source: {
        type: "code",
        code: `<ProfileCard
  open={profileOpen}
  avatarSrc={user.avatarUrl}
  options={JOB_TITLE_OPTIONS}
  value={jobTitle}
  onValueChange={setJobTitle}
  onToggleOpen={() => setProfileOpen((prev) => !prev)}
  isSelfGoalComplete={selfGoal.isSaved}
  isContentGoalComplete={contentGoal.isSaved}
  isToneOfVoiceComplete={toneOfVoice.isSaved}
  knownForNowText={selfGoal.now}
  knownForNextText={selfGoal.next}
  contentGoalText={contentGoal.text}
  toneOfVoiceText={toneOfVoice.text}
  onEditSelfGoal={() => setGoalOpen(true)}
  onEditContentGoal={() => setGoalOpen(true)}
  onEditToneOfVoice={() => setGoalOpen(true)}
/>`,
      },
    },
  },
  argTypes: {
    open: { control: "boolean" },
    disabled: { control: "boolean" },
    avatarSrc: { control: "text" },
    avatarAlt: { control: "text" },
    placeholder: { control: "text" },
    toggleLabel: { control: "text" },
    isSelfGoalComplete: { control: "boolean" },
    isContentGoalComplete: { control: "boolean" },
    isToneOfVoiceComplete: { control: "boolean" },
    knownForNowText: { control: "text" },
    knownForNextText: { control: "text" },
    contentGoalText: { control: "text" },
    toneOfVoiceText: { control: "text" },
    options: { control: false },
    value: { control: false },
  },
  args: {
    open: true,
    disabled: false,
    avatarSrc: "/images/personas/self-default.jpg",
    options: JOB_TITLE_OPTIONS,
    defaultValue: "data-scientist",
    isSelfGoalComplete: true,
    isContentGoalComplete: false,
    isToneOfVoiceComplete: false,
    knownForNowText:
      "4 years in finance, 3 in data science — forecasting Finance teams trust.",
    knownForNextText:
      "I'm known for Finance-Fluent Modeling Partner for early-stage SaaS founders.",
    onValueChange: fn(),
    onToggleOpen: fn(),
    onEditSelfGoal: fn(),
    onEditContentGoal: fn(),
    onEditToneOfVoice: fn(),
  },
  render: (args) => <ProfileCardDemo {...args} />,
} satisfies Meta<typeof ProfileCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Edit Self-Goal" }),
    );
    expect(args.onEditSelfGoal).toHaveBeenCalledTimes(1);

    await userEvent.click(
      canvas.getByRole("button", { name: "Collapse profile card" }),
    );
    expect(args.onToggleOpen).toHaveBeenCalledTimes(1);

    await userEvent.click(
      canvas.getByRole("button", { name: "Expand profile card" }),
    );
    expect(args.onToggleOpen).toHaveBeenCalledTimes(2);
  },
};
