# AutoParts Hub — Full Project Documentation

## Overview

AutoParts Hub is a fullstack **car spare parts e-commerce marketplace** built with Next.js App Router. It supports three user roles (Admin, Seller, Customer), a multi-vendor product catalog, cart and checkout with Chapa payment integration, order management, product reviews, wishlist, email notifications, and profile management — all in a single Next.js application with no separate backend server.

---

## Tech Stack

| Layer      | Technology                | Version |
| ---------- | ------------------------- | ------- |
| Framework  | Next.js App Router        | 16.2.4  |
| Language   | TypeScript (strict)       | 5.x     |
| UI         | React                     | 19.2.4  |
| Styling    | Tailwind CSS              | v4      |
| Database   | PostgreSQL                | 16      |
| ORM        | Prisma                    | 6       |
| Auth       | NextAuth (beta)           | v5      |
| Payment    | Chapa (Ethiopian gateway) | —       |
| Email      | Resend                    | 6.x     |
| Icons      | Lucide React              | 1.x     |
| Validation | Zod                       | v4      |
| Charts     | Recharts                  | 3.x     |
| Toasts     | Sonner                    | 2.x     |

---

## Architecture

This project uses **Next.js App Router fullstack architecture** — there is no separate backend server.

```
Browser
  │
  ├─ Server Components  (app/**/page.tsx, layout.tsx)
  │    └─ Fetch data directly from PostgreSQL via Prisma
  │    └─ Run only on the server — zero client JS
  │
  ├─ Server Actions  (actions/*.ts)
  │    └─ Handle all mutations: forms, cart, checkout, auth
  │    └─ Run on server only — DB credentials never reach the browser
  │    └─ Called via HTML <form action={...}> or useActionState()
  │
  └─ Client Components  ("use client")
       └─ Interactive UI: wishlist toggle, avatar upload, dropdowns
```

**Network tab behaviour:**
Server Actions always POST to the current page URL and return `text/x-component` (RSC wire format), not JSON. A `303 See Other` after a successful action with `redirect()` is expected and correct.

---

## Project Structure

