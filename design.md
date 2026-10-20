---
name: Career Operating System
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#c2c7d0'
  on-secondary: '#2c3138'
  secondary-container: '#444951'
  on-secondary-container: '#b4b9c2'
  tertiary: '#ffb3af'
  on-tertiary: '#650911'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#dee3ec'
  secondary-fixed-dim: '#c2c7d0'
  on-secondary-fixed: '#171c23'
  on-secondary-fixed-variant: '#42474f'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
  surface-base: '#09090b'
  surface-card: '#0f0f12'
  surface-overlay: '#18181b'
  surface-subtle: '#27272a'
  border-subtle: rgba(255, 255, 255, 0.08)
  border-hover: rgba(255, 255, 255, 0.16)
  border-active: rgba(255, 255, 255, 0.24)
  text-primary: '#f4f4f5'
  text-secondary: '#a1a1aa'
  text-muted: '#71717a'
  primary-hover: '#34d399'
  status-applied: '#38bdf8'
  status-interview: '#f59e0b'
  status-offer: '#10b981'
  status-rejected: '#f43f5e'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
  body-default:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: -0.005em
  body-medium:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.005em
  body-muted:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  mono-metric-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.02em
  mono-metric-default:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  mono-label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.02em
  keybinding-kbd:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 2px
  space-xs: 4px
  space-sm: 8px
  space-md: 12px
  space-lg: 16px
  space-xl: 24px
  space-2xl: 32px
  layout-sidebar: 240px
  layout-inspector: 360px
  gutter-dense: 8px
  gutter-standard: 12px
---

## Brand & Style

This design system embodies a high-density, keyboard-first engineering workbench built for precision, speed, and analytical rigor. Stripped of superficial marketing gloss, fuzzy gradients, or decorative bloat, the aesthetic takes inspiration from toolchains like Linear, Raycast, and Stripe Dashboard. It treats career trajectory not as a passive résumé feed, but as an active technical operating system.

The core visual language relies on:
- **Technical Minimalist Density:** Maximum signal-to-noise ratio. Information density is prioritized via compact layouts, crisp internal dividers, and structural tabular data.
- **Human-Crafted Utility:** Deliberate, high-contrast monochrome surfaces accented by precise, semantic telemetry colors. 
- **Deterministic Hierarchy:** Sub-pixel alignment, razor-sharp 1px structural outlines (`rgba(255,255,255,0.08)`), and dedicated monospaced figures for metrics, salaries, dates, and execution state.
- **Quiet Authority:** Surfaces remain deep, quiet, and grounded, allowing interactive focal points (emerald highlights, keyboard shortcuts, match indicators) to command immediate spatial awareness.

## Colors

The palette operates in a deterministic dark mode architecture anchored by deep, neutral zinc values to eliminate optical vibration and eye strain during sustained usage sessions.

### Application Rules
- **Base Canvas (`#09090b`):** The definitive ground layer for root views, toolbars, and background panes.
- **Card & Workspace Surface (`#0f0f12`):** Primary interactive blocks, workbench cards, and floating inspector panes. Delimited exclusively by `border-subtle` (`rgba(255,255,255,0.08)`), never heavy drop shadows.
- **Overlay & Popover Surface (`#18181b`):** Command palettes (Cmd+K), dropdown menus, tooltips, and modal sheets.
- **Primary Emerald (`#10b981`, hover `#34d399`):** Reserved strictly for high-value actions, verified state completions, high match scores (e.g., >85%), and accepted offers. Never used decoratively across large surface fills.
- **Semantic State Architecture:**
  - `status-applied` (`#38bdf8`): Cold blue signaling transmission and pending external response.
  - `status-interview` (`#f59e0b`): Active, high-urgency amber denoting scheduling, pending rounds, and active review.
  - `status-offer` (`#10b981`): Crisp green signaling positive conclusion and contract negotiation.
  - `status-rejected` (`#f43f5e`): Controlled rose/crimson denoting closed cycles or declined tracks.

## Typography

Typography prioritizes maximum scan-ability at compact scales. The dual-typeface configuration assigns structural UI text to **Inter** and analytical payloads to **JetBrains Mono**.

### Composition Guidelines
- **Tabular Alignment:** All quantitative telemetry—including base comp, equity valuations, application elapsed timers, stage counters, and dates—must use `jetbrainsMono` with `font-variant-numeric: tabular-nums` enabled.
- **Optical Leading:** Line heights are restrained (1.25x to 1.38x) to preserve vertical density across list-intensive views, table layouts, and multi-column kanbans.
- **Letter Spacing:** Headings feature negative tracking (`-0.01em` to `-0.02em`) to bind dense title forms tightly. Monospaced metadata and keyboard shortcuts utilize neutral or slight positive tracking (`+0.02em` to `+0.04em`) to ensure character delineation at sub-12px sizes.

## Layout & Spacing

The layout is built on a 4px spatial baseline engineered for dense screen real estate. The primary mental model is a deterministic workstation panel split:

### Spatial Structure
- **Global Left Navigation (Fixed 240px):** Application pipeline tree, smart filters, active searches, and status aggregators. Collapsible via shortcut `[`.
- **Main Canvas (Fluid):** Tabular workbench or kanban stream displaying pipeline records. Employs an explicit inner grid with tight `12px` column gutters.
- **Contextual Inspector Pane (Fixed 360px):** Slides or docks to the right for single-item deep work (job description raw text, requirements match analysis, compensation breakdown, contact matrix). Toggleable via shortcut `]`.

