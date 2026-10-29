# Tabs

- Code: `components/ui/tabs/tabs.tsx` (`tabs.module.css`, `tabs.stories.tsx`, `tabs.test.tsx`, `index.ts`)
- Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=3282-324) — node-id `3282:324` (the "Tabs" frame, `Number` variants 1–8)

## Overview

`Tabs` lays out `role="tab"` buttons in a row inside a `role="tablist"` root. It is fully controlled through the `items` array (`TabItem[]`), `selectedIndex`, and the `onSelectedIndexChange` callback. Each tab can render a count `Badge` beside its label.

Page frame `76:10755` holds two component sets:

- **`Part/Tab`** (node `3282:285`) — the `State` variants of a single tab: `Default` / `Hovered` / `Selected` / `disabled`. The per-tab button styles map 1:1 onto these four.
- **`Tabs`** (node `3282:324`) — a `Number` variant (`1`–`8`) showing rows with different tab counts. Every tab is drawn in `Default`, and only the container width changes.

## When to use

- To **switch between sections in one area** — one visible at a time, with the tab row showing which is open.
- When each section should **expose an item count** — passing `count` adds a `Badge` beside the label.
- When a section must be **temporarily unselectable** — `items[].disabled` disables a single tab.

## When not to use

- **Do not place `Part/Tab` on its own.** The Figma description says so: a single tab is a part used to build `Tabs`.
- **When there is nothing to switch between.** The root declares `role="tablist"` and each button `role="tab"` with `aria-selected`, so a tab row that changes nothing announces itself as tabs while doing nothing. If you only need a heading, use a heading element.

## How to use

```tsx
// Basic — with count badges
const items = [
  { label: "All", count: 12 },
  { label: "In progress", count: 4 },
  { label: "Done" }, // no count → no badge
];

<Tabs items={items} selectedIndex={0} />;

// Controlled switching
function TabsDemo() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <Tabs
      items={items}
      selectedIndex={selectedIndex}
      onSelectedIndexChange={setSelectedIndex}
    />
  );
}

// Disabled tab — not clickable, and no badge even with a count
<Tabs
  items={[
    { label: "All", count: 12 },
    { label: "In progress", count: 4, disabled: true },
    { label: "Done" },
  ]}
  selectedIndex={0}
/>;
```

Live composition (`components/app/noti-dropdown/noti-dropdown.tsx`):

```tsx
<Tabs
  items={[
    { label: "All", count: items.length },
    { label: "Unread", count: unreadCount },
  ]}
  selectedIndex={selectedTab === "unread" ? 1 : 0}
  onSelectedIndexChange={(index) =>
    onSelectedTabChange?.(index === 1 ? "unread" : "all")
  }
/>
```

## Structure

- Root: `<div role="tablist">`, a flex row with a bottom border (`--gb-border-1` of `--gb-border-static-gray`). Overridable through `className`.
- Each tab: `<button type="button" role="tab" aria-selected={selected} tabIndex={selected ? 0 : -1} disabled={item.disabled}>`
  - `<span>{item.label}</span>`
  - A `<Badge>` is rendered only when `typeof item.count === "number" && !item.disabled`, with `variant={selected ? "default" : "outline"}`. When disabled, no badge renders regardless of `count`.
- The key is `` `${item.label}-${index}` `` — `TabItem` has no `id` prop, so the key is built from label plus index.

A single tab is 48px tall with `--gb-spacing-3` (12px) horizontal padding and `--gb-spacing-2` (8px) between label and badge. There is no gap between tabs, so they butt together and the bottom border runs unbroken.

## Props

`TabItem`:

| Prop       | Type      | Required | Default | Description                                                                                         |
| ---------- | --------- | -------- | ------- | --------------------------------------------------------------------------------------------------- |
| `label`    | `string`  | yes      | —       | Label text                                                                                          |
| `count`    | `number`  | no       | —       | Count beside the label. No badge without it                                                         |
| `disabled` | `boolean` | no       | —       | Blocks clicks and suppresses the badge even when a count exists (Figma `Part/Tab` `state=disabled`) |

`TabsProps` = `Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">` plus:

| Prop                    | Type                                                      | Required | Default | Description                       |
| ----------------------- | --------------------------------------------------------- | -------- | ------- | --------------------------------- |
| `items`                 | `TabItem[]`                                               | yes      | —       | The tabs                          |
| `selectedIndex`         | `number`                                                  | yes      | —       | Index of the selected tab         |
| `onSelectedIndexChange` | `(index: number) => void`                                 | no       | —       | Called when the selection changes |
| `className`             | `string`                                                  | no       | —       | Merged onto the root `<div>`      |
| rest                    | `React.HTMLAttributes<HTMLDivElement>` (minus `onChange`) | no       | —       | `data-*` and other div attributes |

## Variants

The four `State` variants of Figma `Part/Tab` (node `3282:285`) and their code equivalents:

| Figma `State` | Code condition                       | Label color / typography                  | Bottom border        | Badge                                                                    |
| ------------- | ------------------------------------ | ----------------------------------------- | -------------------- | ------------------------------------------------------------------------ |
| `Default`     | `selected === false`, not hovered    | `--gb-text-subtle`, `Text-sm/Medium`      | transparent          | `variant="outline"` (when a count exists)                                |
| `Hovered`     | CSS `:hover` on unselected tabs only | `--gb-text-emphasis`, `Text-sm/Medium`    | transparent          | `variant="outline"` — Figma keeps the Default badge color in Hovered too |
| `Selected`    | `selected === true`                  | `--gb-text-default`, `Text-sm/SemiBold`   | `--gb-border-bolder` | `variant="default"`                                                      |
| `disabled`    | `disabled === true`                  | `--gb-text-static-gray`, `Text-sm/Medium` | transparent          | not rendered (Figma has no badge in `disabled` either)                   |

`Selected` and `Hovered` are mutually exclusive states in Figma, and the code matches: the selected branch has no hover rule, and only the unselected branch applies the hover color.

The `Number` variant changes neither color nor style — only the tab count (1–8) and the container width. The code covers it naturally through `items.length`, with no prop.

The root is `width: fit-content` — Figma sets `Tabs` to HUG, so it takes only as much room as its tabs. To spread tabs evenly across a container, the consumer passes layout through `className` (see NotiDropdown).

## States and behaviors

- **Selection (`aria-selected`)** is computed from `selectedIndex === index` and applies the `Selected` style (semibold plus bottom border).
- **hover** applies only to unselected tabs, with a color transition.
- **focus-visible** draws a 2px outline at `-3px` offset with a `--gb-radius-scale-lg` corner. Figma's four `Part/Tab` states include no "Focused" variant — this is an accessibility layer added in code. The `-3px` has no matching token and is hardcoded deliberately (see below).
- **disabled** uses the native attribute (blocking clicks, `pointer-events: none`, `cursor: not-allowed`) with `--gb-text-static-gray`, and suppresses the badge.
- The `role="tablist"` container itself has no hover or focus state — state exists per tab button only.
- **Arrow-key navigation (code-only, no Figma basis).** Left/Right move selection to the previous/next enabled tab and move focus with it (Home/End jump to the first/last enabled tab); disabled tabs are skipped. Only the selected tab is in the Tab order (`tabIndex={selected ? 0 : -1}`, the standard WAI-ARIA tablist roving-tabindex pattern) — the same pattern `ButtonGroup`'s `type="menu"` already uses.

## Composition with other components

- **Badge** (`components/ui/badge`): rendered only when `count` is a number and the tab is not disabled, with `variant={selected ? "default" : "outline"}` tying badge color to selection.
- **NotiDropdown** (`components/app/noti-dropdown`): "All" / "Unread" tabs with count badges filtering the notification list, with each tab button stretched evenly through `className`.

Consumers override only the root's layout (width, border color) through `className` and leave the per-tab styling — typography and the badge variant logic — alone.

## `focus-visible` is an accessibility layer added in code

Figma's `Part/Tab` `State` axis has no `Focused`. It exists for keyboard users, and `outline-offset: -3px` has no matching value in the token scale so it stays a literal — there is no Figma spec to compare it against.