```
car-spare-part/
│
├── actions/                   # Server Actions — the entire "backend"
│   ├── auth.ts                # register, login, forgot/reset password
│   ├── cart.ts                # addToCart, removeCartItem, toggleWishlist
│   ├── checkout.ts            # placeOrder → Chapa payment init
│   ├── seller-products.ts     # seller product CRUD, markOrderShipped
│   ├── admin.ts               # admin user/seller/product/order management
│   ├── addresses.ts           # create, update, delete, setDefault address
│   ├── reviews.ts             # createReview (purchase-gated)
│   ├── contact.ts             # contact form → Resend email
│   └── profile.ts             # updateAvatar (file upload), updateProfile
│
├── app/                       # Next.js App Router pages
│   ├── layout.tsx             # Root layout — Header + Footer + Toaster
│   ├── page.tsx               # Home page
│   │
│   ├── (auth)/                # Auth group (no shared layout)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   │
│   ├── account/               # Customer dashboard (auth required)
│   │   ├── layout.tsx         # Sidebar nav: Profile, Orders, Wishlist, Addresses
│   │   ├── page.tsx           # Profile + avatar upload + edit form
│   │   ├── orders/page.tsx    # Order history + cancel + tracking
│   │   └── addresses/page.tsx # Address CRUD
│   │
│   ├── admin/                 # Admin dashboard (ADMIN only)
│   │   ├── layout.tsx         # Sidebar nav + ADMIN role guard
│   │   ├── page.tsx           # Overview stats
│   │   ├── products/page.tsx  # All products management
│   │   ├── categories/page.tsx
│   │   ├── brands/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── users/page.tsx
│   │   ├── sellers/page.tsx   # Approve / reject / suspend sellers
│   │   ├── promotions/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── seller/                # Seller dashboard (SELLER + ADMIN)
│   │   ├── layout.tsx         # Sidebar nav + role guard
│   │   ├── page.tsx           # Store overview stats
│   │   ├── products/
│   │   │   ├── page.tsx       # Product list + delete
│   │   │   ├── new/page.tsx   # Create product
│   │   │   └── [id]/edit/page.tsx  # Edit product
│   │   ├── orders/page.tsx    # Orders for this seller + mark shipped
│   │   ├── store/page.tsx     # Store settings
│   │   └── onboarding/page.tsx
│   │
│   ├── products/
│   │   ├── page.tsx           # Listing with sidebar filters + pagination
│   │   └── [slug]/page.tsx    # Product detail + reviews + compatibility
│   │
│   ├── categories/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   │
│   ├── brands/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   │
│   ├── cart/page.tsx
│   ├── checkout/
│   │   ├── page.tsx
│   │   └── success/page.tsx
│   ├── wishlist/page.tsx
│   │
│   ├── about/page.tsx         # Static content pages
│   ├── contact/page.tsx
│   ├── help/page.tsx
│   ├── shipping/page.tsx
│   ├── returns/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── warranty/page.tsx
│   │
│   ├── api/auth/[...nextauth]/route.ts   # NextAuth handler
│   ├── sitemap.ts             # Dynamic XML sitemap
│   └── robots.ts              # robots.txt
│
├── components/
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── account/
│   │   ├── avatar-upload.tsx      # Camera overlay + file input + optimistic preview
│   │   ├── profile-form.tsx       # Name / phone edit form
│   │   ├── cancel-order-button.tsx
│   │   └── address-actions.tsx    # Edit / delete / set-default + new address form
│   ├── cart/
│   │   └── cart-line-item.tsx
│   ├── checkout/
│   │   └── checkout-form.tsx
│   ├── home/
│   │   ├── hero.tsx
│   │   ├── categories.tsx
│   │   ├── featured-products.tsx
│   │   ├── featured-deals.tsx
│   │   ├── popular-brands.tsx
│   │   ├── testimonials.tsx
│   │   └── newsletter.tsx
│   ├── layout/
│   │   ├── header.tsx             # Async server — auth, cart count, avatar
│   │   ├── footer.tsx
│   │   └── mobile-nav.tsx         # Client drawer with role-aware links
│   ├── product/
│   │   ├── product-card.tsx       # Card with wishlisted state
│   │   ├── wishlist-button.tsx    # Optimistic heart toggle (client)
│   │   ├── add-to-cart-form.tsx
│   │   ├── review-form.tsx
│   │   └── sort-select.tsx
│   ├── seller/
│   │   ├── new-product-form.tsx
│   │   ├── edit-product-form.tsx
│   │   └── seller-actions.tsx     # DeleteProductButton, MarkShippedButton
│   ├── admin/
│   │   ├── admin-actions.tsx      # UserActiveToggle, SellerStatusButtons, etc.
│   │   └── create-brand-form.tsx
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── nav-link.tsx           # Active-highlighted sidebar link (client)
│       ├── rating.tsx
│       └── skeleton.tsx
│
├── lib/
│   ├── prisma.ts              # Prisma client singleton
│   ├── utils.ts               # formatCurrency (ETB / am-ET), cn(), discountPercent()
│   ├── chapa.ts               # initializeChapaPayment(), verifyChapaPayment()
│   ├── email.ts               # Resend helpers — order, shipping, reset, approval
│   └── queries/
│       ├── products.ts        # getProducts() with full filter/sort/pagination
│       └── cart.ts            # getOrCreateCart(), cartTotals()
│
├── prisma/
│   ├── schema.prisma          # Full database schema
│   └── seed.ts                # Seeds: users, categories, brands, vehicles, products
│
├── types/
│   └── next-auth.d.ts         # Extends Session with id + role
│
├── auth.ts                    # NextAuth config (Credentials + optional Google)
├── middleware.ts              # Route protection + role redirects
├── next.config.ts
├── tsconfig.json
├── .env                       # Environment variables (never commit secrets)
├── AGENTS.md                  # Rules for AI coding agents
├── CLAUDE.md                  # Claude-specific instructions
└── PROJECT.md                 # This file
```

---

## Database Schema

### Models

| Model                  | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `User`                 | All users — customers, sellers, admins              |
| `Account`              | OAuth provider accounts (NextAuth)                  |
| `Session`              | Active sessions (NextAuth)                          |
| `PasswordResetToken`   | Forgot-password tokens (24 h expiry)                |
| `Address`              | User shipping addresses (multi + default flag)      |
| `Category`             | Hierarchical product categories                     |
| `Brand`                | Automotive brands                                   |
| `VehicleMake`          | e.g. Toyota, Honda, BMW                             |
| `VehicleModel`         | e.g. Camry 2020 (linked to a Make)                  |
| `VehicleCompatibility` | Links products to vehicle models + year range       |
| `Product`              | Full listing: price, stock, images, specs, SEO slug |
| `Seller`               | Store profile linked to a User (one-to-one)         |
| `Cart` / `CartItem`    | Shopping cart                                       |
| `Order` / `OrderItem`  | Placed orders                                       |
| `Review`               | Star-rated reviews (purchase-gated)                 |
| `WishlistItem`         | User saved products                                 |
| `Notification`         | In-app notifications                                |
| `Promotion`            | Discount codes                                      |
| `InventoryLog`         | Stock change history                                |

### Enums

