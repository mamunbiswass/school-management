import express from "express";
import db from "../db.js"; // ✅ mysql2/promise connection pool
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ================== Multer Setup ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/students";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ================== Routes ==================

// ✅ Get all students
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch students error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get single student by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: "Student not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create new student (Admission)
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.photo = "/uploads/students/" + req.file.filename;
    }

    const sql = `
      INSERT INTO students 
      (uid, admissionNo, name, gender, dob, address,
       className, section, roll, admissionDate,
       father, mother, fatherOccupation, motherOccupation,
       phone, email, guardian, guardianRelation, guardianPhone,
       bloodGroup, emergencyContact, healthInfo,
       caste, religion, nationality, motherTongue, hobbies, photo)
      VALUES (?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?,
              ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?,
              ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.uid,
      data.admissionNo,
      data.name,
      data.gender,
      data.dob,
      data.address,
      data.className,
      data.section,
      data.roll,
      data.admissionDate,
      data.father,
      data.mother,
      data.fatherOccupation,
      data.motherOccupation,
      data.phone,
      data.email,
      data.guardian,
      data.guardianRelation,
      data.guardianPhone,
      data.bloodGroup,
      data.emergencyContact,
      data.healthInfo,
      data.caste,
      data.religion,
      data.nationality,
      data.motherTongue,
      data.hobbies,
      data.photo || null,
    ];

    await db.query(sql, values);

    res.json({ success: true, message: "✅ Student admitted successfully" });
  } catch (err) {
    console.error("❌ Admission error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Check Aadhaar duplication
router.get("/check/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const [rows] = await db.query("SELECT id FROM students WHERE uid = ?", [uid]);

    if (rows.length > 0) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (err) {
    console.error("❌ Aadhaar check error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Update student
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    // যদি photo update করে
    if (req.file) {
      data.photo = "/uploads/students/" + req.file.filename;
    }

    // Build update query dynamically
    const fields = Object.keys(data);
    const values = Object.values(data);

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    const updates = fields.map((f) => `${f} = ?`).join(", ");
    const sql = `UPDATE students SET ${updates} WHERE id = ?`;

    await db.query(sql, [...values, id]);

    res.json({ success: true, message: "Student updated successfully" });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete student
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Delete photo if exists
    const [rows] = await db.query("SELECT photo FROM students WHERE id = ?", [id]);
    if (rows.length > 0 && rows[0].photo) {
      const photoPath = path.join(process.cwd(), rows[0].photo);
      if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
    }

    await db.query("DELETE FROM students WHERE id = ?", [id]);
    res.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
