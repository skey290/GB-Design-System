"use client";

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within } from "storybook/test";

import { InputSearch } from "@/components/ui/input-search";
import {
  LUCIDE_SPRITE_MAP,
  SPRITE_ONLY_ICON_IDS,
  type IconId,
  type LucideIconId,
} from "@/lib/sprite-icon";

const FIGMA_URL =
  "https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=1086-1066";

const LUCIDE_IDS = Object.keys(LUCIDE_SPRITE_MAP) as LucideIconId[];

function LucideGlyph({ id }: { id: LucideIconId }) {
  const Glyph = LUCIDE_SPRITE_MAP[id];
  return (
    <Glyph
      className="size-[24px] text-[var(--gb-icon-default)]"
      aria-hidden="true"
    />
  );
}

function SpriteGlyph({ id }: { id: IconId }) {
  return (
    <svg
      className="size-[24px] text-[var(--gb-icon-default)]"
      aria-hidden="true"
    >
      <use href={`/icons.svg#${id}`} />
    </svg>
  );
}

function IconCell({ id, children }: { id: IconId; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-[var(--gb-spacing-2)]">
      <div className="flex h-[56px] w-full items-center justify-center rounded-[var(--gb-radius-scale-sm)] border-[length:var(--gb-border-1)] border-solid border-[var(--gb-border-default)] bg-[var(--gb-background-surface)]">
        {children}
      </div>
      <span className="text-xs-regular w-full break-all text-center font-mono text-[var(--gb-text-subtle)]">
        {id}
      </span>
    </div>
  );
}

function IconSection({
  title,
  description,
  shown,
  total,
  children,
}: {
  title: string;
  description: string;
  shown: number;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-[var(--gb-spacing-4)]">
      <div className="flex flex-col gap-[var(--gb-spacing-1)]">
        <h3 className="text-sm-semi-bold text-[var(--gb-text-default)]">
          {title}
          <span className="text-sm-regular text-[var(--gb-text-subtle)]">
            {shown === total ? ` (${total})` : ` (${shown} / ${total})`}
          </span>
        </h3>
        <p className="text-xs-regular text-[var(--gb-text-subtle)]">
          {description}
        </p>
      </div>

      {shown === 0 ? (
        <p className="text-sm-regular text-[var(--gb-text-subtle)]">
          No results.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-[var(--gb-spacing-4)]">
          {children}
        </div>
      )}
    </section>
  );
}

function IconsFoundation() {
  const [query, setQuery] = React.useState("");

  const keyword = query.trim().toLowerCase();
  const matches = (id: string) => id.includes(keyword);

  const lucide = LUCIDE_IDS.filter(matches);
  const sprite = SPRITE_ONLY_ICON_IDS.filter(matches);

  return (
    <div className="flex flex-col gap-[var(--gb-spacing-8)] p-[var(--gb-spacing-6)]">
      <div className="flex flex-col gap-[var(--gb-spacing-1)]">
        <h2 className="text-xl-semi-bold text-[var(--gb-text-default)]">
          Icons
        </h2>
        <p className="text-sm-regular text-[var(--gb-text-subtle)]">
          Split on the same basis as the two frames on Figma's `Lucide Icons`
          page — icons that exist in the library are referenced from
          `lucide-react`, and only customized icons are kept in the
          `/public/icons.svg` sprite. The list is read straight from
          `lib/sprite-icon.tsx`.
        </p>
      </div>

      <InputSearch
        value={query}
        onValueChange={setQuery}
        placeholder="Search icon ids (e.g. chevron, calendar)"
      />

      <IconSection
        title="Referenced from the Lucide library"
        description="Imported as components from the lucide-react package. These are not in the svg file."
        shown={lucide.length}
        total={LUCIDE_IDS.length}
      >
        {lucide.map((id) => (
          <IconCell key={id} id={id}>
            <LucideGlyph id={id} />
          </IconCell>
        ))}
      </IconSection>

      <IconSection
        title="Custom SVG"
        description="References symbols in /public/icons.svg. Stroke color follows the theme through currentColor, while brand logos keep their own colors."
        shown={sprite.length}
        total={SPRITE_ONLY_ICON_IDS.length}
      >
        {sprite.map((id) => (
          <IconCell key={id} id={id}>
            <SpriteGlyph id={id} />
          </IconCell>
        ))}
      </IconSection>
    </div>
  );
}

const meta = {
  title: "Foundation/Icons",
  component: IconsFoundation,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
} satisfies Meta<typeof IconsFoundation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("chevron-down-icon")).toBeInTheDocument();
    await expect(canvas.getByText("google-icon")).toBeInTheDocument();
  },
};
