import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

import schoolRoutes from "./routes/school.route.js";
import classRoutes from "./routes/classes.route.js";
import teacherRoutes from "./routes/teachers.route.js";
import studentRoutes from "./routes/students.route.js";
import subjectsRoutes from "./routes/subjects.route.js";
import timetableRoutes from "./routes/timetable.route.js";
import locationRoutes from "./routes/location.route.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// __dirname setup (কারণ ES Modules এ সরাসরি __dirname পাওয়া যায় না)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== MySQL Connection Pool ==================
let db;
const initDB = async () => {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("✅ MySQL connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  }
};

// Attach db instance to every request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// ================== Static File Serving ==================
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")));
app.use("/uploads", express.static("uploads"));



// ================== Routes ==================
app.use("/api/school", schoolRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/location", locationRoutes);


// ================== Error Handling ==================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ================== Start Server ==================
const PORT = process.env.PORT || 5000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
