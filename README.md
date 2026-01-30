# MATCHE

**Mapped Adventures Through Curated Holiday Experiences**

A full-stack travel tracking and planning platform where travelers can document their journeys, share experiences, and connect with others.

## 🚀 Features Implemented

### ✅ Core Features
- **User Authentication**: Complete Clerk integration with webhook syncing
- **Trip Management**: Full CRUD operations for trips with destinations
- **Dashboard**: Real-time statistics and trip overview
- **Trip Detail Pages**: Comprehensive view with destinations, photos, posts, and comments
- **User Profiles**: Personal profile pages with travel statistics
- **Social Feed**: Activity feed with posts and comments
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

### 🗄️ Database Schema
- Users with profiles and preferences
- Trips with multiple destinations
- Posts and Comments
- Photos linked to trips and posts
- Follow relationships
- Notifications system (schema ready)
- Full visibility controls (Public, Friends Only, Private)

### 🏗️ Tech Stack
- **Frontend**: Next.js 16 (React 19) with TypeScript
- **Backend**: Express.js with tRPC for type-safe API
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Monorepo**: Turborepo + pnpm workspaces
- **Styling**: Tailwind CSS
- **Validation**: Zod schemas

## 📦 Project Structure

```
matche/
├── apps/
│   ├── api/              # Express + tRPC backend (port 3001)
│   ├── web/              # Next.js frontend (port 3000)
│   └── workers/          # Background job workers (scraper)
├── packages/
│   ├── db/               # Prisma schema & client
│   └── shared/           # Shared types & validation
├── docker-compose.yml    # PostgreSQL + Redis
└── SETUP.md             # Detailed setup instructions
```

## 🛠️ Quick Setup

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Docker Desktop (for PostgreSQL)
- Clerk account (https://clerk.com)

### Step-by-Step Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment Variables**
   
   Create `.env` files from the examples:
   ```bash
   # Database
   cp packages/db/.env.example packages/db/.env
   
   # API
   cp apps/api/.env.example apps/api/.env
   
   # Web
   cp apps/web/.env.local.example apps/web/.env.local
   ```

3. **Set Up Clerk**
   - Go to https://clerk.com and create an account
   - Create a new application
   - Copy your keys to `apps/web/.env.local`:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     CLERK_SECRET_KEY=sk_test_...
     ```
   - Set up a webhook:
     - URL: `http://localhost:3001/api/webhooks/user`
     - Events: Check `user.created`
     - Copy the webhook secret to `apps/api/.env`

4. **Start Infrastructure**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d
   
   # Verify containers are running
   docker ps
   ```

5. **Push Database Schema**
   ```bash
   pnpm db:push
   ```

6. **Start Development Servers**
   ```bash
   pnpm dev
   ```
   
   This starts:
   - Web app: http://localhost:3000
   - API: http://localhost:3001

7. **View Database** (Optional)
   ```bash
   pnpm db:studio
   ```
   Opens at http://localhost:5555

## 🎯 Usage

1. **Sign Up**: Go to http://localhost:3000 and click "Sign In" to create an account
2. **Create a Trip**: Click "Plan a New Trip" from the dashboard
3. **Add Destinations**: Add one or more destinations to your trip
4. **Explore**: View your trips, create posts, and interact with the feed

## 📱 Available Pages

- `/` - Landing page
- `/dashboard` - Personal dashboard with stats
- `/trips` - List of all your trips
- `/trips/new` - Create a new trip
- `/trips/[id]` - Trip detail page
- `/feed` - Social activity feed
- `/profile` - Your profile
- `/explore` - Discover page (coming soon)

## 🔧 Available Commands

```bash
pnpm dev          # Start all dev servers
pnpm build        # Build all packages
pnpm db:push      # Push database schema changes
pnpm db:studio    # Open Prisma Studio
pnpm clean        # Remove all node_modules
pnpm kill         # Kill processes on ports 3000, 3001, 5555
```

## 🚧 Coming Soon

- Photo upload with cloud storage
- Map integration for destinations
- Enhanced social features (likes, shares)
- Travel planning tools (itinerary builder, packing lists)
- Discovery/explore page with public trips
- Mobile responsiveness improvements
- Push notifications

## 📝 API Documentation

The API uses tRPC for type-safe endpoints. Main routers:

- `trip.*` - Trip CRUD operations
- `user.*` - User profile management
- `social.*` - Posts, comments, follow/unfollow

All API calls are automatically typed on the frontend.

## 🐛 Troubleshooting

**Database connection issues:**
```bash
docker ps                    # Check if PostgreSQL is running
docker logs matche-db        # View database logs
```

**Port conflicts:**
```bash
pnpm kill                    # Kill processes on 3000, 3001, 5555
```

**tRPC errors:**
- Ensure API is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify Clerk authentication is working

## 📄 License

ISC

---

Built with ❤️ for travelers by travelers
