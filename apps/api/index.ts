import express from "express";
import { prisma } from "@matche/db"; // Importing from your local package
import { CreateTripSchema } from "@matche/shared"; 

const app = express();
app.use(express.json());

app.post("/trips", async (req, res) => {
  // 1. Validate input using shared schema
  const parse = CreateTripSchema.safeParse(req.body);
  
  if (!parse.success) {
    return res.status(400).json(parse.error);
  }

  // 2. Write to DB using shared Prisma client
  const trip = await prisma.trip.create({
    data: {
      ...parse.data,
      plannerId: "user-id-from-auth-middleware"
    }
  });

  res.json(trip);
});

app.listen(3001, () => {
  console.log("API running on 3001");
});