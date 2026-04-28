import "dotenv/config";
import express, { json } from "express";
import { connectDB, disconnectDB } from "./lib/prisma.js";
import authRoutes from "./routes/authRoutes.js";

connectDB();
const app = express();
const PORT = process.env.PORT;

app.use(json());

app.get("/", (req, res) => {
  res.send("Fancy Todo API");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running in port: ", PORT);
});

// ERROR HANDLING
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception", err);
  await disconnectDB();
  process.exit(1);
});
process.on("unhandledRejection", async (err) => {
  console.error("Unhandled Rejection", err);
  await disconnectDB();
  process.exit(1);
});
process.on("SIGTERM", async (err) => {
  console.error("SIGTERM receive, shutting down gracefully", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});
