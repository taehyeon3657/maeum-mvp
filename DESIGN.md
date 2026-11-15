# Maeum Design System

This document is the implementation standard for Maeum UI. Use it when building or changing screens, components, and interaction. It records tokens that already exist in the repo and marks every unverified value as a **recommended default**.

Scope: the Next.js web app in `src/` (the mobile app is a WebView shell around that UI). Do not copy another product’s logo, wordmark, icon set, or screen layout. The target mood is a photo-first mobile card experience: a pink-to-coral accent, a short top bar, circular action buttons, and a soft swipe. Maeum remains a Korean quote product, not a dating app. Profile-style fields below are a type hierarchy for card overlays. Where the product has no such field today, the token still applies to the closest quote-card role (author, source, status).

## Current implementation

Confirmed from the repo:

| Area | What the code does today |
| --- | --- |
| Framework | Next.js 16 App Router, React 19. Styling is Tailwind CSS v4 (`@import "tailwindcss"` and `@theme` in `src/app/globals.css`). `tailwind.config.ts` only lists content paths. |
| App shell | `src/app/layout.tsx` centers a column at `max-w-md` (28rem / 448px) on a gray page. The column background is `bg-background`. `viewportFit: "cover"`. Portrait PWA (`src/app/manifest.ts`). |
| Theme | Light. App background `#FFFEFC`, home wash `#FDF9F5` → `#F5EDE3`, manifest `background_color` `#FDF9F5`. `themeColor` is `#FDF9F5` for both `prefers-color-scheme` values. |
| Color tokens in `@theme` | `--color-background` `#FFFEFC`, `--color-surface` `#FFFFFF`, `--color-primary` `#E07A5F`, `--color-secondary` `#2D6A4F`, `--color-text-main` `#37352F`, `--color-text-muted` `#868E96`, `--color-warm` `#F0EBE1`. Home page (`src/app/home.css`) also uses `--ink` `#1A1714`, `--cream` `#FAF7F2`, `--gold` `#C9A96E`, `--muted` `#8A8178`. |
| Type | Local **Nanum Square Round** (`--font-nsr`) at weights 300, 400, 700, 800. `--font-sans` and `--font-quote` both point at it. Root language is `ko`. |
| Components | Hand-built. No component library. `lucide-react` is used for a few actions (collection detail). Feed cards use `rounded-[28px]`. Swipe lives in `src/hooks/useSwipe.ts` and `src/components/feed/SwipeCard.tsx`. |
| Directories | `src/app` routes, `src/components` UI, `src/hooks` behavior, `src/lib` shared logic, `src/fonts` Nanum Square Round files. |

The signature gradient, circular Like / Nope / Super Like cluster, tab bar, and match badge are **not** in the current UI. Treat those sections as the standard for new work. Existing coral `#E07A5F` stays valid until a screen is migrated. Do not restyle unrelated screens just to match this file.

## Theme decision

**Default theme: light.** The shipped screens, CSS variables, viewport `themeColor`, and manifest background are warm off-white. A dark theme is an optional extension at the end of the color section. New photo cards may be visually dark because of the image and scrim. The app chrome around them stays light.

---

## 1. Color Palette

Root size for rem values in this document is **16px**.

### Signature gradient

| Token | Value | Role |
| --- | --- | --- |
| `--color-brand-start` | `#FD267A` | Gradient start. Recommended default. |
| `--color-brand-end` | `#FF6036` | Gradient end. Recommended default. |
| `--gradient-brand` | `linear-gradient(90deg, #FD267A 0%, #FF6036 100%)` | Default angle: **90deg**, left to right. |
| `--gradient-brand-emphasis` | `linear-gradient(135deg, #FD267A 0%, #FF6036 100%)` | Diagonal for small fills (badges, icon chips). |

```css
.brand-fill {
  background: linear-gradient(90deg, var(--color-brand-start) 0%, var(--color-brand-end) 100%);
}
```

Apply the gradient only to:

