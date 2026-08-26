<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# MANDATORY: Check When Done — NEVER SKIP THIS
AFTER EVERY CODE CHANGE, WITHOUT EXCEPTION, YOU MUST:
1. No Magic Strings Allowed
2. Scan related functions, export counterparts, shared schemas, and sibling services for anything missing, broken, or inconsistent with the change.
3. Briefly explain the problem, the fix applied, and any important considerations.
4. End with a one-line statement confirming whether anything important is missing.
5. Run `yarn format` and fix all lint issues.

RULES:
- Remember to make it easy to switch to API calls. for all States and Flows. (Until we start build the backend side)
- Do NOT wait to be asked. Do NOT skip because the change "looks small".
- Keep the review practical. Do not over-engineer, suggest unnecessary improvements, or nitpick.
- Breaking-change risk must be called out immediately and clearly. If a change could impact existing API contracts, payload shapes, database schema, background jobs, integrations, or expected behavior, say so up front and treat it as a high-priority warning.
- If everything is fine, say so explicitly: "Nothing important appears to be missing."
