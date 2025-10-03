import express from "express";
import db from "../db.js"; // MySQL connection pool

const router = express.Router();

/**
 * ===========================
 * GET Timetable by Class & Section
 * ===========================
 */
router.get("/:className/:section", async (req, res) => {
  try {
    const { className, section } = req.params;

    const [rows] = await db.query(
      `SELECT t.id, t.className, t.section, t.day, t.startTime, t.endTime,
              s.name AS subjectName, tr.name AS teacherName,
              t.subjectId, t.teacherId
       FROM timetable t
       LEFT JOIN subjects s ON t.subjectId = s.id
       LEFT JOIN teachers tr ON t.teacherId = tr.id
       WHERE t.className=? AND t.section=?
       ORDER BY FIELD(t.day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
                t.startTime`,
      [className, section]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No timetable found" });
    }

    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch timetable error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * ===========================
 * ADD Timetable Period
 * ===========================
 */
router.post("/", async (req, res) => {
  try {
    const { className, section, day, startTime, endTime, subjectId, teacherId } = req.body;

    if (!className || !section || !day || !startTime || !endTime) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [result] = await db.query(
      `INSERT INTO timetable (className, section, day, startTime, endTime, subjectId, teacherId)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [className, section, day, startTime, endTime, subjectId || null, teacherId || null]
    );

    res.status(201).json({ id: result.insertId, message: "✅ Period added successfully" });
  } catch (err) {
    console.error("❌ Add timetable error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * ===========================
 * UPDATE Timetable Period
 * ===========================
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { day, startTime, endTime, subjectId, teacherId } = req.body;

    const [result] = await db.query(
      `UPDATE timetable 
       SET day=?, startTime=?, endTime=?, subjectId=?, teacherId=?, updatedAt=CURRENT_TIMESTAMP
       WHERE id=?`,
      [day, startTime, endTime, subjectId || null, teacherId || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Period not found" });
    }

    res.json({ message: "✅ Period updated successfully" });
  } catch (err) {
    console.error("❌ Update timetable error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * ===========================
 * DELETE Timetable Period
 * ===========================
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM timetable WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Period not found" });
    }

    res.json({ message: "🗑 Period deleted successfully" });
  } catch (err) {
    console.error("❌ Delete timetable error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
