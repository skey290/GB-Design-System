"use client";

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, within } from "storybook/test";

const FIGMA_URL =
  "https://www.figma.com/design/PrsHuyyra9LzqqrDwmrB5P/%F0%9F%93%8C-GB_Design-System?node-id=4122-8425";

const SCALE_KEYS = [
  "neg-0-8",
  "neg-0-4",
  "0",
  "0-4",
  "0-5",
  "0-75",
  "0-8",
  "1",
  "1-25",
  "1-5",
  "1-6",
  "1-75",
  "2",
  "2-25",
  "2-5",
  "2-75",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "14",
  "15",
  "16",
  "18",
  "20",
  "22",
  "24",
  "25",
  "26",
  "28",
  "30",
  "32",
  "35",
  "36",
  "40",
  "44",
  "45",
  "48",
  "50",
  "55",
  "56",
  "60",
  "64",
  "65",
  "70",
  "72",
  "75",
  "80",
  "85",
  "90",
  "95",
  "96",
  "100",
  "112",
  "128",
  "144",
  "160",
  "176",
  "192",
  "200",
  "208",
  "224",
  "240",
  "256",
  "288",
  "300",
  "320",
  "384",
  "400",
  "448",
  "500",
  "512",
  "576",
  "600",
  "640",
  "672",
  "700",
  "768",
  "800",
  "896",
  "900",
  "1024",
  "1152",
  "1280",
  "1536",
  "9999",
] as const;

const MAX_BAR_PX = 200;

function useResolvedScale(
  ref: React.RefObject<HTMLDivElement | null>,
  varName: string,
) {
  const [raw, setRaw] = React.useState("");
  const [widthPx, setWidthPx] = React.useState("");

  React.useEffect(() => {
    if (!ref.current) return;
    const computed = getComputedStyle(ref.current);
    setRaw(computed.getPropertyValue(varName).trim());
    setWidthPx(computed.width);
  }, [ref, varName]);

  return { raw, widthPx };
}

function ScaleSwatch({ scaleKey }: { scaleKey: string }) {
  const varName = `--scale-${scaleKey}`;
  const ref = React.useRef<HTMLDivElement>(null);
  const { raw, widthPx } = useResolvedScale(ref, varName);

  return (
    <div className="flex flex-col gap-[var(--spacing-2)]">
      <div className="flex h-[calc(var(--scale-32)*1px)] items-center rounded-[var(--radius-scale-sm)] border-[length:var(--border-1)] border-border bg-background px-[var(--spacing-2)]">
        <div
          ref={ref}
          className="h-[calc(var(--scale-16)*1px)] rounded-[var(--radius-scale-xs)] bg-primary"
          style={{
            width: `calc(max(min(var(${varName}), ${MAX_BAR_PX}), 0) * 1px)`,
          }}
        />
      </div>
      <span className="text-xs-medium break-all font-mono text-foreground">
        {varName}
      </span>
      <span className="text-xs-regular font-mono text-muted-foreground">
        raw: {raw || "…"} · {widthPx || "…"}
        {Number(raw) > MAX_BAR_PX ? ` (막대 ${MAX_BAR_PX}px로 제한)` : ""}
      </span>
    </div>
  );
}

function ScaleFoundation() {
  return (
    <div className="flex flex-col gap-[var(--spacing-6)] p-[var(--spacing-6)]">
      <div className="flex flex-col gap-[var(--spacing-1)]">
        <h2 className="text-xl-semi-bold text-foreground">Scale</h2>
        <p className="text-sm-regular text-muted-foreground">
          src/tokens/scale.css 전체 89개 토큰. 단위 없는 raw 숫자 풀(다른 토큰이
          alias로 참조하는 원시값)이라, calc(var(--scale-*) * 1px) 형태로 너비를
          환산한 막대로 시각화했습니다. 값이 클수록 막대가 길어지되
          {` ${MAX_BAR_PX}px`}로 상한을 두었고, 실제 raw 값과 환산된 px 값을
          모두 표시합니다. 음수 값은 막대 없이 0px로 표시됩니다.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(calc(var(--scale-192)*1px),1fr))] gap-[var(--spacing-4)]">
        {SCALE_KEYS.map((scaleKey) => (
          <ScaleSwatch key={scaleKey} scaleKey={scaleKey} />
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Foundation/Scale",
  component: ScaleFoundation,
  tags: ["autodocs"],
  parameters: {
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
} satisfies Meta<typeof ScaleFoundation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllScaleValues: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("--scale-16")).toBeInTheDocument();
    await expect(canvas.getByText("--scale-9999")).toBeInTheDocument();
    await expect(canvas.getByText("--scale-neg-0-8")).toBeInTheDocument();
  },
};
