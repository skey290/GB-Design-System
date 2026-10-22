# Scrollbar

Figma: [📌 GB_Design-System — Atom](https://www.figma.com/design/G9YNa2vjdqDjnML9y5hXJ4/%F0%9F%93%8C-GB_Design-System--Atom-?node-id=7792-522) · node-id `7792:522`
Code: `components/ui/scrollbar/scrollbar.tsx`

## Overview

A decorative track + thumb overlay, matching Figma's own `Scroll bar` component structure — a sibling `div` drawn **next to** a scrollable element, not a wrapper around it. It has no scroll-ratio logic of its own: the caller measures its own scrollable element's `scrollTop`/`scrollHeight`/`clientHeight` and passes the resulting percentages in as `thumbTop`/`thumbHeight`. This is a deliberate match to how Figma itself separates the two concerns — the `Scroll bar` component is pure decoration; computing where the thumb sits is something only a real scrolling interaction (i.e. code) can do.

An earlier version of this component tried to reproduce the design by repainting the browser's *native* scrollbar through `::-webkit-scrollbar`, which put the bar **inside** the scrolling container's own box. That cannot reproduce Figma's structure, where the bar is a separate 10px/5px-wide panel sitting **outside** the scrollable content — so two consumers (`DropdownList`, `NotiDropdown`) each drew their own near-identical `div`-based overlay by hand instead of using this component at all. The current version matches Figma's actual structure, and both consumers now import and reuse it (see Composition below).

## When to use

- Next to a vertically scrolling list or box, to show scroll position with Figma's track/thumb look. Pair it with a sibling scrollable element that hides its own native scrollbar (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`) and reports its own scroll ratio.

There is no "narrow area" precedent for `thickness="thin"` in the app yet — it exists because Figma defines it (all three real Figma instances found so far use `Thick`, 10px), not because an observed use case needs it.

## When not to use

- **When the scroll position must be controlled, or a custom thumb must be draggable.** This component only draws the thumb at whatever percentages it's given — it does not read or write scroll position itself.
- Horizontal scrolling — this component only draws a vertical track.

## How to use

Pair it with the scrollable element as a flex sibling, computing the ratio yourself (see `dropdown-list.tsx` or `noti-dropdown.tsx` for the full pattern, or `scrollbar.stories.tsx` for a minimal one):

```tsx
const [thumb, setThumb] = useState({ top: 0, height: 100 });
const listRef = useRef<HTMLDivElement>(null);

const updateThumb = () => {
  const el = listRef.current;
  if (!el) return;
  const { scrollTop, scrollHeight, clientHeight } = el;
  if (scrollHeight <= clientHeight) return setThumb({ top: 0, height: 100 });
  const heightPercent = (clientHeight / scrollHeight) * 100;
  const topPercent = (scrollTop / (scrollHeight - clientHeight)) * (100 - heightPercent);
  setThumb({ top: topPercent, height: heightPercent });
};

<div className="flex items-stretch gap-[var(--gb-spacing-2)]">
  <div
    ref={listRef}
    onScroll={updateThumb}
    className="min-w-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    {content}
  </div>
  <Scrollbar thumbTop={thumb.top} thumbHeight={thumb.height} />
</div>
```

## Structure

Five files per the project component rule: `scrollbar.tsx` / `scrollbar.module.css` / `scrollbar.stories.tsx` / `scrollbar.test.tsx` / `index.ts`.

```
<div aria-hidden="true">   the track — width 10px/5px, radius full, background-subtler
  <div />                  the thumb — absolutely positioned by top%/height%, background-subtle
```

The DOM is two `<div>`s: an `aria-hidden` track and an absolutely positioned thumb inside it. Neither wraps any scrollable content.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `thumbTop` | `number` | **required** | Thumb position as a percentage (0–100) of the track |
| `thumbHeight` | `number` | **required** | Thumb height as a percentage (0–100) of the track |
| `thickness` | `"thick" \| "thin"` | `"thick"` | Scrollbar width (Figma `Type`) |
| `className` | `string` | — | Merged onto the track `<div>` |

The rest of `Omit<React.HTMLAttributes<HTMLDivElement>, "children">` is inherited — `children` is excluded, since this component never wraps scrollable content. `style` is commonly used to set the track's `height` to match the paired list's visible height.

## Variants

Figma has two axes — `Type` (Thick/Thin) × `Position` (Start/Center/End), six variants. `Position` is **a snapshot of where the thumb sits on the track**, not a prop: the real position is driven by `thumbTop`/`thumbHeight`, following the caller's actual scroll offset.

| Figma `Type` | `thickness` | Width |
| --- | --- | --- |
| `Thick` | `"thick"` | 10px |
| `Thin` | `"thin"` | 5px |

## States and behaviors

| Property | Value |
| --- | --- |
| Track background | `--gb-background-subtler` |
| Thumb background | `--gb-background-subtle` |
| Track and thumb radius | `--gb-radius-scale-full` |

- **There is no hover or active state.** Figma defines no thumb color change either.
- **The thumb is not inset.** Figma's `Indicator` layer is absolutely positioned, so a `py-[16px]`-looking gap in the generated CSS is not an actual inset — the thumb sits flush against both ends of the track (`Start` variant: y=0; `End` variant: y = track height − thumb height). There is no 16px inset to reproduce, and this component doesn't add one.
- **No Firefox-specific concerns remain.** Because this is a hand-drawn overlay rather than a repainted native scrollbar, `scrollbar-color`/`scrollbar-width`'s Firefox limitations (which the previous native-repaint version had to work around) no longer apply — the track/thumb render identically everywhere.

## Composition with other components

Both real consumers compose this component today:

- **`DropdownList`** (`components/ui/dropdown-list`): renders `<Scrollbar thumbTop={thumb.top} thumbHeight={thumb.height} style={{ height: LIST_VISIBLE_HEIGHT }} />` as a flex sibling of its `<ul>`, reusing its own existing thumb-ratio calculation. This matches a genuine `Scroll bar` instance Figma embeds inside the `Dropdown slot`'s `self` / `mbti` / `phone number` `Type`s (confirmed via the instance-id chain back to this component's master, `7792:524`).
- **`NotiDropdown`** (`components/app/noti-dropdown`): same pattern, replacing what used to be its own hand-rolled Tailwind `div` overlay (which also carried the same 4px-inset bug `DropdownList` had — both are fixed now that they share one implementation).

`Select` is not part of either consumer directly — `select.tsx`/`select.module.css` contain no scrollbar markup; its dropdown content is `DropdownList`, which is where the actual reuse happens.