| Enum               | Values                                                                        |
| ------------------ | ----------------------------------------------------------------------------- |
| `UserRole`         | `CUSTOMER` · `SELLER` · `ADMIN`                                               |
| `SellerStatus`     | `PENDING` · `APPROVED` · `SUSPENDED` · `REJECTED`                             |
| `ProductCondition` | `NEW` · `USED` · `REFURBISHED`                                                |
| `PartType`         | `OEM` · `AFTERMARKET`                                                         |
| `OrderStatus`      | `PENDING` · `PROCESSING` · `SHIPPED` · `DELIVERED` · `CANCELLED` · `REFUNDED` |
| `PaymentStatus`    | `PENDING` · `PAID` · `FAILED` · `REFUNDED`                                    |

---

## User Roles & Features

### CUSTOMER

**Protected routes:** `/account/*`, `/checkout`, `/wishlist`

| Feature         | Details                                                            |
| --------------- | ------------------------------------------------------------------ |
| Browse & search | Products with filters (category, brand, price, condition, vehicle) |
| Product detail  | Images, specs, reviews, vehicle compatibility                      |
| Cart            | Add, update quantity, remove items                                 |
| Checkout        | Delivery info → Chapa payment → order confirmation email           |
| Orders          | View history, cancel PENDING orders, see tracking numbers          |
| Reviews         | Write star review only if order was SHIPPED or DELIVERED           |
| Wishlist        | Heart toggle on any product card (optimistic UI)                   |
| Addresses       | Create, edit, delete, set default                                  |
| Profile         | Edit name, phone, upload avatar photo (max 5 MB)                   |
| Password        | Forgot/reset via email link (24 h token)                           |

### SELLER (all CUSTOMER features plus)

**Protected routes:** `/seller/*`

| Feature        | Details                                                               |
| -------------- | --------------------------------------------------------------------- |
| Dashboard      | Store stats — revenue, product count, stock, avg rating               |
| Products       | Create, edit, delete own products (with images, SKU, compatibility)   |
| Orders         | View orders for own products, mark as shipped (enter tracking number) |
| Store settings | Update store name, description, contact info                          |
| Onboarding     | Register seller store (requires admin approval)                       |

### ADMIN (all SELLER features plus)

**Protected routes:** `/admin/*`

| Feature    | Details                                                               |
| ---------- | --------------------------------------------------------------------- |
| Overview   | Platform stats — revenue, orders, products, customers, active sellers |
| Users      | List all users, activate/deactivate accounts                          |
| Sellers    | Approve, reject, suspend seller accounts (triggers email)             |
| Products   | View and manage all listings across all sellers                       |
| Categories | Create, edit, delete categories (hierarchical)                        |
| Brands     | Create, delete brands                                                 |
| Orders     | View all orders, update status                                        |
| Promotions | Manage discount codes                                                 |
| Settings   | Site configuration                                                    |

---

## Authentication

| Property         | Value                                                 |
| ---------------- | ----------------------------------------------------- |
| Library          | NextAuth v5 beta                                      |
| Strategy         | JWT (stored in `authjs.session-token` cookie)         |
| Providers        | Credentials (email + password), optional Google OAuth |
| Password hashing | bcryptjs, 10 rounds                                   |
| Token contents   | `id`, `email`, `name`, `image`, `role`                |
| Forgot password  | `PasswordResetToken` in DB → email link → 24 h expiry |

**Important NextAuth v5 patterns:**

```ts
// Correct — redirectTo param, re-throw non-AuthError
try {
  await signIn("credentials", { email, password, redirectTo: "/" });
} catch (error) {
  if (error instanceof AuthError) return { message: error.message };
  throw error; // re-throw NEXT_REDIRECT
}
```

---

## Route Protection

`middleware.ts` intercepts every non-static request:

```
Unauthenticated + protected route  →  /login?callbackUrl=...
CUSTOMER   + /seller/*             →  /
non-ADMIN  + /admin/*              →  /
```

Server layout files provide a second layer of protection (`app/seller/layout.tsx`, `app/admin/layout.tsx`).

---

## Payment — Chapa

