<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules (ai-starter)
- Read `docs/vault/00-STATUS.md` and active issues in `docs/vault/04-Issues/` before starting; update `docs/vault/00-STATUS.md` after finishing.
- Never read, print, or commit `.env.local`, `.sqlite` files, or secrets.
- Derive user identity only from verified Better Auth session (`HttpOnly` cookie). Never accept `userId` or `role` from request body (`z.strictObject`).
- Check `Origin === BETTER_AUTH_URL` and `Content-Type: application/json` on cookie-authenticated mutations.
- Always filter resource queries by `user_id = session.user.id` in `WHERE`; foreign or invalid IDs return `404`.
- With `cacheComponents: true`, wrap any server code reading session/cookies/headers in `<Suspense>`.
- Never weaken CSP, types, lint rules, CI checks, or tests.