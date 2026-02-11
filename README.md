# EventHub — Event Management Platform

A full-stack event management platform inspired by Eventbrite, built with modern web technologies. EventHub enables users to discover, create, and manage events with features like ticket purchasing, RSVP tracking, interactive maps, real-time notifications, and an admin dashboard.

> **University:** San Jose State University
> **Course:** CMPE 202 — Software Systems Engineering
> **Semester:** Spring 2026

---

## Team Members & Contributions

| Name            | Module                        | Key Contributions                                                                                         |
| --------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Preetam**     | Auth, Infrastructure & DevOps | User authentication (JWT), role-based access control, admin user management, Docker setup, Terraform IaC, CI/CD pipeline, Nginx config |
| **Nikhil**      | Events & Categories           | Event CRUD APIs, category management, event approval workflow, EventCard/Grid/Form components, admin events page |
| **Sasi**        | Tickets & Notifications       | Ticket purchase flow, RSVP system, QR code generation, email/calendar services, notification system, ticket components |
| **Pratham**     | Search, Maps & Shared UI      | Full-text search, geo-location queries, Leaflet map integration, filter/sort system, shared UI components (Modal, Spinner, Pagination), middleware stack |

---

## Tech Stack

### Backend
- **Runtime:** Node.js 20 with TypeScript
- **Framework:** Express.js
- **ORM:** Prisma with PostgreSQL 15
- **Authentication:** JWT (access + refresh tokens) with bcrypt
- **Validation:** Zod
- **Email:** Nodemailer
- **Testing:** Jest + Supertest

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod resolver
- **Maps:** Leaflet + React Leaflet
- **Calendar:** react-big-calendar
- **QR Codes:** qrcode.react
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Testing:** Vitest + React Testing Library

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Cloud:** AWS (EC2, RDS, ALB, VPC, S3, ECR)
- **IaC:** Terraform
- **CI/CD:** GitHub Actions
- **Reverse Proxy:** Nginx

---

## Features

### User Authentication & Authorization
- Email/password registration and login
- JWT-based authentication with automatic token refresh
- Role-based access control (User, Organizer, Admin)
- Profile management with avatar upload
- Password strength indicator

### Event Management
- Create, edit, and delete events with a multi-step form wizard
- Category-based browsing and filtering
- Event approval workflow for admin moderation
- Organizer dashboard for managing personal events
- Rich event detail pages with schedules

### Ticket System
- Multiple ticket types per event (General, VIP, etc.)
- Atomic ticket purchase with availability checking
- QR code generation for purchased tickets
- Ticket cancellation support
- RSVP system for free events (Going / Maybe / Not Going)

### Search & Discovery
- Full-text search across events, venues, and cities
- Advanced filters (category, date range, price, location)
- Interactive map with event markers (Leaflet)
- Nearby events based on geolocation
- Trending events section
- Save/bookmark events

### Notifications & Communication
- In-app notification system
- Email confirmations on ticket purchase
- Calendar file (.ics) download
- Real-time notification bell with unread count

### Admin Dashboard
- Overview statistics (users, events, tickets, revenue)
- Event approval/rejection with notes
- User role management
- Account activation/deactivation

---

## Architecture

```
eventhub/
├── backend/                 # Express.js API server
│   ├── prisma/              # Database schema & seeds
│   ├── src/
│   │   ├── config/          # Database, JWT, email, AWS configs
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # Auth, validation, error handling, CORS
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic layer
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Helpers (slug gen, ticket numbers, geo)
│   │   └── validators/      # Zod validation schemas
│   └── tests/               # Jest test suites
├── frontend/                # React SPA
│   ├── src/
│   │   ├── api/             # Axios API clients
│   │   ├── components/      # Reusable UI components
│   │   │   ├── auth/        # Login, Register, ProtectedRoute
│   │   │   ├── events/      # EventCard, EventGrid, EventForm
│   │   │   ├── layout/      # Navbar, Footer, Sidebar
│   │   │   ├── map/         # EventMap, LocationPicker
│   │   │   ├── notifications/# NotificationBell, Dropdown
│   │   │   ├── search/      # SearchBar, FilterPanel, Results
│   │   │   ├── shared/      # Button, Input, Modal, Spinner
│   │   │   └── tickets/     # TicketSelector, TicketCard, QRCode
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page-level components
│   │   ├── store/           # Zustand state stores
│   │   ├── styles/          # Global CSS
│   │   └── utils/           # Formatting, constants
│   └── tests/               # Vitest test suites
├── infrastructure/
│   ├── terraform/           # AWS infrastructure-as-code
│   └── nginx/               # Reverse proxy configuration
├── docs/                    # Project documentation
│   ├── xp-values.md         # XP Core Values narrative
│   ├── burndown/            # Burndown charts
│   └── project-journal/     # Sprint reports (1–6)
├── .github/workflows/       # CI/CD pipeline
├── docker-compose.yml       # Local development orchestration
└── README.md                # This file
```

