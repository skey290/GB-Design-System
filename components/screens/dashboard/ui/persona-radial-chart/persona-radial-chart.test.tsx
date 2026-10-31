import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DEFAULT_PERSONAS, PersonaRadialChart } from "./persona-radial-chart";
import styles from "./persona-radial-chart.module.css";
import selfSlotStyles from "@/components/screens/dashboard/ui/self-slot/self-slot.module.css";
import selfCurationStyles from "@/components/screens/dashboard/ui/self-curation/self-curation.module.css";

/** Picks out only the value band paths (excludes the grid/hit area) */
function getBandPaths(container: HTMLElement, fill: string) {
  return Array.from(
    container.querySelectorAll<SVGPathElement>(`path[fill="${fill}"]`),
  );
}

// Same strings as the component's HIGHLIGHT_BAND_FILL/DIMMED_BAND_FILL
// (theme-responsive — the highlight becomes white in dark / black in light, dim is the opposite polarity)
const WHITE_BAND =
  "color-mix(in srgb, var(--gb-icon-default) 20%, transparent)";
const BLACK_BAND = "var(--gb-background-sheer)";

/**
 * Finds the Badge root by its text. The text sits inside an extra inner
 * span wrapped for fade-in, so `getByText` returns that span.
 */
function badgeOf(text: string) {
  return screen.getByText(text).parentElement as HTMLElement;
}

/**
 * Data where the self is **not** first place.
 *
 * The Figma sample has Data Scientist in first place on all 3 metrics, so
 * "fill the self's badge" and "fill the first-place badge" produce the same
 * result. Telling them apart needs data where the self and first place differ.
 */
const SELF_IS_RUNNER_UP = [
  { id: "self", name: "Self", growth: 10, reach: 100, engagement: 1 },
  { id: "rival", name: "Rival", growth: 90, reach: 900, engagement: 9 },
];