### Breakpoint Scaling & Adaptability
- **Desktop (>1280px):** Full 3-pane orchestration visible simultaneously.
- **Compact Desktop / Tablet (768px - 1279px):** Inspector pane transitions into an overlaid backdrop drawer. Global navigation converts into an icon rail or compact drawer.
- **Mobile (<768px):** Single-pane sequential navigation. Priority transitions to swipeable status cards and condensed rows with horizontal scrolling pinned headers. Padding scales from standard `16px/24px` down to `12px`.

## Elevation & Depth

This design system rejects ambient multi-layered drop shadows, colored glow halos, and skeuomorphic bevels. Depth is articulated through **Tonal Stacking** paired with **Razor Outlines**.

### Elevation Tiers
- **Tier 0 (Base Floor, `#09090b`):** The primary view surface. No border, no elevation.
- **Tier 1 (Structural Containers, `#0f0f12`):** Cards, boards, tables, and split panes. Outlined with `1px solid rgba(255, 255, 255, 0.08)`. Hover transitions swap border to `rgba(255, 255, 255, 0.16)`. No box shadow.
- **Tier 2 (Floating Utility Panels, `#18181b`):** Command palettes, dropdown context menus, and inline date pickers. Outlined with `1px solid rgba(255, 255, 255, 0.12)` with a compact directional drop shadow: `0 8px 24px -4px rgba(0, 0, 0, 0.6)`.
- **Tier 3 (Modal Modifiers, `#18181b`):** Critical confirmation dialogs. Outlined with `1px solid rgba(255, 255, 255, 0.16)` with full-screen backdrop occlusion (`rgba(0, 0, 0, 0.75)` with zero blur filter).

## Shapes

Shapes reflect precision-milled hardware tools. Micro-radii prevent the interface from appearing either aggressively industrial or toy-like.

### Token Application
- **Default Elements (`10px`):** Standard interactive elements such as form inputs, standard buttons, table rows, and contextual popovers.
- **Nested Inner Elements (`6px` - `8px`):** Badges, keyboard shortcut tags (`<kbd>`), toggle switches, and nested chips within a parent card.
- **Major Structural Cards (`12px`):** Kanban columns, dashboard summary widgets, and the primary inspector container.
- **Strict Prohibition:** Full circular pill radii (`9999px`) are forbidden except for status indicator dots (6px × 6px) and circular avatar thumbnails.

## Components

### Buttons
- **Primary:** Background `#10b981`, foreground `#09090b`, weight 500, height 32px, padding `0 12px`, radius 10px. Hover: `#34d399`. Focus: 2px offset ring `#10b981`.
- **Secondary / Ghost:** Background `transparent`, border `1px solid rgba(255, 255, 255, 0.08)`, foreground `#f4f4f5`. Hover: background `rgba(255, 255, 255, 0.04)`, border `rgba(255, 255, 255, 0.16)`.
- **Icon / Action Trigger:** 28px × 28px square, radius 6px. Color `#a1a1aa`, hover `#f4f4f5` on subtle fill `rgba(255,255,255,0.06)`.

### Semantic Status Badges
- Compact height (20px), padding `0 6px`, radius 6px.
- Composed of an optional 5px solid indicator dot, font `mono-label-sm` (uppercase), and tinted background:
  - **Applied:** Background `rgba(56, 189, 248, 0.10)`, text `#38bdf8`, border `rgba(56, 189, 248, 0.20)`.
  - **Interview:** Background `rgba(245, 158, 11, 0.10)`, text `#f59e0b`, border `rgba(245, 158, 11, 0.20)`.
  - **Offer:** Background `rgba(16, 185, 129, 0.10)`, text `#10b981`, border `rgba(16, 185, 129, 0.20)`.
  - **Rejected:** Background `rgba(244, 63, 94, 0.10)`, text `#f43f5e`, border `rgba(244, 63, 94, 0.20)`.

### Cards & Kanban Tiles
- Background `#0f0f12`, border `1px solid rgba(255, 255, 255, 0.08)`, border-radius 10px, padding `12px`.
- Interactive hover: Subtle border lift to `rgba(255, 255, 255, 0.16)`. Dragging state adds an active green highlight border (`rgba(16, 185, 129, 0.4)`).
- Sub-elements within cards (tags, interview round markers) stack with `8px` vertical spacing.

### Inputs & Search Bars
- Background `#09090b`, border `1px solid rgba(255, 255, 255, 0.08)`, height 32px, radius 10px, typography `body-default`.
- Placeholder `#71717a`. Active focus: Border shifts to `#10b981`, zero outer glow.
- Inline trailing accessory: `<kbd>` shortcut badge (`#27272a` fill, `#a1a1aa` text, 4px radius).

### Tables & Dense Lists
- Row height: 36px fixed.
- Alternating fills: None. Clean divider via bottom border `1px solid rgba(255, 255, 255, 0.04)`.
- Row hover: Full row background `#18181b`.
- Quantitative data columns align right with `mono-metric-default`. Status columns align left with standard badge styling.

### Match Score Gauge
- Inline indicator: Metric `mono-metric-default` accompanied by an ultra-thin 3px progress bar or circular ring.
- Score thresholding:
  - 85–100%: Text and fill `#10b981`
  - 65–84%: Text and fill `#f59e0b`
  - <65%: Text and fill `#71717a`
