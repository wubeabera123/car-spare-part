<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AutoParts Hub — Agent Rules

## Stack (read before every task)

- **Next.js 16.2.4** App Router — Server Components, Server Actions, `useActionState`
- **React 19** — `useOptimistic`, `useTransition` available
- **TypeScript strict mode** — no `any`, no unchecked indexing
- **Prisma 6 + PostgreSQL 16** — use `prisma.db push` not migrations
- **NextAuth v5 beta** — `auth()` server function, JWT strategy, `signIn()` throws `NEXT_REDIRECT`
- **Tailwind v4** — custom tokens: `bg-surface`, `bg-surface-muted`, `border-border`, `text-foreground-muted`, `text-accent-600`, `bg-accent-600`, `bg-brand-900`
- **Zod v4** — use `z.flattenError(parsed.error).fieldErrors` (NOT `.flatten()`)
- **Path alias** — `@/` maps to project root

## Architecture rules

- **No separate backend** — Server Actions in `actions/*.ts` ARE the API layer
- **Never add `fetch()` calls** to feature code — use Server Actions or direct Prisma queries
- **Server Components by default** — only add `"use client"` when you need interactivity
- **Server Actions** must start with `"use server"` and be `async`
- **Forms** must NOT have `required`, `minLength`, or `type="email"` on inputs — browser HTML5 validation blocks Server Action submission
- **Currency** — always ETB via `formatCurrency()` in `lib/utils.ts`

## File conventions

- Pages: `app/**/page.tsx` (Server Components, export default async function)
- Layouts: `app/**/layout.tsx` (Server Components with auth guards)
- Actions: `actions/*.ts` (Server Actions only, `"use server"` at top)
- Components: `components/**/*.tsx` (client or server)
- Queries: `lib/queries/*.ts` (pure Prisma query helpers)
- Validations: `lib/validations/*.ts` (Zod schemas)

## Auth patterns

```ts
// Server Component or Action
const session = await auth();
if (!session?.user?.id) redirect("/login");

// Roles: CUSTOMER | SELLER | ADMIN
// session.user.id, session.user.role, session.user.name, session.user.email
```

## Prisma patterns

- Never import Prisma client directly in components — use `lib/prisma.ts`
- After mutations: `revalidatePath("/path")` to bust Next.js cache
- After avatar/profile changes: `revalidatePath("/", "layout")` to refresh header
- Stop dev server before running `npx prisma generate` (DLL lock on Windows)
- Use `npx prisma generate --no-engine` for types only without stopping server

## Roles & access

| Role     | Routes                                 | Features                                         |
| -------- | -------------------------------------- | ------------------------------------------------ |
| CUSTOMER | `/account/*`, `/checkout`, `/wishlist` | Browse, cart, checkout, reviews, addresses       |
| SELLER   | `/seller/*`                            | Product CRUD, order fulfillment, store settings  |
| ADMIN    | `/admin/*`                             | All management: users, sellers, products, orders |

## Common mistakes to avoid

- Do NOT use `redirect: false` with `signIn()` — use `redirectTo: "/"` param instead
- Do NOT catch and swallow `NEXT_REDIRECT` — re-throw non-`AuthError` errors
- Do NOT use `prisma generate --no-engine` for seeding — it creates Accelerate-only client
- Do NOT hardcode prices in USD — always ETB
- Do NOT create REST API routes unless explicitly asked — use Server Actions
- Do NOT add browser validation attributes (`required`, `type="email"`) to form inputs
