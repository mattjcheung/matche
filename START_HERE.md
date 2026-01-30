# 🚀 START HERE - Complete Setup Guide

Welcome! I've built out a comprehensive full-stack travel platform for you. Here's how to get it running on localhost.

## ⚡ Quick Start (5 Minutes)

### 1. Install Dependencies

Open PowerShell in the project root and run:

```powershell
pnpm install
```

If you don't have pnpm:
```powershell
npm install -g pnpm
pnpm install
```

### 2. Start Docker (Database)

Make sure Docker Desktop is running, then:

```powershell
docker-compose up -d
```

Verify it's running:
```powershell
docker ps
```

You should see `matche-db` and `matche-redis` containers.

### 3. Set Up Clerk Authentication

**Important**: You need a Clerk account for authentication.

1. Go to https://clerk.com and sign up (free)
2. Create a new application
3. Copy your keys from the Clerk dashboard

### 4. Configure Environment Variables

**Database** (`packages/db/.env`):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/matche_dev"
```

**API** (`apps/api/.env`):
```env
PORT=3001
DATABASE_URL="postgresql://postgres:password@localhost:5432/matche_dev"
CLERK_WEBHOOK_SECRET=your_webhook_secret_from_clerk
FRONTEND_URL=http://localhost:3000
```

**Web** (`apps/web/.env.local`):
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_API_URL=http://localhost:3001/trpc
```

### 5. Set Up Clerk Webhook

In your Clerk dashboard:
1. Go to "Webhooks" in the left sidebar
2. Click "Add Endpoint"
3. URL: `http://localhost:3001/api/webhooks/user`
4. Subscribe to events: Check `user.created`
5. Copy the "Signing Secret" to your `apps/api/.env` as `CLERK_WEBHOOK_SECRET`

**Note**: For local development, you may need to use a tool like ngrok to expose your local API, or you can set this up after deployment.

### 6. Push Database Schema

```powershell
pnpm db:push
```

This creates all the tables in your PostgreSQL database.

### 7. Start Development Servers

```powershell
pnpm dev
```

This starts both:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🎉 You're Ready!

Open http://localhost:3000 in your browser and:
1. Click "Sign In" to create an account with Clerk
2. You'll be redirected to the dashboard
3. Click "Plan a New Trip" to create your first trip

## 🔍 What's Been Built

### Pages You Can Test
- **Dashboard** (`/dashboard`) - See your trip statistics
- **My Trips** (`/trips`) - List all your trips with filters
- **Create Trip** (`/trips/new`) - Beautiful form with destination management
- **Trip Detail** (`/trips/[id]`) - Full trip view with destinations, stats, comments
- **Feed** (`/feed`) - Social feed with posts and comments
- **Profile** (`/profile`) - Your user profile with stats

### Features Implemented
✅ Full authentication with Clerk
✅ Trip CRUD (Create, Read, Update, Delete)
✅ Multiple destinations per trip
✅ Trip status management (Planned, Ongoing, Completed)
✅ Visibility controls (Public, Friends Only, Private)
✅ Social feed with posts
✅ Comments on posts and trips
✅ User profiles with statistics
✅ Beautiful, responsive UI

### Database Schema
- **Users** - Profile, bio, avatar
- **Trips** - Title, description, dates, status, visibility
- **Destinations** - Name, city, country, coordinates
- **TripDestinations** - Link trips to destinations with order
- **Posts** - Content, visibility, linked to trips
- **Comments** - On posts and trips
- **Photos** - Linked to trips and posts (schema ready)
- **Follow** - User follow relationships
- **Notifications** - Alert system (schema ready)

## 🛠️ Useful Commands

```powershell
# View database in browser
pnpm db:studio

# Stop Docker containers
docker-compose down

# Kill processes if ports are occupied
pnpm kill

# Rebuild everything
pnpm clean
pnpm install
pnpm db:push
pnpm dev
```

## 🐛 Common Issues

