import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ReachEngagement, type FunnelColumn } from "./ReachEngagement";

describe("ReachEngagement", () => {
  it("defaults to type=empty and shows the no-data state", () => {
    render(<ReachEngagement />);

    expect(screen.getByText("No reach data yet")).toBeInTheDocument();
    expect(
      screen.getByText(/Insights from channels like LinkedIn/),
    ).toBeInTheDocument();
  });

  it("renders the reach total, delta, metrics, and top channel for type=reach", () => {
    render(<ReachEngagement type="reach" />);

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("18,240")).toBeInTheDocument();
    expect(screen.getByText("+22%")).toBeInTheDocument();
    expect(screen.getAllByText("Engagement Rate")).toHaveLength(2);
    expect(screen.getByText("New Followers")).toBeInTheDocument();
    expect(screen.getByText("Top Channel")).toBeInTheDocument();
    expect(screen.getByText("Linkedin")).toBeInTheDocument();
  });

  it("calls onFunnelAnalysisClick when the funnel analysis button is clicked", async () => {
    const user = userEvent.setup();
    const onFunnelAnalysisClick = vi.fn();
    render(
      <ReachEngagement
        type="reach"
        onFunnelAnalysisClick={onFunnelAnalysisClick}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Funnel Analysis" }));

    expect(onFunnelAnalysisClick).toHaveBeenCalledTimes(1);
  });

  it("renders the connected-account select and all funnel columns for type=funnel", () => {
    render(<ReachEngagement type="funnel" />);

    expect(screen.getByText("Growth funnel on")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("Social Connected");
    expect(screen.getByText("Reach")).toBeInTheDocument();
    expect(screen.getByText("Engagement")).toBeInTheDocument();
    expect(screen.getByText("New Followers")).toBeInTheDocument();
    expect(screen.getByText("Conversion")).toBeInTheDocument();
    expect(screen.getByText("(avg.0.4%)")).toBeInTheDocument();
  });

  it("calls onAccountChange when a different account is selected", async () => {
    const user = userEvent.setup();
    const onAccountChange = vi.fn();
    render(
      <ReachEngagement
        type="funnel"
        accountOptions={[
          { value: "social-connected", label: "Social Connected" },
          { value: "other-account", label: "Other Account" },
        ]}
        onAccountChange={onAccountChange}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Other Account" }));

    expect(onAccountChange).toHaveBeenCalledWith("other-account");
  });

  it("renders custom columns passed via props instead of the default mock data", () => {
    const columns: FunnelColumn[] = [
      {
        label: "Custom Metric",
        value: "42",
        delta: "+1",
        rows: [
          {
            icon: "instagram-icon",
            label: "Instagram",
            value: "10",
            delta: "+1",
          },
        ],
      },
    ];

    render(<ReachEngagement type="funnel" columns={columns} />);

    expect(screen.getByText("Custom Metric")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.queryByText("Conversion")).not.toBeInTheDocument();
  });

  it("marks the highlighted channel row via data-highlighted", () => {
    render(<ReachEngagement type="funnel" />);

    const linkedinLabels = screen.getAllByText("Linkedin");
    const highlightedRow = linkedinLabels[0]?.closest("[data-highlighted]");
    expect(highlightedRow).toHaveAttribute("data-highlighted", "true");
  });
});
