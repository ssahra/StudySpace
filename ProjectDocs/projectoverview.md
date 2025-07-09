# 📘 StudySpace – Product Requirements Document (PRD)

## 1. Overview

**StudySpace** is a real-time web application designed to help university students find available, empty classrooms for studying. As libraries and public study spaces become overcrowded, StudySpace gives students an easy, authenticated way to check which classrooms are free, when they’ll be occupied, and what’s coming next.

This product aligns with modern campus life by promoting smarter use of resources and reducing physical congestion in traditional study areas. StudySpace is built as a secure, role-based platform (students, staff, and admins), optimized for mobile, and deployed as a private app for university domains.

**Product Goals**
- Optimize classroom utilization by surfacing availability data.
- Reduce overcrowding in libraries and other shared spaces.
- Provide students with frictionless, authenticated access to real-time room schedules.

**Business Goals**
- Establish StudySpace as the go-to student productivity tool.
- Monetize through B2B university licensing and premium features.
- Grow through campus-focused marketing and university partnerships.

---

## 2. Problem Statement

University students frequently encounter full libraries and lack quiet study space during peak hours. Simultaneously, many classrooms are unused outside scheduled teaching hours.

### Key Problems:
- Overcrowded libraries, especially during exams.
- No real-time visibility into unused classroom space.
- Schedule data is locked in outdated internal systems.
- Admins lack tools to flag temporary room closures (e.g. maintenance).

**StudySpace solves this by unlocking classroom availability in real time and empowering admins to manage it.**

---

## 3. Target Audience

### 🎓 Primary Users
**University Students**
- Age 18–30
- Access via university email
- Looking for study space during class gaps, evenings, weekends
- Tech-native, expect mobile-first experience

### 👨‍🏫 Secondary Users
**University Staff**
- Professors, teaching assistants, or researchers
- May use app to check availability for ad hoc sessions

### 🛠️ Admin Users
**University Admins / IT Staff**
- Facility managers or timetabling staff
- Need upload/edit access to schedules
- May use dashboard for room audits and usage tracking

---

## 4. Key Features

### ✅ MVP (First 6 Weeks)
- Supabase Auth (Email/Password)
- Real-time room availability view
- Filters: Building, Time Range
- Room schedule view (day/week)
- Admin Dashboard: CRUD for rooms & schedules
- Role-based access via Supabase RLS
- Mobile-optimized interface

### 🚀 V1 (Post-MVP)
- SSO (Google Workspace, SAML)
- CSV Upload for schedules
- Maintenance toggle (manual override)
- Search (room/building)

### 🌱 V2+
- Campus Map with location pins
- Room Booking / Reservations
- Student feedback & issue reporting
- Analytics dashboard (usage, trends)

---

## 5. User Stories

### Student
> "As a student, I want to log in and see which rooms are free nearby, so I can find a quiet place to study quickly."

### Staff
> "As a professor, I want to check room availability on short notice to hold informal sessions."

### Admin
> "As an admin, I want to upload weekly schedules and mark rooms closed for maintenance."

---

## 6. User Flows

### 🔑 Login Flow
1. Navigate to URL
2. Login via university email (Supabase Auth)
3. Redirected to main dashboard

### 🔍 Room Discovery Flow
1. Land on live room list
2. Filter by building and time range
3. Select room to view full schedule
4. (Optional) Save favorite buildings

### 🛠 Admin Flow
1. Log in as admin
2. Navigate to dashboard
3. Upload weekly schedule (CSV/manual)
4. Mark room as unavailable for maintenance

---

## 7. Branding & Design Guidelines

### 🎨 Color Palette
| Purpose        | Color     | Hex       |
|----------------|-----------|-----------|
| Primary        | Indigo    | `#4F46E5` |
| Accent         | Sky Blue  | `#0EA5E9` |
| Background     | Off White | `#F9FAFB` |
| Text (Dark)    | Charcoal  | `#1F2937` |
| Success        | Emerald   | `#10B981` |
| Warning        | Amber     | `#F59E0B` |
| Error          | Red       | `#EF4444` |

### 🖋 Typography
- **Heading Font**: Inter, bold, 700
- **Body Font**: Inter, regular, 400
- **Font Sizes**: Responsive (`text-base`, `text-lg`, `text-xl`)

