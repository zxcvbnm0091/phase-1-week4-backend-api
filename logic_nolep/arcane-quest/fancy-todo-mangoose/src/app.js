import express from "express";
import cookieParser from "cookie-parser";
import allRoutes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", allRoutes);

export default app;
