import "reflect-metadata";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import "dotenv/config"; // Dung cho ES module
// import dotenv from "dotenv"; // Nhận xét: Dùng cho commonjs
// dotenv.config();
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.router.js";
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

app.use(requestMiddleware); // Add some properties to req object
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
// Bắt buộc đặt sau app.use
app.use(errorMiddleware); // Catch app errors and return a custom response

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Init database and seeds
import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "..", "database.sqlite");
const SQL_INIT_FILE = path.join(__dirname, "config", "init.sql");
const dbExists = fs.existsSync(DB_PATH);

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    return console.error('[DB] Lỗi kết nối:', err.message);
  }
  console.log('[DB] Đã kết nối tới SQLite (ESM).');
  if(!dbExists) {
    console.log('[DB] Phát hiện lần chạy đầu tiên. Đang khởi tạo database...');
    initializeDatabase();
  }
});

function initializeDatabase() {
  try {
    const sql = fs.readFileSync(SQL_INIT_FILE, 'utf8');
    db.exec(sql, (err) => {
      if (err) {
        console.error("[DB]Lỗi khi thực thi SQL:", err.message);
      } else {
        console.log("[DB] Khởi tạo database thành công.");
      }
    });
  } catch (error) {
    console.error("[DB]Không thể đọc file SQL:", error);
  }
}

// Run app server
const PORT = process.env.PORT || 3000;
import { AppDataSource } from "./config/data-source.js";

AppDataSource.initialize().then(() => {
  console.log("[DB] Data Source has been initialized!");

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("[DB] Error during Data Source initialization:", err);
});