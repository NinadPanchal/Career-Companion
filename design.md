# DESIGN.md — Liquid Glass, Minimal, Professional

This is the single source of truth for the app's front-end design. Every UI change MUST follow it. If something isn't covered here, choose the more minimal option.

## 1. Principles

1. **Minimal first.** Remove before adding. No decorative gradients, shadows or borders unless they communicate hierarchy or state.
2. **Glass is for surfaces, not for everything.** Only floating layers (sidebar, toolbar, cards, modals, popovers) use glass. Text-heavy content areas sit on calm, near-solid surfaces for legibility.
3. **One accent color.** Everything else is neutral.
4. **Consistent spacing, radius and type.** Use tokens only. No magic numbers.
5. **Content > chrome.** The UI should fade into the background.
6. **Accessible.** Text contrast >= 4.5:1, visible focus rings, respects `prefers-reduced-motion` and `prefers-reduced-transparency`.

## 2. Design Tokens

Put these in `src/styles/tokens.css` and import once at the app root.

```css
:root {
  /* Typography */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  --text-xs: 12px;
  --text-sm: 13px;
  --text-md: 14px;   /* body default */
  --text-lg: 16px;
  --text-xl: 20px;
  --text-2xl: 28px;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;

  /* Spacing (4px grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-pill: 999px;

  /* Motion */
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-fast: 120ms;
  --dur-base: 220ms;
  --dur-slow: 360ms;

  /* Accent (single brand color) */
  --accent: #4f8cff;
  --accent-hover: #6a9fff;
  --accent-contrast: #ffffff;

  /* Status */
  --success: #34c759;
  --warning: #ff9f0a;
  --danger: #ff453a;
}

/* ---------- Dark (default) ---------- */
:root,
:root[data-theme="dark"] {
  color-scheme: dark;

  --bg: #0b0d12;
  --bg-gradient:
    radial-gradient(60% 50% at 15% 10%, rgba(79,140,255,0.18) 0%, transparent 60%),
    radial-gradient(50% 50% at 90% 85%, rgba(160,110,255,0.14) 0%, transparent 60%),
    #0b0d12;

  --text: rgba(255,255,255,0.92);
  --text-muted: rgba(255,255,255,0.60);
  --text-faint: rgba(255,255,255,0.38);

  --glass-bg: rgba(255,255,255,0.06);
  --glass-bg-strong: rgba(255,255,255,0.10);
  --glass-border: rgba(255,255,255,0.14);
  --glass-highlight: rgba(255,255,255,0.22);
  --glass-shadow: 0 8px 32px rgba(0,0,0,0.35);

  --surface-solid: #12151c;      /* for dense content / tables / editors */
  --divider: rgba(255,255,255,0.08);
}

/* ---------- Light ---------- */
:root[data-theme="light"] {
  color-scheme: light;

  --bg: #eef1f6;
  --bg-gradient:
    radial-gradient(60% 50% at 15% 10%, rgba(79,140,255,0.22) 0%, transparent 60%),
    radial-gradient(50% 50% at 90% 85%, rgba(190,150,255,0.18) 0%, transparent 60%),
    #eef1f6;

  --text: rgba(10,14,22,0.92);
  --text-muted: rgba(10,14,22,0.62);
  --text-faint: rgba(10,14,22,0.40);

  --glass-bg: rgba(255,255,255,0.55);
  --glass-bg-strong: rgba(255,255,255,0.75);
  --glass-border: rgba(255,255,255,0.7);
  --glass-highlight: rgba(255,255,255,0.9);
  --glass-shadow: 0 8px 32px rgba(30,40,70,0.12);

  --surface-solid: #ffffff;
  --divider: rgba(10,14,22,0.08);
}
```

Follow the OS theme by default (`prefers-color-scheme`), with a manual toggle that sets `data-theme` on `<html>` and persists the choice.

## 3. Liquid Glass Recipe

The "liquid" feel comes from four layers: blur + saturation, a translucent tint, a thin specular border, and an inner top highlight.

