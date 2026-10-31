import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { CompassSphere } from "./compass-sphere";

/**
 * jsdom has no WebGL context, so creating a `THREE.WebGLRenderer` fails —
 * the component is guarded to skip sphere rendering in that case (see the
 * component's comment), so here we only verify that the static layer
 * (container/default badge label) mounts without crashing.
 */
describe("CompassSphere", () => {
  it("renders without crashing when WebGL is unavailable", () => {
    render(<CompassSphere />);

    expect(screen.getByText("Gabrielle.ai")).toBeInTheDocument();
  });

  it("forwards className and props to the root container", () => {
    const { container } = render(
      <CompassSphere className="custom-class" data-testid="sphere-root" />,
    );

    const root = screen.getByTestId("sphere-root");
    expect(root).toHaveClass("custom-class");
    expect(container.firstChild).toBe(root);
  });
});