### "Cannot connect to database"
- Make sure Docker Desktop is running
- Run `docker ps` to verify containers are up
- Check the DATABASE_URL in your .env files

### "Clerk authentication not working"
- Verify your Clerk keys in `apps/web/.env.local`
- Make sure you're using the keys from the correct Clerk application
- Clear your browser cookies and try again

### "Port 3000/3001 already in use"
- Run `pnpm kill` to kill processes on those ports
- Or manually: `npx kill-port 3000 3001`

### "tRPC errors in browser console"
- Ensure the API is running on port 3001
- Check the browser Network tab for failed requests
- Verify `NEXT_PUBLIC_API_URL` is set correctly

### Webhook not syncing users
For local development, webhooks from Clerk won't work without exposing your local API. Two options:
1. **Use ngrok**: `ngrok http 3001` and use that URL in Clerk
2. **Skip webhook**: Users will still authenticate via Clerk, but won't be saved to your DB until you deploy

## 📁 Project Structure

```
matche/
├── apps/
│   ├── api/                      # Backend (Express + tRPC)
│   │   ├── src/
│   │   │   ├── trpc/
│   │   │   │   ├── routers/
│   │   │   │   │   ├── trip.ts     # Trip endpoints
│   │   │   │   │   ├── user.ts     # User endpoints
│   │   │   │   │   ├── social.ts   # Social features
│   │   │   │   │   └── _app.ts     # Main router
│   │   │   │   └── trpc.ts         # tRPC setup
│   │   │   └── index.ts             # Express server
│   │   └── package.json
│   │
│   └── web/                      # Frontend (Next.js)
│       ├── app/
│       │   ├── dashboard/        # Dashboard page
│       │   ├── trips/            # Trip pages
│       │   ├── feed/             # Social feed
│       │   ├── profile/          # User profile
│       │   ├── explore/          # Discovery (coming soon)
│       │   ├── layout.tsx        # Root layout
│       │   └── page.tsx          # Landing page
│       ├── components/
│       │   └── providers/
│       │       └── TRPCProvider.tsx
│       ├── lib/
│       │   └── trpc.ts           # tRPC client setup
│       └── package.json
│
├── packages/
│   ├── db/                       # Database package
│   │   ├── prisma/
│   │   │   └── schema.prisma     # Database schema
│   │   └── src/
│   │       └── index.ts          # Prisma client export
│   │
│   └── shared/                   # Shared code
│       └── src/
│           └── types.ts          # Zod validation schemas
│
├── docker-compose.yml            # PostgreSQL + Redis
├── turbo.json                    # Turborepo config
├── pnpm-workspace.yaml           # pnpm workspace config
└── README.md                     # Full documentation
```

## 🎯 Next Steps After Testing

Once everything is working locally, you might want to:

1. **Add Photo Upload**
   - Integrate with Cloudflare R2, AWS S3, or UploadThing
   - Update the Photo model usage in trip and post forms

2. **Map Integration**
   - Add Google Maps or Mapbox
   - Show destinations on a map in trip detail page

3. **Enhanced Social Features**
   - Implement the follow/unfollow UI
   - Add likes to posts
   - Build out the explore page

4. **Deploy**
   - Deploy database to a hosted PostgreSQL (Railway, Supabase, etc.)
   - Deploy API to a server or serverless platform
   - Deploy frontend to Vercel or similar
   - Update Clerk webhook to production URL

## 📞 Need Help?

If you run into issues:
1. Check the console logs in your terminal
2. Check the browser console for errors
3. Verify all environment variables are set
4. Make sure Docker containers are running
5. Try `pnpm clean && pnpm install` and start fresh

## 🎨 Customization

The UI is built with Tailwind CSS. You can customize:
- Colors in `apps/web/app/globals.css`
- Components in `apps/web/app/**/page.tsx`
- Add new routes by creating folders in `apps/web/app/`

---

Happy coding! 🚀 Start by running `pnpm install` then `docker-compose up -d` then `pnpm db:push` then `pnpm dev`
