# 🚀 Quick Command Reference

Copy and paste these commands to get started quickly!

## First Time Setup (Run Once)

```powershell
# 1. Install dependencies
pnpm install

# 2. Start Docker (PostgreSQL + Redis)
docker-compose up -d

# 3. Create .env files (then edit them with your Clerk keys)
Copy-Item packages/db/.env.example packages/db/.env
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.local.example apps/web/.env.local

# 4. Push database schema
pnpm db:push

# 5. Start development servers
pnpm dev
```

## Daily Development Commands

```powershell
# Start everything (database + dev servers)
docker-compose up -d
pnpm dev

# Stop everything
# Press Ctrl+C in the terminal running pnpm dev
docker-compose down
```

## Useful Commands

```powershell
# View database in browser (http://localhost:5555)
pnpm db:studio

# Check if Docker is running
docker ps

# View Docker logs
docker logs matche-db
docker logs matche-redis

# Kill processes on specific ports
pnpm kill
# or
npx kill-port 3000 3001 5555

# Restart everything fresh
docker-compose down
docker-compose up -d
pnpm db:push
pnpm dev

# Clean install (if you have issues)
pnpm clean
pnpm install
pnpm db:push
pnpm dev
```

## Environment Variables Quick Reference

### `packages/db/.env`
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/matche_dev"
```

### `apps/api/.env`
```env
PORT=3001
DATABASE_URL="postgresql://postgres:password@localhost:5432/matche_dev"
CLERK_WEBHOOK_SECRET=whsec_your_key_from_clerk
FRONTEND_URL=http://localhost:3000
```

### `apps/web/.env.local`
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_from_clerk
CLERK_SECRET_KEY=sk_test_your_key_from_clerk
NEXT_PUBLIC_API_URL=http://localhost:3001/trpc
```

## Clerk Setup Checklist

1. ✅ Go to https://clerk.com
2. ✅ Create account / Sign in
3. ✅ Create new application
4. ✅ Copy "Publishable key" to `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
5. ✅ Copy "Secret key" to `CLERK_SECRET_KEY`
6. ✅ Go to "Webhooks" → "Add Endpoint"
7. ✅ URL: `http://localhost:3001/api/webhooks/user`
8. ✅ Events: Check `user.created`
9. ✅ Copy "Signing Secret" to `CLERK_WEBHOOK_SECRET`

## URLs Quick Reference

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001 |
| Prisma Studio | http://localhost:5555 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

## Testing Checklist

Once running, test these flows:

1. ✅ Go to http://localhost:3000
2. ✅ Click "Sign In" and create account
3. ✅ View Dashboard - should show 0 trips
4. ✅ Click "Plan a New Trip"
5. ✅ Fill in trip details and add a destination
6. ✅ Click "Create Trip"
7. ✅ View trip detail page
8. ✅ Navigate to "My Trips" - should see your trip
9. ✅ Navigate to "Feed" - should be empty initially
10. ✅ Navigate to "Profile" - should show your info

## Troubleshooting Commands

```powershell
# If database won't connect
docker ps  # Check if containers are running
docker restart matche-db

# If ports are in use
pnpm kill
# or find and kill manually
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# If Prisma has issues
cd packages/db
pnpm prisma generate
pnpm prisma db push

# If dependencies are messed up
pnpm clean
pnpm install

# If Docker won't start
# Restart Docker Desktop application

# Check logs for errors
# Terminal 1: Watch API logs (where you ran pnpm dev)
# Terminal 2: docker logs -f matche-db
```

## Git Commands (if needed)

```powershell
# See what changed
git status

# See specific changes
git diff

# Stage all changes
git add .

# Commit changes
git commit -m "feat: implement trip management and social features"

# Push to remote
git push
```

## Quick File Navigation

Key files to know:

```
📁 Database Schema
└─ packages/db/prisma/schema.prisma

📁 API Routes
├─ apps/api/src/trpc/routers/trip.ts
├─ apps/api/src/trpc/routers/user.ts
└─ apps/api/src/trpc/routers/social.ts

📁 Frontend Pages
├─ apps/web/app/dashboard/page.tsx
├─ apps/web/app/trips/page.tsx
├─ apps/web/app/trips/new/page.tsx
├─ apps/web/app/trips/[id]/page.tsx
├─ apps/web/app/feed/page.tsx
└─ apps/web/app/profile/page.tsx

📁 Shared Types
└─ packages/shared/src/types.ts
```

## Need Help?

1. Read `START_HERE.md` for detailed setup
2. Read `README.md` for full documentation
3. Read `CHANGES_SUMMARY.md` to see what was built
4. Check terminal logs for errors
5. Check browser console (F12) for frontend errors

---

**Most Common First-Time Flow:**

```powershell
pnpm install
docker-compose up -d
# Edit .env files with your Clerk keys
pnpm db:push
pnpm dev
# Open http://localhost:3000 in browser
```
