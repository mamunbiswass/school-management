import express from "express";
import db from "../db.js"; 
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ========= Multer Config =========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ========= Routes =========

// GET school info (ধরা হচ্ছে সবসময় প্রথম row ব্যবহার হবে)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM school LIMIT 1");
    if (rows.length === 0) return res.status(404).json({ error: "No school found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ GET school error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE school info (with logo upload)
router.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, email, principal } = req.body;
    let logoPath = null;

    if (req.file) {
      logoPath = `uploads/${req.file.filename}`;
    }

    const query = logoPath
      ? "UPDATE school SET name=?, address=?, phone=?, email=?, principal=?, logo=? WHERE id=?"
      : "UPDATE school SET name=?, address=?, phone=?, email=?, principal=? WHERE id=?";

    const values = logoPath
      ? [name, address, phone, email, principal, logoPath, id]
      : [name, address, phone, email, principal, id];

    await db.query(query, values);

    res.json({ message: "✅ School info updated!" });
  } catch (err) {
    console.error("❌ UPDATE school error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
