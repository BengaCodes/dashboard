# Application Documentation

## Overview
This is a web based finance tracking application. To allow users track income, expenses and budgets.

## Architecture

### Backend Infrastructure
- **Database**: Supabase (PostgreSQL-based)
- **Real-time Capabilities**: Supabase Realtime for live data synchronization
- **Authentication**: Supabase Auth (tbc)
- **Storage**: Supabase Storage (if applicable)

### Design Philosophy
- **Inspiration**: bolt.new
- **Focus**: Clean, modern, and intuitive user interface
- **Responsiveness**: Mobile-first approach with adaptive layouts
- **Performance**: Optimized for fast load times and smooth interactions

## Key Features Implemented

### Data Management
- Integration with Supabase for persistent data storage
- Real-time data updates using Supabase subscriptions
- TanStack Query for server state management and automatic cache invalidation
- Efficient data fetching and caching strategies

### User Interface
- Sleek, modern design inspired by bolt.new
- Responsive layout that adapts to different screen sizes
- Intuitive navigation and user workflows
- Clean typography and visual hierarchy

## Technology Stack
- **Frontend Framework**: [React, Typescript, TanStack Query]
- **Backend Service**: Supabase
- **State Management**: [TanStack Query for server state management, Zustand? (tbc)]
- **Styling**: [CSS framework/approach used]

## Development Status
The application is currently in active development, with core functionality implemented and ongoing enhancements being added.

---

*Documentation should be updated as new features are added and architectural decisions are made.*

## Documentation Template for New Features

### Feature: Row Level Security (RLS) Policies

#### Description
Enabled Row Level Security (RLS) policies on all database tables to ensure only authenticated users can perform CRUD operations on their own data.

#### Implementation Details
- **Components**: N/A
- **Database Changes**: Added `user_id` column to all tables; enabled RLS policies for CREATE, READ, UPDATE, and DELETE operations
- **API Endpoints**: N/A
- **Dependencies**: N/A

#### Usage
RLS policies enforce data isolation at the database level, automatically restricting users to their own records.

#### Technical Notes
- All tables now include a `user_id` column to identify record ownership
- Policies are enforced server-side by Supabase

#### Related Issues/PRs
Links to relevant issues or pull requests.

---

### Feature: [Bulk Upload]

#### Description
This feature enables users to import multiple transactions at once by uploading an Excel spreadsheet, streamlining the data entry process for bulk transaction management.

#### Implementation Details
- **Components**: `TransactionForm.tsx`
- **Database Changes**: N/A
- **API Endpoints**: N/A
- **Dependencies**: react-spreadsheet

#### Usage
Users can add transactions through the transaction modal, which offers two input methods: manual entry for single transactions or Excel upload for bulk imports.

#### Technical Notes
Any important technical considerations, edge cases, or known limitations.

#### Related Issues/PRs
Links to relevant issues or pull requests.

---

### Feature: Transaction Filters (Month/Year, Income/Expense)

#### Description
Added filters to view transactions by specific month and year, and to quickly filter recent transactions by income or expense.

#### Implementation Details
- **Components**: `TransactionFilters.tsx`, `RecentTransactions.tsx`
- **Database Changes**: None
- **API Endpoints**: None (uses existing transaction queries)
- **Dependencies**: None

#### Usage
Users can select a month and year to narrow the transaction list, or toggle recent transactions by income or expense.

#### Technical Notes
- Filters are applied client-side for responsiveness
- Defaults to current month/year when no filter is set

#### Related Issues/PRs
Links to relevant issues or pull requests.

### Feature: Authentication

#### Description
Implemented user authentication using Supabase Auth to secure the application and ensure only registered users can access the finance tracking features.

#### Implementation Details
- **Components**: `AuthProvider.tsx`, `AuthPage.tsx`
- **Database Changes**: None (handled by Supabase Auth)
- **API Endpoints**: Supabase Auth endpoints
- **Dependencies**: `@supabase/auth-helpers-react`

#### Usage
Users can create an account or log in with email and password. Authentication state is managed globally and protects routes from unauthorized access.

#### Technical Notes
- Session tokens are stored securely in the browser
- Auth state persists across browser sessions
- Protected routes redirect unauthenticated users to login

#### Related Issues/PRs
N/A

---