- Primary CTAs (one per view): continue, share, “see today’s quotes”.
- Active tab indicator and selected pill.
- Emphasis marks: match badge, live status chip, progress when a step is complete.

Do not paint page backgrounds, body text, or Like / Nope / Super Like buttons with this gradient. Those actions keep their own hues so direction stays readable.

Current primary CTA fill is solid `#E07A5F` (`--color-primary`, home `--rust`). That remains the implemented color until a screen adopts `--gradient-brand`.

### Backgrounds

| Token | Hex | Use |
| --- | --- | --- |
| `--color-bg` | `#FFFEFC` | Default app background. Implemented as `--color-background`. |
| `--color-bg-wash` | `#FDF9F5` | Home and marketing wash (top of the home gradient). Implemented. |
| `--color-bg-wash-end` | `#F5EDE3` | Bottom of the home gradient. Implemented in `home.css`. |
| `--color-surface` | `#FFFFFF` | Cards, sheets, input fields. Implemented. |
| `--color-surface-muted` | `#F0EBE1` | Secondary blocks, stacked cards behind the front card, chart tracks. Implemented as `--color-warm`. |
| `--color-overlay` | `rgba(26, 23, 20, 0.48)` | Modal scrim over the app. Recommended default. |
| `--color-photo-scrim` | see card section | Readability layer on photography. |

Desktop page chrome outside the 448px column uses the browser `bg-gray-100` (`#F3F4F6`). That gray is the desk, not a product surface.

### Text

| Token | Hex | Use |
| --- | --- | --- |
| `--color-text-primary` | `#1A1714` | Headlines and names. Implemented as home `--ink`. |
| `--color-text-body` | `#37352F` | Default body. Implemented as `--color-text-main`. |
| `--color-text-secondary` | `#5C534C` | Supporting copy that must meet WCAG AA. **Recommended default.** |
| `--color-text-muted` | `#868E96` | Current muted token. Eyebrows and non-essential captions only. |
| `--color-text-disabled` | `#B7B1A8` | Disabled labels and icons. Recommended default. |
| `--color-text-on-photo` | `#FFFFFF` | Text on a darkened photo band. |
| `--color-text-on-photo-muted` | `rgba(255, 255, 255, 0.82)` | Author/source on a photo. Implemented on the quote card. |
| `--color-text-on-brand` | `#FFFFFF` | Labels on brand fills. See contrast rules. |

`--color-text-muted` (`#868E96`) on `#FFFEFC` is about **3.3:1**. That fails WCAG AA for normal text (4.5:1). Keep it for 11px tracking labels and decorative captions. Use `--color-text-secondary` (`#5C534C`, about **7.5:1** on `#FFFEFC`) for any secondary sentence.

### Action colors

Circular buttons use a white disc. The hue is the icon and the pressed fill, not a solid neon disc.

| Action | Token | Default | Hover | Pressed | Disabled |
| --- | --- | --- | --- | --- | --- |
| Like | `--color-like` | `#16A34A` icon on `#FFFFFF` | icon `#15803D`, disc `#F0FDF4` | disc `#DCFCE7`, icon `#166534` | icon `#B7B1A8`, disc `#FFFFFF`, shadow off |
| Nope | `--color-nope` | `#E11D48` icon on `#FFFFFF` | icon `#BE123C`, disc `#FFF1F2` | disc `#FFE4E6`, icon `#9F1239` | same disabled treatment |
| Super Like | `--color-superlike` | `#0284C7` icon on `#FFFFFF` | icon `#0369A1`, disc `#F0F9FF` | disc `#E0F2FE`, icon `#075985` | same disabled treatment |

Border at rest: `1.5px solid` the default hue at 35% opacity (`--color-like-border: rgba(22, 163, 74, 0.35)`, `--color-nope-border: rgba(225, 29, 72, 0.35)`, `--color-superlike-border: rgba(2, 132, 199, 0.35)`).

