import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all subjects
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, code, className, section, teacher, createdAt FROM subjects ORDER BY className, section, name"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ GET /subjects error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add subject
router.post("/", async (req, res) => {
  try {
    const { name, code, className, section, teacher } = req.body;
    const [result] = await db.query(
      "INSERT INTO subjects (name, code, className, section, teacher) VALUES (?, ?, ?, ?, ?)",
      [name, code, className, section, teacher || null]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      code,
      className,
      section,
      teacher,
    });
  } catch (err) {
    console.error("❌ POST /subjects error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update subject
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, className, section, teacher } = req.body;
    const [result] = await db.query(
      "UPDATE subjects SET name=?, code=?, className=?, section=?, teacher=? WHERE id=?",
      [name, code, className, section, teacher || null, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Subject not found" });
    res.json({ message: "✅ Subject updated successfully" });
  } catch (err) {
    console.error("❌ PUT /subjects error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete subject
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM subjects WHERE id=?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Subject not found" });
    res.json({ message: "✅ Subject deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE /subjects error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
