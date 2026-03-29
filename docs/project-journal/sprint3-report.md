# Sprint 3 Report — Frontend Pages & Component Library

**Sprint Dates:** March 9 – March 22, 2026
**Sprint Goal:** Build out the frontend page structure and component library. All major user flows should be navigable in the UI.

---

## Completed Tasks

### Preetam (Auth & Layout)
- Built Profile page with edit functionality
- Created Admin Dashboard page with stats overview
- Refined Navbar with auth-aware navigation
- Added RoleGuard component for admin routes

### Nikhil (Events)
- Built Sidebar navigation component
- Created EventGrid with loading skeletons and empty state
- Implemented multi-step EventForm (5-step wizard)
- Built EventSchedule display component
- Created CategoryFilter with horizontal scroll
- Built EventListPage, EventDetailPage, CreateEventPage, EditEventPage, MyEventsPage
- Added EmptyState shared component

### Sasi (Tickets & Notifications)
- Created ticket API client and notification API client
- Built ticket and notification Zustand stores with hooks
- Implemented TicketSelector with quantity controls
- Created TicketCard with status badges
- Built CheckoutForm component
- Implemented RSVPButton with dropdown
- Created QRCodeDisplay with download functionality
- Built NotificationBell, NotificationDropdown, NotificationItem
- Created TicketPurchasePage, MyTicketsPage, TicketDetailPage

### Pratham (Search & Maps)
- Built EventMap with Leaflet integration
- Created LocationPicker for event creation
- Implemented MapMarker and NearbyEvents components
- Built SearchResults with grid/list toggle and sorting
- Created Modal, LoadingSpinner, and Pagination shared components
- Built SearchPage, MapPage, and SavedEventsPage
- Added cn utility for className merging

---

## Demo Deliverables
- Complete event discovery flow: Home → Search → Event Detail → Purchase Ticket
- Map-based event browsing with nearby events
- Ticket purchase flow with QR code generation
- RSVP system for free events
- Notification bell with dropdown
- Admin dashboard skeleton

---

## Weekly Scrum Summary

**Week 1 (Mar 9–15):**
- Major page scaffolding complete for all four modules
- Ticket and notification frontend stores integrated
- Map components functional with mock data

**Week 2 (Mar 16–22):**
- Polish pass on all pages — loading states, error handling
- Cross-module integration: EventDetail → TicketSelector → Checkout
- Responsive design adjustments for mobile viewports

---

## Retrospective Notes
- **Start:** Performance profiling before adding more features
- **Stop:** Skipping TypeScript strict checks — enable `strict: true`
- **Continue:** Component-driven development with isolated testing