Swipe stamps already in the feed use Tailwind `green-500` (`#22C55E`) for “좋아요” and `rose-400` (`#FB7185`) for “넘길게요”. New stamps should use `--color-like` and `--color-nope` so the stamp and the button match. Current stamp colors stay until that component is updated.

### Status

| Token | Hex | Use |
| --- | --- | --- |
| `--color-success` | `#15803D` | Success text and icons on light surfaces. Pairs with `--color-success-bg` `#F0FDF4`. |
| `--color-warning` | `#B45309` | Warning text. Background `#FFFBEB`. |
| `--color-danger` | `#BE123C` | Error text. Background `#FFF1F2`. |
| `--color-info` | `#0369A1` | Info text. Background `#F0F9FF`. |

Like green and success green are related but not interchangeable. Like is an action hue. Success is a confirmation.

### Contrast

| Pair | Approx. ratio | Rule |
| --- | --- | --- |
| `#1A1714` on `#FFFEFC` | ~16:1 | Body, titles, buttons with dark text. |
| `#37352F` on `#FFFFFF` | ~12:1 | Default body on cards. |
| `#5C534C` on `#FFFEFC` | ~7.5:1 | Secondary text. Passes AA. |
| `#868E96` on `#FFFEFC` | ~3.3:1 | Decorative captions only. |
| `#FFFFFF` on `#FD267A` | ~3.7:1 | Large bold UI text only, and only with the overlay below. |
| `#FFFFFF` on `#FF6036` | ~3.0:1 | Do not put small text on the orange stop alone. |

Brand buttons:

- Label is white, weight 800, at least 15px.
- Add a darkening layer so the fill is not the raw orange stop: `linear-gradient(90deg, rgba(0,0,0,0.14), rgba(0,0,0,0.14)), var(--gradient-brand)`.
- Do not set paragraphs on the gradient. On a pale brand tint (`#FFE4EE`), text is `--color-text-primary`.

Photo text:

- Place the string inside the dark band of the scrim (top 28% or bottom 36% of the card).
- Required stack, already used on the quote card: scrim plus `text-shadow: 0 1px 10px rgba(0, 0, 0, 0.55)`.
- Muted photo text uses `rgba(255, 255, 255, 0.82)` and the same shadow.
- If the image is missing, do not use white text. Use the surface text colors on `--color-surface` or the quote background from `getQuoteBackground`.

### Dark theme extension

Not implemented. Ship light. If a dark chrome is added later, invert surfaces only:

| Token | Dark value |
| --- | --- |
| `--color-bg` | `#141210` |
| `--color-surface` | `#1C1917` |
| `--color-surface-muted` | `#292524` |
| `--color-text-primary` | `#FAF7F2` |
| `--color-text-secondary` | `#D6D3D1` |
| `--color-overlay` | `rgba(0, 0, 0, 0.64)` |

Keep `--gradient-brand` and the action hues. Raise shadows (see elevation). Do not switch the app to dark only because a photo card is dark.

### CSS variables

```css
:root {
  --color-brand-start: #fd267a;
  --color-brand-end: #ff6036;
  --gradient-brand: linear-gradient(90deg, var(--color-brand-start) 0%, var(--color-brand-end) 100%);
  --gradient-brand-emphasis: linear-gradient(135deg, var(--color-brand-start) 0%, var(--color-brand-end) 100%);

  --color-bg: #fffefc;
  --color-bg-wash: #fdf9f5;
  --color-bg-wash-end: #f5ede3;
  --color-surface: #ffffff;
  --color-surface-muted: #f0ebe1;
  --color-overlay: rgba(26, 23, 20, 0.48);

  --color-text-primary: #1a1714;
  --color-text-body: #37352f;
  --color-text-secondary: #5c534c;
  --color-text-muted: #868e96;
  --color-text-disabled: #b7b1a8;
  --color-text-on-photo: #ffffff;
  --color-text-on-photo-muted: rgba(255, 255, 255, 0.82);
  --color-text-on-brand: #ffffff;

  --color-like: #16a34a;
  --color-nope: #e11d48;
  --color-superlike: #0284c7;
  --color-success: #15803d;
  --color-warning: #b45309;
  --color-danger: #be123c;
  --color-info: #0369a1;

  /* Implemented alias — do not remove until call sites move */
  --color-primary: #e07a5f;
}
```

