import "dotenv/config";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

let server;

connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`🟢 Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("🔴 Failed to connect to database:", err);
    process.exit(1);
  });

// ERROR HANDLING
process.on("uncaughtException", async (err) => {
  console.error("💥 Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

process.on("unhandledRejection", async (err) => {
  console.error("💥 Unhandled Rejection:", err);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("⚠️ SIGTERM received, shutting down gracefully...");
  if (server) {
    server.close(async () => {
      await disconnectDB();
      console.log("🛑 Process terminated!");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
