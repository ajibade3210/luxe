# DESIGN.md — Shopwus Design System Ground Truth

This document serves as the absolute ground truth for all UI, visual design, typography, color palettes, and component patterns across the Shopwus codebase. Every AI agent and developer must read and adhere to these guidelines before generating or modifying UI code.

---

## 1. Aesthetic Direction & Brand DNA
* **Style:** Modern Digital Atelier / Quiet Luxury / Executive Fintech.
* **Mood:** Warm tactile minimalism, editorial typography, precise geometry, high contrast, bespoke luxury craftsmanship.
* **Avoid:** Generic flat enterprise templates, jarring saturated rainbow colors, clunky slab serif numerals, ambiguous progress bars, and over-decorated components.

---

## 2. Color Palette & Semantic Tokens

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

### Semantic Status Indicators
| Meaning | Text Color | Background Pill | Border |
| :--- | :--- | :--- | :--- |
| **Positive / Margin / Active** | `#059669` / `#15803d` | `#ecfdf5` / `#dcfce7` | `#a7f3d0` |
| **Outflow / Deficit / Danger** | `#dc2626` / `#b91c1c` | `#fef2f2` | `#fecaca` |
| **Warning / Pending / Draft** | `#d97706` / `#854d0e` | `#fef3c7` / `#fefce8` | `#fde68a` |
| **Info / Emerging Tier** | `#0284c7` | `#e0f2fe` | `#bae6fd` |
| **Flagship / Enterprise Tier** | `#9333ea` | `#f3e8ff` | `#e9d5ff` |

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

### A. KPI Metric Cards
* **Grid:** 5 columns on desktop (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4`).
* **Card Container:** `bg-white border border-[#eee7dc] rounded-2xl p-5 shadow-[0_2px_12px_rgba(70,50,30,0.02)] hover:border-[#c59a78]/60 hover:shadow-md transition-all flex flex-col justify-between`.
* **Top Row:** Squircle icon badge on left (`w-9 h-9 rounded-xl`), trend badge on right (`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold`).
* **Bottom Row:** Muted label (`text-xs font-medium text-[#8c827a]`) followed by crisp tabular number (`text-2xl font-bold font-sans tabular-nums`).
* **Do NOT use ambiguous colored underline bars.**

### B. Business Valuation & Appraisal Display
* **Hero Range Box:** Gradient backdrop (`bg-gradient-to-br from-[#faf7f2] via-[#fcfbf9] to-[#f5efe6]/70 border border-[#e8dfd2] rounded-2xl p-6 sm:p-7 shadow-xs`).
* **Multiple Glass Box:** `bg-white/95 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-[#e2dad0] shadow-xs min-w-[170px]` with accessible SDE tooltip.
* **Key Drivers Grid:** 4-column responsive grid (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5`).
* **Disclaimer Note:** Always include the informal estimate disclaimer at the bottom in `text-[11px] text-[#8c827a]`.
* **Zero-Data State:** Render clean onboarding card prompting first invoices & expenses if data is zero.

### C. Buttons & Interactive Controls
* **Primary Dark Button:** `bg-[#191c1d] hover:bg-black !text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer`.
* **Secondary Outline Button:** `bg-white hover:bg-[#f8f4ed] text-[#2a1d15] border border-[#ded5c8] hover:border-[#c59a78] px-4 py-2.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all cursor-pointer`.
* **Segmented Tabs / Switch:** `bg-[#f0ebe3] p-1 rounded-2xl flex items-center border border-[#e2dad0]`. Active tab has `bg-white text-[#2a1d15] shadow-xs rounded-xl`.

### D. Tables & Data Lists
* **Card Container:** `border border-[#eee7dc] bg-white rounded-2xl shadow-xs overflow-hidden`.
* **Table Header:** Uppercase 9px bold tracking-widest text `#8c827a`, border-b `#eee7dc`.
* **Table Row:** Hover effect `hover:bg-[#fafaf7] transition-colors`, cell padding `py-3.5 px-4`.

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