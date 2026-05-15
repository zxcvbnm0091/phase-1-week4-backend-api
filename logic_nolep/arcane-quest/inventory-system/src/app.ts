import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);

export default app;
