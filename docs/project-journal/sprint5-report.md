# Sprint 5 Report — Testing, Accessibility & Quality

**Sprint Dates:** April 6 – April 19, 2026
**Sprint Goal:** Achieve comprehensive test coverage, improve accessibility, and fix edge cases across all modules.

---

## Completed Tasks

### Preetam (Auth Tests & Infrastructure)
- Wrote backend auth tests (registration, login, token refresh, profile)
- Wrote frontend auth component tests (LoginForm, RegisterForm, ProtectedRoute)
- Configured CI/CD pipeline with test jobs for both backend and frontend
- Added environment-specific configuration for test database

### Nikhil (Event Tests & UI Polish)
- Wrote backend event tests (CRUD, filters, pagination, admin approval)
- Wrote frontend event component tests (EventCard, EventGrid, CategoryFilter)
- Fixed responsive layout issues on EventForm
- Added aria labels and keyboard navigation to event components

### Sasi (Ticket Tests & Edge Cases)
- Wrote backend ticket tests (purchase, cancellation, RSVP, availability)
- Wrote frontend ticket component tests (TicketSelector, TicketCard, RSVPButton, QRCode)
- Fixed ticket cancellation edge case (double-cancel)
- Added email template formatting
- Improved Toast accessibility with ARIA live regions

### Pratham (Search Tests & Performance)
- Wrote backend search tests (full-text search, geo queries, filters)
- Wrote frontend search component tests (SearchBar, FilterPanel, SearchResults, debounce)
- Added loading skeletons to search results
- Implemented error boundary components
- Accessibility audit: added focus indicators and screen reader labels

---

## Demo Deliverables
- All backend test suites passing (auth, events, tickets, search)
- All frontend test suites passing (components, hooks)
- CI/CD pipeline running tests on every push and PR
- Improved keyboard navigation across all interactive components

---

## Weekly Scrum Summary

**Week 1 (Apr 6–12):**
- Backend test suites written and passing for all four modules
- CI/CD pipeline updated to run tests automatically
- Began frontend component testing with Vitest + Testing Library

**Week 2 (Apr 13–19):**
- Frontend test suites completed
- Accessibility improvements across all interactive components
- Edge case fixes: ticket concurrency, search pagination, auth token expiry

---

## Retrospective Notes
- **Start:** Performance testing with Lighthouse
- **Stop:** N/A — the quality focus of this sprint was effective
- **Continue:** Test-first approach for any new features in Sprint 6
