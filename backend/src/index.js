import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";  

import { clerkMiddleware } from "@clerk/express";

import { connectDB } from "./lib/db.js";
import clerkWebhook from "./webhooks/clerk.webhook.js";
import authRoutes from "./routes/auth.route.js" 
// import job from "./lib/cron.js"; // Agar cron job hai to import karo

const app = express();


const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(), "public");

// Clerk webhook (must be before express.json())
app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook
);

app.use(clerkMiddleware());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth",authRoutes)

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);

  // if (process.env.NODE_ENV === "production") {
  //   job.start();
  // }
});