---

## Getting Started

### Prerequisites
- **Node.js** >= 20
- **Docker** & **Docker Compose**
- **Git**

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-org/eventhub.git
cd eventhub

# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up --build

# The app will be available at:
#   Frontend: http://localhost:5173
#   Backend API: http://localhost:3001
#   PostgreSQL: localhost:5432
```

### Option 2: Local Development

**Backend:**
```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start the development server
npm run dev
# → API running at http://localhost:3001
```

**Frontend:**
```bash
cd frontend
npm install

# Copy environment variables
cp .env.example .env

# Start the development server
npm run dev
# → App running at http://localhost:5173
```

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

---

## API Endpoints

| Method | Endpoint                          | Description                   | Auth Required |
| ------ | --------------------------------- | ----------------------------- | ------------- |
| POST   | `/api/auth/register`              | Register a new user           | No            |
| POST   | `/api/auth/login`                 | Login and receive tokens      | No            |
| POST   | `/api/auth/refresh`               | Refresh access token          | No            |
| GET    | `/api/auth/me`                    | Get current user profile      | Yes           |
| PUT    | `/api/auth/me`                    | Update profile                | Yes           |
| GET    | `/api/events`                     | List events (with filters)    | No            |
| POST   | `/api/events`                     | Create a new event            | Yes           |
| GET    | `/api/events/:slug`               | Get event by slug             | No            |
| PUT    | `/api/events/:id`                 | Update an event               | Yes           |
| DELETE | `/api/events/:id`                 | Delete an event               | Yes           |
| GET    | `/api/events/:id/ticket-types`    | List ticket types for event   | No            |
| POST   | `/api/events/:id/tickets/purchase`| Purchase tickets              | Yes           |
| GET    | `/api/search`                     | Search events                 | No            |
| GET    | `/api/events/nearby`              | Get nearby events             | No            |
| GET    | `/api/events/trending`            | Get trending events           | No            |
| GET    | `/api/categories`                 | List all categories           | No            |
| GET    | `/api/admin/events/pending`       | List pending events (admin)   | Yes (Admin)   |
| GET    | `/api/admin/dashboard`            | Dashboard statistics          | Yes (Admin)   |

---

## Deployment

The project uses Terraform for AWS infrastructure provisioning:

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Preview changes
terraform plan -var="db_username=admin" -var="db_password=YourSecurePassword"

# Apply infrastructure
terraform apply
```

See [infrastructure/terraform/](./infrastructure/terraform/) for complete IaC definitions and the [CI/CD pipeline](./.github/workflows/ci-cd_Preetam.yml) for automated deployment.

---

## XP Core Values

Our team embraced **Communication** and **Feedback** as our guiding XP values throughout the project:

- **Communication:** Daily stand-ups, shared documentation channels, consistent commit conventions, and pair programming sessions ensured zero knowledge silos. Any team member could contribute to any module.

- **Feedback:** Mandatory code reviews, sprint retrospectives (Start/Stop/Continue), CI/CD pipeline giving instant build feedback, and mid-project usability walkthroughs drove continuous improvement across all six sprints.

See [docs/xp-values.md](./docs/xp-values.md) for the full narrative.

---

## Project Links

- **GitHub Repository:** [github.com/your-org/eventhub](https://github.com/your-org/eventhub)
- **Sprint Burndown Charts:** [docs/burndown/burndown-charts.md](./docs/burndown/burndown-charts.md)
- **Project Journal:** [docs/project-journal/](./docs/project-journal/)
- **CI/CD Pipeline:** [.github/workflows/ci-cd_Preetam.yml](./.github/workflows/ci-cd_Preetam.yml)
