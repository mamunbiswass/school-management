import express from "express";
import db from "../db.js"; // তোমার MySQL connection pool

const router = express.Router();

/**
 * ===========================
 * GET All Classes
 * ===========================
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM classes ORDER BY name, section");
    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch classes error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * ===========================
 * Add New Class / Section
 * ===========================
 */
router.post("/", async (req, res) => {
  try {
    const { name, section, teacher } = req.body;

    if (!name || !section) {
      return res.status(400).json({ error: "Class name & section required" });
    }

    // Duplicate check
    const [existing] = await db.query(
      "SELECT * FROM classes WHERE name=? AND section=?",
      [name, section]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Class with this section already exists!" });
    }

    const [result] = await db.query(
      "INSERT INTO classes (name, section, teacher) VALUES (?, ?, ?)",
      [name, section, teacher || null]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      section,
      teacher,
    });
  } catch (err) {
    console.error("❌ Add class error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * ===========================
 * Update Class / Section
 * ===========================
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, section, teacher } = req.body;

    const [result] = await db.query(
      "UPDATE classes SET name=?, section=?, teacher=? WHERE id=?",
      [name, section, teacher || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json({ message: "✅ Class updated successfully" });
  } catch (err) {
    console.error("❌ Update class error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * ===========================
 * Delete Class / Section
 * ===========================
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM classes WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json({ message: "✅ Class deleted successfully" });
  } catch (err) {
    console.error("❌ Delete class error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
