import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// 📁 Create upload directory if not exists
const uploadDir = path.join(process.cwd(), "src", "uploads", "students");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// 🖼️ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

// 🎯 Generate Admission Number
function generateAdmissionNo(schoolName, className, section, roll) {
  const initials = schoolName
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const year = new Date().getFullYear();
  return `${initials}${year}${className}${section}${roll || ""}`;
}

// 🧾 Add new student
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const body = req.body;
    const photoPath = req.file ? `/uploads/students/${req.file.filename}` : null;

    const admissionNo = generateAdmissionNo(
      "Elite Knowledge School",
      body.className,
      body.section,
      body.roll
    );

    const [result] = await db.query(
      `INSERT INTO students
        (admissionNo, uid, name, gender, dob, address, className, section, roll,
         father, mother, phone, email, bloodGroup, emergencyContact,
         healthInfo, caste, religion, motherTongue, hobbies, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        admissionNo,
        body.uid,
        body.name,
        body.gender,
        body.dob,
        body.address,
        body.className,
        body.section,
        body.roll || null,
        body.father,
        body.mother,
        body.phone,
        body.email,
        body.bloodGroup,
        body.emergencyContact,
        body.healthInfo,
        body.caste,
        body.religion,
        body.motherTongue,
        body.hobbies,
        photoPath,
      ]
    );

    res.json({
      success: true,
      message: "✅ Student admitted successfully!",
      admissionNo,
      id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Insert student error:", err);
    res.status(500).json({ error: "Database insert failed", details: err });
  }
});

// 📄 Fetch all students
router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch students error:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// 📄 Get single student by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Student not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

export default router;
