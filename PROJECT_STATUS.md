# Project Status and Handover

## Overview
Status of the MSTC application development as of Dec 11, 2025. This document outlines completed features and pending tasks for future contributors.

## ✅ Implemented Features

### 1. Admin System & Security
- **RBAC (Role-Based Access Control)**: 
  - Routes under `/admin` are strictly protected.
  - `middleware.ts` redirects 'student' users to `/dashboard` if they attempt access.
  - `auth.ts` and `next-auth.d.ts` updated to propagate user `role` (e.g., 'convener', 'core_member') to the customized session.
- **Navigation**: 
  - Intelligent Sidebar: "Admin Panel" button appears in the User Dashboard only for authorized roles.

### 2. Database & Schema
- **Accounts Table Fix**: 
  - Refactored `account` table in `db/schema.ts`.
  - Replaced composite primary key with a single UUID `id` (surrogate key) to ensure compatibility with Drizzle Studio and admin tools.
  - Added unique constraint on `(provider, providerAccountId)`.
  - Cleaned up conflicting orphaned data.

### 3. Event Management (Backend)
- **Checkpoint Reviews**: 
  - Fixed Drizzle ORM queries in `admin/events/[id]/checkpoints` to correctly handle nested joins and data mapping.
  - Resolved `PgColumn` type mismatches.

## 📝 Remaining / Pending Work

### 1. Feature Completion
- **Event Awards**: Schema exists (`event_awards`), but full UI for assigning/viewing awards needs verification.
- **Roadmaps**: Schema exists (`roadmaps`), need to confirm frontend implementation for creating/viewing roadmaps.

### 2. Testing & Validation
- **Role Verification**: Ensure 'deputy_convener' and 'core_member' roles have correct granular permissions if different from 'convener'.
- **Registration Flow**: Test full end-to-end event registration as a student.

### 3. Tech Debt & Optimization
- **Type Safety**: Continue refining Drizzle select types to avoid manual mapping where possible (consider `with: {...}` syntax if Drizzle supports it fully for that relation).
- **Error Boundaries**: Add global error boundaries for Admin routes.

---
*Document created for handover/status tracking.*
