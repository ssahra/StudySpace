# context.md

## 📌 Project Overview

StudySpace is a real-time web application designed to help university students find available, empty classrooms for studying. As libraries and public study spaces become overcrowded, StudySpace gives students an easy, authenticated way to check which classrooms are free, when they'll be occupied, and what's coming next.

This product aligns with modern campus life by promoting smarter use of resources and reducing physical congestion in traditional study areas. StudySpace is built as a secure, role-based platform (students, staff, and admins), optimized for mobile, and deployed as a private app for university domains.

---

## ✅ Must-Have Features

### 1. **User Authentication (Supabase Auth)**
- **User Flow**:
  - Users can sign up, log in, reset password, and update their profile.
  - Protected routes enforce login state.
  - Role-based access: students, staff, and admins.
- **Tech Stack**: Supabase Auth, Next.js 14 App Router, TypeScript, Tailwind CSS.
- **Code Snippet**:
  ```ts
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  ```
- **Potential Bugs**:
  - Session not persisting on refresh (fix by handling auth state listener).
  - Wrong redirect URLs for password reset.

### 2. **Dashboard Layout**
- **User Flow**:
  - Authenticated users land on a dashboard with access to room availability features.
- **Tech**: Next.js dynamic layouts, Supabase `getUser()`.

### 3. **Real-time Room Availability View**
- View real-time availability of university study rooms.
- Filter by building and time range.
- Room schedule view (day/week).
- **Pseudocode**:
  ```js
  const { data } = await supabase.from("rooms").select("*").eq("status", "available")
  ```

### 4. **Admin Dashboard**
- CRUD operations for rooms & schedules.
- Upload weekly schedules (CSV/manual).
- Mark rooms as unavailable for maintenance.
- **Tech**: Supabase RLS for admin-only access.

---

## 🎯 Nice-to-Have Features

- SSO (Google Workspace, SAML).
- CSV Upload for schedules.
- Maintenance toggle (manual override).
- Search (room/building).
- Campus Map with location pins.
- Room Booking / Reservations.
- Student feedback & issue reporting.
- Analytics dashboard (usage, trends).

---

## 🧭 User Flow Summary

1. **Landing Page**
   → Sign Up / Login

2. **Onboarding**
   → Optional flow (later phase)

3. **Dashboard**
   → Room availability view with filters

4. **Room Discovery**
   → Filter by building and time range
   → Select room to view full schedule
   → (Optional) Save favorite buildings

5. **Admin Flow**
   → Upload weekly schedule (CSV/manual)
   → Mark room as unavailable for maintenance

---

## 🧰 Technologies Used

- Frontend: React (Next.js), Tailwind CSS, Shadcn/UI
- Auth: Supabase Auth
- DB: Supabase Postgres
- State Management: React context / local state
- Hosting: Vercel
- Real-time: Supabase Realtime

---

## 🐛 Current Bugs

| ID | Description | Affected File | Status |
|----|-------------|----------------|--------|
| #1 | Auth redirect not working on sign in | `login/page.tsx` | 🟡 Open |
| #2 | Layout flickers when loading auth state | `ClientLayout.tsx` | ✅ Fixed |

---

## ✅ Fixed Bugs

- Layout hydration mismatch resolved by moving auth check to client-side hook.

---

## 💡 Notes for AI Coders (Cursor)
- Always wrap feature work in layout context.
- Use Supabase hooks for client auth state.
- Split features by phase (MVP → v1 → v2).
- Log errors clearly in console and UI.
- Focus on mobile-first responsive design.
- Implement role-based access control (RLS) for all database operations.
