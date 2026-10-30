import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import { Scrollbar, type ScrollbarThickness } from "./scrollbar";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7792-522";

/**
 * `Scrollbar` only draws the track/thumb — matching Figma's own `Scroll bar` component,
 * which has no scroll-ratio logic of its own. Pairing it with a real scrollable list is
 * the caller's job; this wrapper is the same pattern `DropdownList` and `NotiDropdown` use.
 */
function ScrollbarDemo({ thickness }: { thickness: ScrollbarThickness }) {
  const [thumb, setThumb] = React.useState({ top: 0, height: 100 });
  const listRef = React.useRef<HTMLDivElement>(null);

  const updateThumb = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const { scrollTop, scrollHeight, clientHeight } = list;
    if (scrollHeight <= clientHeight) {
      setThumb({ top: 0, height: 100 });
      return;
    }
    const heightPercent = (clientHeight / scrollHeight) * 100;
    const topPercent =
      (scrollTop / (scrollHeight - clientHeight)) * (100 - heightPercent);
    setThumb({ top: topPercent, height: heightPercent });
  }, []);

  React.useEffect(() => {
    updateThumb();
  }, [updateThumb]);

  return (
    <div className="flex h-[469px] w-[320px] items-stretch gap-[var(--gb-spacing-2)]">
      <div
        ref={listRef}
        onScroll={updateThumb}
        className="flex min-w-0 flex-1 flex-col gap-[var(--gb-spacing-3)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: 24 }, (_, index) => (
          <p
            key={index}
            className="text-sm-medium text-[var(--gb-text-default)]"
          >
            {`Scrollable row ${index + 1}`}
          </p>
        ))}
      </div>
      <Scrollbar
        thickness={thickness}
        thumbTop={thumb.top}
        thumbHeight={thumb.height}
      />
    </div>
  );
}

const meta = {
  title: "UI/Scrollbar",
  component: Scrollbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        // Verbatim text from the Figma component's description field
        component:
          "A custom-styled scrollbar for a scrollable container, replacing the browser default. Comes in a standard and a thin width. Purely cosmetic — the scrolling behaviour itself stays the browser's.",
        story:
          "Canvas renders the story-local ScrollbarDemo, which can't be imported by name. The code below is the real pattern (also in docs/components/scrollbar.md) — Scrollbar has no scroll-ratio logic of its own, so every real consumer writes this same scrollTop/scrollHeight/clientHeight math.",
      },
      source: {
        type: "code",
        code: `const [thumb, setThumb] = useState({ top: 0, height: 100 });
const listRef = useRef<HTMLDivElement>(null);

const updateThumb = () => {
  const el = listRef.current;
  if (!el) return;
  const { scrollTop, scrollHeight, clientHeight } = el;
  if (scrollHeight <= clientHeight) return setThumb({ top: 0, height: 100 });
  const heightPercent = (clientHeight / scrollHeight) * 100;
  const topPercent =
    (scrollTop / (scrollHeight - clientHeight)) * (100 - heightPercent);
  setThumb({ top: topPercent, height: heightPercent });
};

<div className="flex items-stretch gap-[var(--gb-spacing-2)]">
  <div
    ref={listRef}
    onScroll={updateThumb}
    className="min-w-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    {content}
  </div>
  <Scrollbar thumbTop={thumb.top} thumbHeight={thumb.height} />
</div>`,
      },
    },
    layout: "centered",
    design: { type: "figma", url: FIGMA_URL },
  },
  render: ({ thickness = "thick" }) => <ScrollbarDemo thickness={thickness} />,
  argTypes: {
    thickness: {
      control: "radio",
      options: ["thick", "thin"],
      description: "Scrollbar thickness — thick 10px / thin 5px (Figma `Type`)",
    },
    thumbTop: { control: false },
    thumbHeight: { control: false },
  },
} satisfies Meta<typeof Scrollbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    thickness: "thick",
    thumbTop: 0,
    thumbHeight: 32,
  },
};
