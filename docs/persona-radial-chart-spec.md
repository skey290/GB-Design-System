# Persona Radial Analytics — Spec

## Overview

A data visualization comparing the user's "self" against 8 personas (Data Scientist, Yoga Meditator, Novelist, Entrepreneur, Fashionista, Fashion Editor, Team Leader, Vegan Chef) in a single radial chart. It expresses 3 metrics (Growth Potential, Qualified Reach, Engagement Intensity) as concentric rings, and the 8 personas as angular sectors.

- **Figma**: 📌 `GB_UXUI (261002)` (`Wp6AZNGqC4qf2Sz5zQ2PzQ`) node `8133:122594` ("Dashboard Data Vis")
- **Original variant composition**: `Self(1|8) × Data collected(true|false) × Status(default|hover-reach|hover-engagement|hover-growth potential)` = **12 total** (no `Self=8 × Data collected=false` combination). `hover="self"` is a value not on this Status axis — it's a separate interaction (directly hovering an avatar) that the code additionally handles
- **Implementation location**: `components/dashboard/ui/persona-radial-chart/`

> ⚠️ **Dark-only**: The Figma original is only drawn on a dark background. Badges, grid, and text are semantic tokens, so they automatically adapt to the light theme too, but **the value bands alone use a literal white 20% and are barely visible on a light background.** Until a light variant exists in Figma, the original values are followed as-is.

---

## 1. Overall Structure

### 1.1 Angle division (8 sectors = 8 personas)

