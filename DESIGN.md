# DESIGN.md — Shopwus Design System Ground Truth

This document serves as the absolute ground truth for all UI, visual design, typography, color palettes, and component patterns across the Shopwus codebase. Every AI agent and developer must read and adhere to these guidelines before generating or modifying UI code.

---

## 1. Aesthetic Direction & Brand DNA
* **Style:** Modern Digital Atelier / Quiet Luxury / Executive Fintech.
* **Mood:** Warm tactile minimalism, editorial typography, precise geometry, high contrast, bespoke luxury craftsmanship.
* **Avoid:** Generic flat enterprise templates, jarring saturated rainbow colors, clunky slab serif numerals, ambiguous progress bars, and over-decorated components.

---

## 2. Color Palette & Semantic Tokens

### Strict Tailwind CSS Utility Standard
Shopwus strictly follows a **Tailwind CSS utility-first** architecture.
- **NEVER** write new CSS classes in `admin.css` or arbitrary stylesheets.
- All layouts, sidebars, headers, cards, grids, buttons, and tables must be composed directly in JSX using Tailwind classes.
- Use design tokens defined in `@theme` in `src/app/globals.css` alongside standard Tailwind utilities.
- Use standard Tailwind breakpoint modifiers (`sm:`, `md:`, `lg:`, `xl:`, `max-lg:`) instead of arbitrary media queries.

### Semantic Utility Classes (`@theme`)
Instead of writing raw arbitrary hex values (`bg-[#faf8f5]`, `border-[#eee7dc]`), use these semantic utility classes:

| Token | Utility Class | Value | Purpose |
| :--- | :--- | :--- | :--- |
| `atelier-canvas` | `bg-atelier-canvas` | `#faf8f5` | Atelier warm subtle background |
| `atelier-warm` | `bg-atelier-warm` | `#faf7f2` | Inner well boxes & driver card backgrounds |
| `atelier-card` | `bg-atelier-card` | `#ffffff` | Elevated card surfaces |
| `atelier-line` | `border-atelier-line` | `#eee7dc` | Primary card and container borders |
| `atelier-subtle` | `border-atelier-subtle` | `#f4eee6` | Inner card dividers and table lines |
| `atelier-ink` | `text-atelier-ink` | `#1f1d1a` | High-contrast headings and numerals |
| `atelier-body` | `text-atelier-body` | `#665e57` | Body text and microcopy |
| `atelier-muted` | `text-atelier-muted` | `#8c827a` | Eyebrow labels, metadata, timestamps |
| `atelier-accent` | `text-atelier-accent` | `#9e633d` | Brand accents, badges, and multipliers |
| `atelier-accent-hover` | `border-atelier-accent-hover` | `#c59a78` | Interactive hover borders and outlines |

### Semantic Status Indicators (`<StatusBadge />`)
Always use the standardized `<StatusBadge status={status} />` primitive (`src/components/admin/common/status-badge.tsx`):

| Meaning / Status | Text Color | Background Pill | Border |
| :--- | :--- | :--- | :--- |
| **Active / Paid / Converted / Completed** | `#047857` | `#ecfdf5` | `#a7f3d0` |
| **Closed / Lost / Overdue** | `#b91c1c` | `#fef2f2` | `#fecaca` |
| **New / Pending / Sent** | `#b45309` | `#fef3c7` | `#fde68a` |
| **Contacted** | `#6f4c22` | `#faf5ee` | `#f0e4d4` |
| **Qualified** | `#115e59` | `#f0fdfa` | `#ccfbf1` |
| **Draft** | `#334155` | `#f1f5f9` | `#e2e8f0` |

---

## 3. Typography Rules & Numerals Standard

### ⚠️ STRICT NUMERAL RULE: Never Use Serif for Currency or Figures
* **Financial Metrics, Prices, Quantities, Currency (`₦`, `$`, `£`):**
  * MUST use `font-sans font-bold tracking-tight tabular-nums` (e.g. `text-2xl font-bold tracking-tight text-[#1f1d1a] font-sans tabular-nums`).
  * Serif fonts (Playfair Display) distort currency glyphs (especially `₦`) and lack tabular alignment.
* **Editorial Titles & Brand Headings:**
  * Use `font-serif font-bold text-[#1f1d1a]` (e.g. "Welcome to Élan Atelier", "Business Valuation Estimator").
* **Eyebrows & Section Headers:**
  * Use `text-[10px]` or `text-xs font-bold uppercase tracking-widest text-[#9e633d]`.
* **Monospace Data (URLs, Codes, Timestamps):**
  * Use `font-mono text-xs text-[#524a43]`.

