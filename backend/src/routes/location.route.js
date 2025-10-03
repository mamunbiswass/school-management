import express from "express";
import db from "../db.js"; 
const router = express.Router();

// Get all districts
router.get("/districts", async (req, res) => {
  const [rows] = await db.query("SELECT DISTINCT district FROM locations ORDER BY district");
  res.json(rows.map(r => r.district));
});

// Get blocks by district
router.get("/blocks", async (req, res) => {
  const { district } = req.query;
  const [rows] = await db.query(
    "SELECT DISTINCT block FROM locations WHERE district = ? ORDER BY block",
    [district]
  );
  res.json(rows.map(r => r.block));
});

// Get villages by block
router.get("/villages", async (req, res) => {
  const { district, block } = req.query;
  const [rows] = await db.query(
    "SELECT village FROM locations WHERE district = ? AND block = ? ORDER BY village",
    [district, block]
  );
  res.json(rows.map(r => r.village));
});

export default router;
