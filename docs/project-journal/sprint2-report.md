# Sprint 2 Report — Core Feature APIs & Frontend Integration

**Sprint Dates:** February 23 – March 8, 2026
**Sprint Goal:** Complete core backend APIs (event CRUD, ticket purchase, search) and begin frontend-backend integration with API clients and state management.

---

## Completed Tasks

### Preetam (Auth & Infrastructure)
- Added profile update and password change endpoints
- Implemented avatar upload with Multer
- Created user management APIs (admin: list users, update roles)
- Built auth store with Zustand and useAuth hook
- Created Login and Register pages with form validation

### Nikhil (Events & Categories)
- Extended event controller with update, delete, and filter operations
- Added event validation schemas (Zod)
- Built frontend event API client
- Created event Zustand store and useEvents hook
- Implemented EventCard component
- Built basic HomePage layout

### Sasi (Tickets & Notifications)
- Implemented ticket purchase flow with atomic availability check
- Built RSVP controller and service
- Created notification controller and service
- Added ticket validation schemas
- Set up email configuration
- Created ticket seed data

### Pratham (Search & Middleware)
- Built search routes, controller, and service
- Implemented location routes and service
- Added search validation schemas with geo-utils
- Created frontend search API client
- Built search Zustand store and useSearch hook
- Implemented SearchBar and FilterPanel components
- Seeded location data

---

## Demo Deliverables
- Full event CRUD working end-to-end (create, read, update, delete)
- User registration → login → profile view flow functional
- Search API returning filtered results
- Ticket purchase API with availability checking

---

## Weekly Scrum Summary

**Week 1 (Feb 23 – Mar 1):**
- Backend APIs for events, tickets, and search completed
- Started frontend API clients and state management

**Week 2 (Mar 2–8):**
- Frontend store integration and hook creation
- First end-to-end flows tested manually
- Resolved token refresh race condition in axios interceptor

---

## Retrospective Notes
- **Start:** Adding loading states and error boundaries to frontend
- **Stop:** Large PRs — keep them under 300 lines for faster review
- **Continue:** Module-owner pairing for integration testing
