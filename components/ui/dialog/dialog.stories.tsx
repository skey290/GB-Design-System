import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function DialogDemo({
  title,
  description,
  body,
}: {
  title: string;
  description: string;
  body: string;
}) {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <p className="text-sm-regular text-[var(--gb-text-default)]">
          {body}
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Continue</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: "UI/Dialog",
  component: DialogDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "General-purpose modal shell composed of Trigger/Content/Header/Footer parts, for arbitrary content (forms, multi-step flows) — unlike Popover, which is a fixed confirmation dialog. No Figma spec; follows the standard Shadcn Dialog pattern.",
      },
    },
  },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    body: { control: "text" },
  },
  args: {
    title: "Create a 'Self'",
    description: "Describe the goal this Self should represent.",
    body: "Arbitrary content goes here — forms, lists, previews, anything.",
  },
  render: (args) => <DialogDemo {...args} />,
} satisfies Meta<typeof DialogDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
