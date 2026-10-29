# DropdownList

- Code: `components/ui/dropdown-list/dropdown-list.tsx` (`dropdown-list.module.css`, `dropdown-list.stories.tsx`, `dropdown-list.test.tsx`, `index.ts`)
- Figma: [📌 GB_Design-System (Atom)](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=8094-1187) `Dropdown slot` (node `8094:1187`) · `Part/dropdown slot` (node `8094:1231`)

## Overview

The option list (plus its custom scrollbar) extracted from `Select`'s dropdown panel. `Select` imports this component and places it inside the popover content below the trigger — the same "shared slot plus the content that fills it" relationship as `components/ui/chatbox` and `components/app/chatbox-composer`. The difference is that Chatbox's slot takes static content, while here selection and highlight state flow both ways with `Select` (`highlightedIndex` / `onHighlightChange`, `onCommit`).

In Figma, the `Select` component set (Atom file, node `614:2466`) contains an empty slot node named `Dropdown`, and the design of the list that actually goes in there lives in `Dropdown slot` / `Part/dropdown slot`, placed next to `Select` in the same file. They are separate reference component sets, not absorbed into the variant axes.

It lives in `components/ui/` because it is the extracted internals of `Select`, which is a real atom in the Atom file. If `ui/Select` referenced `app/`, the GB-Design-System build — which publishes only `Select` — would break.

**The three `Type` values on `Dropdown slot` (with Icon / default / with search) are a real Figma variant property, not sample-data showcases** — `get_design_context` returns `type?: "with Icon" | "default" | "with search"` as a generated prop, and each of the three is its own `Type=…` symbol under `8094:1187`. They differ from each other: `with Icon` is 210×148 with a 4-row list and no scrollbar; `default` is 210×220 with a 6-row list and a scrollbar; `with search` is 210×260, adding an `Input search` field above a 6-row scrollable list. Neither the `DropdownListOption` type nor the rendering logic in code branches on this axis, though — the three remain sample data for story purposes in that narrower sense.

## When to use

- `Select` uses it internally. There is rarely a reason to reach for it directly, but it is reusable when an option list is needed without a trigger (a command palette, for instance).

## How to use

```tsx
<DropdownList
  options={options}
  value={currentValue}
  highlightedIndex={highlightedIndex}
  onHighlightChange={setHighlightedIndex}
  onCommit={(option) => { ... }}
  listboxId={listboxId}
  getOptionId={(value) => `${id}-option-${value}`}
/>
```

## Props

| Prop                | Type                                   | Description                                                                |
| ------------------- | -------------------------------------- | -------------------------------------------------------------------------- |
| `options`           | `DropdownListOption[]`                 | `{ value, label, code?, icon?, disabled? }[]`                              |
| `value`             | `string`                               | Currently selected value                                                   |
| `highlightedIndex`  | `number`                               | Index highlighted by keyboard or mouse (controlled; the parent owns it)    |
| `onHighlightChange` | `(index: number) => void`              | Called when mouse hover moves the highlight                                |
| `onCommit`          | `(option: DropdownListOption) => void` | Called when an option is clicked — checking `disabled` is the caller's job |
| `listboxId`         | `string`                               | `<ul id>`, linked to the trigger's `aria-controls`                         |
| `getOptionId`       | `(value: string) => string`            | Builds each option's `id` for `aria-activedescendant`                      |

`DropdownListOption`: `{ value: string; label: string; code?: string; icon?: LucideIcon; disabled?: boolean }` — the `SelectOption` that `Select` exports is an alias of this type, re-exported.

## Structure

- If any option has an `icon`, a 16px icon column is added at the front (options without one keep the empty slot so the rows align) — a code-only decision with no Figma counterpart to check it against.
- If any option has a `code`, the layout becomes two columns — a fixed 50px `code` column plus `label`; otherwise a single `label` column.
- Rows use an 8px gap between their icon/code/label cells (`--gb-spacing-2`), matching Figma's `self`/`mbti`/`phone number` row layout.
- **The list is always capped at six rows.** Past six options it scrolls; Figma's own `self` / `mbti` / `phone number` `Type`s are themselves drawn at exactly 6 rows with the scrollbar showing, so this isn't an extrapolation past what Figma defines. The `<ul>` hides its own native scrollbar and sits next to the shared `Scrollbar` component (`components/ui/scrollbar`), which renders only when there are more than six options; `DropdownList` computes `top`/`height` percentages from the scroll position and passes them in as `thumbTop`/`thumbHeight`. This pairing reproduces a genuine `Scroll bar` component instance that Figma embeds inside those three `Type`s (see [`scrollbar.md`](./scrollbar.md)) — it is not an invented, code-only scrollbar. The panel is 220px tall and the scrollbar track sits flush against the right edge, matching Figma. There is no "show more" chevron at the bottom because Figma does not design one — scrolling is the only way to reach the rest.
  Implementation note: the height cap is applied through inline `style` on the `<ul>` and the scrollbar track rather than a Tailwind arbitrary-value class — in `calc()`, a `+` or `-` without surrounding whitespace invalidates the whole declaration and is silently dropped.
- A `disabled` option only dims its text and never takes the hover highlight, but the click is still forwarded through `onCommit` — blocking selection is the caller's responsibility (`Select` does it).
- The scrollbar thumb size is recomputed in `useLayoutEffect` whenever `options` changes. The `<ul>` itself is not remounted when only the content changes inside the same `Select` / `DropdownList` instance, so computing it at mount alone would leave a thumb sized for the previous option count.

## States and behaviors

- **Selected and highlighted options** both render as `--gb-background-mute` + `--gb-text-static-white` — mouse hover and keyboard highlight look identical.
- **Per-option disabled** changes only the text to `--gb-text-static-gray`, with no background change, and never highlights on hover.