[Chapa](https://chapa.co) is Ethiopia's payment gateway.

```
User fills checkout form
  → placeOrder() server action
  → Order created in DB (status: PENDING)
  → initializeChapaPayment() called
  → User redirected to Chapa-hosted payment page
  → On success: Chapa redirects to /checkout/success
  → verifyChapaPayment() confirms transaction
  → Order status updated to PROCESSING
  → Order confirmation email sent via Resend
```

Required env var: `CHAPA_SECRET_KEY`

---

## Email — Resend

All transactional emails are in `lib/email.ts`.

| Function                     | Trigger                       |
| ---------------------------- | ----------------------------- |
| `sendOrderConfirmationEmail` | Successful checkout           |
| `sendShippingUpdateEmail`    | Seller marks order as shipped |
| `sendPasswordResetEmail`     | Forgot-password request       |
| `sendSellerApprovalEmail`    | Admin approves a seller       |

Required env vars: `RESEND_API_KEY`, `EMAIL_FROM`

> These fail **silently** if env vars are missing — orders and actions still work.

---

## Profile Picture Upload

- File saved to `public/uploads/avatars/{userId}.ext` (server filesystem)
- Filename is user ID only — no user-controlled path components
- Allowed types: JPEG, PNG, WebP, GIF
- Max size: 5 MB
- After upload: `revalidatePath("/", "layout")` flushes Next.js cache so the header shows the new image immediately
- **For production:** replace local filesystem with S3 / Cloudflare R2

---

## Currency

All prices use **ETB (Ethiopian Birr)** with the `am-ET` locale.

```ts
// lib/utils.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("am-ET", {
    style: "currency",
    currency: "ETB",
  }).format(amount);
}
```

---

## SEO

| File             | Purpose                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `app/sitemap.ts` | Dynamic XML sitemap: all products, categories, brands               |
| `app/robots.ts`  | Disallows `/admin/`, `/account/`, `/seller/`, `/api/`, `/checkout/` |
| Each page        | Exports `metadata` object with `title` and `description`            |

---

## Environment Variables

| Variable               | Required | Purpose                                         |
| ---------------------- | :------: | ----------------------------------------------- |
| `DATABASE_URL`         |    ✅    | PostgreSQL connection string                    |
| `AUTH_SECRET`          |    ✅    | NextAuth JWT signing secret (32+ chars in prod) |
| `AUTH_URL`             |    ✅    | App base URL for NextAuth                       |
| `NEXTAUTH_URL`         |    ✅    | App base URL (v5 compatibility)                 |
| `NEXT_PUBLIC_APP_NAME` |    ✅    | App display name                                |
| `NEXT_PUBLIC_APP_URL`  |    ✅    | Public URL                                      |
| `RESEND_API_KEY`       |    ⚠️    | Email sending (silent fail without it)          |
| `EMAIL_FROM`           |    ⚠️    | Sender address, e.g. `noreply@yourdomain.com`   |
| `CHAPA_SECRET_KEY`     |    ⚠️    | Payment processing (silent fail without it)     |
| `CHAPA_WEBHOOK_SECRET` |    ⚠️    | Payment webhook verification                    |
| `AUTH_GOOGLE_ID`       | Optional | Google OAuth client ID                          |
| `AUTH_GOOGLE_SECRET`   | Optional | Google OAuth client secret                      |

---

## Setup & Running

### Prerequisites

- Node.js 20+
- PostgreSQL 16 running locally

### Install

```bash
npm install
```

### Database

```bash
# 1. Create tables from schema
npm run db:push

# 2. Generate Prisma client (stop dev server first on Windows)
npx prisma generate

# 3. Seed test data
npm run db:seed
```

### Dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## Test Credentials

| Role         | Email                    | Password      |
| ------------ | ------------------------ | ------------- |
| **ADMIN**    | `admin@autoparts.hub`    | `admin123!`   |
| **SELLER**   | `seller@autoparts.hub`   | `password123` |
| **CUSTOMER** | `customer@autoparts.hub` | `password123` |

---

## Available Scripts

| Script           | Command               | Purpose                      |
| ---------------- | --------------------- | ---------------------------- |
| Dev server       | `npm run dev`         | Start with Turbopack         |
| Production build | `npm run build`       | Build for deployment         |
| Start            | `npm run start`       | Run production build         |
| Lint             | `npm run lint`        | ESLint                       |
| DB push          | `npm run db:push`     | Sync schema → database       |
| DB generate      | `npm run db:generate` | Generate Prisma client       |
| DB seed          | `npm run db:seed`     | Seed sample data             |
| DB studio        | `npm run db:studio`   | Prisma GUI at localhost:5555 |

---

## Known Notes & Gotchas

| Issue                              | Notes                                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| `prisma generate` EPERM on Windows | Dev server locks the query engine DLL. Stop server first, or use `--no-engine` for types only. |
| JWT role staleness                 | If a user's role changes in DB, they must log out and back in for the new role to take effect. |
| Avatar storage                     | Currently saved to `public/uploads/` on local disk. Swap to S3/Cloudflare R2 for production.   |
| Missing API keys                   | `RESEND_API_KEY` and `CHAPA_SECRET_KEY` are optional in dev — features fail silently.          |
| Seed on first install              | Must stop dev server → `npx prisma generate` → `npm run db:seed` → restart server.             |