---

## 2. Typography

**Family, in order:** `"Nanum Square Round", var(--font-nsr), "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif`.

Nanum Square Round is already loaded locally and assigned to both `--font-sans` and `--font-quote`. It covers Korean and Latin. Available weights are 300, 400, 700, and 800. There is no 500 or 600 file. Use 400 for regular, 700 for semibold, 800 for bold. Do not specify 500 or 600.

Root: `html { font-size: 16px; }`. `rem` values below assume that.

| Token | Role | Size | Line height | Weight | Tracking |
| --- | --- | --- | --- | --- | --- |
| `--text-display` | Marketing hero only | `clamp(2.75rem, 11vw, 3.75rem)` (44–60px) | 1.2 | 800 | `-0.02em` |
| `--text-title` | Screen title, profile name | `1.75rem` / 28px | 1.25 | 800 | `-0.02em` |
| `--text-card` | Quote or bio on a card | `1.45rem` / 23.2px | 1.9 | 700 | `0` |
| `--text-heading` | Section heading | `1.25rem` / 20px | 1.4 | 800 | `-0.01em` |
| `--text-body` | Body | `0.9375rem` / 15px | 1.7 | 400 | `0` |
| `--text-button` | Buttons | `0.875rem` / 14px | 1.2 | 800 | `0.04em` |
| `--text-secondary` | Job, intro, source | `0.8125rem` / 13px | 1.55 | 400 | `0` |
| `--text-badge` | Badges, tabs | `0.6875rem` / 11px | 1.2 | 700 | `0.06em` |
| `--text-caption` | Captions, distance, legal | `0.6875rem` / 11px | 1.45 | 400 | `0.02em` |

Korean body copy sets `word-break: keep-all`.

### Card text hierarchy

Map these roles even when the data is a quote rather than a person.

| Role | Style | Current quote-card stand-in |
| --- | --- | --- |
| Profile name | `--text-title`, `--color-text-on-photo` when a photo is showing | Not a separate field today. Author uses 0.95rem / 700 at 85% opacity. New name lines use `--text-title`. |
| Age | Same line as the name, 22px / 1.375rem, weight 400, 6px gap | No age field. Recommended default if a numeric meta is added. |
| Job or intro | `--text-secondary`, on-photo muted color, max 2 lines, then ellipsis | Quote body uses `--text-card` because the sentence is the content, not a caption. |
| Online | 12px / 0.75rem, weight 700, `--color-success`, with a 6px dot | Recommended default. |
| Distance or source | `--text-caption`, on-photo muted | Source line is 11px. Keep that size. |
| Match badge | `--text-badge`, white on `--gradient-brand-emphasis` | Recommended default. Saved-quote chip is separate (see badges). |

### Screen-size adjustments

- Below 360px width: card quote drops to `1.25rem` / 20px, line-height 1.7. Titles drop to `1.5rem` / 24px. Do not shrink body below 14px.
- 360–448px (default phone column): table above.
- Wider than 448px: the column does not grow. Do not scale type with the viewport except the home hero, which already uses `clamp`.

---

## 3. Layout and Spacing

Mobile-first. The product column is the phone, even on a desktop browser.

| Token | Value | Meaning |
| --- | --- | --- |
| `--layout-page-max` | `448px` (`max-w-md`) | Implemented app column. |
| `--layout-content-max` | `430px` | Implemented home inner measure. |
| `--layout-min` | `320px` | Minimum supported width. |
| `--layout-ref` | `390 × 844` | Reference phone. Recommended default, not a coded breakpoint. |