describe("PersonaRadialChart", () => {
  describe("grid", () => {
    it("renders the four concentric circles at the Figma radii", () => {
      const { container } = render(<PersonaRadialChart />);

      const radii = Array.from(container.querySelectorAll("circle")).map(
        (circle) => circle.getAttribute("r"),
      );

      expect(radii).toEqual(["128", "160", "200", "250"]);
    });

    it("renders four diameter spokes, the first one vertical", () => {
      const { container } = render(<PersonaRadialChart />);

      const lines = Array.from(container.querySelectorAll("line"));
      // The Figma original is 4 diameter lines through the center, not 8 rays
      expect(lines).toHaveLength(4);

      expect(Number(lines[0].getAttribute("x1"))).toBeCloseTo(0, 3);
      expect(Number(lines[0].getAttribute("y1"))).toBeCloseTo(250, 3);
      expect(Number(lines[0].getAttribute("x2"))).toBeCloseTo(0, 3);
      expect(Number(lines[0].getAttribute("y2"))).toBeCloseTo(-250, 3);
    });

    it("uses the muted token for grid strokes", () => {
      const { container } = render(<PersonaRadialChart />);

      const circles = Array.from(container.querySelectorAll("circle"));
      expect(
        circles.every(
          (circle) =>
            circle.getAttribute("stroke") === "var(--gb-background-subtler)",
        ),
      ).toBe(true);
    });
  });

  describe("value bands", () => {
    it("gives the ring's top performer all eight bands", () => {
      const { container } = render(
        <PersonaRadialChart
          isDataCollected={false}
          personas={[
            { id: "top", name: "Top", growth: 80, reach: 0, engagement: 0 },
            { id: "half", name: "Half", growth: 40, reach: 0, engagement: 0 },
          ]}
        />,
      );

      // Since isDataCollected=false, only the growth ring: 8 bands for first + 1 band for last = 9 paths
      expect(getBandPaths(container, WHITE_BAND)).toHaveLength(9);
    });

    it("ranks by order, so near-identical values still differ by one band", () => {
      const { container } = render(
        <PersonaRadialChart
          isDataCollected={false}
          personas={[
            { id: "a", name: "A", growth: 8340, reach: 0, engagement: 0 },
            { id: "b", name: "B", growth: 8006, reach: 0, engagement: 0 },
            { id: "c", name: "C", growth: 125, reach: 0, engagement: 0 },
          ]}
        />,
      );

      // If this were value-ratio based, 8340 and 8006 would both collapse to 8 bands.
      // Since it's rank-based, the 3 people always stay distinct at 8 / 5 (middle) / 1 bands
      expect(getBandPaths(container, WHITE_BAND)).toHaveLength(8 + 5 + 1);
    });

    it("spreads eight personas across all eight band counts", () => {
      const { container } = render(
        <PersonaRadialChart isDataCollected={false} />,
      );

      // The default data's growth is 80/70/60/50/40/30/20/10 — no ties, so
      // 8,7,6,5,4,3,2,1 = 36 total, with exactly one of the 8 people assigned to each of the 8 tiers
      expect(getBandPaths(container, WHITE_BAND)).toHaveLength(36);
    });

    it("gives tied values the same band count", () => {
      const { container } = render(
        <PersonaRadialChart
          isDataCollected={false}
          personas={[
            { id: "a", name: "A", growth: 50, reach: 0, engagement: 0 },
            { id: "b", name: "B", growth: 50, reach: 0, engagement: 0 },
          ]}
        />,
      );

      // A tie means the same rank = the same band count (8 + 8)
      expect(getBandPaths(container, WHITE_BAND)).toHaveLength(16);
    });

    it("renders no bands for a persona whose value is zero", () => {
      const { container } = render(
        <PersonaRadialChart
          isDataCollected={false}
          personas={[
            { id: "a", name: "A", growth: 80, reach: 0, engagement: 0 },
            { id: "zero", name: "Zero", growth: 0, reach: 0, engagement: 0 },
          ]}
        />,
      );

      expect(getBandPaths(container, WHITE_BAND)).toHaveLength(8);
    });

    it("dims non-hovered rings with black bands instead of opacity", () => {
      const { container } = render(
        <PersonaRadialChart
          hover="growth"
          personas={[
            { id: "solo", name: "Solo", growth: 80, reach: 100, engagement: 4 },
          ]}
        />,
      );

      // Only the growth ring gets 8 white bands; the reach/engagement rings get 8 black bands each
      expect(getBandPaths(container, WHITE_BAND)).toHaveLength(8);
      expect(getBandPaths(container, BLACK_BAND)).toHaveLength(16);
    });

    it("keeps every ring white when nothing is hovered", () => {
      const { container } = render(
        <PersonaRadialChart
          personas={[
            { id: "solo", name: "Solo", growth: 80, reach: 100, engagement: 4 },
          ]}
        />,
      );

      expect(getBandPaths(container, WHITE_BAND)).toHaveLength(24);
      expect(getBandPaths(container, BLACK_BAND)).toHaveLength(0);
    });
  });

  describe("isDataCollected", () => {
    it("omits reach and engagement bands when there are no posts", () => {
      const { container } = render(
        <PersonaRadialChart
          isDataCollected={false}
          personas={[
            { id: "solo", name: "Solo", growth: 80, reach: 100, engagement: 4 },
          ]}
        />,
      );

      // Only the growth ring's 8 bands
      expect(getBandPaths(container, WHITE_BAND)).toHaveLength(8);
    });

    it("shows the placeholder badge only while a post-dependent metric is hovered", () => {
      // The badge shouldn't appear preemptively just because there are no
      // posts — it should only appear, in its default state, once
      // Reach/Engagement are actually hovered

      const { rerender } = render(
        <PersonaRadialChart isDataCollected={false} />,
      );
      expect(screen.queryByText("Not Enough Data Yet")).toBeNull();

      // Growth is still computed without posts, so this still doesn't appear
      rerender(<PersonaRadialChart isDataCollected={false} hover="growth" />);
      expect(screen.queryByText("Not Enough Data Yet")).toBeNull();

      // Still doesn't appear while just looking at an avatar
      rerender(<PersonaRadialChart isDataCollected={false} hover="self" />);
      expect(screen.queryByText("Not Enough Data Yet")).toBeNull();

      rerender(<PersonaRadialChart isDataCollected={false} hover="reach" />);
      expect(screen.getByText("Not Enough Data Yet")).toBeInTheDocument();
    });

    it("renders the placeholder badge in its default, never a dimmed, state", () => {
      render(<PersonaRadialChart isDataCollected={false} hover="engagement" />);

      // Unlike the persona badges, the bottom badge has no nested fade span, so the element itself is the Badge
      const badge = screen.getByText("Not Enough Data Yet");
      expect(badge).toHaveAttribute("data-variant", "default");
    });

    it("fills the ring uniformly while awaiting data", () => {
      const { container } = render(
        <PersonaRadialChart isDataCollected={false} hover="reach" />,
      );

      // A uniform fill is a single whole-ring donut, not per-sector bands
      const uniformFill = container.querySelector<SVGPathElement>(
        `path[fill="${WHITE_BAND}"][fill-rule="evenodd"]`,
      );
      expect(uniformFill).not.toBeNull();
    });

    it("highlights the awaiting ring's boundary circles in white", () => {
      const { container } = render(
        <PersonaRadialChart isDataCollected={false} hover="reach" />,
      );

      const highlighted = Array.from(container.querySelectorAll("circle"))
        .filter(
          (circle) =>
            circle.getAttribute("stroke") ===
            "var(--gb-color-semantic-non-changeable)",
        )
        .map((circle) => circle.getAttribute("r"));

      // Only Qualified Reach's two boundary circles (160/200) are white
      expect(highlighted).toEqual(["160", "200"]);
    });
  });

  describe("badges", () => {
    it("shows persona names when nothing is hovered", () => {
      render(<PersonaRadialChart />);

      for (const persona of DEFAULT_PERSONAS) {
        expect(screen.getByText(persona.name)).toBeInTheDocument();
      }
    });

    it("swaps names for metric values while a ring is hovered", () => {
      render(<PersonaRadialChart hover="growth" />);

      expect(screen.queryByText("Data Scientist")).toBeNull();
      expect(screen.getByText("80%")).toBeInTheDocument();
      expect(screen.getByText("10%")).toBeInTheDocument();
    });

    /*
     * Accounts for real data — the Figma mock happens to round neatly to one
     * decimal place, but real computed values come out with long decimals.
     * Without rounding, the badge would break as-is.
     */
    it("rounds long decimals to one place", () => {
      render(
        <PersonaRadialChart
          hover="engagement"
          personas={[
            { id: "a", name: "A", growth: 0, reach: 0, engagement: 14.333333 },
          ]}
        />,
      );

      expect(screen.getByText("14.3%")).toBeInTheDocument();
    });

    it("does not add a decimal point to whole numbers", () => {
      // Since it's a maximum digit count, 80 doesn't become "80.0%" (keeps Figma's notation)
      render(<PersonaRadialChart hover="growth" />);

      expect(screen.getByText("80%")).toBeInTheDocument();
      expect(screen.queryByText("80.0%")).toBeNull();
    });

    it("rounds reach and keeps the thousands separator", () => {
      render(
        <PersonaRadialChart
          hover="reach"
          personas={[
            { id: "a", name: "A", growth: 0, reach: 1234567.89, engagement: 0 },
          ]}
        />,
      );

      expect(screen.getByText("1,234,567.9")).toBeInTheDocument();
    });

    it("lets the caller override the decimal precision", () => {
      render(
        <PersonaRadialChart
          hover="engagement"
          valueFractionDigits={0}
          personas={[
            { id: "a", name: "A", growth: 0, reach: 0, engagement: 14.333333 },
          ]}
        />,
      );

      expect(screen.getByText("14%")).toBeInTheDocument();
    });

    it("formats reach values with thousands separators", () => {
      render(<PersonaRadialChart hover="reach" />);

      expect(screen.getByText("8,340")).toBeInTheDocument();
      expect(screen.getByText("125")).toBeInTheDocument();
    });

    it("keeps names on the badges while hovering the self avatar", () => {
      render(<PersonaRadialChart hover="self" />);

      expect(screen.getByText("Data Scientist")).toBeInTheDocument();
    });

    it("renders one badge per existing self, not one per sector", () => {
      render(<PersonaRadialChart selfCount={1} />);

      // The 7 empty slots have no badge
      expect(screen.getByText("Data Scientist")).toBeInTheDocument();
      for (const persona of DEFAULT_PERSONAS.slice(1)) {
        expect(screen.queryByText(persona.name)).toBeNull();
      }
    });

    it("hides every badge when the hovered metric has no data", () => {
      render(<PersonaRadialChart isDataCollected={false} hover="reach" />);

      // The badge itself disappears instead of falling back to the name
      for (const persona of DEFAULT_PERSONAS) {
        expect(screen.queryByText(persona.name)).toBeNull();
      }
      // The only badge left on screen is the bottom notice
      expect(screen.getByText("Not Enough Data Yet")).toBeInTheDocument();
    });

    it("still shows badges for growth, which needs no posts", () => {
      render(<PersonaRadialChart isDataCollected={false} hover="growth" />);

      expect(screen.getByText("80%")).toBeInTheDocument();
    });

    it("fills the self's badge while the badges show names", () => {
      render(<PersonaRadialChart personas={SELF_IS_RUNNER_UP} selfId="self" />);

      // When showing names, the criterion is "the self configured on this page"
      expect(badgeOf("Self")).toHaveAttribute("data-variant", "default");
      expect(badgeOf("Rival")).toHaveAttribute("data-variant", "outline");
    });

    it("fills the top performer's badge while the badges show values", () => {
      render(
        <PersonaRadialChart
          personas={SELF_IS_RUNNER_UP}
          selfId="self"
          hover="growth"
        />,
      );

      // When showing values, the criterion is that metric's first place, not the self
      expect(badgeOf("90%")).toHaveAttribute("data-variant", "default");
      expect(badgeOf("10%")).toHaveAttribute("data-variant", "outline");
    });

    it("fills both badges when the top value is tied", () => {
      render(
        <PersonaRadialChart
          personas={[
            { id: "a", name: "A", growth: 50, reach: 1, engagement: 1 },
            { id: "b", name: "B", growth: 50, reach: 2, engagement: 2 },
          ]}
          hover="growth"
        />,
      );

      // A tie means the same rank = the same band count, so the badges get filled together too
      const tied = screen.getAllByText("50%");
      expect(tied).toHaveLength(2);
      for (const label of tied) {
        expect(label.parentElement).toHaveAttribute("data-variant", "default");
      }
    });
  });

  describe("self count", () => {
    it("renders seven empty slots when only the self persona exists", () => {
      render(<PersonaRadialChart selfCount={1} />);

      expect(screen.getAllByText("No Self")).toHaveLength(7);
    });

    it("draws bands for the self persona only", () => {
      const { container } = render(
        <PersonaRadialChart selfCount={1} isDataCollected={false} />,
      );

      // Data Scientist's growth (80) is the ring's max value, so 8 bands; the rest aren't shown
      expect(getBandPaths(container, WHITE_BAND)).toHaveLength(8);
    });

    it("keeps the self visible when selfId is an empty string", () => {
      // If `selfId=""` slipped through the `??` fallback, it would become an
      // id matching no persona, treating all 8 slots as empty — `||` must block this

      render(<PersonaRadialChart selfCount={1} selfId="" />);

      expect(screen.getAllByText("No Self")).toHaveLength(7);
      expect(screen.getByText("Data Scientist")).toBeInTheDocument();
    });

    /*
     * Accounts for real data — Figma only has Self counts of 1 and 8, but in
     * reality anywhere from 1 to 8 is possible. When `selfCount` isn't
     * given, all the passed-in data is revealed, and the remaining slots
     * stay empty to nudge "create more."
     */
    it("reveals every persona passed in when selfCount is omitted", () => {
      const three = DEFAULT_PERSONAS.slice(0, 3);
      render(<PersonaRadialChart personas={three} />);

      expect(screen.getByText("Data Scientist")).toBeInTheDocument();
      expect(screen.getByText("Yoga Meditator")).toBeInTheDocument();
      expect(screen.getByText("Novelist")).toBeInTheDocument();
      // The 8-slot wheel stays intact, with the remaining 5 slots becoming empty
      expect(screen.getAllByLabelText("No Self")).toHaveLength(5);
    });

    it.each([1, 2, 3, 4, 5, 6, 7, 8])(
      "handles selfCount=%i, not just 1 and 8",
      (count) => {
        render(<PersonaRadialChart selfCount={count} />);

        expect(screen.queryAllByLabelText("No Self")).toHaveLength(8 - count);
      },
    );

    it("gives each empty slot its own hover highlight", async () => {
      // An empty slot has no persona id, so it's identified by a synthetic
      // key. If keys collided, hovering one slot would highlight several together.
      const { container } = render(<PersonaRadialChart selfCount={1} />);

      const slots = screen.getAllByLabelText("No Self");
      await userEvent.hover(slots[2]);

      const highlighted = container.querySelectorAll("[data-active]");
      expect(highlighted).toHaveLength(1);
    });

    it("renders no empty slots when all eight personas exist", () => {
      render(<PersonaRadialChart selfCount={8} />);

      expect(screen.queryByText("No Self")).toBeNull();
    });

    it("keeps the 8px type style on the empty slot label", () => {
      render(<PersonaRadialChart selfCount={1} />);

      // A CSS Module class is an opaque identifier that cn()/tailwind-merge
      // never touches, so the old issue where a Tailwind class collision
      // silently dropped typography can't structurally recur — just checks
      // that the specified class itself got applied.
      const slot = screen.getAllByRole("img", { name: "No Self" })[0];
      expect(slot).toHaveClass(selfSlotStyles.emptyRoot);
    });
  });

  describe("center message", () => {
    it.each([
      ["default" as const, true, 8 as const, "Hover to explore"],
      ["growth" as const, true, 8 as const, "Growth Potential"],
      ["reach" as const, true, 8 as const, "Qualified Reach"],
      ["engagement" as const, true, 8 as const, "Engagement Intensity"],
      ["reach" as const, false, 8 as const, "Create Posts to analyze"],
      ["engagement" as const, false, 8 as const, "Create Posts to analyze"],
      ["self" as const, true, 1 as const, "Create a Self"],
      ["self" as const, true, 8 as const, "Go to Content Studio"],
    ])(
      "shows %s / isDataCollected=%s / self=%s → %s",
      (hover, isDataCollected, selfCount, expected) => {
        render(
          <PersonaRadialChart
            hover={hover}
            isDataCollected={isDataCollected}
            selfCount={selfCount}
          />,
        );

        expect(screen.getByText(expected)).toBeInTheDocument();
      },
    );

    it("calls onCenterClick when the message is clicked", async () => {
      const onCenterClick = vi.fn();
      render(
        <PersonaRadialChart
          selfCount={1}
          hover="self"
          onCenterClick={onCenterClick}
        />,
      );

      await userEvent.click(screen.getByText("Create a Self"));

      expect(onCenterClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("hover behaviour", () => {
    it("stays fixed on the controlled value regardless of the mouse", async () => {
      const { container } = render(<PersonaRadialChart hover="growth" />);

      const hitAreas = container.querySelectorAll<SVGPathElement>(
        'g[fill="transparent"] path',
      );
      await userEvent.hover(hitAreas[2]);

      // Since it's controlled, growth stays even when hovering the engagement ring
      expect(screen.getByText("Growth Potential")).toBeInTheDocument();
    });

    it("reports hover changes through onHoverChange", async () => {
      const onHoverChange = vi.fn();
      const { container } = render(
        <PersonaRadialChart onHoverChange={onHoverChange} />,
      );

      const hitAreas = container.querySelectorAll<SVGPathElement>(
        'g[fill="transparent"] path',
      );
      await userEvent.hover(hitAreas[0]);

      expect(onHoverChange).toHaveBeenCalledWith("growth");
    });

    it("activates the hovered avatar, not just the self one", async () => {
      const onHoverChange = vi.fn();
      render(<PersonaRadialChart onHoverChange={onHoverChange} />);

      // Hovering a non-self avatar still switches to the self-highlight state
      await userEvent.hover(
        screen.getByRole("img", { name: "Yoga Meditator" }),
      );

      expect(onHoverChange).toHaveBeenCalledWith("self");
    });

    it("does not highlight any ring while an avatar is hovered", async () => {
      const { container } = render(<PersonaRadialChart />);

      await userEvent.hover(
        screen.getByRole("img", { name: "Data Scientist" }),
      );

      // Avatar hover isn't metric hover, so no ring dims to black
      expect(getBandPaths(container, BLACK_BAND)).toHaveLength(0);
      expect(getBandPaths(container, WHITE_BAND).length).toBeGreaterThan(0);
    });

    it("restores the default message when the pointer leaves an avatar", async () => {
      /*
       * With only the root's onMouseLeave, restoration happened **only when
       * leaving the chart entirely**, so the CTA text stayed as-is when
       * moving from the avatar to the empty center space. So this verifies
       * via a move that stays inside the chart (avatar → center message).
       */
      render(<PersonaRadialChart />);

      const avatar = screen.getByRole("img", { name: "Novelist" });
      await userEvent.hover(avatar);
      expect(screen.getByText("Go to Content Studio")).toBeInTheDocument();

      /*
       * React synthesizes onMouseLeave from `mouseout` + `relatedTarget`,
       * excluding the common ancestor up to relatedTarget. The common
       * ancestor here is the chart root, so this event fires **only the
       * avatar's onMouseLeave** and not the root's — precisely targeting
       * per-avatar handling.
       */
      fireEvent.mouseOut(
        avatar.closest(`.${selfCurationStyles.slotWrap}`) as HTMLElement,
        {
          relatedTarget: screen.getByText("Go to Content Studio"),
        },
      );

      expect(screen.getByText("Hover to explore")).toBeInTheDocument();
    });

    it("says Go to Content Studio when an existing avatar is hovered", async () => {
      // Even with only 1 self, hovering that self shouldn't prompt "create a new one"
      render(<PersonaRadialChart selfCount={1} />);

      await userEvent.hover(
        screen.getByRole("img", { name: "Data Scientist" }),
      );

      expect(screen.getByText("Go to Content Studio")).toBeInTheDocument();
      expect(screen.queryByText("Create a Self")).toBeNull();
    });

    it("says Create a Self when an empty slot is hovered", async () => {
      render(<PersonaRadialChart selfCount={1} />);

      await userEvent.hover(screen.getAllByLabelText("No Self")[0]);

      expect(screen.getByText("Create a Self")).toBeInTheDocument();
    });

    it("follows the mouse when uncontrolled", async () => {
      const { container } = render(<PersonaRadialChart />);

      const hitAreas = container.querySelectorAll<SVGPathElement>(
        'g[fill="transparent"] path',
      );
      await userEvent.hover(hitAreas[1]);

      expect(screen.getByText("Qualified Reach")).toBeInTheDocument();
      expect(screen.getByText("8,340")).toBeInTheDocument();
    });
  });

  /*
   * jsdom doesn't actually run animations, so "smoothness" can't be
   * verified. Instead this checks that the classes needed for the
   * transition are applied, and that the correct data-active is set per state.
   */
  describe("transitions", () => {
    it("puts a colour transition on every value band", () => {
      const { container } = render(<PersonaRadialChart />);

      for (const band of getBandPaths(container, WHITE_BAND)) {
        expect(band).toHaveClass(styles.colorTransition);
      }
    });

    it("puts a colour transition on the grid circles", () => {
      const { container } = render(<PersonaRadialChart />);

      for (const circle of container.querySelectorAll("circle")) {
        expect(circle).toHaveClass(styles.colorTransition);
      }
    });

    it("keeps the avatar highlight ring mounted in both states", () => {
      const { container: idle } = render(<PersonaRadialChart />);
      const { container: active } = render(<PersonaRadialChart hover="self" />);

      const ringOf = (container: HTMLElement) =>
        container.querySelector<HTMLElement>(`.${selfSlotStyles.ring}`)!;

      // The ring always exists, only data-active changes — this is needed for border-color to transition
      for (const el of [ringOf(idle), ringOf(active)]) {
        expect(el).toHaveClass(selfSlotStyles.ring);
      }
      expect(ringOf(idle)).not.toHaveAttribute("data-active");
      expect(ringOf(active)).toHaveAttribute("data-active");
    });

    it("keeps the dim overlay mounted so it can fade", () => {
      const { container: idle } = render(<PersonaRadialChart />);
      const { container: active } = render(<PersonaRadialChart hover="self" />);

      const overlayOf = (container: HTMLElement) =>
        container.querySelector<HTMLElement>(`.${selfSlotStyles.overlay}`)!;

      expect(overlayOf(idle)).not.toHaveAttribute("data-active");
      expect(overlayOf(active)).toHaveAttribute("data-active");
    });

    it("swaps the empty slot's dashed border for a solid one when it becomes the highlight", () => {
      const slotOf = (hover?: "self") =>
        render(
          <PersonaRadialChart selfCount={1} hover={hover} />,
        ).container.querySelectorAll<HTMLElement>('[aria-label="No Self"]')[0];

      const idle = slotOf();
      expect(idle).not.toHaveAttribute("data-active");

      const active = slotOf("self");
      expect(active).toHaveAttribute("data-active");
    });

    it("fades the badge label in when the text is swapped", () => {
      const { rerender } = render(<PersonaRadialChart />);
      expect(screen.getByText("Data Scientist")).toHaveClass(styles.fadeIn);

      rerender(<PersonaRadialChart hover="growth" />);
      expect(screen.getByText("80%")).toHaveClass(styles.fadeIn);
    });
  });
});
