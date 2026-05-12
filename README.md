# EventHub — Event Management Platform

A full-stack event management platform inspired by Eventbrite, built with modern web technologies. EventHub enables users to discover, create, and manage events with features like ticket purchasing, RSVP tracking, interactive maps, real-time notifications, and an admin dashboard.

> **University:** San Jose State University
> **Course:** CMPE 202 — Software Systems Engineering
> **Semester:** Spring 2026

**Course docs, sprint backlogs & task boards:** [**Scrum backlog and task board (Notion)**](#scrum-backlog-and-task-board-notion).

---

## Team Members & Contributions

| Name            | Module                        | Key Contributions                                                                                         |
| --------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Preetam**     | Auth, Infrastructure & DevOps | User authentication (JWT), role-based access control, admin user management, Docker setup, Terraform IaC, CI/CD pipeline; AWS deployment (Elastic Beanstalk, RDS, S3, CloudFront), secrets via environment variables |
| **Nikhil**      | Events & Categories           | Event CRUD APIs, category management, event approval workflow, EventCard/Grid/Form components (multi-step wizard, image upload UX, safer submit behavior), admin events page |
| **Sasi**        | Tickets & Notifications       | Ticket purchase flow, RSVP system, QR codes, email/calendar services, notification system; ticket listing ordering fixes |
| **Pratham**     | Search, Maps & Shared UI      | Full-text search, geo-location queries, Leaflet map integration, filter/sort system, shared UI components (Modal, Spinner, Pagination), middleware stack; event detail Google Maps embed robustness |

---

## Scrum backlog and task board (Notion)

The team follows **Scrum** and keeps a **Product Backlog** plus a **Sprint Backlog for each sprint** (Sprints **1–6**, Feb 9 – May 4). In Notion we maintain:

**Backlog (per sprint)**

- Refined **user stories**, acceptance criteria, and dependencies  
- **Sprint goal**, planned capacity, and **carry-over** from the previous sprint  
- **Definition of Done** checks and planning/refinement notes  

**Task board (per sprint)**

- A **sprint task board** (Kanban-style columns such as *To Do / In Progress / In Review / Done*) tracks day-to-day execution of backlog items through the sprint  
- Tasks are linked or aligned to backlog stories so progress is visible in stand-ups and sprint reviews  

**Workspace:** [Software Systems Engineering Project — Notion](https://www.notion.so/Software-Systems-Engineering-Project-3048bd88685180dcbec5eef94333cdb8)

Quantitative sprint outcomes (velocity, carry-over, release burndown chart) are summarized in-repo: **[docs/burndown/burndown-charts.md](./docs/burndown/burndown-charts.md)**.

---

## Tech Stack

### Backend
- **Runtime:** Node.js 20 with TypeScript
- **Framework:** Express.js
- **ORM:** Prisma with PostgreSQL 15
- **Authentication:** JWT (access + refresh tokens) with bcrypt
- **Validation:** Zod
- **Email:** Nodemailer with [Resend](https://resend.com/) API (`RESEND_API_KEY` in production)
- **File uploads:** Multer + `@aws-sdk/client-s3` (event images stored in S3)
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
- **Containerization:** Docker & Docker Compose (local development)
- **Cloud (production deployment):** AWS — Elastic Beanstalk (Node.js on EC2 + Application Load Balancer), Amazon RDS (PostgreSQL), Amazon S3 (static frontend + event image uploads), Amazon CloudFront (HTTPS CDN in front of S3 and API — avoids mixed-content blocking when the SPA is served over HTTPS)
- **IaC:** Terraform definitions under `infrastructure/terraform/` (baseline VPC/RDS patterns)
- **CI/CD:** GitHub Actions — [.github/workflows/ci-cd_Preetam.yml](./.github/workflows/ci-cd_Preetam.yml)
- **Optional reverse proxy:** Nginx sample config under `infrastructure/nginx/` (not required when using Elastic Beanstalk’s managed proxy)

---

## Features

### User Authentication & Authorization
- Email/password registration and login
- JWT-based authentication with automatic token refresh
- Role-based access control (User, Organizer, Admin)
- Profile management with avatar upload
- Password strength indicator

### Event Management
- Create, edit, and delete events with a multi-step form wizard (cover image upload to S3 in cloud deployments)
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
│   ├── wireframes/          # UI wireframes (HTML)
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
git clone https://github.com/gopinathsjsu/cmpe202-4849-spring2026-Stumble-Guys.git
cd cmpe202-4849-spring2026-Stumble-Guys

# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up --build

# The app will be available at:
#   Frontend: http://localhost:5173
#   Backend API: http://localhost:3001/api/v1
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
# Set VITE_API_URL to your backend base URL (includes /api/v1), e.g. http://localhost:3001/api/v1

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

All REST routes are mounted under **`/api/v1`**.

| Method | Endpoint                              | Description                   | Auth Required |
| ------ | ------------------------------------- | ----------------------------- | ------------- |
| POST   | `/api/v1/auth/register`               | Register a new user           | No            |
| POST   | `/api/v1/auth/login`                  | Login and receive JWT tokens   | No            |
| POST   | `/api/v1/auth/refresh`                | Refresh access token          | No            |
| GET    | `/api/v1/auth/me`                     | Get current user profile      | Yes           |
| PUT    | `/api/v1/auth/me`                     | Update profile                | Yes           |
| GET    | `/api/v1/events`                      | List events (with filters)    | No            |
| POST   | `/api/v1/events`                      | Create a new event            | Yes           |
| GET    | `/api/v1/events/:slug`                | Get event by slug             | No            |
| PUT    | `/api/v1/events/:id`                  | Update an event               | Yes           |
| DELETE | `/api/v1/events/:id`                  | Delete an event               | Yes           |
| GET    | `/api/v1/events/:id/ticket-types`     | List ticket types for event   | No            |
| POST   | `/api/v1/events/:id/tickets/purchase`| Purchase tickets              | Yes           |
| POST   | `/api/v1/uploads/event-image`        | Upload event cover image      | Yes           |
| GET    | `/api/v1/search`                      | Search events                 | No            |
| GET    | `/api/v1/events/nearby`               | Get nearby events             | No            |
| GET    | `/api/v1/events/trending`             | Get trending events           | No            |
| GET    | `/api/v1/categories`                  | List all categories           | No            |
| GET    | `/api/v1/admin/events/pending`        | List pending events (admin)   | Yes (Admin)   |
| GET    | `/api/v1/admin/dashboard`             | Dashboard statistics          | Yes (Admin)   |

---

## Deployment

### AWS runtime (Spring 2026)

The team deployed EventHub end-to-end on AWS for demos and inspection:

| Layer | AWS services |
| ----- | ------------- |
| **SPA** | Static files on **Amazon S3**, delivered over **HTTPS** with **Amazon CloudFront** |
| **REST API** | **AWS Elastic Beanstalk** (Node.js on **EC2** behind an **Application Load Balancer**). A **second CloudFront distribution** can terminate HTTPS for the API so the SPA (HTTPS) does not trigger mixed-content blocking against an HTTP origin |
| **Database** | **Amazon RDS for PostgreSQL** (private VPC connectivity from the EB environment) |
| **Media** | Dedicated **S3 bucket** for organizer-uploaded event images; backend uses **`@aws-sdk/client-s3`** + env-configured credentials |

**Secrets** (`DATABASE_URL`, `JWT_*`, `RESEND_API_KEY`, `CORS_ORIGIN`, `FRONTEND_URL`, `AWS_*`, bucket names, etc.) are configured as **Elastic Beanstalk environment variables** — never committed to the repo.

**Operational docs, demo URLs, sprint backlogs & task boards:** [Software Systems Engineering Project — Notion](https://www.notion.so/Software-Systems-Engineering-Project-3048bd88685180dcbec5eef94333cdb8) — see also [_Scrum backlog and task board (Notion)_](#scrum-backlog-and-task-board-notion).

### Terraform (optional IaC baseline)

The repository includes Terraform modules under `infrastructure/terraform/` for VPC/RDS-style provisioning:

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Preview changes
terraform plan -var="db_username=admin" -var="db_password=YourSecurePassword"

# Apply infrastructure
terraform apply
```

See [infrastructure/terraform/](./infrastructure/terraform/) and the [CI/CD workflow](./.github/workflows/ci-cd_Preetam.yml) for automation details.

---

## XP Core Values

Our team embraced **Communication** and **Feedback** as our guiding XP values throughout the project:

- **Communication:** Daily stand-ups, shared documentation channels, consistent commit conventions, and pair programming sessions ensured zero knowledge silos. Any team member could contribute to any module.

- **Feedback:** Mandatory code reviews, sprint retrospectives (Start/Stop/Continue), CI/CD pipeline giving instant build feedback, and mid-project usability walkthroughs drove continuous improvement across all six sprints.

See [docs/xp-values.md](./docs/xp-values.md) for the full narrative.

---

## Project Links

- **Notion — Scrum backlogs, sprint task boards & course workspace:** [Software Systems Engineering Project](https://www.notion.so/Software-Systems-Engineering-Project-3048bd88685180dcbec5eef94333cdb8) — backlog **and task board** maintained **per sprint** (see [_Scrum backlog and task board (Notion)_](#scrum-backlog-and-task-board-notion))
- **GitHub repository:** [gopinathsjsu/cmpe202-4849-spring2026-Stumble-Guys](https://github.com/gopinathsjsu/cmpe202-4849-spring2026-Stumble-Guys)
- **Release burndown chart:** [docs/burndown/burndown-charts.md](./docs/burndown/burndown-charts.md) (embedded PNG + interactive HTML)
- **Interactive wireframes (HTML):** [docs/wireframes/wireframes.html](./docs/wireframes/wireframes.html)
- **Project journal:** [docs/project-journal/](./docs/project-journal/)
- **CI/CD pipeline:** [.github/workflows/ci-cd_Preetam.yml](./.github/workflows/ci-cd_Preetam.yml)
