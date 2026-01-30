# Matche Setup Guide

## Prerequisites
- Node.js 20+
- pnpm installed (`npm install -g pnpm`)
- Docker Desktop (for PostgreSQL and Redis)

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Environment Variables

Copy the example env files and fill in your values:

```bash
# Database
cp packages/db/.env.example packages/db/.env

# API
cp apps/api/.env.example apps/api/.env

# Web App
cp apps/web/.env.local.example apps/web/.env.local
```

### 3. Start Infrastructure (Database & Redis)
```bash
pnpm predev
# Or manually: docker-compose up -d
```

### 4. Push Database Schema
```bash
pnpm db:push
```

### 5. Start Development Servers
```bash
pnpm dev
```

This will start:
- Web app: http://localhost:3000
- API: http://localhost:3001
- (API and Web run in parallel)

### 6. View Database (Optional)
```bash
pnpm db:studio
```
Opens Prisma Studio at http://localhost:5555

## Clerk Setup

1. Create a Clerk account at https://clerk.com
2. Create a new application
3. Copy the publishable key and secret key to `apps/web/.env.local`
4. Set up a webhook endpoint:
   - URL: `http://localhost:3001/api/webhooks/user`
   - Events: `user.created`
   - Copy the webhook secret to `apps/api/.env`

## Project Structure

```
matche/
├── apps/
│   ├── api/          # Express + tRPC backend
│   ├── web/          # Next.js frontend
│   └── workers/      # Background job workers (scraper)
├── packages/
│   ├── db/           # Prisma schema & client
│   └── shared/       # Shared types & validation
├── infra/            # Infrastructure configs
└── docker-compose.yml
```

## Available Commands

- `pnpm dev` - Start all dev servers
- `pnpm build` - Build all packages
- `pnpm db:push` - Push database schema changes
- `pnpm db:studio` - Open Prisma Studio
- `pnpm clean` - Remove all node_modules
- `pnpm kill` - Kill processes on ports 3000, 3001, 5555

## Features Implemented

✅ User authentication with Clerk
✅ Trip CRUD operations
✅ Dashboard with trip statistics
✅ Trip creation form with destinations
✅ Trip detail page
✅ User profile page
✅ Database schema with full relationships

## Next Steps

🚧 Photo upload functionality
🚧 Social features (follow, comments, feed)
🚧 Map integration for destinations
🚧 Travel planning tools
🚧 Discovery/explore page

## Troubleshooting

### Database connection issues
- Make sure Docker is running: `docker ps`
- Check if PostgreSQL is up: `docker logs matche-db`

### Port conflicts
- Run `pnpm kill` to kill processes on occupied ports
- Or manually: `npx kill-port 3000 3001 5555`

### tRPC errors
- Make sure the API is running on port 3001
- Check NEXT_PUBLIC_API_URL in `apps/web/.env.local`
- Verify Clerk user ID is being passed in headers
