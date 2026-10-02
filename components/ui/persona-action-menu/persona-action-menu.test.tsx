import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  PersonaActionMenu,
  type PersonaActionMenuAction,
} from "./persona-action-menu";

beforeAll(() => {
  // Radix Popover는 포지셔닝 계산에 ResizeObserver를 사용하는데 jsdom에는 없음
  if (!("ResizeObserver" in window)) {
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = vi
      .fn()
      .mockImplementation(function ResizeObserverMock() {
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        };
      });
  }
});

function buildActions(): PersonaActionMenuAction[] {
  return [
    { label: "Create a Post", onSelect: vi.fn() },
    { label: "Edit Asset Image", onSelect: vi.fn() },
    { label: "Move to Archive", onSelect: vi.fn() },
    { label: "Edit Goal", onSelect: vi.fn() },
  ];
}

describe("PersonaActionMenu", () => {
  it("renders the label on the trigger", () => {
    render(
      <PersonaActionMenu
        style="self-right"
        label="Data Scientist"
        actions={buildActions()}
      />,
    );

    expect(screen.getByRole("button")).toHaveTextContent("Data Scientist");
  });

  it("opens the action list when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <PersonaActionMenu
        style="self-right"
        label="Data Scientist"
        actions={buildActions()}
      />,
    );

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Create a Post")).toBeInTheDocument();
    expect(screen.getByText("Move to Archive")).toBeInTheDocument();
  });

  it("calls the action's onSelect and closes the menu when clicked", async () => {
    const user = userEvent.setup();
    const actions = buildActions();

    render(
      <PersonaActionMenu
        style="self-right"
        label="Data Scientist"
        actions={actions}
      />,
    );

    await user.click(screen.getByRole("button"));
    const option = await screen.findByText("Move to Archive");
    await user.click(option);

    expect(actions[2].onSelect).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("selects the highlighted action with ArrowDown + Enter", async () => {
    const user = userEvent.setup();
    const actions = buildActions();

    render(
      <PersonaActionMenu
        style="self-right"
        label="Data Scientist"
        actions={actions}
      />,
    );

    await user.click(screen.getByRole("button"));
    await screen.findByRole("listbox");
    await user.keyboard("{ArrowDown}{Enter}");

    expect(actions[1].onSelect).toHaveBeenCalledTimes(1);
  });

  it("renders the self-left style with the same actions", async () => {
    const user = userEvent.setup();
    const actions = buildActions();

    render(
      <PersonaActionMenu
        style="self-left"
        label="Data Scientist"
        actions={actions}
      />,
    );

    await user.click(screen.getByRole("button"));
    const option = await screen.findByText("Edit Goal");
    await user.click(option);

    expect(actions[3].onSelect).toHaveBeenCalledTimes(1);
  });
});
