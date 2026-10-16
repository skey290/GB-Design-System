import * as React from "react";

/** Set by ButtonGroup; Button falls back to it when it has no `disabled` prop of its own. */
export const ButtonGroupContext = React.createContext<{ disabled?: boolean }>(
  {},
);
