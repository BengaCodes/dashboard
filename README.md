# FinTraxx — Finance Tracker

A full-stack personal finance dashboard for tracking income, expenses, and budgets. Built with **React + TypeScript** on the frontend and **NestJS** on the backend.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Design System](#design-system)
6. [Component Library](#component-library)
7. [Backend — NestJS API](#backend--nestjs-api)
8. [Frontend — React App](#frontend--react-app)
9. [Features](#features)
10. [Getting Started](#getting-started)
11. [Environment Variables](#environment-variables)
12. [API Reference](#api-reference)
13. [Database Schema](#database-schema)

---

## Overview

FinTraxx lets users:
- Track income and expense transactions
- Categorise spending with colour-coded categories
- Set monthly budgets per category and see how much has been spent
- Visualise spending by category with progress bars
- Filter transactions by month and year
- Bulk-import transactions from Excel/CSV files
- Set up recurring transactions (daily, weekly, monthly, yearly)

---

## Architecture

```
fintraxx/
├── backend/        NestJS REST API (auth, data access, business logic)
└── src/            React frontend (UI, state, data fetching)
```

### Data Flow

```
Browser ──► React (TanStack Query) ──► NestJS API ──► PostgreSQL
                                          │
                                     JWT Auth Guard
```

The frontend communicates with the backend exclusively via REST API. Authentication is JWT-based — the token is stored in `localStorage` under the key `fintraxx_token`.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend UI | React 19 + TypeScript | |
| Styling | Tailwind CSS v4 | CSS custom properties for design tokens |
| Icons | Lucide React | |
| Server State | TanStack Query v5 | Caching, invalidation |
| Build | Vite 7 | |
| Backend | NestJS 10 | Modules, Pipes, Guards |
| ORM | TypeORM | PostgreSQL adapter |
| Auth | JWT (passport-jwt) + bcryptjs | |
| Database | PostgreSQL | Any hosted instance; Supabase works |
| Validation | class-validator + class-transformer | |
| API Docs | Swagger (OpenAPI) | `/api/docs` |
| File Parsing | xlsx | Excel bulk import |

---

## Project Structure

```
dashboard/
├── backend/                      NestJS API
│   ├── src/
│   │   ├── main.ts               Entry point, Swagger, CORS, global pipes
│   │   ├── app.module.ts         Root module, TypeORM config
│   │   ├── auth/                 JWT auth (sign-up, sign-in)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/              SignUpDto, SignInDto
│   │   │   ├── guards/           JwtAuthGuard
│   │   │   └── strategies/       JwtStrategy
│   │   ├── users/                User entity & service
│   │   ├── categories/           Category entity, CRUD, default seeding
│   │   ├── transactions/         Transaction entity, CRUD, filters, bulk create
│   │   └── budgets/              Budget entity, CRUD, with-spent aggregation
│   ├── package.json
│   └── tsconfig.json
│
├── src/                          React frontend
│   ├── api/                      API client layer (fetch wrapper + typed calls)
│   │   ├── client.ts             Base fetch client with JWT injection
│   │   ├── auth.api.ts
│   │   ├── transactions.api.ts
│   │   ├── categories.api.ts
│   │   └── budgets.api.ts
│   ├── types/
│   │   └── index.ts              Shared TypeScript types
│   ├── state/
│   │   ├── AuthContext.tsx        JWT-based auth context (sign-in, sign-up, sign-out)
│   │   └── useAuth.tsx           Context consumer hook
│   ├── hooks/
│   │   ├── api/
│   │   │   ├── useFetchQuery.tsx  TanStack Query wrapper
│   │   │   └── useMutationQuery.tsx
│   │   └── common/
│   │       └── useInput.tsx      Controlled input helper
│   ├── utils/
│   │   ├── dataQuery.ts          Query key factories + API call mappings
│   │   └── utils.ts              Formatters, metric calculators
│   ├── components/
│   │   ├── ui/                   Design system primitives (see below)
│   │   ├── common/               App-level common components
│   │   ├── auth/                 AuthPage
│   │   ├── layout/               Layout shell with header
│   │   ├── dashboard/            Dashboard page — composes all sections
│   │   ├── filter/               Month/year date filter
│   │   ├── metricCard/           Summary metric cards
│   │   ├── transactions/         Transactions list, add form, bulk upload
│   │   ├── budgetOverview/       Budget cards, add budget form
│   │   ├── spendingChart/        Category spending breakdown
│   │   └── userInput/            User menu / sign-out
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                 Design tokens (CSS custom properties)
│
├── .env.example                  Frontend env template
└── README.md
```

---

## Design System

All design tokens are defined as CSS custom properties in `src/index.css` and are available globally.
The theme is a **dark fintech** palette with two typefaces loaded from Google Fonts.

### Typography

| Token | Font | Weights | Usage |
|-------|------|---------|-------|
| `--font-ui` | Syne | 400, 500, 600, 700 | All UI text, headings, nav, buttons |
| `--font-mono` | DM Mono | 400, 500 | Numbers, monetary values, labels, period indicators |

Apply `DM Mono` by adding the `font-mono` class, the `data-mono` attribute, or `.tabular-nums`.

### Colour Tokens

#### Background

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-base` | `#0B0F1A` | Page background |
| `--color-bg-surface` | `#111626` | Card / panel surfaces |
| `--color-bg-panel` | `#0D1120` | Nested panels, sidebars |

#### Accents

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent-green` | `#4DFFC3` | Income, positive, active nav, success states |
| `--color-accent-red` | `#FF4E7A` | Expenses, negative, danger, delete actions |
| `--color-accent-blue` | `#1EC8FF` | Primary actions, links, focus rings |

#### Text

| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#F0EFE8` | Body text, headings |
| `--color-text-muted` | `#4A5068` | Captions, placeholders, secondary labels |

#### Legacy Aliases (kept for compatibility)

`--color-primary → --color-accent-blue`, `--color-success → --color-accent-green`, `--color-danger → --color-accent-red`, `--color-surface → --color-bg-surface`, `--color-bg → --color-bg-base`, `--color-border → rgba(240,239,232,0.08)`

### Other Tokens

```css
--radius-sm / --radius-md / --radius-lg / --radius-xl
--shadow-sm / --shadow-md / --shadow-lg
--transition-fast (150ms) / --transition-base (200ms) / --transition-slow (300ms)
```

---

## Component Library

Reusable primitives live in `src/components/ui/` and `src/components/common/`.

### UI Primitives (`src/components/ui/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `Card` | `padding`, `hover`, `className` | Dark card with surface background. Has `Card.Header` and `Card.Title` sub-components |
| `Badge` | `variant` (default/success/warning/danger/info) | Pill label for status |
| `Progress` | `value`, `color`, `size`, `showLabel` | Colour-coded progress bar |
| `Alert` | `variant`, `title` | Info/success/warning/danger banners |
| `Skeleton` | `className` | Animated loading placeholder. Also exports `SkeletonCard`, `SkeletonRow` |

### Common Components (`src/components/common/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant` (primary/secondary/ghost/danger/success), `size` (sm/md/lg) | Full text button |
| `IconButton` | `icon`, `variant`, `size`, `label` | Icon-only button with accessible label |
| `Input` | `label`, `error`, `hint` + all native input props | Labelled text input with error/hint states |
| `Select` | `label`, `options`, `error` + all native select props | Labelled select with custom chevron |
| `Modal` | `isOpen`, `onClose`, `title`, `size` | Portal-based modal. Closes on Escape or backdrop click |
| `Loading` | — | Full loading screen animation |
| `Spinner` | `size` | Inline spinning SVG |
| `FintraxxLogo` | `className` | 34×34 teal-to-blue gradient icon + Syne/DM Mono wordmark |
| `Icons` | `iconName` + any SVG props | Dynamic Lucide icon renderer |

### Layout Components (`src/components/layout/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `Navbar` | `activeTab`, `onTabChange` | Sticky top navbar — logo left, nav links centre, user avatar right. Background `#0E1220` with hairline bottom border |
| `Layout` | `children` | Page shell. Renders `Navbar` when authenticated; holds `activeTab` state |

### Hero Component (`src/components/hero/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `HeroSection` | `selectedDate`, `onChangeDate`, `income`, `expenses`, `balance` | Dashboard hero — period selector (arrows + DM Mono label), large balance display, 2-column Income / Expenses stat cards |

---

## Backend — NestJS API

### Modules

| Module | Routes | Auth |
|--------|--------|------|
| `AuthModule` | `POST /api/auth/sign-up`, `POST /api/auth/sign-in` | Public |
| `CategoriesModule` | `GET /api/categories` | JWT required |
| `TransactionsModule` | `GET/POST /api/transactions`, `POST /api/transactions/bulk`, `DELETE /api/transactions/:id` | JWT required |
| `BudgetsModule` | `GET/POST /api/budgets`, `GET /api/budgets/with-spent` | JWT required |

### Authentication

1. `POST /api/auth/sign-up` — creates a user in the `fintraxx_users` table, hashes the password with bcrypt (12 rounds), seeds 18 default categories for the new user, and returns a JWT.
2. `POST /api/auth/sign-in` — validates credentials and returns a JWT.
3. All other endpoints require `Authorization: Bearer <token>` in the request header.

### Swagger

Full interactive API documentation is available at `http://localhost:3001/api/docs` when the backend is running.

### Default Categories (auto-seeded on registration)

Food & Dining, Transportation, Entertainment, Salary, Shopping, Groceries, Healthcare, Utilities, Housing, Education, Insurance, Travel, Fitness, Personal Care, Subscriptions, Gifts & Donations, Freelance Income, Investment Returns

---

## Frontend — React App

### State Management

| Concern | Tool |
|---------|------|
| Server state (data fetching/caching) | TanStack Query v5 |
| Auth state (user, JWT token) | React Context + localStorage |
| Form state | Local `useState` via `useInput` hook |

### Auth Flow

```
User submits login → authApi.signIn() → NestJS returns { token, user }
→ stored in localStorage (fintraxx_token / fintraxx_user)
→ AuthContext reads user from storage on mount
→ App renders Dashboard
```

### API Client (`src/api/client.ts`)

The `api` helper wraps `fetch` and:
- Injects `Authorization: Bearer <token>` from localStorage automatically
- Parses error responses and throws typed `Error` objects
- Handles 204 No Content responses

---

## Features

### Transaction Management
- Add individual transactions with description, amount, date, type (income/expense), and category
- Mark transactions as recurring (daily/weekly/monthly/yearly) with optional end date
- Delete transactions with confirmation modal
- Filter displayed transactions by type (All / Income / Expense)

### Bulk Upload
- Upload `.xlsx` or `.xls` files with transactions
- File drag-and-drop area with file name preview
- Required columns: `Description`, `Amount`, `Date`, `Type`, `Category_id` (category name)
- Shows preview count before confirming upload
- Error feedback for invalid or missing fields

### Budget Tracking
- Set monthly budgets per expense category
- Live spending calculation per budget vs transactions in the selected month
- Progress bars with colour-coded status (green < 70% / amber 70–90% / red > 90%)
- Shows remaining or overspent amount

### Spending Chart
- Breaks down expenses by category for the selected month
- Sorted by amount descending
- Shows percentage of total and formatted amount per category
- Shows total spending sum

### Month Filter
- Navigate months with prev/next arrows
- Or select directly from month and year dropdowns
- All data (metrics, transactions, spending chart, budgets) reflects the selected month

### Metric Cards
- Total Balance (income − expenses)
- Total Income
- Total Expenses
- Total Budget

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database (Supabase, Neon, Railway, or local)

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env

npm install
npm run start:dev
```

The API starts at `http://localhost:3001/api`.
Swagger docs at `http://localhost:3001/api/docs`.

### 2. Frontend Setup

```bash
# From the project root
cp .env.example .env
# Set VITE_API_URL if backend is not on localhost:3001

npm install
npm run dev
```

The app starts at `http://localhost:5173`.

### 3. First Run

Register a new account via the sign-up form. The backend will automatically create your user and seed 18 default categories. You can then add transactions and budgets immediately.

---

## Environment Variables

### Frontend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001/api` | NestJS backend base URL |

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `DB_SSL` | | Set to `true` for hosted databases (e.g. Supabase) |
| `JWT_SECRET` | ✅ | Secret for signing JWTs (min 32 chars in production) |
| `JWT_EXPIRES_IN` | | Token lifetime (default: `7d`) |
| `PORT` | | API port (default: `3001`) |
| `CORS_ORIGIN` | | Frontend origin for CORS (default: `http://localhost:5173`) |
| `NODE_ENV` | | Set to `production` to disable TypeORM `synchronize` |

---

## API Reference

### Auth

```
POST /api/auth/sign-up    { email, password }  → { token, user: { id, email } }
POST /api/auth/sign-in    { email, password }  → { token, user: { id, email } }
```

### Categories

```
GET  /api/categories       → Category[]
```

### Transactions

```
GET    /api/transactions                         → TransactionWithCategory[]
       ?limit=&order=asc|desc&startDate=&endDate=&type=income|expense

POST   /api/transactions   { date, description, amount, category_id, type, recurring?, ... }
                                                 → TransactionWithCategory

POST   /api/transactions/bulk  { transactions: [...] }
                                                 → TransactionWithCategory[]

DELETE /api/transactions/:id                     → 204 No Content
```

### Budgets

```
GET  /api/budgets                                → BudgetWithCategory[]
GET  /api/budgets/with-spent?year=&month=        → (BudgetWithCategory & { spent: number })[]
POST /api/budgets  { amount, period, category_id }  → Budget
```

---

## Database Schema

> **Note:** TypeORM creates/syncs these tables automatically in development (`synchronize: true`). In production, disable synchronize and use migrations.

```sql
-- Users (NestJS-managed; separate from Supabase Auth)
CREATE TABLE fintraxx_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR UNIQUE NOT NULL,
  password    VARCHAR NOT NULL,   -- bcrypt hash
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Categories (auto-seeded on registration)
CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now(),
  name        VARCHAR NOT NULL,
  type        VARCHAR NOT NULL CHECK (type IN ('income', 'expense')),
  color       VARCHAR NOT NULL,   -- hex colour e.g. #FF6B6B
  icon        VARCHAR NOT NULL,   -- Lucide icon name e.g. 'Utensils'
  user_id     UUID REFERENCES fintraxx_users(id) ON DELETE CASCADE
);

-- Transactions
CREATE TABLE transactions (
  id                    SERIAL PRIMARY KEY,
  date                  DATE NOT NULL,
  description           VARCHAR NOT NULL,
  amount                DECIMAL(12, 2) NOT NULL,
  category_id           INT REFERENCES categories(id),
  type                  VARCHAR NOT NULL CHECK (type IN ('income', 'expense')),
  user_id               UUID REFERENCES fintraxx_users(id) ON DELETE SET NULL,
  recurring             BOOLEAN DEFAULT false,
  recurring_frequency   VARCHAR CHECK (recurring_frequency IN ('daily','weekly','monthly','yearly')),
  recurring_end_date    DATE,
  recurring_next_date   DATE,
  parent_recurring_id   VARCHAR
);

-- Budgets
CREATE TABLE budgets (
  id          SERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now(),
  amount      DECIMAL(12, 2) NOT NULL,
  period      VARCHAR NOT NULL,
  category_id INT REFERENCES categories(id),
  user_id     UUID REFERENCES fintraxx_users(id) ON DELETE CASCADE
);
```

---

## Migrating from Supabase

If you previously used this app with Supabase Auth:

1. The new `fintraxx_users` table is separate from Supabase's `auth.users`. Existing data won't be accessible with new accounts.
2. To preserve data: export your Supabase transactions/categories/budgets, update the `user_id` columns to match the new UUIDs from `fintraxx_users`, and re-import.
3. Alternatively, start fresh — register a new account and the default categories are seeded automatically.
4. The `@supabase/supabase-js` dependency has been removed from the frontend.

---

## Changelog

### v1.1.0 — Dark Fintech Theme & UI Redesign

**Theme**
- Replaced light slate palette with a dark fintech theme across `src/index.css`
- New background tokens: `--color-bg-base` (#0B0F1A), `--color-bg-surface` (#111626), `--color-bg-panel` (#0D1120)
- New accent tokens: `--color-accent-green` (#4DFFC3), `--color-accent-red` (#FF4E7A), `--color-accent-blue` (#1EC8FF)
- Text tokens updated: `--color-text-primary` (#F0EFE8), `--color-text-muted` (#4A5068)
- All old light-theme tokens kept as CSS variable aliases so existing components continue working
- Shimmer skeleton updated to use dark surface colours

**Typography**
- Added Syne (400/500/600/700) and DM Mono (400/500) via Google Fonts in `index.html`
- `--font-ui: 'Syne'` applied globally to `body`
- `--font-mono: 'DM Mono'` applied via `.font-mono`, `[data-mono]`, `.tabular-nums`

**Navbar (`src/components/layout/Navbar.tsx`)** — new component
- Sticky top bar, `background: #0E1220`, `border-bottom: 0.5px solid rgba(255,255,255,0.07)`, 60px height
- Left: `FintraxxLogo`; Centre: Overview / Transactions / Budgets / Analytics nav links; Right: `UserInput`
- Active link: `rgba(77,255,195,0.08)` background + `--color-accent-green` text, Syne 600
- Hover: lifts muted text to primary with subtle background

**FintraxxLogo** — updated
- Resized from 44×44 to 34×34px; gradient fill updated to teal→blue (`#4DFFC3 → #1EC8FF`), `border-radius: 8px`
- Wordmark: "FinTraxx" in Syne 700 18px; "FINANCE TRACKER" in DM Mono 400 10px uppercase muted

**UserInput** — updated
- Avatar: 32px circle with teal→blue gradient, shows initials derived from email (e.g. `benga.olasebikan@…` → "BO")
- Email shown in DM Mono 12px to the right of avatar (hidden on mobile)
- Dropdown updated to dark surface colours; sign-out hover turns red accent

**HeroSection (`src/components/hero/HeroSection.tsx`)** — new component
- Period selector: left/right arrow buttons + "MONTH YEAR" in DM Mono 500 uppercase (e.g. "JUNE 2026")
- Net balance: "NET BALANCE" label in DM Mono 11px uppercase muted; value in Syne 700 48px, letter-spacing −2px
- 2-column stat cards (Income, Expenses): `background: #111626`, `border: 0.5px solid rgba(255,255,255,0.06)`, `border-radius: 12px`; 2px top accent stripe (green / red); icon in tinted circle (top-right); value in Syne 700 26px accent colour; label in DM Mono 11px uppercase

**Dashboard** — updated
- Removed `TransactionFilter` and 4-card `MetricCard` grid
- Replaced with `HeroSection` (period selector + balance + income/expenses cards)
- Budget data remains in the `BudgetOverview` sidebar section

**TransactionsList** — redesigned
- Container: `--color-bg-surface` background, `0.5px solid rgba(255,255,255,0.06)` border, `border-radius: 12px`
- Header: "Transactions" in Syne 600 15px left; pill tab switcher (All / Income / Expense) in `rgba(255,255,255,0.04)` container with active teal pill; upload icon button + teal "Add" button right
- Empty state: DM Mono 13px muted centred text

**TransactionCells** — redesigned
- Row hover: `rgba(255,255,255,0.03)` background + `inset 0 0 0 0.5px rgba(255,255,255,0.06)` box-shadow
- Category icon: 38×38px square, `border-radius: 10px`, `background: {color}1a` tint
- Merchant: Syne 500 13px `--color-text-primary`; Category: DM Mono 11px `--color-text-muted` below
- Amount: DM Mono 700 13px — `#4DFFC3` with `+` prefix for income, `#FF4E7A` with `−` for expenses
- Date: DM Mono 11px muted, right-aligned below amount
- Delete button: fades in on row hover, turns red accent on hover

**UserInput** — dropdown redesigned
- Trigger: avatar (28px gradient circle + initials) + email (DM Mono 12px) + ChevronDown; `padding: 5px 10px`, `border-radius: 9px`; chevron rotates 180° on open via `transform 200ms ease`; button background lifts to `rgba(255,255,255,0.06)` while dropdown is open
- Dropdown: `background: #131B2E`, `border: 0.5px solid rgba(255,255,255,0.10)`, `border-radius: 12px`, `width: 220px`, `top: calc(100% + 8px)`, `box-shadow: 0 16px 40px rgba(0,0,0,0.5)`
- Header: display name derived from email (e.g. `benga.olasebikan@…` → "Benga Olasebikan") in Syne 700 13px + email in DM Mono 11px muted; separated by `0.5px` border
- Menu section: `DropdownItem` rows (15px Lucide icon + 12px Syne label) — Settings & preferences (purple `#A78BFA` icon + text, purple tint hover), Edit profile (default), Notifications (default)
- Divider: `0.5px solid rgba(255,255,255,0.07)` with vertical margin
- Sign out section: red `#FF4E7A` icon + text, red tint hover; triggers `signOut()` from auth context
- Outside-click close via `useRef` + `useEffect` `mousedown` listener

**Routing (React Router v6/v7)**
- `react-router-dom` installed; `<BrowserRouter>` wraps the app in `main.tsx`
- Routes: `/` `/transactions` `/budgets` `/analytics` → Dashboard; `/settings` → SettingsPage; `*` redirects to `/`
- `Navbar` uses `useLocation()` to derive the active nav item — `pathname === link.path` (Overview matches `/` exactly, others match their segment); no prop drilling
- `Navbar` uses `useNavigate()` for nav link clicks
- `UserInput` "Settings & preferences" item calls `useNavigate('/settings')` and closes the dropdown
- `Layout` simplified — no tab state; Navbar is self-contained

**Navbar — mobile drawer**
- Center nav links hidden on mobile (`hidden lg:flex`); hamburger icon shown (`lg:hidden`)
- `MobileDrawer` component: fixed overlay (`position: fixed`, `z-index: 201`) with backdrop blur, slides in from the left via `slideInFromLeft` animation
- Drawer shows logo, all four nav links (active highlighted in teal), `0.5px` divider, then "Settings &amp; preferences" in purple using `useNavigate('/settings')`
- Body scroll locked while drawer is open; closes on outside click or route change

**SettingsPage (`src/components/settings/SettingsPage.tsx`)**
- Breadcrumb "Dashboard › Settings" with clickable Dashboard link using `useNavigate('/')`
- Page title "Settings &amp; preferences" in Syne 700 28px
- 2×2 responsive grid (single column on mobile via `.settings-grid` media query)
  - **Profile card** — display name (editable), email (read-only), currency selector
  - **Notifications card** — four toggles (budget alerts, weekly digest, recurring reminders, security alerts) with animated teal/dark switch
  - **Appearance card** — date format, week start, theme display
  - **Security card** — current / new / confirm password inputs
- All inputs: `0.5px` border, `rgba(255,255,255,0.03)` surface, teal focus ring; teal "Save changes" button with `scale(1.03)` hover

**Right Sidebar** — redesigned
- Dashboard right column wrapped in unified panel: `background: #0D1120`, `border-left: 0.5px solid rgba(255,255,255,0.06)`, `border-radius: 12px`
- **SpendingChart** — removed `Card` wrapper; dark header with `0.5px` bottom border; 3px progress bars with `#1A2035` track; DM Mono amounts + percentages
- **ChartItem** — 7px colored dot, Syne 500 name, DM Mono 11px percentage + 12px amount, 3px progress bar
- **BudgetOverview** — removed `Card` wrapper; teal "Add" button in header; summary card (`rgba(255,255,255,0.03)` surface) showing monthly limit in Syne 700 30px + spent/remaining in DM Mono 11px muted; centered SVG donut chart (120×120px): `#1A2035` track + `#4DFFC3` arc fill + DM Mono 700 percentage label at center; budget list separated by `0.5px` divider
- **Budget** — renamed `bgColor` → `color`; 7px colored dot; Syne 500 name; DM Mono 11px percentage right-aligned; 3px `#1A2035` track bar with colored fill; DM Mono 10px spent/remaining below

---

### v1.0.0 — NestJS Migration & Design System

**Architecture**
- Replaced Supabase Auth and direct database queries with a dedicated NestJS backend
- JWT authentication (sign-up, sign-in, sign-out) — no external auth service dependency
- REST API with full Swagger documentation at `/api/docs`
- TypeORM entities with automatic schema synchronisation in development
- Default categories auto-seeded on user registration

**Design System**
- CSS custom properties for all design tokens (colours, radii, shadows, transitions)
- Consistent typography scale and spacing
- Custom scrollbar styling

**New Components**
- `Card` — composable card with `Card.Header` and `Card.Title`
- `Badge` — status pill with semantic variants
- `Progress` — colour-coded progress bar (used in budgets and spending chart)
- `Alert` — info/success/warning/danger banners
- `Skeleton` / `SkeletonCard` / `SkeletonRow` — loading placeholders
- `Spinner` — inline loading indicator

**Improved Components**
- `Button` — proper padding, text sizing, `success` variant added
- `IconButton` — accessible `aria-label`, `success` variant
- `Input` — error state, hint text, asterisk for required fields
- `Select` — consistent with Input, Lucide chevron icon
- `Modal` — Escape key to close, improved header layout
- `UserInput` — click-outside close, better avatar, sign-out confirmation
- `TransactionFilter` — extended year range (5 years), calendar icon
- `TransactionCell` — recurring badge, cleaner layout
- `TransactionsList` — segmented button filter (All/Income/Expense)
- `UploadTransactionsForm` — drag-zone UI, progress feedback, validation
- `AuthPage` — fixed form submit type, toggle button, error Alert component
- `MetricCard` — fixed `text-3xl` (was broken `text-3x`), tighter spacing
- `BudgetOverview` — "Add your first budget" empty state CTA
- `AddBudgetForm` — filters to expense-only categories for budgets
- `Dashboard` — removed hard-coded Supabase token check

**Bug Fixes**
- `AuthPage`: fixed `text-red-red-600` CSS typo
- `Loading.tsx`: fixed SVG attribute `stroke-linecap` → `strokeLinecap`
- `Dashboard`: removed hardcoded `sb-aahhzpfnqjkkssucoddo-auth-token` localStorage key
- `AddBudgetForm`: fixed category name matching (now case-insensitive)
- `utils.ts`: removed all `any` types, proper TypeScript throughout
- Category matching now correctly case-insensitive in all forms

**Removed**
- `@supabase/supabase-js` dependency
- `src/utils/supabase.ts` Supabase client
