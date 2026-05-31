@AGENTS.md

# Claude-specific notes for AutoParts Hub

## Before starting any task

1. Read `AGENTS.md` for stack rules and conventions
2. Check `PROJECT.md` for full project structure and feature map
3. Run `npx tsc --noEmit` after every edit to verify zero TypeScript errors

## Key files to understand first

| File                   | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `prisma/schema.prisma` | Full DB schema — check before any data work       |
| `auth.ts`              | NextAuth config — JWT callbacks, role in token    |
| `middleware.ts`        | Route guards — PROTECTED, SELLER_ONLY, ADMIN_ONLY |
| `lib/utils.ts`         | `formatCurrency` (ETB), `cn`, `discountPercent`   |
| `actions/*.ts`         | All business logic lives here                     |

## Test credentials

| Role     | Email                    | Password      |
| -------- | ------------------------ | ------------- |
| ADMIN    | `admin@autoparts.hub`    | `admin123!`   |
| SELLER   | `seller@autoparts.hub`   | `password123` |
| CUSTOMER | `customer@autoparts.hub` | `password123` |

## Database setup (first time)

```bash
npm run db:push      # create tables
# stop dev server, then:
npx prisma generate  # full client (not --no-engine)
npm run db:seed      # seed users, categories, products
npm run dev          # restart
```

## Environment variables needed

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/car_spare_parts?schema=public
AUTH_SECRET=dev-secret-replace-me
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AutoParts Hub
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Optional (silent fail without them):
RESEND_API_KEY=
EMAIL_FROM=
CHAPA_SECRET_KEY=
```

## Workflow for adding a new feature

1. Schema change? → edit `prisma/schema.prisma` → `npm run db:push`
2. Business logic? → add/edit `actions/*.ts` (Server Action)
3. Data query? → add to `lib/queries/*.ts`
4. UI? → Server Component page in `app/` or Client Component in `components/`
5. Validate: `npx tsc --noEmit`