### 🧱 Components
- Tailwind CSS + shadcn/ui components
- Rounded corners (`rounded-2xl`)
- Soft shadows, minimal gradients
- Framer Motion for transitions
- UI Theme: Clean, academic, uncluttered

---

## 8. Monetization Strategy

### 🎓 B2B Model
- **Licensing SaaS to Universities**:
  - Monthly or annual subscription
  - Tiered based on number of students/buildings

### 🔐 Freemium (Future)
- Free access for students, premium features for institutions:
  - Analytics
  - Branded portals
  - Reservation system
  - Priority support

---

## 9. Marketing Plan

### 🛠 Go-to-Market Strategy

#### Phase 1: MVP Rollout (Weeks 5–6)
- Launch pilot at one university
- Collect feedback from student focus groups

#### Phase 2: Growth
- Partner with student unions and IT departments
- On-campus promo (QR codes in hallways, cafeteria)
- Demo days with university facilities teams

#### Phase 3: Brand Building
- Create brand assets: website, pitch deck, explainer video
- Publish blogs and whitepapers on optimizing classroom usage
- Attend higher ed tech expos & summits

### 📣 Channels
- Campus posters and digital signage
- LinkedIn campaigns targeting university ops
- Email outreach to deans and IT directors
- SEO: Blog targeting keywords like "find empty classrooms"

---

## 10. Technical Requirements

### ⚙️ Tech Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Realtime)
- **CI/CD**: GitHub + Vercel
- **Database**: Supabase PostgreSQL
- **State**: React Context + SWR

### 🔐 Security
- Supabase Auth for all user access
- RLS enforces row-level access:
  - Students/staff can read only
  - Admins can write

### 🔌 Integrations
- Google Workspace SSO (Phase 2)
- CSV Parsing (PapaParse)
- Supabase Realtime (for live updates)

---

## 11. Success Metrics

### 🎯 Product KPIs
- 1000+ student users in pilot university
- >90% schedule data accuracy
- <30s time-to-find-room (UX)
- 99.9% uptime (Supabase SLA)

### 💼 Business KPIs
- 3 university signups by Q3
- $25k ARR by end of year
- 25% MoM user growth (pilot)

---

## 12. Out of Scope (MVP)

- Room booking/reservations
- Mobile apps (native iOS/Android)
- Campus map view
- SMS/email notifications
- Usage analytics for staff

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Poor schedule data quality | Manual override + alerts in admin dashboard |
| Authentication failure | Fallback to manual auth or IT support email |
| Admin neglects updates | Reminders + automated weekly CSV prompt |
| Misuse of rooms by students | Include room usage policy in onboarding |
| Low student adoption | Incentivize via student groups & QR scan challenges |

---

## 14. Timeline – 6-Week MVP Plan

### Sprint 1
- Set up Supabase (tables, auth, RLS)
- Define roles & test policies
- Create wireframes (student & admin view)

### Sprint 2
- Build auth flow (login, redirect, protected routes)
- Basic room list UI
- Room schema, schedule parsing logic

### Sprint 3
- Filtering UI
- Time logic (current, next, today)
- Live updates (Supabase Realtime)

### Sprint 4
- Room detail (day/week view)
- Timezone support
- Admin dashboard base layout

### Sprint 5
- Upload tool (CSV parsing)
- Override toggle
- Admin edit UI

### Sprint 6
- QA + bug fixes
- Deploy to staging
- First demo with stakeholders

---

## 15. Stakeholders

| Name | Role | Interest |
|------|------|----------|
| Product Manager | Strategy & roadmap | Delivery, business alignment |
| University IT | Infrastructure | Data & auth integration |
| Facilities Admin | Room data | Ensures schedule accuracy |
| Student Union Rep | Advocacy | Drives student adoption |
| Lead Developer | Engineering | Implements architecture |
| UI/UX Designer | Product design | Delivers polished, intuitive UI |

---

## 16. Open Questions

- What format are class schedules currently stored in? (Google Calendar, CSV, internal API?)
- Will admins upload schedules weekly or automate?
- Is there a preferred time zone/locale setup for each campus?
- Should we enable dark mode for late-night use?
- Should student feedback be visible to admins?

---

