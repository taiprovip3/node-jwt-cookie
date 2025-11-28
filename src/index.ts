import "reflect-metadata";
import cookieParser from "cookie-parser";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import "dotenv/config"; // Dung cho ES module
// import dotenv from "dotenv"; // Nhận xét: Dùng cho commonjs
// dotenv.config();
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { AppDataSource } from "./config/data-source.js";
import { requestMiddleware } from "./middleware/request.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use((req: Request, res: Response, next: NextFunction) => {
  console.info(`🗣 ➜  ${req.method} ${req.path}`);
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(requestMiddleware); // Add some properties to req object
app.use(errorMiddleware); // Catch app errors and return a custom response
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;

AppDataSource.initialize().then(() => {
  console.log("📦 Data Source has been initialized!");
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Error during Data Source initialization:", err);
});