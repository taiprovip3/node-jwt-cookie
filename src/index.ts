import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import authRoutes from "./routes/auth.routes";
import { AppDataSource } from "./config/data-source";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = 3000;

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

AppDataSource.initialize().then(() => {
  console.log("📦 Data Source has been initialized!");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Error during Data Source initialization:", err);
});