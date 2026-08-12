const express = require("express");
const router = express.Router();
const sql = require("mssql");
const poolPromise = require("../../db");
const { getPool } = require("../../db");


/**
 * GET – Fetch Financial Years
 */
router.get("/", async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request()
      .query("SELECT * FROM trn_fy");

    console.log("RESULT:", result);
    console.log("RECORDSET:", result.recordset);

    res.json(result.recordset);   // ⚠️ MUST be recordset

  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/** Post */
router.post("/", async (req, res) => {
  try {
    const { fy, fvalue, isactive } = req.body;

    const pool = getPool();

    if (!pool) {
      return res.status(500).json({ error: "Database not connected yet" });
    }

    await pool.request()
      .input("fy", sql.VarChar(20), fy)
      .input("fvalue", sql.Numeric(10, 0), fvalue)
      .input("isactive", sql.VarChar(1), isactive ? "1" : "0")
      .query(`
        INSERT INTO TRN_FY (
          TRN_FYID,
          FY,
          FVALUE,
          ISACTIVE,
          CREATEDON
        )
        VALUES (
          (SELECT ISNULL(MAX(TRN_FYID),0) + 1 FROM TRN_FY),
          @fy,
          @fvalue,
          @isactive,
          GETDATE()
        )
      `);

    res.status(201).json({ message: "Financial Year inserted successfully" });

  } catch (err) {
    console.error("❌ Insert Error Full:", err);
    res.status(500).json({ error: "Insert failed" });
  }
});



module.exports = router;