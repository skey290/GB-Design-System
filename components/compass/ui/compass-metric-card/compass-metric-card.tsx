import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import styles from "./compass-metric-card.module.css";

/**
 * A component that extracts the frame (shell) that repeats identically across the
 * three "Growth Potential" / "Qualified Reach" / "Engagement Intensity" sections
 * inside Figma's "Detail view" (❄️ GB_Compass, C34HOpbSASmThFA1iYFm8D) node-id
 * 8003:12444. After directly inspecting all 6 `type` variants
 * (default/BLS/niche data/no experience/trend data/error), all three sections
 * share the same "title+badge header → (optional) description paragraph →
 * content slot → (optional) footer link" structure, and the only thing that
 * changes is inside the content slot (percent hero vs. post stats vs. empty
 * state), so only that part is injected as `children` from the parent
 * (`CompassDetailView`) (same compass-specific child-component split pattern
 * as `compass-dial-tick.tsx`).
 *
 * `state` → Figma axis mapping:
 * - `default` (no border): type=default/BLS/trend data
 * - `warning` (adds a 1px `--border-warning` border): type=niche data/no experience
 *   (verified against Figma — counterintuitively, the warning border appears
 *   only on these two types rather than on a "completely empty" state. This
 *   axis is only used on the Growth Potential card; the Qualified Reach/
 *   Engagement Intensity cards are always `default` even for these two types)
 * - `error`: hides only the "Update in Know thyself" footer link. Warning: the
 *   description paragraph is determined solely by whether the `description`
 *   prop is passed, independent of `state` — verified against Figma, the
 *   Qualified Reach/Engagement Intensity cards still keep their description
 *   paragraph even in `error` (the caller keeps passing it), while only the
 *   Growth Potential card's caller omits `description` entirely in `error`
 *   (it occupies the title slot instead), causing it to disappear.
 */

export type CompassMetricCardState = "default" | "warning" | "error";

export interface CompassMetricCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Card title (e.g. "Growth Potential") */
  title: string;
  /** Pill badge text on the right of the header (e.g. "Become Recommended") */
  badgeLabel: string;
  /** Description paragraph. Rendered only when this value is present, regardless of `state` (see doc comment above) */
  description?: string;
  /** Shell style determined by the Figma `type` axis. Defaults to "default" */
  state?: CompassMetricCardState;
  /** Footer link text. Defaults to "Update in Know thyself" */
  footerLinkLabel?: string;
  /** Footer link click handler. The link itself is not rendered when `state="error"` */
  onFooterLinkClick?: () => void;
  /** Content slot (percent hero/post stats/empty state/error notice, etc. — differs per card) */
  children: React.ReactNode;
}

export function CompassMetricCard({
  title,
  badgeLabel,
  description,
  state = "default",
  footerLinkLabel = "Update in Know thyself",
  onFooterLinkClick,
  children,
  className,
  ...props
}: CompassMetricCardProps) {
  const isError = state === "error";

  return (
    <div
      className={cn(styles.root, className)}
      data-warning={state === "warning" || undefined}
      {...props}
    >
      <div className={styles.headerWrap}>
        <div className={styles.headerRow}>
          <p className={styles.title}>{title}</p>
          <Badge variant="outline" size="20">
            {badgeLabel}
          </Badge>
        </div>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {children}

      {!isError && (
        // Verified against Figma coordinates (bugfix, node 8003:12465 vs parent 8003:12449):
        // button instance x=404, width=156 → right edge at 560px, which exactly
        // matches the card content area's right edge (28+532=560 once the 28px
        // padding is excluded) — so this was right-aligned, not centered.
        // Changed `items-center` to `items-end`.
        <div className={styles.footerLinkRow}>
          <Button
            variant="link"
            onClick={onFooterLinkClick}
            className={styles.footerLink}
          >
            {footerLinkLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