Padding on `<main>` is `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`. Viewport fit is `cover`. The helper `.h-dvh` is `100dvh` minus those insets, so children must not add a second inset unless they are outside that main padding. Bottom sheets that need extra inset use `padding-bottom: max(2rem, env(safe-area-inset-bottom))`, which the share screen and collection modal already do.

| Range | Behavior |
| --- | --- |
| 320–359px | Page padding `--space-4` (16px). Action cluster may drop auxiliary buttons. |
| 360–767px | Default. Page padding `--space-4` on the feed (`mx-4`), `--space-7` (28px) on the home column. |
| 768px and up | Column stays `--layout-page-max`, centered. Side gutters are the gray desk. No multi-column feed. |

### Spacing scale

4px base. Use these tokens instead of one-off pixels.

| Token | px | rem |
| --- | --- | --- |
| `--space-1` | 4 | 0.25rem |
| `--space-2` | 8 | 0.5rem |
| `--space-3` | 12 | 0.75rem |
| `--space-4` | 16 | 1rem |
| `--space-5` | 20 | 1.25rem |
| `--space-6` | 24 | 1.5rem |
| `--space-7` | 28 | 1.75rem |
| `--space-8` | 32 | 2rem |
| `--space-10` | 40 | 2.5rem |
| `--space-12` | 48 | 3rem |

| Use | Token |
| --- | --- |
| Feed page, left and right | `--space-4` (implemented `mx-4`) |
| Home page, left and right | `--space-7` (implemented 28px) |
| Gap between stacked sections | `--space-5` to `--space-6` |
| Card inner padding, photo cards | `--space-6` vertical, `--space-8` horizontal on the quote card (implemented `px-8 pt-7 pb-6`) |
| Card inner padding, collection tiles | 14px (`p-3.5`) |
| Gap inside the action cluster | `--space-3` (12px). Recommended default. |

### Card and action grid

```
column (max 448px, min 0, flex column, height: .h-dvh)
├── top bar          flex: none
├── card stage       flex: 1; min-height: 0; margin: 12px 16px 8px
└── action row       flex: none; padding-bottom: max(16px, safe-area)
```

The card stage is `position: relative`. The front card is `absolute; inset: 0`. Back cards sit in the same box, scaled (implemented: 0.95 at +11px Y, 0.90 at +22px Y).

The action row is a single centered flex line: `justify-content: center; align-items: center; gap: var(--space-3)`. It is not overlaid on the card.

### Short viewports

When height is tight, the card shrinks and the actions stay put.

- Card stage: `flex: 1; min-height: 0; overflow: hidden`.
- Action row and top bar: `flex: none`.
- Below **640px** height (recommended default): hide the back-of-stack cards, reduce card bottom margin to `--space-2`, and allow the quote size to drop one step. Do not let the action row cover the card. Do not use negative margins to pull buttons over the photo.
- The feed already follows the flex split. It does not yet collapse the stack on short screens. That collapse is a recommended default.

---

## 4. Components and Elevation

### Swipe profile card

The implemented card is `QuoteCard` inside `SwipeCard`. Radius, scrim, and shadow below match that component unless marked recommended.

**Rules**

- One primary card fills the stage. Peek the next card behind it.
- Photos use `object-fit: cover` and `object-position: center` (collection tiles already do).
- Quote backgrounds that are CSS (no bitmap) come from `getQuoteBackground`. Do not invent a second fallback palette.
- Text sits in the padded column. On a photo, a scrim is mandatory.

**Defaults**

