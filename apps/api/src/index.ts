import express from 'express';
import cors from 'cors';
import { Webhook } from 'svix';
import { prisma } from '@matche/db';
import 'dotenv/config'; // Ensures .env is loaded immediately
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from './trpc/trpc';
import { appRouter } from './trpc/routers/_app';

const app = express();

// --- CORS ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// --- 1. GLOBAL LOGGER (The "Detective") ---
// This will print every request to your terminal so you can see why it's 404ing
app.use((req, res, next) => {
  console.log(`📡 Incoming: ${req.method} ${req.url}`);
  next();
});

// --- 2. THE WEBHOOK ROUTE (Must be BEFORE express.json) ---
app.post('/api/webhooks/user', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log("🪝 Webhook route hit!");
  const payload = req.body.toString();
  const headers = req.headers;

  const svix_id = headers["svix-id"] as string;
  const svix_timestamp = headers["svix-timestamp"] as string;
  const svix_signature = headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing Svix headers");
    return res.status(400).json({ error: 'Missing svix headers' });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
    console.log("✅ Webhook verified!");
  } catch (err) {
    console.error("❌ Verification failed:", err instanceof Error ? err.message : String(err));
    return res.status(400).json({ error: 'Webhook verification failed' });
  }

if (evt.type === 'user.created') {
    const { id, email_addresses, username, first_name, last_name } = evt.data;
    
    // Safely grab the first email address if it exists
    const primaryEmail = email_addresses && email_addresses.length > 0 
      ? email_addresses[0].email_address 
      : `no-email-${id}@example.com`;

    try {
      await prisma.user.create({
        data: {
          id: id,
          email: primaryEmail,
          username: username || `${first_name}${last_name}` || `user_${id.slice(-5)}`,
        }
      });
      console.log(`🎉 User ${id} saved to DB!`);
    } catch (dbErr: any) {
      // If the user already exists (from a previous test), it will throw a P2002 error
      if (dbErr.code === 'P2002') {
        console.log(`ℹ️ User ${id} already exists in database, skipping create.`);
      } else {
        console.error("❌ Database error:", dbErr.message);
      }
    }
  }

  return res.status(200).json({ received: true });
});

// --- 3. STANDARD MIDDLEWARE (For everything else) ---
app.use(express.json());

// --- 4. TRPC ROUTES ---
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// --- 5. OTHER ROUTES ---
app.get('/debug', (req, res) => {
  res.send("If you see this, the API is reachable!");
});

// --- 6. 404 HANDLER ---
app.use((req, res) => {
  console.log(`🚫 404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).send(`Route ${req.url} not found on this server.`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API Brain listening on port ${PORT}`);
});