```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow:
    var(--glass-shadow),
    inset 0 1px 0 var(--glass-highlight);   /* specular top edge */
}

.glass--strong { background: var(--glass-bg-strong); }

.glass--interactive {
  transition:
    transform var(--dur-base) var(--ease),
    background var(--dur-base) var(--ease),
    border-color var(--dur-base) var(--ease);
}
.glass--interactive:hover {
  background: var(--glass-bg-strong);
  transform: translateY(-1px);
}
.glass--interactive:active { transform: translateY(0) scale(0.99); }

/* Fallbacks */
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: var(--surface-solid); }
}
@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: var(--surface-solid);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

### Glass rules
- Max **2 stacked glass layers** on screen at once (e.g. sidebar + modal). Never glass inside glass inside glass.
- Blur range: 16–32px. Never above 40px (performance).
- Text on glass must still meet contrast; if not, increase `--glass-bg-strong` opacity.
- Dense content (tables, code, long text, forms with many fields) goes on `--surface-solid` or a very light glass, not heavy blur.
- The app background (`body`) uses `var(--bg-gradient)`, since glass needs something behind it to refract.

## 4. Layout

- **App shell:** left sidebar (glass, 232px, collapsible to 64px) + main content area (max-width 1200px content column, centered if wide) + optional top toolbar (glass, 52px).
- Outer padding: `--space-4`. Gap between panels: `--space-3`. Panels float with rounded corners, not edge-to-edge.
- Custom title bar if the window is frameless: 40px high, draggable via `data-tauri-drag-region`, window controls on the platform's native side.
- Responsive: collapse sidebar under 900px width. The app must work at 800x560 minimum with no overflow or overlap.

## 5. Typography

- Font: Inter (bundle it locally in `src/assets/fonts`, don't load from a CDN since this is a desktop app and should work offline).
- Body 14px/1.5, headings use `--weight-semibold` with tight letter-spacing (`-0.01em`).
- Page title `--text-2xl`, section title `--text-lg`, labels `--text-sm` in `--text-muted`.
- Use tabular numbers (`font-variant-numeric: tabular-nums`) for any data/number columns.
- Max 2 weights visible per screen section.

## 6. Components

**Buttons** (height 36px, radius `--radius-md`, padding 0 `--space-4`)
- *Primary:* solid `--accent`, `--accent-contrast` text, subtle inner highlight, no glass.
- *Secondary:* `.glass` style, text `--text`.
- *Ghost:* transparent, `--text-muted`, hover gets `--glass-bg`.
- *Danger:* same as primary but `--danger`.
- Disabled: 40% opacity, no hover. Loading: inline spinner, width stays fixed.

**Inputs / selects / textareas** (height 36px)
- Background `--glass-bg`, border `--glass-border`, radius `--radius-md`.
- Focus: 2px ring `color-mix(in srgb, var(--accent) 55%, transparent)` + border `--accent`. Never remove the outline without a replacement.
- Labels above the field, helper/error text below in `--text-xs`.

**Cards:** `.glass`, padding `--space-5`, radius `--radius-lg`, no inner borders. Separate sections with `--divider` hairlines.

**Sidebar nav items:** 36px tall, radius `--radius-md`, icon 18px + label. Active item: `--glass-bg-strong` + 2px accent indicator on the left; no loud fills.

**Modals / dialogs:** centered, `.glass--strong`, radius `--radius-lg`, backdrop is `rgba(0,0,0,0.4)` with `blur(6px)`. Open animation: fade + scale from 0.97, `--dur-base`.

**Tables / lists:** solid surface, 44px rows, hairline dividers, hover `--glass-bg`. No zebra stripes, no heavy borders.

**Toasts:** bottom-right, `.glass`, auto-dismiss 4s, max 3 visible.

**Tooltips:** small `.glass--strong`, 12px text, 300ms delay.

**Empty states:** centered icon (48px, `--text-faint`), one sentence, one primary action.

**Icons:** a single set only (Lucide), 1.5px stroke, 18px default. No emoji in the UI.

## 7. Motion

- Only animate `opacity`, `transform`, `background-color`, `border-color`. Never animate `backdrop-filter` or layout properties.
- Durations: hover/press `--dur-fast`, panels/modals `--dur-base`, page transitions `--dur-slow`.
- Always wrap in:
  ```css
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
  ```

## 8. Tauri-Specific Notes

- **WebView differences:** Tauri uses WebView2 (Windows), WKWebView (macOS), WebKitGTK (Linux). `backdrop-filter` works on all three, but WebKitGTK can be slow with large blurred areas. Keep blur radius moderate, avoid full-window blurred overlays, and test on Linux if you ship there.
- **Native translucent window (optional, big visual upgrade):**
  In `src-tauri/tauri.conf.json` (Tauri v2), on the main window set `"transparent": true` and optionally `"windowEffects"` (e.g. `mica` / `acrylic` on Windows, `sidebar` / `hudWindow` on macOS). On macOS, transparency also needs `"macOSPrivateApi": true` under `app`. When the window is transparent, set `html, body { background: transparent }` and let panels carry the glass. Keep a solid fallback for platforms that don't support the effect.
- **Frameless window:** `"decorations": false` plus a custom title bar using `data-tauri-drag-region`. Make sure buttons inside the drag region are not draggable.
- **No layout jank:** set the window background color in config to match `--bg` to avoid a white flash on launch.
- Don't change Rust commands, IPC names or data shapes during the redesign. Front-end only.

## 9. Do / Don't

| Do | Don't |
|---|---|
| Use tokens for every color, space, radius | Hardcode hex values or pixel numbers |
| One accent color, used sparingly | Rainbow gradients, multiple brand colors |
| Generous whitespace | Cramming controls together |
| Subtle, fast animations | Bouncy or long animations |
| Solid surfaces for dense data | Blur behind long text or tables |
| Consistent 36px control height | Mixed button/input sizes |
| Inline SVG icons from one set | Emoji, mixed icon styles |

## 10. Definition of Done (per screen)

- [ ] Uses only tokens (grep for stray `#hex` / `px` outside `tokens.css`)
- [ ] Works in dark and light themes
- [ ] No overflow/overlap at 800x560 and at 1440x900
- [ ] All interactive elements have hover, focus-visible, active, disabled states
- [ ] Keyboard navigable, visible focus rings
- [ ] Text contrast >= 4.5:1
- [ ] No console errors/warnings
- [ ] Reduced motion and reduced transparency respected
- [ ] `npm run tauri dev` launches and every existing feature still works
