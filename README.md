# EnterpriseHub AI

Enterprise-grade, Management powered SaaS platform — HRMS, CRM, Project Management, Documents, Collaboration, Analytics, and more in one unified workspace.

---

## 🚀 **NEW: Quick Start Guides**

**First time here? Start with these:**


**💡 Quick Actions:**
- 🚀 **Fast Startup:** Double-click `START_FAST.bat`
- ⚡ **Performance Setup:** Double-click `QUICK_PERFORMANCE_SETUP.bat`
- 🔍 **Verify Setup:** Double-click `VERIFY_SETUP.bat`

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Project Structure](#project-structure)
  - [Root](#root)
  - [backend/](#backend)
  - [frontend/](#frontend)
  - [infra/](#infra)
  - [scripts/](#scripts)
  - [.github/](#github)
- [Modules & Features](#modules--features)
- [API Endpoints](#api-endpoints)
- [WebSocket Routes](#websocket-routes)
- [Environment Variables](#environment-variables)
- [How to Run](#how-to-run)
  - [Prerequisites](#prerequisites)
  - [1. Clone & Configure](#1-clone--configure)
  - [2. Run the Backend](#2-run-the-backend)
  - [3. Run Celery Workers](#3-run-celery-workers)
  - [4. Run the Frontend](#4-run-the-frontend)
  - [5. Seed Demo Data](#5-seed-demo-data)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

---

## Overview

EnterpriseHub AI is a full-stack, enterprise-grade SaaS platform built with Django (backend) and Next.js 14 (frontend). The platform combines multiple business management systems into one unified workspace:

**Core Systems:**
- **HRMS** (Human Resource Management System)
- **CRM** (Customer Relationship Management)
- **Project Management** with Kanban boards
- **Document Management System** with OCR
- **Real-time Collaboration** with WebSocket chat
- **Analytics & Reporting**
- **Finance, Calendar & Reports** modules

**Technical Architecture:**
- Django 5.0.6 REST API backend with PostgreSQL database
- Django Channels for WebSocket real-time features
- Celery for background task processing (emails, notifications)
- Redis for caching and message brokering
- Next.js 14 App Router frontend with TypeScript
- JWT-based authentication with custom MongoDB backend
- AWS S3 integration for file storage

**User Roles:** The platform supports role-based access control with roles including `super_admin`, `company_admin`, `hr`, and `employee`.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS | Next.js 14.2.5, TypeScript 5.5.4 |
| State Management | Redux Toolkit, React Query | @reduxjs/toolkit 2.2.7, @tanstack/react-query 5.51.23 |
| UI Components | Framer Motion, Lucide React, Recharts | Various |
| Backend | Django, Django REST Framework | Django 5.0.6, DRF 3.15.2 |
| Database | PostgreSQL (psycopg2-binary) | 2.9.12 |
| Real-time | Django Channels, Channels Redis, Daphne | Channels 4.1.0, Daphne 4.1.2 |
| Background Tasks | Celery | 5.4.0 |
| Cache / Message Broker | Redis | 5.0.7 |
| Auth | JWT (SimpleJWT) — custom MongoDB JWT backend | 5.3.1 |
| API Documentation | drf-spectacular (OpenAPI) | 0.27.2 |
| Email | SMTP via Gmail (Celery tasks) | Django built-in |
| File Storage | Django Storages, AWS S3 (boto3), Whitenoise | Various |
| Social Auth | django-allauth, social-auth-app-django | 65.18.0, 5.4.1 |
| Web Server | Gunicorn, Nginx (reverse proxy) | 22.0.0 |
| CI/CD | GitHub Actions | - |

---

## Design System

Brutalist + Typography-Driven + Minimalist:

- Fonts: Bebas Neue (display), Space Mono (labels/code), Space Grotesk (body)
- Colors: Black `#0a0a0a`, Accent Red `#ff3b00`, Yellow `#ffd600`, Blue `#0057ff`, Green `#00c853`
- Borders: 2px solid, no border-radius, box-shadow offsets for depth
- Themes: 16 themes with CSS variables (`--bg`, `--surface`, `--text`, `--accent`, `--border`)
- Auth pages are always dark regardless of theme — scoped via `data-scope="auth"`
- Dashboard theme is user-controlled — scoped via `data-scope="dashboard"`

---

## Project Structure

```
enterprisehub-ai/
├── backend/                  # Django backend with MongoDB & Celery
├── frontend/                 # Next.js 14 frontend with TypeScript
├── infra/                    # Infrastructure config (Nginx, Docker)
├── scripts/                  # Utility scripts (seed data, migrations)
├── .github/                  # GitHub Actions CI/CD workflows
├── .env                      # Root environment variables
├── .env.example              # Environment variable template
└── README.md                 # This file
```

---

### Root

| File / Folder | Description |
|---|---|
| `.env` | Root-level environment variables shared across the project |
| `.env.example` | Template showing all required environment variables with empty values |
| `README.md` | This file - complete project documentation |

---

### `backend/`

The Django backend with PostgreSQL database, Django Channels for WebSockets, and Celery for background tasks.

```
backend/
├── apps/                          # All Django applications
│   ├── __init__.py
│   ├── apps.py
│   │
│   ├── core/                      # Core module — base models & utilities
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py              # BaseDocument, TenantDocument (base models)
│   │   ├── pagination.py          # Custom pagination classes (StandardPagination)
│   │   ├── permissions.py         # Custom permission classes (IsCompanyAdmin, IsEmployee)
│   │   ├── exceptions.py          # Custom exception handlers
│   │   └── migrations/
│   │
│   ├── authentication/            # Authentication & JWT
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── jwt_auth.py            # MongoJWTAuthentication — custom JWT backend
│   │   ├── serializers.py         # Login, Register, PasswordReset serializers
│   │   ├── views.py               # Login, Logout, TokenRefresh, PasswordReset views
│   │   ├── urls.py                # Auth API routes (/api/v1/auth/)
│   │   └── migrations/
│   │
│   ├── users/                     # User & Company management
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py              # User and Company models
│   │   ├── backends.py            # MongoAuthBackend — custom authentication backend
│   │   ├── serializers.py         # User, Company serializers
│   │   ├── views.py               # User CRUD, profile, company management
│   │   ├── urls.py                # Users API routes (/api/v1/users/)
│   │   └── migrations/
│   │       └── 0001_initial.py
│   │
│   ├── hr/                        # HR Management System (HRMS)
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py              # Employee, Attendance, Leave, Candidate, Performance models
│   │   ├── serializers.py         # HR serializers
│   │   ├── views.py               # HR viewsets and API views
│   │   ├── urls.py                # HR API routes (/api/v1/hr/)
│   │   ├── migrations/
│   │   │   ├── 0001_initial.py
│   │   │   └── 0002_initial.py
│   │   ├── employees/             # Employee management submodule
│   │   │   ├── __init__.py
│   │   │   └── apps.py
│   │   ├── attendance/            # Attendance tracking submodule
│   │   │   ├── __init__.py
│   │   │   └── apps.py
│   │   ├── leave/                 # Leave management submodule
│   │   │   ├── __init__.py
│   │   │   └── apps.py
│   │   ├── recruitment/           # Recruitment & candidate tracking
│   │   │   ├── __init__.py
│   │   │   └── apps.py
│   │   ├── performance/           # Performance reviews
│   │   │   ├── __init__.py
│   │   │   └── apps.py
│   │   └── payroll/               # Payroll management
│   │       ├── __init__.py
│   │       └── apps.py
│   │
│   ├── projects/                  # Project Management & Kanban
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py              # Project, Sprint, Task, TimeLog, Milestone, Comment
│   │   ├── serializers.py         # Project serializers
│   │   ├── views.py               # Project viewsets, kanban, task management
│   │   ├── urls.py                # Projects API routes (/api/v1/projects/)
│   │   ├── migrations/
│   │   │   ├── 0001_initial.py
│   │   │   └── 0002_initial.py
│   │   ├── kanban/                # Kanban board submodule
│   │   │   ├── __init__.py
│   │   │   └── apps.py
│   │   └── time_tracking/         # Time tracking submodule
│   │       ├── __init__.py
│   │       └── apps.py
│   │
│   ├── crm/                       # Customer Relationship Management
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py              # Lead, Customer, Deal with pipeline stages
│   │   ├── serializers.py         # CRM serializers
│   │   ├── views.py               # CRM viewsets, pipeline management
│   │   ├── urls.py                # CRM API routes (/api/v1/crm/)
│   │   ├── migrations/
│   │   │   ├── 0001_initial.py
│   │   │   └── 0002_initial.py
│   │   ├── leads/                 # Lead management submodule
│   │   │   ├── __init__.py
│   │   │   └── apps.py
│   │   └── pipeline/              # Sales pipeline submodule
│   │       ├── __init__.py
│   │       └── apps.py
│   │
│   ├── documents/                 # Document Management System (DMS)
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py              # Document, Folder, Version models
│   │   ├── serializers.py         # Document serializers
│   │   ├── views.py               # Upload, OCR, versioning, folder management
│   │   ├── urls.py                # Documents API routes (/api/v1/documents/)
│   │   ├── migrations/
│   │   │   ├── 0001_initial.py
│   │   │   └── 0002_initial.py
│   │   └── ocr/                   # OCR processing submodule
│   │       ├── __init__.py
│   │       └── apps.py
│   │
│   ├── collaboration/             # Team Collaboration & Chat
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py              # Channel, Message, DirectMessage models
│   │   ├── consumers.py           # ChatConsumer — WebSocket consumer for chat
│   │   ├── views.py               # Collaboration viewsets
│   │   ├── urls.py                # Collaboration API routes (/api/v1/collaboration/)
│   │   ├── migrations/
│   │   │   ├── 0001_initial.py
│   │   │   └── 0002_initial.py
│   │   └── chat/                  # Chat submodule
│   │       ├── __init__.py
│   │       └── apps.py
│   │
│   ├── notifications/             # Notification System
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py              # Notification model
│   │   ├── consumers.py           # NotificationConsumer — WebSocket for notifications
│   │   ├── views.py               # Notification viewsets (mark read, delete)
│   │   ├── urls.py                # Notifications API routes (/api/v1/notifications/)
│   │   ├── migrations/
│   │   │   ├── 0001_initial.py
│   │   │   └── 0002_initial.py
│   │   └── email/                 # Email notifications submodule
│   │       ├── __init__.py
│   │       └── apps.py
│   │
│   ├── analytics/                 # Analytics & Reporting
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── views.py               # Analytics views (metrics, charts)
│   │   ├── urls.py                # Analytics API routes (/api/v1/analytics/)
│   │   └── migrations/
│   │
│   ├── finance/                   # Finance Module (Placeholder)
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── urls.py                # Finance API routes (/api/v1/finance/)
│   │   └── migrations/
│   │
│   ├── calendar/                  # Calendar Module (Placeholder)
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── urls.py                # Calendar API routes (/api/v1/calendar/)
│   │   └── migrations/
│   │
│   └── reports/                   # Reports Module (Placeholder)
│       ├── __init__.py
│       ├── apps.py
│       ├── urls.py                # Reports API routes (/api/v1/reports/)
│       └── migrations/
│
├── celery_tasks/                  # Celery background tasks
│   ├── __pycache__/
│   ├── email_tasks.py             # Email tasks (welcome, login alert, password reset)
│   └── notification_tasks.py      # Notification tasks (push notifications)
│
├── config/                        # Django project configuration
│   ├── __pycache__/
│   ├── settings/
│   │   ├── __pycache__/
│   │   ├── base.py                # Core settings — PostgreSQL, Redis, JWT, DRF, Celery
│   │   ├── dev.py                 # Dev settings — DEBUG=True, Django Debug Toolbar
│   │   ├── prod.py                # Prod settings — HTTPS, HSTS, secure cookies
│   │   └── test.py                # Test settings
│   ├── asgi.py                    # ASGI entry point — Django Channels WebSocket support
│   ├── celery.py                  # Celery app configuration
│   ├── urls.py                    # Root URL config — all API routes under /api/v1/
│   └── wsgi.py                    # WSGI entry point for standard HTTP
│
├── websockets/                    # WebSocket configuration
│   └── routing.py                 # WebSocket URL patterns:
│                                  #   ws/chat/<room_name>/ → ChatConsumer
│                                  #   ws/notifications/ → NotificationConsumer
│
├── requirements/                  # Python dependencies
│   ├── base.txt                   # Core deps: Django, DRF, Channels, Celery, Redis, etc.
│   ├── dev.txt                    # Dev deps: pytest, black, flake8, debug toolbar
│   └── prod.txt                   # Prod deps: gunicorn, sentry-sdk (if needed)
│
├── tests/                         # Backend test suite
│   └── [test modules]             # Unit tests, integration tests
│
├── storage/                       # Local file storage directory (uploads, documents)
├── media/                         # User-uploaded media files
├── staticfiles/                   # Collected static files for production
├── venv/                          # Python virtual environment (gitignored)
├── .env                           # Backend environment variables
├── manage.py                      # Django management CLI
├── pytest.ini                     # Pytest configuration
└── server.log                     # Runtime server log
```

#### Key Backend Files Explained

**Core Module (`apps/core/`):**
- `models.py` — Base model classes for all app models (timestamps, UUIDs, soft delete)
- `pagination.py` — Custom pagination (StandardPagination with 20 items per page)
- `permissions.py` — Custom permissions (IsCompanyAdmin, IsEmployee)
- `exceptions.py` — Custom exception handlers for API errors

**Authentication (`apps/authentication/`):**
- `jwt_auth.py` — `MongoJWTAuthentication` class that reads Bearer token from Authorization header, validates with SimpleJWT, fetches user from database
- `serializers.py` — Login, Register, Token Refresh, Password Reset serializers
- `views.py` — Login, Logout, Token Refresh, Password Reset API views

**Users Module (`apps/users/`):**
- `models.py` — User and Company models with bcrypt password hashing
- `backends.py` — `MongoAuthBackend` custom authentication backend
- `views.py` — User CRUD operations, profile management, company management

**Database Configuration (`config/settings/base.py`):**
- Uses PostgreSQL with `psycopg2-binary` adapter
- MongoDB connection via `mongoengine.connect()` for custom JWT backend
- Dummy database backend satisfies DRF/SimpleJWT imports
- Redis configuration for caching and Celery broker

**Celery Tasks (`celery_tasks/`):**
- `email_tasks.py` — Transactional emails (welcome, login alert, password reset) rendered as HTML
- `notification_tasks.py` — Push notification tasks

**WebSocket Routing (`websockets/routing.py`):**
- `ws/chat/<room_name>/` → `ChatConsumer` for real-time chat
- `ws/notifications/` → `NotificationConsumer` for real-time notifications

**API Routes (`config/urls.py`):**
All API endpoints prefixed with `/api/v1/`:
- `/api/v1/auth/` → Authentication endpoints
- `/api/v1/users/` → User management
- `/api/v1/hr/` → HR management
- `/api/v1/projects/` → Project management
- `/api/v1/crm/` → CRM
- `/api/v1/documents/` → Documents
- `/api/v1/collaboration/` → Collaboration
- `/api/v1/notifications/` → Notifications
- `/api/v1/analytics/` → Analytics
- `/api/v1/finance/` → Finance
- `/api/v1/calendar/` → Calendar
- `/api/v1/reports/` → Reports

---

### `frontend/`

Next.js 14 App Router frontend with TypeScript, Tailwind CSS, Redux Toolkit, and React Query.

```
frontend/
├── src/
│   ├── app/                       # Next.js 14 App Router
│   │   ├── (auth)/                # Auth route group — always dark theme
│   │   │   ├── login/
│   │   │   │   └── page.tsx       # Login page
│   │   │   ├── register/
│   │   │   │   └── page.tsx       # Registration page
│   │   │   └── forgot-password/
│   │   │       └── page.tsx       # Password reset page
│   │   │
│   │   ├── (dashboard)/           # Dashboard route group — theme-aware
│   │   │   ├── layout.tsx         # Dashboard layout (Sidebar + Topbar)
│   │   │   │
│   │   │   ├── dashboard/         # Main dashboard
│   │   │   │   └── page.tsx       # Dashboard overview (metrics, charts, activity)
│   │   │   │
│   │   │   ├── welcome/           # Welcome/Onboarding
│   │   │   │   └── page.tsx       # Welcome page for new users
│   │   │   │
│   │   │   ├── hr/                # HR Module pages
│   │   │   │   ├── page.tsx       # HR overview
│   │   │   │   ├── employees/     # Employee management
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── attendance/    # Attendance tracking
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── leave/         # Leave management
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── recruitment/   # Recruitment & candidates
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── performance/   # Performance reviews
│   │   │   │   │   └── page.tsx
│   │   │   │   └── payroll/       # Payroll management
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── projects/          # Project Management pages
│   │   │   │   ├── page.tsx       # Projects list
│   │   │   │   ├── [id]/          # Project details (dynamic route)
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── kanban/        # Kanban board
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── sprints/       # Sprint management
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── tasks/         # Task management
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── time-tracking/ # Time logs
│   │   │   │   │   └── page.tsx
│   │   │   │   └── milestones/    # Milestones
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── crm/               # CRM pages
│   │   │   │   ├── page.tsx       # CRM overview
│   │   │   │   ├── leads/         # Lead management
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── customers/     # Customer management
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── deals/         # Deal tracking
│   │   │   │   │   └── page.tsx
│   │   │   │   └── pipeline/      # Sales pipeline
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── documents/         # Document Management pages
│   │   │   │   ├── page.tsx       # Documents list
│   │   │   │   ├── [id]/          # Document viewer (dynamic route)
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── folders/       # Folder management
│   │   │   │   │   └── page.tsx
│   │   │   │   └── upload/        # Document upload
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── collaboration/     # Collaboration pages
│   │   │   │   ├── page.tsx       # Collaboration overview
│   │   │   │   ├── channels/      # Public/private channels
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── messages/      # Direct messages
│   │   │   │   │   └── page.tsx
│   │   │   │   └── chat/          # Chat interface
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── analytics/         # Analytics pages
│   │   │   │   ├── page.tsx       # Analytics dashboard
│   │   │   │   ├── hr/            # HR analytics
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── projects/      # Project analytics
│   │   │   │   │   └── page.tsx
│   │   │   │   └── crm/           # CRM analytics
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── finance/           # Finance pages
│   │   │   │   └── page.tsx       # Finance overview (placeholder)
│   │   │   │
│   │   │   ├── calendar/          # Calendar pages
│   │   │   │   └── page.tsx       # Calendar view (placeholder)
│   │   │   │
│   │   │   ├── reports/           # Reports pages
│   │   │   │   └── page.tsx       # Reports dashboard (placeholder)
│   │   │   │
│   │   │   └── settings/          # Settings pages
│   │   │       ├── page.tsx       # Settings overview
│   │   │       ├── appearance/    # Theme, font size, density
│   │   │       │   └── page.tsx
│   │   │       ├── localization/  # Language, currency, timezone
│   │   │       │   └── page.tsx
│   │   │       └── notifications/ # Notification preferences
│   │   │           └── page.tsx
│   │   │
│   │   ├── globals.css            # Global styles, CSS variables, theme scoping
│   │   ├── layout.tsx             # Root layout — fonts, providers
│   │   ├── page.tsx               # Landing page (hero, features, pricing)
│   │   └── providers.tsx          # Redux + React Query providers
│   │
│   ├── components/                # React components
│   │   ├── ai/                    # AI assistant components (placeholder)
│   │   ├── charts/                # Recharts-based chart components (placeholder)
│   │   ├── chat/                  # Chat UI components (placeholder)
│   │   ├── crm/                   # CRM-specific components (placeholder)
│   │   │
│   │   ├── dashboard/             # Dashboard widgets and cards
│   │   │   ├── StatCard.tsx       # Metric card component
│   │   │   ├── ActivityFeed.tsx   # Recent activity feed widget
│   │   │   └── ProjectsOverview.tsx # Projects summary widget
│   │   │
│   │   ├── documents/             # Document viewer components (placeholder)
│   │   ├── hr/                    # HR module components (placeholder)
│   │   ├── projects/              # Project components (placeholder)
│   │   │
│   │   ├── shared/                # Shared layout components
│   │   │   ├── Sidebar.tsx        # Collapsible sidebar navigation
│   │   │   └── Topbar.tsx         # Top navigation bar with user menu
│   │   │
│   │   └── ui/                    # Base UI components
│   │       ├── AppearanceProvider.tsx # Theme & appearance context provider
│   │       ├── BrutalTicker.tsx   # Brutalist ticker animation
│   │       └── GlitchText.tsx     # Glitch text effect component
│   │
│   ├── constants/                 # App-wide constants (placeholder)
│   │
│   ├── features/                  # Redux slices (state management)
│   │   ├── ai/                    # AI assistant state (placeholder)
│   │   ├── auth/
│   │   │   └── authSlice.ts       # Auth state (user, token, isAuthenticated)
│   │   ├── crm/                   # CRM state (placeholder)
│   │   ├── documents/             # Documents state (placeholder)
│   │   ├── hr/                    # HR state (placeholder)
│   │   ├── notifications/
│   │   │   └── notificationsSlice.ts # Notifications state
│   │   └── projects/              # Projects state (placeholder)
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts             # Authentication hook
│   │   ├── useWebSocket.ts        # WebSocket connection hook
│   │   ├── useAppDispatch.ts      # Typed Redux dispatch hook
│   │   └── useAppSelector.ts      # Typed Redux selector hook
│   │
│   ├── lib/                       # Utility libraries
│   │   ├── axios.ts               # Axios instance with JWT interceptor
│   │   ├── socket.ts              # Socket.io client configuration
│   │   ├── queryClient.ts         # React Query client configuration
│   │   └── utils.ts               # Helper functions (formatDate, cn, etc.)
│   │
│   ├── services/                  # API service functions
│   │   ├── authService.ts         # Auth API calls (login, register, reset)
│   │   ├── hrService.ts           # HR API calls
│   │   ├── projectService.ts      # Project API calls
│   │   ├── crmService.ts          # CRM API calls
│   │   ├── documentService.ts     # Document API calls
│   │   ├── collaborationService.ts # Collaboration API calls
│   │   ├── notificationService.ts # Notification API calls
│   │   └── analyticsService.ts    # Analytics API calls
│   │
│   ├── store/
│   │   └── store.ts               # Redux store configuration
│   │
│   ├── types/
│   │   └── index.ts               # Global TypeScript type definitions
│   │
│   └── middleware.ts              # Next.js middleware — route protection, auth redirects
│
├── public/                        # Static assets
│   ├── icons/                     # App icons (logo, favicon)
│   └── images/                    # Static images
│
├── node_modules/                  # Node dependencies (gitignored)
├── .next/                         # Next.js build output (gitignored)
│
├── .env.local                     # Frontend environment variables
├── next.config.js                 # Next.js config — API rewrites, image domains
├── next-env.d.ts                  # Next.js TypeScript declarations
├── tailwind.config.ts             # Tailwind CSS configuration (fonts, colors, themes)
├── postcss.config.js              # PostCSS configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.tsbuildinfo           # TypeScript build info (gitignored)
├── package.json                   # Node dependencies and scripts
└── package-lock.json              # Locked dependency versions
```

#### Key Frontend Files Explained

**App Router Structure (`src/app/`):**
- `(auth)/` — Route group for authentication pages (login, register, forgot-password)
  - All auth pages have `data-scope="auth"` and use dark theme regardless of user settings
- `(dashboard)/` — Route group for authenticated dashboard pages
  - `layout.tsx` — Dashboard layout with Sidebar and Topbar, applies `data-scope="dashboard"`
  - All module pages organized by feature (hr/, projects/, crm/, documents/, etc.)

**Components (`src/components/`):**
- `shared/` — Layout components (Sidebar, Topbar) used across dashboard
- `dashboard/` — Dashboard-specific widgets (StatCard, ActivityFeed, ProjectsOverview)
- `ui/` — Base UI components (AppearanceProvider, BrutalTicker, GlitchText)
- Feature-specific component folders (ai/, charts/, chat/, crm/, documents/, hr/, projects/)

**State Management (`src/features/`):**
- Redux Toolkit slices for each feature domain
- `authSlice.ts` — Authentication state (user, token, isAuthenticated)
- `notificationsSlice.ts` — Notifications state
- Placeholder folders for other modules

**API Integration (`src/services/`):**
- Service functions for each module using Axios
- All services use the base Axios instance with JWT interceptor

**Configuration Files:**
- `src/middleware.ts` — Next.js middleware for route protection and auth redirects
- `src/app/globals.css` — Global styles, CSS variables, theme scoping
- `src/app/providers.tsx` — Redux Provider and React Query Provider wrapper
- `src/lib/axios.ts` — Axios instance with base URL and JWT token attachment
- `src/lib/socket.ts` — Socket.io client for WebSocket connections
- `src/lib/queryClient.ts` — React Query client configuration

**Package Dependencies (`package.json`):**
- **Framework:** Next.js 14.2.5, React 18.3.1, TypeScript 5.5.4
- **State Management:** Redux Toolkit 2.2.7, React Query 5.51.23
- **HTTP Client:** Axios 1.7.3
- **Real-time:** Socket.io Client 4.7.5
- **Forms:** React Hook Form 7.52.2, Zod 3.23.8
- **UI/Animation:** Framer Motion 11.3.19, Lucide React 0.414.0
- **Charts:** Recharts 2.12.7
- **Utilities:** date-fns 3.6.0, clsx 2.1.1, tailwind-merge 2.4.0
- **Styling:** Tailwind CSS 3.4.7, PostCSS 8.4.40

**TypeScript Configuration:**
- Strict mode enabled in `tsconfig.json`
- Path aliases configured for cleaner imports
- Types defined in `src/types/index.ts`

---

### `infra/`

```
infra/
└── nginx/
    └── nginx.conf            # Nginx reverse proxy config
```

- `nginx.conf` — Proxies `/api/` and `/ws/` to the Django backend (port 8000), and `/` to the Next.js frontend (port 3000). Handles WebSocket upgrades for `/ws/`. Configured for HTTPS with TLS 1.2/1.3. Max upload size set to 100MB.

---

### `scripts/`

```
scripts/
└── seed.py                   # Seeds MongoDB with demo users, company, projects, and leads
```

- `seed.py` — Creates a demo company (`demo.com`), three users (`admin@demo.com`, `hr@demo.com`, `employee@demo.com`) all with password `demo1234`, sample projects, and sample CRM leads. Run once after setting up the backend.

---

### `.github/`

```
.github/
└── workflows/
    └── ci-cd.yml             # GitHub Actions pipeline
```

- `ci-cd.yml` — Runs on push to `main` / `develop` and on PRs to `main`.
  - `backend-test` job: installs Python 3.12 deps, runs `pytest --cov=apps`, runs `flake8` and `black` linting.
  - `frontend-test` job: installs Node 20 deps, runs `npm run lint`, runs `npm run build`.
  - `deploy` job: triggers only on `main` — builds and pushes Docker images to AWS ECR.

---

## Modules & Features

| Module | Features |
|---|---|
| Auth | JWT login/logout, password reset, role-based access (`company_admin`, `employee`) |
| HR | Employees, attendance tracking, leave requests, job postings, candidate pipeline, performance reviews |
| Projects | Projects, sprints, kanban tasks (todo/in_progress/review/done), time logging, milestones, comments |
| CRM | Leads with status pipeline, customers, deals with probability tracking |
| Documents | File upload, folder structure, OCR text extraction, AI summary, versioning, tagging |
| Collaboration | Public/private channels, threaded messages, direct messages, real-time WebSocket chat |
| Notifications | Real-time WebSocket push notifications, email notifications via Celery |
| Analytics | Dashboard metrics, HR analytics, project analytics, CRM analytics |
| Finance | Finance module (URL routing in place) |
| Calendar | Calendar module (URL routing in place) |
| Reports | Reports module (URL routing in place) |
| Settings | Appearance (16 themes, font size, density), Localization (150+ currencies, language, timezone), Notifications |

---

## API Endpoints

All endpoints are prefixed with `/api/v1/`.

| Prefix | Module |
|---|---|
| `/api/v1/auth/` | Login, logout, token refresh, password reset |
| `/api/v1/users/` | User profile, user management |
| `/api/v1/hr/` | Employees, attendance, leave, recruitment, performance |
| `/api/v1/projects/` | Projects, sprints, tasks, time logs, milestones |
| `/api/v1/crm/` | Leads, customers, deals |
| `/api/v1/documents/` | Documents, folders, versions |
| `/api/v1/collaboration/` | Channels, messages, direct messages |
| `/api/v1/notifications/` | Notifications |
| `/api/v1/analytics/` | Analytics data |
| `/api/v1/finance/` | Finance data |
| `/api/v1/calendar/` | Calendar events |
| `/api/v1/reports/` | Reports |

---

## WebSocket Routes

Real-time WebSocket connections are configured in `backend/websockets/routing.py`:

| WebSocket Path | Consumer | Purpose |
|---|---|---|
| `ws/chat/<room_name>/` | `ChatConsumer` | Real-time chat messages in channels/rooms |
| `ws/notifications/` | `NotificationConsumer` | Real-time push notifications to users |

**Frontend Connection:**
- Socket.io client connects to `NEXT_PUBLIC_WS_URL` (default: `ws://localhost:8000/ws`)
- JWT token passed for authentication
- Automatic reconnection handling

**Backend Configuration:**
- Django Channels with Daphne ASGI server
- Redis channel layer for message broadcasting
- WebSocket consumers in `apps/collaboration/consumers.py` and `apps/notifications/consumers.py`

---

### Backend `.env` (`backend/.env`)

Same as root `.env` — copy values or symlink the file:

```bash
# Windows
copy .env backend\.env

# Linux/macOS
cp .env backend/.env
```

### Frontend `.env.local` (`frontend/.env.local`)

```bash
# ─── API & WebSocket URLs ─────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws

# ─── AI Provider (Optional) ───────────────────────────────
NEXT_PUBLIC_LLM_PROVIDER=GPT-4o
```

**Important Notes:**
- Never commit `.env` files with real credentials to version control
- Use `.env.example` as a template showing all required variables
- For production, set `DEBUG=False` and use secure credentials
- Enable `USE_S3=True` for production file storage

---


## How to Run

### Prerequisites

Make sure the following are installed on your machine:

- **Python 3.12+** (Python 3.13 recommended based on current setup)
- **Node.js 20+**
- **PostgreSQL** (for primary database)
- **MongoDB** (optional, for custom JWT backend)
- **Redis** (for caching, Celery broker, and Channels)

**Database Setup:**

```bash
# PostgreSQL (Windows with psql)
psql -U postgres
CREATE DATABASE enterprisehub;
\q

# Redis (ensure running on default port 6379)
redis-server

# MongoDB (optional, ensure running on default port 27017)
mongod
```

---

### 1. Clone & Configure

```bash
git clone <repo-url>
cd enterprisehub-ai
```

Copy and fill in environment variables:

```bash
cp .env.example .env
# Edit .env with your values
```

Also copy for the backend:

```bash
copy .env backend\.env
# Or manually ensure backend/.env has the same values
```

---

### 2. Run the Backend

Open a terminal in the `backend/` folder:

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements\dev.txt

# Run database migrations (PostgreSQL)
python manage.py migrate --settings=config.settings.dev

# Create superuser (optional)
python manage.py createsuperuser --settings=config.settings.dev

# Start the development server
python manage.py runserver 8000 --settings=config.settings.dev
```

Backend will be available at: `http://localhost:8000`

**Note:** The project uses PostgreSQL as the primary database. Django migrations are managed normally with `python manage.py migrate`.

---

### 3. Run Celery Workers

Open two additional terminals (with the venv activated) in the `backend/` folder:

**Worker** (processes background tasks like emails):
```bash
cd backend
venv\Scripts\activate
celery -A config worker -l info
```

**Beat** (scheduled/periodic tasks):
```bash
cd backend
venv\Scripts\activate
celery -A config beat -l info
```

> If you set `CELERY_TASK_ALWAYS_EAGER=True` in `.env`, tasks run synchronously in the same process and you do not need to run Celery separately. This is the default for development.

---

### 4. Run the Frontend

Open a terminal in the `frontend/` folder:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

### 5. Seed Demo Data

From the project root (with the backend venv active):

```bash
cd backend
venv\Scripts\activate
cd ..
python scripts/seed.py
```

This creates:

| Email | Password | Role |
|---|---|---|
| `admin@demo.com` | `demo1234` | `super_admin` |
| `hr@demo.com` | `demo1234` | `hr` |
| `employee@demo.com` | `demo1234` | `employee` |

Also creates a demo company, 3 sample projects, and 3 sample CRM leads.

---

## Running Tests

**Backend:**

```bash
cd backend
venv\Scripts\activate
pytest --cov=apps
```

**Frontend:**

```bash
cd frontend
npm run test
```

**Linting:**

```bash
# Backend
cd backend
flake8 apps/ --max-line-length=120
black --check apps/

# Frontend
cd frontend
npm run lint
```

---

## Deployment

| Component | Recommended Service |
|---|---|
| Frontend | Vercel, Netlify, or Nginx + Node |
| Backend | AWS EC2, Heroku, DigitalOcean (Gunicorn + Daphne) |
| Database | AWS RDS (PostgreSQL), DigitalOcean Managed PostgreSQL |
| MongoDB | MongoDB Atlas (optional, for JWT backend) |
| Redis | AWS ElastiCache, Upstash, or Redis Cloud |
| File Storage | AWS S3, DigitalOcean Spaces |
| Reverse Proxy | Nginx (`infra/nginx/nginx.conf`) |
| CI/CD | GitHub Actions (`.github/workflows/ci-cd.yml`) |

### Production Setup

1. **Backend Server:**

```bash
# Install production dependencies
pip install -r requirements/prod.txt

# Run migrations
python manage.py migrate --settings=config.settings.prod

# Collect static files
python manage.py collectstatic --noinput --settings=config.settings.prod

# Start with Gunicorn (HTTP) + Daphne (WebSocket)
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
daphne -b 0.0.0.0 -p 8001 config.asgi:application
```

2. **Environment Configuration:**
   - Set `DEBUG=False`
   - Use strong `SECRET_KEY`
   - Configure `ALLOWED_HOSTS` with your domain
   - Enable `USE_S3=True` for file storage
   - Set secure database credentials

3. **Nginx Configuration:**
   - Use `infra/nginx/nginx.conf` as a template
   - Configure SSL/TLS certificates
   - Proxy `/api/` and `/ws/` to backend
   - Proxy `/` to frontend

4. **Celery Workers:**

```bash
# Worker
celery -A config worker -l info --concurrency=4

# Beat scheduler
celery -A config beat -l info
```

5. **Frontend Deployment:**

```bash
cd frontend
npm run build
npm start
# Or deploy to Vercel with: vercel --prod
```

---

## Project Architecture Summary

### Backend Architecture
- **Framework:** Django 5.0.6 with Django REST Framework 3.15.2
- **Database:** PostgreSQL (psycopg2-binary) for primary data storage
- **NoSQL:** MongoDB (optional) for custom JWT authentication backend via MongoEngine
- **Real-time:** Django Channels 4.1.0 with Daphne 4.1.2 ASGI server
- **Background Tasks:** Celery 5.4.0 with Redis broker
- **Caching:** Redis 5.0.7 via django-redis
- **Authentication:** JWT with djangorestframework-simplejwt 5.3.1
- **API Documentation:** drf-spectacular 0.27.2 (OpenAPI/Swagger)
- **File Storage:** Django Storages with AWS S3 (boto3) or local storage
- **Social Auth:** django-allauth, social-auth-app-django

### Frontend Architecture
- **Framework:** Next.js 14.2.5 with App Router
- **Language:** TypeScript 5.5.4
- **State Management:** Redux Toolkit 2.2.7
- **Data Fetching:** React Query 5.51.23 + Axios 1.7.3
- **Real-time:** Socket.io Client 4.7.5
- **Forms:** React Hook Form 7.52.2 with Zod validation
- **Styling:** Tailwind CSS 3.4.7
- **Animation:** Framer Motion 11.3.19
- **Charts:** Recharts 2.12.7
- **Icons:** Lucide React 0.414.0

### Key Design Patterns
- **Multi-tenancy:** All models include `company_id` for data isolation
- **Role-based Access Control:** Permissions based on user roles (super_admin, company_admin, hr, employee)
- **API-first Design:** RESTful API with OpenAPI documentation
- **Real-time Updates:** WebSocket connections for chat and notifications
- **Async Tasks:** Email sending and heavy processing via Celery
- **Modular Structure:** Feature-based app organization for scalability

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

**Development Guidelines:**
- Follow PEP 8 for Python code (enforced by flake8 and black)
- Use TypeScript strict mode for frontend code
- Write tests for new features (pytest for backend, jest for frontend)
- Keep components small and focused
- Document complex logic with comments

---

## License

This project is proprietary and confidential. All rights reserved.

---

## Support & Contact

For issues, questions, or feature requests, please open an issue on GitHub or contact the development team.

to build this project work fast and  smoothy work this Frontend and Backend && Database all this Fast Smoothly work