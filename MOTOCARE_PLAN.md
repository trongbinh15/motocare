# MotoCare Zalo Mini App - Development Plan & Architecture

## Project Overview
MotoCare is a comprehensive monorepo application for tracking motorcycle/car maintenance using Zalo Mini Apps, featuring AI-powered license plate detection via Cloudflare Workers.

## Core Architecture

### Technology Stack
- **Monorepo**: pnpm workspaces + Turborepo v2
- **Frontend**: Zalo Mini App (React 18 + Vite 6 + ZMP SDK v2 + zmp-ui v1.11)
- **Backend**: Hono v4 + tRPC v11 + SQLite + Drizzle ORM
- **AI Worker**: Cloudflare Workers + Workers AI (llama-3.2-11b-vision-instruct)
- **Validation**: Valibot v1.2 (Standard Schema compatible with tRPC v11)
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

### Database Schema
- **vehicles**: Basic vehicle info + current mileage
- **odo_logs**: Mileage tracking history
- **service_records**: Maintenance/service history
- **service_recommendations**: Manufacturer recommendations
- **products**: Related products catalog

## Implementation Phases

### Phase 1: Scaffolding - COMPLETE
- Monorepo structure with pnpm workspaces
- Turborepo v2 pipeline configuration
- TypeScript configurations for all packages
- Basic package structures and dependencies
- Tailwind v4 setup with ZMP UI integration
- tRPC v11 basic setup with Hono adapter
- Cloudflare Worker AI binding configuration

### Phase 2: Backend Core - COMPLETE
- Complete Drizzle ORM schema with 5 tables (vehicles, odo_logs, service_records, service_recommendations, products)
- SQLite database with auto-migrations and WAL mode
- Full tRPC v11 API with 32 endpoints across 5 routers
- Valibot v1.2 input validation
- Standard Schema support enabled in tRPC
- Server startup and database migrations verified
- tRPC routing fixed (`/*` wildcard for proper sub-path matching)

### Phase 3: Shared Package - COMPLETE
- Valibot validators for all entities
- Shared TypeScript types with InferOutput
- Package exports for validators and types

### Phase 4: Frontend Shell - COMPLETE
- Zalo Mini App layout with BottomNavigation
- tRPC client + React Query integration with superjson
- Router setup with React Router v7
- Component structure with ZMP UI + Tailwind CSS

### Phase 5: Features
- Vehicle CRUD + ODO logging
- Service records + manufacturer recommendations
- Product catalog with search/filter

### Phase 6: AI Worker
- Cloudflare Worker with Hono
- Workers AI vision model integration
- License plate detection API
- Camera UI integration in mini-app

### Phase 7: Deploy
- Dockerfile + docker-compose for backend
- Zalo Mini App deployment configuration
- Cloudflare Worker deployment
- Production environment setup

## Key Technical Decisions

### Monorepo Setup
- **Package Manager**: pnpm (fast, strict, native workspaces support)
- **Task Orchestration**: Turborepo v2 (proper dependsOn chains)
- **Build Pipeline**: Shared package builds first, then dependents
- **Root scripts**: Only delegate to `turbo run` (no filter aliases)

### Frontend Architecture
- **Framework**: Zalo Mini App with ZMP SDK v2
- **UI Library**: zmp-ui v1.11 (Zalo-native components)
- **Styling**: Tailwind CSS v4 (native @theme, no config file needed)
- **State Management**: tRPC + React Query (server state)
- **Routing**: React Router v7

### Backend Architecture
- **Framework**: Hono v4 (fast, edge-compatible)
- **API**: tRPC v11 (end-to-end type safety)
- **Database**: SQLite + Drizzle ORM (lightweight, file-based)
- **Validation**: Valibot v1.2 (tree-shakable, Standard Schema compatible)
- **Deployment**: Docker containerized

### AI Integration
- **Platform**: Cloudflare Workers
- **Model**: llama-3.2-11b-vision-instruct (built-in vision)
- **API**: Workers AI binding
- **Use Case**: License plate OCR for auto-filling vehicle forms

## Current Status

### Completed
- **Phase 1**: Full monorepo scaffolding with pnpm workspaces + Turborepo
- **Phase 2**: Complete backend core with Valibot validation
- **Phase 3**: Shared package with validators and types
- **Phase 4**: Frontend shell with tRPC, React Router, and ZMP UI
- **Dependency upgrade**: All dependencies upgraded to latest stable versions
- GitHub repository created and configured

### Next Up
- Phase 5 (Vehicle CRUD + ODO logging, Service records, Product catalog)

### Known Issues
- `app-config.json` has placeholder appId - needs real Zalo Mini App ID
- No authentication/authorization - all procedures are public
- Search endpoints use exact match (`eq()`) instead of `LIKE`

## Development Commands

```bash
# Build all packages
turbo run build

# Dev all services
turbo run dev

# Dev individual services (use --filter in terminal)
turbo run dev --filter=@motocare/mini-app
turbo run dev --filter=@motocare/server
turbo run dev --filter=@motocare/worker

# Type check all packages
turbo run typecheck

# Lint all packages
turbo run lint
```

### Database
```bash
# Generate migrations
pnpm --filter @motocare/server run db:generate

# Run migrations
pnpm --filter @motocare/server run db:migrate

# Studio (GUI)
pnpm --filter @motocare/server run db:studio
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

## Dependencies & Versions

### Critical Dependencies (as of March 2026)
- `turbo@^2.8.13`
- `typescript@^5.9.3`
- `react@^18.3.1` (pinned to 18 for ZMP compatibility)
- `vite@^6.4.1`
- `zmp-sdk@^2.51.0`
- `zmp-ui@^1.11.12`
- `@trpc/server@^11.11.0`
- `@trpc/client@^11.11.0`
- `hono@^4.12.5`
- `drizzle-orm@^0.45.1`
- `drizzle-kit@^0.31.9`
- `better-sqlite3@^12.6.2`
- `valibot@^1.2.0`
- `tailwindcss@^4.2.1`
- `wrangler@^4.70.0`
- `react-router-dom@^7.13.1`
- `@tanstack/react-query@^5.90.21`