| Property | Value |
| --- | --- |
| Width / height | `100%` of the stage. Stage is the column minus `--space-4` on each side. Max card width equals the stage (≤ 416px inside a 448px column). |
| Min card height | `280px`. Below that, drop stack decoration before shrinking type. Recommended default. |
| Radius | `--radius-card: 28px` (implemented `rounded-[28px]`). Collection tiles use `--radius-tile: 20px`. |
| Image | `object-fit: cover; object-position: center;`. Loading: `background: var(--color-surface-muted)` plus the existing pulse ring. Error or no image: quote background from `getQuoteBackground`, dark text, no white type. |
| Scrim, full-bleed quote photo | `linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.04) 52%, rgba(0,0,0,0.30) 78%, rgba(0,0,0,0.58) 100%)`. Implemented. |
| Scrim, collection tile | `linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 42%, rgba(0,0,0,0.68) 100%)`. Implemented. |
| Name row | Bottom-left, 16px from the edges, name then age. Recommended default for a profile overlay. Quote layout keeps the sentence centered and the author at the bottom (current). |
| Verified mark | 16px Lucide `badge-check` in `--color-superlike`, 4px after the name. Recommended default. Not a copied badge. |

**States**

| State | Elevation |
| --- | --- |
| Rest | `--shadow-card` |
| Hover (fine pointer only) | `--shadow-card-hover`. Translate Y `-2px`. 150ms. |
| Drag | Shadow stays `--shadow-card`. No extra scale. Cursor `grabbing`. Implemented. |
| Selected / front | `z-index: 2`. Back cards use `--shadow-rest` or none. |
| Flying off | Same shadow, no extra elevation. |

**Swipe stamps**

| Stamp | Place | Color | Rotate | Chrome |
| --- | --- | --- | --- | --- |
| Like | Top-left, 28px inset (`p-7`) | `--color-like` | `-12deg` | 2.5px border, radius 12px, padding `8px 16px`, label weight 700, 20px. Background `rgba(255,255,255,0.6)`, backdrop blur 4px. |
| Nope | Top-right, 28px inset | `--color-nope` | `+12deg` | Same chrome. |
| Super Like | Top-center, 28px from the top. Recommended default. | `--color-superlike` | `0deg` | Same chrome. |

Implemented stamps are “좋아요 ✦” at `-10deg` in `#22C55E` and “넘길게요” at `+10deg` in `#FB7185`. Move to the table above when those labels are restyled. Super Like is not implemented.

### Circular action group

Not implemented. Recommended defaults:

| Button | Diameter | Icon box |
| --- | --- | --- |
| Like, Nope | `--size-action: 64px` | 28px Lucide, stroke 2.25 |
| Super Like | `--size-action-mid: 52px` | 24px |
| Rewind, Boost | `--size-action-sm: 44px` | 20px |

Order, left to right: Rewind, Nope, Super Like, Like, Boost. Rewind and Boost are optional. If the row would exceed the column, drop Rewind and Boost first. Never drop Nope or Like. Gap `--space-3`. The row centers. On widths under 360px, primary diameter may fall to 56px. Hit target stays at least **44×44px**: if the drawn disc is smaller, expand the button padding, not the icon.

| Property | Value |
| --- | --- |
| Disc | `--color-surface` |
| Border | 1.5px, action border token |
| Shadow | `--shadow-action` |
| Icon | Lucide, currentColor = action hue. Optical padding is the leftover inside the disc (64px disc, 28px icon → 18px). |
| Focus | 2px offset ring, `#1A1714` at 80% opacity. Do not rely on color alone. |
| Hover | Disc tint from the action table. Fine pointer only. 120ms. |
| Pressed | `transform: scale(0.94)` for 90ms, then the action color flash in Motion. |
| Disabled | No shadow, icon `--color-text-disabled`, `aria-disabled`, no press scale. |

Touch target and visual size are separate. A 44px rewind button meets the minimum. A 64px button exceeds it. Do not shrink the hit area below 44px when adding margins.

### Top bar and match badge

Feed header today: centered wordmark, `px-6 pt-8 pb-2`, title `1.5rem` / 800, tracking `0.12em`, color `--color-primary`. There is no tab bar.

Recommended top bar for screens that gain navigation:

