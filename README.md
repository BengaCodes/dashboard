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

### Example Entry

### Feature: Monthly Budget Overview

#### Description
Added a dashboard widget that displays total budget vs. actual spending for the current month with visual progress indicators.

#### Implementation Details
- **Components**: `BudgetOverview.tsx`, `ProgressBar.tsx`
- **Database Changes**: Added `monthly_budget` column to `budgets` table
- **API Endpoints**: None (uses existing budget queries)
- **Dependencies**: None

#### Usage
Users can view their monthly budget status on the main dashboard. The widget updates in real-time as transactions are added.

#### Technical Notes
- Uses Supabase Realtime for automatic updates
- Calculations are performed client-side for better performance
- Defaults to current month if no budget period is set

#### Related Issues/PRs
- Issue #42: Budget tracking feature
- PR #45: Implement monthly budget overview
