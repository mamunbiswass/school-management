import express from "express";
import db from "../db.js";

const router = express.Router();

// ===================== GET all teachers =====================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM teachers ORDER BY name ASC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch teachers error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ===================== ADD Teacher =====================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      dob,
      gender,
      aadhaar,
      phone,
      altPhone,
      email,
      address,
      employeeId,
      subject,
      qualification,
      designation,
      department,
      joiningDate,
      salary,
      classAssignment,
      experience,
      healthInfo,
      emergencyContact,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Teacher name is required" });
    }

    const [result] = await db.query(
      `INSERT INTO teachers 
      (name, dob, gender, aadhaar, phone, altPhone, email, address, employeeId, subject, qualification, designation, department, joiningDate, salary, classAssignment, experience, healthInfo, emergencyContact) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        dob || null,
        gender || null,
        aadhaar || null,
        phone || null,
        altPhone || null,
        email || null,
        address || null,
        employeeId || null,
        subject || null,
        qualification || null,
        designation || null,
        department || null,
        joiningDate || null,
        salary || null,
        classAssignment || null,
        experience || null,
        healthInfo || null,
        emergencyContact || null,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      ...req.body,
    });
  } catch (err) {
    console.error("❌ Add teacher error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ===================== UPDATE Teacher =====================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE teachers SET ? WHERE id=?`,
      [req.body, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({ message: "✅ Teacher updated successfully" });
  } catch (err) {
    console.error("❌ Update teacher error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ===================== DELETE Teacher =====================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM teachers WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({ message: "✅ Teacher deleted successfully" });
  } catch (err) {
    console.error("❌ Delete teacher error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
