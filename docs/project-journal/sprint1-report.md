# Sprint 1 Report — Project Setup & Core Models

**Sprint Dates:** February 9 – February 22, 2026
**Sprint Goal:** Establish the project foundation—scaffolding, database schema, core backend skeletons, and shared frontend infrastructure.

---

## Completed Tasks

### Preetam (Auth & Infrastructure)
- Initialized monorepo with backend and frontend scaffolding
- Set up Docker Compose with PostgreSQL, backend, and frontend services
- Created Prisma schema with User model and authentication tables
- Implemented auth routes, controller, and service (register, login, JWT)
- Built shared frontend components (Button, Input) and layout (Navbar, Footer)
- Set up Axios client with interceptors and token refresh
- Configured CI/CD pipeline skeleton

### Nikhil (Events & Categories)
- Added Event and Category models to Prisma schema
- Created category seed data
- Built event routes, controller, and service skeletons
- Implemented create event, list events with pagination, and get event by slug APIs
- Added slug generation utility

### Sasi (Tickets & Notifications)
- Added Ticket, RSVP, and Notification models to Prisma schema
- Created ticket routes, controller, and service skeletons
- Implemented ticket number generation utility
- Set up notification routes skeleton

### Pratham (Search & Middleware)
- Built Axios client with request/response interceptors
- Created validation middleware (Zod-based)
- Implemented centralized error handler
- Set up rate limiting middleware
- Configured CORS middleware
- Created response helper utilities
- Defined search type interfaces

---

## Demo Deliverables
- Docker Compose `up` successfully starts all three services (Postgres, backend, frontend)
- User registration and login endpoints functional
- Event CRUD API skeleton responding to requests
- Frontend renders with Navbar, Footer, and basic routing

---

## Weekly Scrum Summary

**Week 1 (Feb 9–15):**
- Focused on environment setup and Prisma schema design
- Resolved Docker networking issues between services
- Agreed on API response format and error handling conventions

**Week 2 (Feb 16–22):**
- Completed initial API endpoints for auth, events, and tickets
- Set up middleware stack (CORS, rate limiting, error handling)
- Frontend routing and shared components established

---

## Retrospective Notes
- **Start:** Writing integration tests from Sprint 2 onward
- **Stop:** Committing directly to main — all work through PRs going forward
- **Continue:** Daily stand-ups and pair programming on cross-module features