| Property | Value |
| --- | --- |
| Height | `--size-topbar: 56px` plus safe-area already applied by `main` |
| Padding, inline | `--space-4` |
| Icon | 24px Lucide, hit area 44×44 |
| Title | `--text-heading` or the existing 24px wordmark |
| Position | `flex: none` at the top of the column. It does not scroll away with the card. Page content under it scrolls only when the screen is a list (collection, insights). |
| Narrow screens | Icons stay 24px. Labels under icons hide under 360px. The wordmark may drop the tracking from `0.12em` to `0.06em`. |

Tabs:

| State | Color | Indicator |
| --- | --- | --- |
| Active | `--color-text-primary` | 2px bar, `--gradient-brand`, 16px wide, centered under the icon, radius 2px |
| Inactive | `--color-text-muted` | none |
| Pressed | opacity 0.72 | same bar if active |

Match badge (recommended default):

| Property | Value |
| --- | --- |
| Height | 22px |
| Padding | `0 8px` |
| Radius | `--radius-pill: 999px` |
| Type | `--text-badge`, white |
| Background | `--gradient-brand-emphasis` |

Unread count: pill, min-width 18px, height 18px, padding `0 5px`, type 11px / 800, white on `--color-nope`. Cap the label at `9+`. Place it on the top-right of the icon, overlapping by 4px. Hide at zero. A dot with no number (8px, `--color-nope`) is allowed for “new” when there is no count.

### Elevation

Shadows are warm and short. On the light theme they use the ink color at low alpha. On a future dark theme, use a black shadow plus a 1px `rgba(255,255,255,0.06)` hairline so edges still separate.

| Token | Light value | Use |
| --- | --- | --- |
| `--shadow-rest` | `0 1px 2px rgba(26, 23, 20, 0.06)` | Chips, inactive tiles |
| `--shadow-card` | `0 12px 40px rgba(224, 122, 95, 0.10)` | Front card. Close to the implemented `shadow-2xl shadow-primary/10`. |
| `--shadow-card-hover` | `0 16px 44px rgba(224, 122, 95, 0.16)` | Fine-pointer hover |
| `--shadow-action` | `0 6px 16px rgba(26, 23, 20, 0.12)` | Circular buttons |
| `--shadow-popover` | `0 12px 32px rgba(26, 23, 20, 0.16)` | Menus, toasts |
| `--shadow-modal` | `0 24px 64px rgba(26, 23, 20, 0.28)` | Dialogs. Collection modal already uses a strong shadow. |

```css
:root {
  --radius-card: 28px;
  --radius-tile: 20px;
  --radius-control: 16px;
  --radius-pill: 999px;
  --shadow-rest: 0 1px 2px rgba(26, 23, 20, 0.06);
  --shadow-card: 0 12px 40px rgba(224, 122, 95, 0.1);
  --shadow-action: 0 6px 16px rgba(26, 23, 20, 0.12);
  --shadow-popover: 0 12px 32px rgba(26, 23, 20, 0.16);
  --shadow-modal: 0 24px 64px rgba(26, 23, 20, 0.28);
}
```

Control radius `--radius-control` (16px) matches current primary buttons (`rounded-2xl` on CTAs). Cards stay 28px. Do not use the card radius on buttons.

---

## 5. Motion and Interaction

Values marked implemented come from `useSwipe`. Anything else is a recommended default.

| Token | Value | Status |
| --- | --- | --- |
| `--motion-swipe-threshold` | `80px` | Implemented. Also fire when horizontal travel exceeds **40%** of the card width, if that distance is smaller than 80px on a very narrow card. The 40% clause is a recommended default. The hook currently uses 80px only. |
| `--motion-swipe-rotate` | `rotate(dragX * 0.04deg)` | Implemented. |
| `--motion-swipe-rotate-max` | `12deg` | Recommended cap. The hook does not clamp. New code uses `clamp(dragX * 0.04, -12, 12)`. |
| `--motion-swipe-fly` | `520px` | Implemented exit distance. |
| `--motion-swipe-duration` | `300ms` | Implemented. |
| `--motion-swipe-ease` | `ease` | Implemented for both exit and return. |
| `--motion-press-duration` | `90ms` | Recommended default. |
| `--motion-press-scale` | `0.94` | Recommended for circular actions. Existing rect buttons use `scale(0.97)` or `scale(0.98)`. |
| `--motion-tab` | `160ms ease` | Recommended default. |

