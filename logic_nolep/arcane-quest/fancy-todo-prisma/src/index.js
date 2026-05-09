import app from "./app.js";
import { connectDB, disconnectDB } from "./lib/prisma.js";

connectDB();
const PORT = process.env.PORT;

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
