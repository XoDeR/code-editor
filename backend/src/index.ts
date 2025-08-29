import express from "express"
import type { Application } from "express";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors"
import dotenv from "dotenv"
import codeRoutes from "./routes/codeRoutes"
import authCodeRoutes from "./routes/authCodeRoutes"

dotenv.config();

const app: Application = express()
const port = process.env.PORT || 5000;

app.use(cors({ exposedHeaders: ["Content-Disposition"] }))
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api", codeRoutes);
app.use("/api/codes", authCodeRoutes);

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
});