**Drag.** Follow the pointer with `transition: none`. Rotation is tied to horizontal delta. Vertical drag does not rotate and does not commit a swipe (current hook is horizontal only).

**Cancel.** If `|dragX|` is under the threshold on release, animate back to `translateX(0) rotate(0)` in `--motion-swipe-duration` with `--motion-swipe-ease`.

**Commit.** Animate to `±520px` at the capped rotation in `300ms ease`, then run the like or dislike handler. Super Like is a button action, not a vertical flick, until a vertical gesture is designed. Do not add a third swipe axis in the current hook without updating this document.

**Stamps.** Opacity is `clamp(drag / threshold, 0, 1)` for Like and the inverse for Nope. Implemented. Add scale from `0.92` to `1` over the same progress. Recommended default. Super Like stamp stays at opacity 0 during a horizontal drag. On Super Like button press, fade it to 1 in 120ms and fly the card upward by `520px` in `300ms ease`.

**Buttons.** On press: scale to `--motion-press-scale` in `--motion-press-duration`, easing `ease-out`. On release, return to 1 with `cubic-bezier(0.175, 0.885, 0.32, 1.275)` in 220ms (the existing `shareIconPop` overshoot). One overshoot. No looping pulse on the action row.

**Tabs and badges.** Tab indicator moves in `--motion-tab`. A new badge scales from `0.8` to `1` and fades in over `160ms ease-out`. It does not bounce again.

**Reduced motion.** There is no `prefers-reduced-motion` handler today. Required for new motion:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-swipe-duration: 1ms;
    --motion-press-duration: 1ms;
    --motion-tab: 1ms;
  }
}
```

Under reduced motion: skip rotation, skip fly-off travel (swap the card immediately), keep opacity stamps at 0 or 1 with no scale, and disable `animate-ping`, particle fall, and infinite pulses. State changes still happen.

Motion explains the swipe. It does not decorate idle screens. No repeating attention animation on the card or the action buttons.

```css
:root {
  --space-4: 1rem;
  --motion-swipe-threshold: 80px;
  --motion-swipe-rotate-max: 12deg;
  --motion-swipe-duration: 300ms;
  --motion-swipe-ease: ease;
  --motion-press-scale: 0.94;
  --motion-press-duration: 90ms;
}
```

---

## Implementation principles

1. Keep the light warm chrome. Put color in the gradient CTA, the active indicator, and the action icons.
2. One primary CTA per view. Like, Nope, and Super Like are peers, not three primaries.
3. The phone column never stretches past 448px.
4. Photo text always sits on the scrim and a text shadow. Missing images use dark text on a solid surface.
5. Tokens in `@theme` (`--color-background`, `--color-primary`, `--font-sans`, `--font-quote`) stay until call sites move. New CSS uses the names in this document.
6. Icons are Lucide. Do not redraw another app’s icon set.
7. Korean line breaking stays `keep-all`. Weights stay inside 300 / 400 / 700 / 800.

## Accessibility checklist

- Body text on `--color-bg` or `--color-surface` uses `--color-text-primary` or `--color-text-body`. Secondary sentences use `--color-text-secondary`, not `#868E96`.
- White on the raw brand gradient is not used for 14px regular text. Brand button labels are 15px or larger, weight 800, on the darkened gradient.
- Action buttons expose an accessible name (`좋아요`, `넘기기`, `슈퍼 라이크`) and a 44×44px hit target.
- Focus rings are visible on keyboard. Dragging is not the only way to choose. Buttons must commit the same actions as swipes.
- Stamps are not the only signal. Color plus label plus direction.
- `prefers-reduced-motion: reduce` short-circuits travel, rotation, and infinite animation.
- Contrast of any new pair is checked against the table in the color section before shipping.
