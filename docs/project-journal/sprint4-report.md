# Sprint 4 Report — Admin Features, Integrations & Polish

**Sprint Dates:** March 23 – April 5, 2026
**Sprint Goal:** Implement admin workflows, email/calendar integrations, trending features, and overall UI polish.

---

## Completed Tasks

### Preetam (Admin & Auth)
- Built Admin Users page with role management
- Added user status toggle (active/inactive)
- Refined auth flow with better error messaging
- Security hardening: helmet, CORS tightening

### Nikhil (Admin Events)
- Created admin event routes, controller, and service
- Built event approval/rejection workflow
- Implemented EventApprovalCard with admin actions
- Created AdminEventsPage for managing pending events
- Added dashboard statistics API

### Sasi (Email, Calendar & Utilities)
- Implemented email service with Nodemailer
- Built calendar service for .ics file generation
- Created AttendeeList component for event organizers
- Built Toast notification component (shared)
- Created CalendarPage with react-big-calendar
- Added formatDate and formatCurrency utility functions

### Pratham (Trending, UX & Error Handling)
- Built TrendingSection component with trending events API
- Created NotFoundPage (404)
- Added view tracking for trending algorithm
- Implemented map bounds API for viewport-based event loading
- Enhanced search with sort options

---

## Demo Deliverables
- Admin can view pending events, approve or reject with notes
- Admin can manage user roles and account status
- Email notifications sent on ticket purchase and event approval
- Calendar download (.ics) from ticket detail page
- Trending events section on homepage
- 404 page for unmatched routes

---

## Weekly Scrum Summary

**Week 1 (Mar 23–29):**
- Admin routes and approval workflow completed
- Email service integrated and tested with dev SMTP
- Trending events API and component built

**Week 2 (Mar 30 – Apr 5):**
- Calendar service and attendee list features shipped
- Cross-browser testing revealed CSS flexbox issues (fixed)
- Final integration testing for admin flows

---

## Retrospective Notes
- **Start:** Writing unit tests — schedule dedicated testing in Sprint 5
- **Stop:** Feature creep — Sprint 5 is focused on quality, not new features
- **Continue:** Documenting API changes in PR descriptions
