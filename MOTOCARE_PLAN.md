# MotoCare Zalo Mini App - Development Plan & Architecture

## Project Overview
MotoCare is a comprehensive monorepo application for tracking motorcycle/car maintenance using Zalo Mini Apps, featuring AI-powered license plate detection via Cloudflare Workers.

## Core Architecture

### Technology Stack
- **Monorepo**: Bun workspaces + Turborepo v2
- **Frontend**: Zalo Mini App (React 18 + Vite 5 + ZMP SDK v2 + zmp-ui v1.11)
- **Backend**: Hono v4 + tRPC v11 + SQLite + Drizzle ORM
- **AI Worker**: Cloudflare Workers + Workers AI (llama-3.2-11b-vision-instruct)
- **Validation**: Valibot v1 (Standard Schema compatible with tRPC v11)
- **Styling**: Tailwind CSS v4 + ZMP UI components
- **Deployment**:
  - Backend: Docker + docker-compose
  - Frontend: Zalo Mini App (zmp deploy)
  - Worker: Cloudflare (wrangler deploy)

### Directory Structure
```
motocare/
├── apps/
│   ├── mini-app/        # Zalo Mini App (React + Vite + Tailwind v4)
│   ├── server/          # Hono + tRPC backend
│   └── worker/          # Cloudflare Worker (plate detection)
├── packages/
│   └── shared/          # Valibot validators + shared types
└── [config files]
```

### Database Schema (Planned)
- **vehicles**: Basic vehicle info + current mileage
- **odo_logs**: Mileage tracking history
- **service_records**: Maintenance/service history
- **service_recommendations**: Manufacturer recommendations
- **products**: Related products catalog

## Implementation Phases

### ✅ Phase 1: Scaffolding (COMPLETE)
- Monorepo structure with Bun workspaces
- Turborepo v2 pipeline configuration
- TypeScript configurations for all packages
- Basic package structures and dependencies
- Tailwind v4 setup with ZMP UI integration
- tRPC v11 basic setup with Hono adapter
- Cloudflare Worker AI binding configuration

### ✅ Phase 2: Backend Core (COMPLETE)
- Complete Drizzle ORM schema with 5 tables (vehicles, odo_logs, service_records, service_recommendations, products)
- SQLite database with auto-migrations and WAL mode
- Full tRPC v11 API with 25+ endpoints across 5 routers
- **Valibot v1.2.0** input validation (replaced Zod as specified)
- Experimental standardSchema support enabled in tRPC
- All TypeScript compilation errors resolved
- Server startup and database migrations verified

### ⏳ Phase 3: Shared Package
- Valibot validators for all entities
- Shared TypeScript types
- tRPC procedure definitions

### ⏳ Phase 4: Frontend Shell
- Zalo Mini App layout with BottomNavigation
- tRPC client + React Query integration
- Router setup with React Router
- Component structure with ZMP UI + Tailwind

### ⏳ Phase 5: Features
- Vehicle CRUD + ODO logging
- Service records + manufacturer recommendations
- Product catalog with search/filter

### ⏳ Phase 6: AI Worker
- Cloudflare Worker with Hono
- Workers AI vision model integration
- License plate detection API
- Camera UI integration in mini-app

### ⏳ Phase 7: Deploy
- Dockerfile + docker-compose for backend
- Zalo Mini App deployment configuration
- Cloudflare Worker deployment
- Production environment setup

## Key Technical Decisions

### Monorepo Setup
- **Package Manager**: Bun (fast, native workspaces support)
- **Task Orchestration**: Turborepo v2 (proper dependsOn chains)
- **Build Pipeline**: Shared package builds first, then dependents
- **Dev Scripts**: Individual package dev commands (no root dev)

### Frontend Architecture
- **Framework**: Zalo Mini App with ZMP SDK v2
- **UI Library**: zmp-ui v1.11 (Zalo-native components)
- **Styling**: Tailwind CSS v4 (native @theme, no config file needed)
- **State Management**: tRPC + React Query (server state)
- **Routing**: React Router v6

### Backend Architecture
- **Framework**: Hono v4 (fast, edge-compatible)
- **API**: tRPC v11 (end-to-end type safety)
- **Database**: SQLite + Drizzle ORM (lightweight, file-based)
- **Validation**: Valibot v1 (tree-shakable, Standard Schema compatible)
- **Deployment**: Docker containerized

### AI Integration
- **Platform**: Cloudflare Workers
- **Model**: llama-3.2-11b-vision-instruct (built-in vision)
- **API**: Workers AI binding
- **Use Case**: License plate OCR for auto-filling vehicle forms

## Current Status

### Completed ✅
- **Phase 1**: Full monorepo scaffolding with Bun workspaces + Turborepo
- **Phase 2**: Complete backend core with Valibot validation
- GitHub repository created and configured
- All dependencies installed and working

### In Progress 🔄
- Ready for Phase 3 (Shared Package with Valibot validators)

### Known Issues
- ~~Root `bun run dev` fails (runs all packages in parallel)~~ ✅ **FIXED**
- Need individual dev commands or selective turbo targets
- ZMP plugin dependency issue (removed temporarily)

## Development Commands

### Individual Package Development
```bash
# Frontend
cd apps/mini-app && bun run dev

# Backend
cd apps/server && bun run dev

# Worker
cd apps/worker && bun run dev
```

### Monorepo Commands
```bash
# Show dev command usage
bun run dev

# Individual services
bun run dev:mini-app  # Zalo Mini App
bun run dev:server    # Backend API
bun run dev:worker     # AI Worker

# All services in parallel
bun run dev:all

# Build all packages
bun run build

# Type check all packages
bun run typecheck

# Lint all packages
bun run lint
```

### Database (Phase 2)
```bash
# Generate migrations
cd apps/server && bun run db:generate

# Run migrations
cd apps/server && bun run db:migrate

# Studio (GUI)
cd apps/server && bun run db:studio
```

## Deployment Strategy

### Development
- **Frontend**: Vite dev server on port 8001
- **Backend**: Hono dev server on port 8002
- **Worker**: Wrangler local dev server on port 8003

### Production
- **Frontend**: Zalo Mini App platform (`zmp deploy`)
- **Backend**: Docker container with SQLite volume mount
- **Worker**: Cloudflare Workers (`wrangler deploy`)

## Next Steps

1. **Fix Dev Commands**: Configure turbo for selective dev targets
2. **Phase 2**: Implement Drizzle schema and database setup
3. **Phase 3**: Create Valibot validators and shared types
4. **Phase 4**: Build frontend shell with navigation
5. **Phase 5**: Implement core features (vehicles, odo, service)
6. **Phase 6**: Integrate AI license plate detection
7. **Phase 7**: Production deployment and testing

## Architecture Diagrams

[See conversation history for Mermaid diagrams:
- System architecture (3 deployable apps)
- Database ER diagram
- tRPC router structure
- User flows and Gantt chart]

## Dependencies & Versions

[See individual package.json files for exact versions]

### Critical Dependencies
- `turbo@^2.8.13`
- `typescript@^5.9.3`
- `react@^18.3.1`
- `zmp-sdk@^2.2.0`
- `zmp-ui@^1.11.0`
- `@trpc/server@^11.0.0-rc.446`
- `hono@^4.5.0`
- `drizzle-orm@^0.32.0`
- `valibot@^1.0.0-beta.1`
- `tailwindcss@^4.0.0-alpha.34`