- The circle is divided into exactly 8 equal 45° slices
- The first sector starts at **-90° (12 o'clock)** → the topmost spoke is exactly vertical. `Vegan Chef` (left) and `Data Scientist` (right) are symmetric left-right around dead center
- Sector placement order (clockwise from 12 o'clock):
  1. Data Scientist _(self)_
  2. Yoga Meditator
  3. Novelist
  4. Entrepreneur
  5. Fashionista
  6. Fashion Editor
  7. Team Leader
  8. Vegan Chef

> Array order is the sector order. Changing the order of the `personas` prop changes the placement too.

### 1.2 Radius division (3 rings = 3 metrics)

A 500×500 canvas, divided by **4** concentric circles (the intended values behind Figma's measured 127.775/159.781/199.539/249.549).

| Circle (from inside) | Radius  | Diameter | Role                                               |
| -------------------- | ------- | -------- | -------------------------------------------------- |
| 1                    | **128** | 256      | Boundary of the avatar placement zone              |
| 2                    | 160     | 320      | Outer boundary of Growth Potential                 |
| 3                    | 200     | 400      | Outer boundary of Qualified Reach                  |
| 4                    | 250     | 500      | Outer boundary of Engagement Intensity (outermost) |

The 3 rings, from the inside out:

1. **Growth Potential** — 128 ~ 160 (width 32)
2. **Qualified Reach** — 160 ~ 200 (width 40)
3. **Engagement Intensity** — 200 ~ 250 (width 50)

> **Coordinate system note**: the radii/angles above are **geometric coordinate values** inside the SVG `viewBox`, not CSS lengths. So they're kept as plain numeric constants instead of `--spacing-*` tokens. The component's **outer dimensions** (canvas, avatar, border/stroke width), on the other hand, use tokens.

### 1.3 Grid style

- 4 concentric circles + 4 diameter lines (= visually 8 spokes), base color `--color-muted`, thickness `--border-1`
- Hovering a ring with no data highlights **only that ring's 2 boundary circles** in `--color-semantic-non-changeable` (white) (§5.2)
- No separate guideline is drawn to split the 8 tiers inside a ring. **The tier boundaries are visible only as the brightness difference created by overlapping bands.**

---

## 2. Value Representation — Rank-Based 8-Tier Bands

### 2.1 Band stacking structure

Inside each ring, **donut slices (annulus sectors) that share the ring's inner boundary as their starting point are stacked N layers deep.**

- The ring width divided into 8 equal parts is one band tier
- For N tiers, a total of N overlapping paths are drawn: `[inner → inner+1 tier]`, `[inner → inner+2 tiers]` … `[inner → inner+N tiers]`
- The more layers overlap, the more alpha accumulates, naturally producing a **gradient that's bright on the inside and fades toward the outside**
- Band color: `color-mix(in srgb, var(--icon-default) 20%, transparent)` (white 20%, on a dark background)

> The "gradient" isn't an actual gradient definition — it's **the result of stacking semi-transparent bands on top of each other.** The Figma original also has its statically baked SVG, per persona×metric combination, built with the exact same technique (stacking the same geometry N layers deep with the same `fill-opacity`), so they're visually identical.

### 2.2 Tier count = **rank** within the ring (not a value ratio)

Ranks are evenly distributed so that 1st place gets 8 tiers and last place gets 1.

Coloring by value ratio (% relative to 1st place) has two problems:

1. **Similar values collapse together** — e.g. 8,340 and 8,006 would both become 8 tiers, indistinguishable
2. **One dominant person flattens everyone else to the bottom**

Coloring by rank means **all 8 people always stay distinguishable, regardless of distribution.** The tradeoff is that "how much of a difference" isn't expressed, so **the exact value is confirmed via the badge when hovering the ring** instead (§5.1).

- Tie → same rank = same tier
- Value ≤ 0 → treated as "no data", **0 tiers** (nothing drawn)
- Rank is always computed **against all 8 people**, regardless of who's currently shown. This keeps the scale stable even when only 1 self is visible

---

## 3. Avatar Placement

- Avatars are evenly placed **inside the radius-128 circle**, at each sector's middle angle (-67.5°, -22.5°, 22.5°, …)
- Placement orbit radius: **97** (Figma-measured) / Avatar size: **40px**
- Center-to-center distance between adjacent avatars ≈ 74px > 40px → no overlap
- Falls back to **initials → icon** in that order when there's no image (reuses the `Avatar` component)

### 3.1 Empty slot ("No Self")

Shown in the remaining 7 slots when only 1 self has been created:

- A 40px circle, `--border-1` (1px) **dashed** border, color `--border-muted`
- 8px text "No Self" centered (`text-xxs-medium`)
- Shaped differently from `Avatar`'s initial/icon variants, so it uses **chart-specific markup**

---

## 4. State (props)

| prop                  | values                                                     | default           | meaning                                                                                                            |
| --------------------- | ---------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `personas`            | `PersonaDatum[]`                                           | 8 sample people   | Personas that **exist**. Array order = sector order                                                                |
| `selfCount`           | `number` (1~8)                                             | `personas.length` | Number of selves to reveal. Remaining slots stay empty                                                             |
| `valueFractionDigits` | `number`                                                   | `1`               | **Maximum** decimal digits for badge values                                                                        |
| `isDataCollected`     | `boolean`                                                  | `true`            | Whether posts exist (Figma `Data collected`). **Growth is computed without posts**, but Reach/Engagement need them |
| `hover`               | `default` \| `growth` \| `reach` \| `engagement` \| `self` | —                 | When given, acts as a controlled component (ignores the mouse); when omitted, follows real mouse hover             |
| `selfId`              | `string`                                                   | first persona     | Id to treat as the self                                                                                            |
| `onHoverChange`       | `(hover) => void`                                          | —                 | Callback for hover state changes                                                                                   |
| `onCenterClick`       | `() => void`                                               | —                 | Click on the center message (acts as a CTA)                                                                        |

> Figma has **no** `Self=8 + Data collected=false` combination. `Data collected=false` exists only with `Self=1`.

### 4.1 Wiring up real data

Just **pass the array received from the server as-is.** There's no need to specify `selfCount`.

```tsx
const personas = await fetchPersonas(); // assume there are 3 selves
<PersonaRadialChart personas={personas} />;
// → 3 slots get filled, the remaining 5 become "No Self" empty slots
```

Design rules:

- **"How many slots" and "how many are filled" are separate concerns.** The slot count is **fixed at 8** (the `SECTOR_COUNT` constant), and only `selfCount` varies. Even with 3 selves, the 8-slot wheel must stay intact for the "create more" nudge to make sense — this is Figma's intended composition
- The self is **always revealed**, no matter where it sits in the array. Setting `selfId` to a persona further back in the array won't make it disappear
- An empty slot has no persona id, so it's identified by a synthetic `slot:<index>` key. This lets **each empty slot be individually hover-highlighted**
- Rank is always computed against **all of `personas`**, regardless of who's currently shown (§2.2)

> Why the slot count isn't exposed as a prop: the 8 slots are tangled up with assumptions baked into the Figma design (spoke placement, badge anchor rules, the 4 diameter lines), so making it variable would break those rules together. If it ever needs to change, fixing the single `SECTOR_COUNT` constant is enough, but the spoke/badge placement would need to be reviewed together at that point.

### 4.2 Value notation

**All metrics show at most 1 decimal place.** Overridable via `valueFractionDigits`.

Because it's a "maximum," whole numbers don't get a decimal point, keeping the Figma mock's notation intact.

| Input        | Output              |
| ------------ | ------------------- |
| `80`         | `80%` (not `80.0%`) |
| `14.333333`  | `14.3%`             |
| `8340`       | `8,340`             |
| `1234567.89` | `1,234,567.9`       |

`toLocaleString("en-US", { maximumFractionDigits })` handles both rounding and the thousands separator.

### 4.3 Center message (Hover × state combinations)

Only the `default` line is a message swapped in by user request in place of the Figma original ("Hover to see analysis") — all the rest are exactly as in the Figma original:

| Hover                  | Condition                                  | Message                                    |
| ---------------------- | ------------------------------------------ | ------------------------------------------ |
| `default`              | —                                          | `Hover to explore`                         |
| `growth`               | —                                          | `Growth Potential`                         |
| `reach` / `engagement` | `isDataCollected=true`                     | `Qualified Reach` / `Engagement Intensity` |
| `reach` / `engagement` | `isDataCollected=false`                    | `Create Posts to analyze`                  |
| `self`                 | hovering an **avatar that already exists** | `Go to Content Studio`                     |
| `self`                 | hovering an **empty slot**                 | `Create a Self`                            |

> The criterion for the `self` message is **the currently highlighted target, not `selfCount`.** Judging by `selfCount` would make `Create a Self` appear **even when hovering the one self that already exists** while only 1 self is present, telling the user to create something that already exists.
>
> In controlled mode with no mouse information (only `hover="self"` specified, e.g. in Storybook), **the first empty slot is highlighted if one exists**, otherwise the self is.

Since Figma has only **1 line of text** with no Button instance, this wasn't made into a button — only `onCenterClick` is exposed for CTA purposes.

---

## 5. Interaction

### 5.1 Ring hover — badges switch to values

Hovering a metric ring:

1. **Only that ring keeps white bands**; the other 2 rings switch to `var(--background-sheer)` (black 20%) bands, **sinking darker than the background**
2. **The text of all 8 outer badges switches from the persona name to that metric's value** (in the same spot)
   - Reach uses thousands separators (`8,340`), the rest use `%` (`80%`)
3. The center message switches to the metric name

### 5.2 Viewing a metric with no data (`isDataCollected=false` + reach/engagement)

1. That ring fills with **one uniform layer instead of 8 stacked bands**
2. **Only that ring's 2 boundary circles** are highlighted in white
3. **All outer badges disappear** (they don't fall back to names)
4. The bottom notice badge `Not Enough Data Yet` appears, **in its default state**, only when Reach/Engagement is actually hovered. Otherwise it isn't rendered at all. This applies the same whether `selfCount` is 1 or 8, positioned at y +276 from the frame center.

### 5.3 Avatar hover

- **Only the one hovered avatar** gets highlighted. No ring gets highlighted
- Highlight expression = **a white 2px inner ring + blur + black overlay** — it **darkens** rather than brightens
  - Ring: `border` 2px `--border-static-white`, placed not behind the avatar/dim overlay but as the very last sibling `span` in the DOM (an `outline` + negative offset was dropped after measuring in Chrome that it gets hidden behind the child filling the full 40px)
  - Blur: `--backdrop-blur-sm` (4px) — the Figma Effect parameter says radius 8, but since the className on this layer in Figma's own generated code (get_design_context) is literally `backdrop-blur-[4px]`, the codegen output is used as the reference rather than the token name. There's no other layer behind the avatar, so applying it via `filter` produces the same result, and the ring — being a separate layer — is unaffected
  - Dim: `--background-backdrop` (black, alpha 0.3 — Figma is bound to the same token too)
- Hovering an empty slot also shows the same ring + a `--background-sheer` background (black 20% on dark)
- Storybook's `hover="self"` controlled mode **can't know which avatar was hovered**, so it highlights the self

### 5.4 Outer badge position

- Orbit radius **265** where the badge's "corner facing the circle" sits (the midpoint of Figma's measured 258.9~272.3)
- The 4 left/right ones (±22.5°, ±157.5°): horizontal corner-aligned only, **vertically centered**
- The 4 corner ones (±67.5°, ±112.5°): both horizontally and vertically corner-aligned
- **Only as many badges as there are created selves** are rendered. Empty slots have no badge

### 5.5 Badge highlight rule (which badge gets filled)

The filled (`Badge variant="default"`) badge points to **"the currently reference target."** The rest are a custom outline with both border and text in `--color-muted-foreground`.

| What the badge shows                | The badge that gets filled           |
| ----------------------------------- | ------------------------------------ |
| **Name** (`hover=default` / `self`) | The **self** configured on this page |
| **Value** (metric hover)            | That metric's **1st place**          |

First-place determination doesn't re-compare values — it **reuses the band tier count used to fill the ring as-is** (8 tiers = 1st place). The sector filled furthest in the ring and the filled badge always point to the same persona, and **in a tie, both get 8 tiers, so both badges get filled too.** (The Figma mockup is a static asset that may not reproduce every tie case, but the procedural implementation handles every tie consistently.)

---

## 6. Motion / Transitions

To keep the transition from looking choppy on hover, a transition was applied across the whole chart, following shadcn convention.

### 6.1 Shared setting

```
MOTION_DURATION = duration-200 ease-out
```

- Other components in this project use `transition-colors` with no explicit duration (defaulting to 150ms), but that's **calibrated for small elements like buttons.** A 500px-diameter chart changes color over a far larger area on a single hover, so 150ms still looked choppy — **200ms** was chosen instead
- **Changing this one constant adjusts the speed across the whole chart**
- Every transition has a `motion-reduce:` variant → users with OS "reduce motion" get an instant change with no transition

### 6.2 Per-target transitions

| Target                        | Method                                                      | When it's visible                              |
| ----------------------------- | ----------------------------------------------------------- | ---------------------------------------------- |
| Value bands (up to 226 paths) | `fill` white↔black color fade                               | Ring hover — the biggest effect                |
| 4 grid boundary circles       | `stroke` color fade                                         | Hovering a ring with no data                   |
| Avatar highlight ring         | `outline-color` transparent↔white                           | Avatar hover                                   |
| Avatar blur                   | `--backdrop-blur-none` ↔ `--backdrop-blur-sm` interpolation | Avatar hover                                   |
| Dim overlay                   | `opacity` 0↔1                                               | Avatar hover                                   |
| Empty slot                    | Ring fade-in + background color fade                        | Hovering an empty slot when `selfCount=1`      |
| Badge text                    | Fade-in when swapping name↔value                            | Ring hover                                     |
| Badge appear/disappear        | Fade-in                                                     | Hovering a metric with no data                 |
| Center message                | Fade-in when the message swaps                              | Every hover                                    |
| Bottom notice badge           | Background, text color, and border fade simultaneously      | Hovering a metric when `isDataCollected=false` |

### 6.3 Implementation gotchas (for future rework)

1. **`border` → `outline`**: giving the highlight ring via border shrinks the avatar from 40px to **36px** because of `box-sizing`. `outline` doesn't take up layout space, `outline-color` is animatable, and it draws above the border
2. **`border-style: dashed ↔ solid` is a value CSS can't interpolate.** For the empty slot, this is worked around by **keeping a 1px dashed border in both states** and covering it with a 2px outline on top
3. **Mount/unmount doesn't get a transition.** The dim overlay is always rendered, with only `opacity` changing (`pointer-events-none` is required)
4. **`filter: none` ↔ `blur(4px)` interpolates ambiguously.** `--backdrop-blur-none` (= `blur(0px)`) must be stated explicitly even in the inactive state for it to transition smoothly
5. **Swapping text content isn't something a transition can target.** It's remounted via `key={content}` and given `animate-in fade-in` instead (tw-animate-css)
6. Tailwind v4's `transition-colors` **already includes** `fill` / `stroke` / `outline-color`. For SVG, just leave the presentation attributes as-is and add the className

---

## 7. Sample Data

`DEFAULT_PERSONAS` is a placeholder based on the Figma mock, and is replaced on the real screen by the array received from the backend (the numbers themselves don't need to match Figma).

| Persona                 | Growth (%) | Qualified Reach | Engagement (%) |
| ----------------------- | ---------- | --------------- | -------------- |
| Data Scientist _(self)_ | 80         | 8,340           | 14.3           |
| Yoga Meditator          | 10         | 6,453           | 1.8            |
| Novelist                | 40         | 4,784           | 0.4            |
| Entrepreneur            | 70         | 978             | 2.0            |
| Fashionista             | 60         | 6,782           | 0.3            |
| Fashion Editor          | 20         | 125             | 3.7            |
| Team Leader             | 50         | 8,006           | 0.5            |
| Vegan Chef              | 30         | 5,431           | 1.9            |

Growth forms a clean ladder of `10/20/30/40/50/60/70/80`. With no ties, the rank-based fill in §2.2 assigns exactly one of the 8 people to each of the 8 tiers (36 band paths in total).

> ⚠️ **The concept of a "per-metric maximum (scale ceiling)" isn't used.** Being rank-based per §2.2 means ceiling values like Growth 100% / Reach 9,000 / Engagement 16% aren't needed.

---

## 8. Undecided / For Future Discussion

- [ ] **Applying real avatar photos** — the `imageSrc` prop is already exposed, but everything currently falls back to initials. Figma's `Self=1` has a real portrait photo
- [ ] **Empty-slot dashed pattern** — Figma doesn't expose a raw dash value, so it currently uses the browser default. Whether to specify an explicit `stroke-dasharray`
- [ ] **Fine-tuning badge position** — averages ~5px / up to 16px off from Figma's measurements. Though since the Figma original coordinates themselves are irregular, the current systematized approach may actually be more accurate
- [ ] **Light theme variant** — Figma only has dark. The value bands (white 20%) aren't visible in light
- [ ] **Distinct band color for the self persona** — currently identical to other personas. Whether to give it a separate accent color

---

## 9. Implementation Files

`components/dashboard/ui/persona-radial-chart/` (1 component = 4 files, per project convention)

| File                               | Content                                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `persona-radial-chart.tsx`         | Component body                                                                                                        |
| `persona-radial-chart.stories.tsx` | Storybook — a single `Playground` story, every prop operable via Controls (1 component = 1 Controls story convention) |
| `persona-radial-chart.test.tsx`    | Vitest (grid / value bands / isDataCollected / badges / self count / center message / hover behaviour / transitions)  |
| `index.ts`                         | Named export                                                                                                          |

Related components: the circular avatar layout + center message are split out into `components/dashboard/ui/self-curation/` (`SelfCuration`, Figma `Self curation`, node `8133:122553`), and a single slot (avatar/empty slot) is handled by `components/dashboard/ui/self-slot/` (`SelfSlot`, Figma `Part/self`, node `8133:122512`).

### Tokens used

| Purpose                        | Token                                                   | Value               |
| ------------------------------ | ------------------------------------------------------- | ------------------- |
| Value band (active)            | `color-mix(..., var(--icon-default) 20%, transparent)`  | White 20%           |
| Value band (sunk)              | `var(--background-sheer)`                               | Black 20% (on dark) |
| Avatar dim overlay             | `var(--background-backdrop)`                            | Black alpha 0.3     |
| Grid                           | `var(--color-muted)`                                    | —                   |
| Grid boundary circle highlight | `var(--color-semantic-non-changeable)`                  | White               |
| Avatar highlight ring          | `var(--border-static-white)`                            | White               |
| Empty slot border              | `var(--border-muted)`                                   | —                   |
| Empty slot text                | `text-muted-foreground` (utility)                       | —                   |
| Border width                   | `var(--border-1)` / `var(--border-2)`                   | 1px / 2px           |
| Blur                           | `var(--backdrop-blur-none)` / `var(--backdrop-blur-sm)` | 0px / 4px           |
| Empty slot circle radius       | `var(--radius-scale-full)`                              | —                   |
| Empty slot label               | `text-xxs-medium`                                       | 8px Medium          |

> ⚠️ A custom typography class like `text-xxs-medium` **must be registered in `TYPOGRAPHY_PRESET_CLASSES` in `lib/utils.ts`.** Without that registration, `cn()` (tailwind-merge) mistakes it for a text **color** utility and silently drops it — and the build, typecheck, and tests all still pass.
>
> All the tokens above are prefix-less alias names (`--border-1`, etc.) defined as `--gb-*` in `src/tokens/*.css` and then aliased. See `docs/design-tokens.md` for the `--gb-` prefix migration status.