---

## 4. Component Patterns & Layout System

### A. KPI Metric Cards (`<Metric>`, `<MetricsGrid>`)
* **Grid:** Standard 3-column responsive grid on admin overview (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5`).
* **Card Container:** `bg-white border border-[#eee7dc] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#ded7cb] transition-all flex flex-col justify-between`.
* **Top Row:** Eyebrow uppercase text (`text-[10px] font-bold tracking-widest text-[#8c827a] uppercase`).
* **Bottom Row:** Crisp tabular number (`text-2xl font-bold font-sans tabular-nums text-[#191c1d]`) and optional subtitle (`text-[11px] font-medium text-[#8c827a] mt-1.5`).

### B. Business Valuation & Appraisal Display
* **Hero Range Box:** Gradient backdrop (`bg-gradient-to-br from-[#faf7f2] via-[#fcfbf9] to-[#f5efe6]/70 border border-[#e8dfd2] rounded-2xl p-6 sm:p-7 shadow-xs`).
* **Multiple Glass Box:** `bg-white/95 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-[#e2dad0] shadow-xs min-w-[170px]` with accessible SDE tooltip.
* **Key Drivers Grid:** 4-column responsive grid (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5`).
* **Disclaimer Note:** Always include the informal estimate disclaimer at the bottom in `text-[11px] text-[#8c827a]`.
* **Zero-Data State:** Render clean onboarding card prompting first invoices & expenses if data is zero.

### C. Buttons & Interactive Controls (Ground Truth Standard)

> ⚠️ **STRICT GLOBAL RULE:** Except where explicitly stated otherwise, **ALL buttons across the entire application MUST default to the button designs below.** Do not invent ad-hoc button colors, borders, or hover styles. Buttons use calm, stable hover transitions without vertical bouncing or jumping effects (`hover:-translate-y-0.5` / `active:translate-y-0` removed).

#### 1. Primary Button (Black — "Save" Style)
Used for main commitments, primary actions, and destructive confirmations:
* **Standard Size:**
  ```tsx
  className="inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white px-5 h-10 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-xs disabled:opacity-50"
  ```
* **Compact / Responsive Size (Modals, Tables, Forms):**
  ```tsx
  className="inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-xs disabled:opacity-50"
  ```
* **Behavior Details:**
  * Background: `#111827` transitioning smoothly to pure `#000000` on hover.
  * Stability: Static placement without vertical jumping or bouncing.
  * Text: White (`text-white`), font size `text-xs`, font weight `font-semibold`.
  * Disabled state: `disabled:opacity-50 disabled:pointer-events-none`.

#### 2. Secondary / Outline Button (White — "Live Studio" Style)
Used for secondary actions, navigation, utilities, cancel triggers, and external links:
* **Standard Size:**
  ```tsx
  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] hover:border-[#9ca3af] px-5 h-10 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs disabled:opacity-50"
  ```
* **Compact Size (Card / Drawer Headers, Inline Actions):**
  ```tsx
  className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] hover:border-[#9ca3af] px-3 py-1.5 rounded-xl text-xs font-semibold hover:shadow-xs transition-all cursor-pointer shadow-2xs disabled:opacity-50"
  ```
* **Behavior Details:**
  * Background: Pure white (`bg-white`) transitioning to subtle warm off-white (`hover:bg-[#fafaf9]`).
  * Border: Crisp `#d1d5db` border deepening to `#9ca3af` on hover (`border border-[#d1d5db] hover:border-[#9ca3af]`).
  * Stability: Static placement without vertical jumping or bouncing.
  * Typography: High-contrast ink text (`text-[#1f2937]`), font size `text-xs`, font weight `font-semibold`.
  * Disabled state: `disabled:opacity-50 disabled:pointer-events-none`.

#### 3. Segmented Tabs / Switches
* `bg-[#f0ebe3] p-1 rounded-2xl flex items-center border border-[#e2dad0]`. Active tab has `bg-white text-[#2a1d15] shadow-xs rounded-xl`.

### D. Tables & Data Lists (`<TableCard>`, `<TableHead>`, `<TableWrap>`)
* **Card Container:** `border border-[#eee7dc] bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col min-h-[clamp(540px,65vh,850px)] overflow-hidden`.
* **Table Header (`th`):** `px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase text-[#6b7280] bg-[#faf8f5] border-b border-[#eee7dc]`.
* **Table Cell (`td`):** `px-5 py-3.5 text-xs text-[#444748] border-b border-[#eee7dc] align-middle`.
* **Table Row Hover:** `hover:bg-[#faf8f5]/60 transition-colors cursor-pointer`.
* **Dropdowns / Filters:** Select menus inside table controls must use `text-[11px]`.

### E. Interactive 3D Stationery Card
* CSS 3D transforms (`perspective: 1000px`, `.card-flip-container`, `.card-flip-inner.is-flipped`, `.card-face.backface-hidden`).
* Front face: Centered business logo, name, location, and flip button.

---

## 5. Layout Hierarchy & Page Flow
1. **Header & Context:** Studio greeting + Timeframe filter + Public atelier live URL bar.
2. **Primary KPIs:** Financial P&L metrics (Gross Sales $\rightarrow$ Operating Expenses $\rightarrow$ Real Net Profit) + Traffic/Inbound conversion.
3. **Operational Telemetry:** Sales curve spline chart + Expense Category Breakdown side-by-side.
4. **Executive Benchmarks:** Studio Equity & Business Valuation Estimator below operational cashflow.

Forbidden:
- Inter, Roboto, Open Sans
- Purple-to-indigo gradients
- Three-up feature card rows on white
- The phrase "transform your workflow"
- Soft drop shadows (use hard 1px borders instead)
- No unnecessary dots, decorative effects, or gradients.
- Do not add visual effects or gradients unless specifically requested or they serve a clear functional purpose.
- If an element does not improve the design or usability, leave it out.

**## 6. Design Restraint & Intentionality**

Every UI element must have a clear purpose.

* **Do not add unnecessary design elements.**
* **Do not add unnecessary icons, illustrations, badges, decorative graphics, animations, gradients, or visual effects.**
* If an element is **not useful, not requested, and does not meaningfully improve the clarity, usability, hierarchy, or overall aesthetic of the interface, do not add it.**
* Do not add icons simply to fill empty space or make a component appear more visually complete.
* Do not introduce decorative elements merely because they are common in modern UI designs.
* **Less is preferred when less communicates the same information more effectively.**
* Every component, element, and visual treatment should earn its place in the interface.
* When implementing a requested design, **follow the existing patterns and visual language in this document rather than inventing additional UI patterns.**
* Do not embellish a design beyond the requirements of the task.
* If there is uncertainty about whether an element is necessary, **leave it out unless its inclusion provides a clear functional or meaningful visual benefit.**
* The goal is **intentional minimalism, not minimalism for its own sake**: the interface should feel refined, purposeful, and complete without feeling decorated.

**AI Implementation Rule:**
Before adding any UI element, ask: *“Is this necessary? Was it requested? Does it improve the experience or the design?”* If the answer is no, **do not add it.**

**## 7. Forbidden Design Elements & Patterns:**

* Inter, Roboto, or Open Sans.
* Purple-to-indigo or other generic SaaS-style gradients.
* Generic three-up feature-card layouts on white backgrounds.
* The phrase **“transform your workflow.”**
* Soft, diffuse drop shadows. Prefer **1px borders, subtle surface contrast, and restrained elevation** instead.
* Decorative UI elements, icons, or illustrations that do not serve a clear functional or informational purpose.
* Visual embellishments added solely to make a section feel “designed.”
* Generic SaaS/dashboard patterns that conflict with the **Modern Digital Atelier / Quiet Luxury / Executive Fintech** aesthetic.

---

## 8. Input, Textarea & Select Focus Rules

**RULE: No blue border, no shadow glow, and no ring on any input, textarea, or select across the entire app on any browser.**

This is a hard design system rule. When any input field is focused, the user sees **only** the blinking text cursor — nothing else changes visually.

### What is enforced globally in `src/styles/base.css`:

```css
@layer base {
  input, textarea, select {
    outline: none;
    box-shadow: none;
    -webkit-box-shadow: none;
  }
  *:focus-within { outline: none; }
}
```

### Rules for agents & developers:

- **NEVER add** `focus:border-[#...]`, `focus:ring-*`, `focus-within:border-[#...]`, `focus-within:ring-*`, or `focus:shadow-*` to any input, textarea, select, or their wrapper `div`.
- **NEVER add** `focus:outline-*` other than `focus:outline-none` (though this is already globally reset).
- **DO NOT** use `focus:bg-white` on wrapper divs to signal active state — the design system does not use focus-driven background changes on inputs.
- The only permitted focus-related class on `<input>` elements is `focus:outline-none` for explicit clarity, though it is already handled globally.
- Checkboxes (`<input type="checkbox">`) are exempt — they may retain `focus:ring-*` for their checkbox accent color.
- Shadcn `<Button>` component `focus-visible:ring-*` is exempt — it applies only to buttons, not text inputs.