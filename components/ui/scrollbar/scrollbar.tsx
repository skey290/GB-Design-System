import * as React from "react";

import styles from "./scrollbar.module.css";

export type ScrollbarThickness = "thick" | "thin";

export interface ScrollbarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Scrollbar thickness (Figma `Type`). Defaults to thick */
  thickness?: ScrollbarThickness;
  /** Thumb position as a percentage of the track (0–100) */
  thumbTop: number;
  /** Thumb height as a percentage of the track (0–100) */
  thumbHeight: number;
}

/**
 * The track + thumb overlay itself (Figma's `Scroll bar` component) — a decorative
 * sibling placed next to a scrollable element, not a wrapper around it. The scrollable
 * element hides its own native scrollbar (`scrollbar-width: none`) and reports its scroll
 * ratio up to `thumbTop`/`thumbHeight`; this component only draws what that ratio says.
 */
export const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
  function Scrollbar(
    { thickness = "thick", thumbTop, thumbHeight, className, style, ...props },
    ref,
  ) {
    const classNames = [styles.track, styles[thickness], className]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={classNames}
        style={style}
        {...props}
      >
        <div
          className={styles.thumb}
          style={{ top: `${thumbTop}%`, height: `${thumbHeight}%` }}
        />
      </div>
    );
  },
);
