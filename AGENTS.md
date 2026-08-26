<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# MANDATORY: Check When Done — NEVER SKIP THIS
AFTER EVERY CODE CHANGE, WITHOUT EXCEPTION, YOU MUST:
1. No Magic Strings Allowed — define named constants, enums, or configuration maps.
2. Scan related functions, export counterparts, shared schemas, and sibling services for anything missing, broken, or inconsistent with the change.
3. Briefly explain the problem, the fix applied, and any important considerations.
4. End with a one-line statement confirming whether anything important is missing (e.g. "Nothing important appears to be missing.").
5. Run formatting and lint checks (`pnpm check`), type checking (`pnpm type-check`), and unit tests (`pnpm test`).
6. If everything is fine, say so explicitly: "Nothing important appears to be missing."

---

# CORE RULES

- **STRICT SCOPE ENFORCEMENT:** NEVER introduce, create, or add any unrequested features, elements, icons, components, sections, or UI decorations unless the user explicitly asked for them. Limit all implementation strictly to the exact user directive without making assumptions or adding unsolicited extras.
- **ZERO `any` POLICY (Strict TypeScript):** `any` is strictly prohibited anywhere in the codebase. Always use explicit types from `@/lib/types` or local interfaces. For unknown payloads, use `unknown` with explicit narrowing. All function signatures, props, callbacks, and state must have complete, explicit types.
- **SERVICE/REPOSITORY ABSTRACTION:** Architect all state and data flows behind an abstraction layer under `src/services/api/` (e.g. `invoice.service.ts`, `leads.service.ts`, `customer.service.ts`) so mock data can be swapped for real API calls later with zero UI refactoring.
- **RESPONSIVE DESIGN:** Design layouts to be responsive across Mobile (320px+), Tablet (768px+), and Desktop (1024px+) breakpoints from the start.
- **KEEP DESIGNS SIMPLE:** Avoid over-engineering or adding unrequested features.
- **NO ASSUMPTIONS:** Never assume or hallucinate requirements; ask clarifying questions when something isn't clear.
- **NEVER SKIP CHECKS:** Do NOT wait to be asked. Do NOT skip because the change "looks small".
- **PRACTICAL REVIEWS:** Keep the review practical. Do not over-engineer, suggest unnecessary improvements, or nitpick.
- **BREAKING-CHANGE RISK:** Breaking-change risk must be called out immediately and clearly. If a change could impact existing API contracts, payload shapes, database schema, background jobs, integrations, or expected behavior, say so up front and treat it as a high-priority warning.
- **COMPLETION CONFIRMATION:** If everything is fine, say so explicitly: "Nothing important appears to be missing."

---

# CODEBASE CONVENTIONS & COMPONENT STRUCTURE

### 1. Component Decomposition
- Keep components focused and manageable (~200–250 lines max per file).
- Decompose complex views into domain subfolders (e.g. `src/components/admin/invoices/`, `src/components/admin/leads/`, `src/components/studio/atelier/`).
- Extract complex component state and event logic into custom hooks under `src/hooks/` (e.g. `useInvoiceForm`, `useLeads`, `useCustomerForm`).

### 2. Service Layer Standards
- UI components must never perform direct mock data mutations or local storage updates inline; always delegate through service methods.
- Methods should return clean resolved promises and maintain state synchronization.

---

# SPECIAL USE CASES & REPOSITORY PATTERNS

### 1. Interactive 3D Stationery Card (`stationery-card.tsx`)
- Uses pure CSS 3D transforms defined in `src/app/globals.css`:
  - `.card-flip-container`: Perspective wrapper with `perspective: 1000px`, matching height (`min-h-[560px]`, `max-w-[480px]`).
  - `.card-flip-inner`: `transform-style: preserve-3d`, toggled with `.is-flipped` (rotates 180deg).
  - `.card-face`, `.card-front`, `.card-back`: `position: absolute; inset: 0; backface-visibility: hidden;`.
- **Front Face:** Displays only the centered business logo, business name, and physical address/location, with an absolute top-right *"Flip Card"* button.

### 2. Verified Social Channels System
- Configured in Admin Settings (`socialChannels: SocialChannel[]` with `.connected` toggle).
- Rendered in public studio views (`social-section.tsx`) using `getSocialChannelStyle(channel.type)` from `social-badge.tsx` for verified brand SVGs, background colors, borders, and direct external URLs.
- Dynamically auto-spread across the container width based on active connected count.

### 3. Currency & Financial Formatting
- Always use `formatCurrency(amount, currencyCode)` from `src/utils/currency.ts` to ensure uniform currency formatting across invoices, analytics, and leads.

### 4. Verification Workflow Before Responding
1. `pnpm check` (Biome linting & formatting).
2. `pnpm type-check` (`tsc --noEmit` with 0 type errors and zero `any`).
3. `pnpm test` (Vitest unit test suite).
