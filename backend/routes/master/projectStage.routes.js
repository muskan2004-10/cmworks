const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

/* ===============================
   GET ALL PROJECT STAGES
================================ */
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
        PRJ_STAGE_HDRID,
        PRJ_STAGE
      FROM prj_stage_hdr
      ORDER BY PRJ_STAGE
    `);

    res.json(result.recordset);

  } catch (err) {
    console.error("Fetch Stage Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {

    const pool = getPool();
    const { stage } = req.body;

    // Generate new ID
    const result = await pool.request().query(`
      SELECT ISNULL(MAX(PRJ_STAGE_HDRID),0) + 1 AS NEWID
      FROM prj_stage_hdr
    `);

    const newId = result.recordset[0].NEWID;

    await pool.request()
      .input("PRJ_STAGE_HDRID", sql.BigInt, newId)
      .input("PRJ_STAGE", sql.VarChar(200), stage)

      .query(`
        INSERT INTO prj_stage_hdr
        (
          PRJ_STAGE_HDRID,
          PRJ_STAGE
        )
        VALUES
        (
          @PRJ_STAGE_HDRID,
          @PRJ_STAGE
        )
      `);

    res.json({
      message: "Project Stage saved successfully"
    });

  } catch (err) {

    console.error("Insert Project Stage Error:", err);

    res.status(500).json({
      error: err.message
    });

  }
});

module.exports = router;
