import * as React from "react";

import styles from "./scrollbar.module.css";

export type ScrollbarThickness = "thick" | "thin";

export interface ScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Scrollbar thickness. Defaults to thick */
  thickness?: ScrollbarThickness;
  /** Content to be scrolled */
  children: React.ReactNode;
}

export const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
  function Scrollbar({ thickness = "thick", className, children, ...props }, ref) {
    const classNames = [styles.root, styles[thickness], className]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    );
  },
);
