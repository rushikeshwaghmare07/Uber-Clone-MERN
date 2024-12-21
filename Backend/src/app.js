import express from "express";
import cors from "cors";
import userRoute from "./routes/user.routes.js"

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
)

// common middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/users", userRoute);

export { app };