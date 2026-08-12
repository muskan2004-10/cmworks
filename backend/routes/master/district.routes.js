const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

/* ===============================
   GET ALL DISTRICTS
================================ */
router.get("/", async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request().query(`
      SELECT 
        d.CM_DISTRICTID,
        d.DISTRICTCODE,
        d.DISTRICTNAME,
        d.DISTRICTNAMEH,
        d.DISTRICTSHORT,
        d.DISTRICTSHORTH,
        d.INACTIVE,
        s.STATENAME AS STATE,
        dv.DIVISION AS DIVISION
      FROM CM_DISTRICT d
      LEFT JOIN CM_STATE s ON d.STATENAME = s.CM_STATEID
      LEFT JOIN CM_DIVISION dv ON d.DIVISION = dv.CM_DIVISIONID
      ORDER BY d.DISTRICTCODE
    `);

    res.json(result.recordset);

  } catch (err) {
    console.error("Fetch District Error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ===============================
   INSERT DISTRICT (FIXED)
================================ */
router.post("/", async (req, res) => {
  try {
    const pool = getPool();

    const {
      districtCode,
      districtName,
      districtNameHindi,
      stateId,        // ✅ directly from frontend
      divisionId,     // ✅ directly from frontend
      shortName,
      shortNameHindi,
      isActive
    } = req.body;

    console.log("Incoming Data:", req.body); // 🔍 DEBUG

    /* ===============================
       VALIDATION
    =============================== */
    if (!districtCode || !districtName || !stateId || !divisionId) {
      return res.status(400).json({
        error: "Required fields missing"
      });
    }

    /* ===============================
       GENERATE NEW ID
    =============================== */
    const idResult = await pool.request().query(`
      SELECT ISNULL(MAX(CM_DISTRICTID),0)+1 AS NEWID 
      FROM CM_DISTRICT
    `);

    const newId = idResult.recordset[0].NEWID;

    /* ===============================
       INSERT
    =============================== */
    await pool.request()
      .input("CM_DISTRICTID", sql.Numeric(38, 0), newId)
      .input("DISTRICTCODE", sql.VarChar(60), districtCode)
      .input("DISTRICTNAME", sql.VarChar(200), districtName)
      .input("DISTRICTNAMEH", sql.VarChar(200), districtNameHindi || "")
      .input("DISTRICTSHORT", sql.VarChar(10), shortName || "")
      .input("DISTRICTSHORTH", sql.VarChar(50), shortNameHindi || "")
      .input("INACTIVE", sql.VarChar(20), isActive ? "0" : "1")
      .input("STATENAME", sql.Numeric(38, 0), stateId)     // ✅ FIXED
      .input("DIVISION", sql.Numeric(38, 0), divisionId)   // ✅ FIXED

      .query(`
        INSERT INTO CM_DISTRICT
        (
          CM_DISTRICTID,
          DISTRICTCODE,
          DISTRICTNAME,
          DISTRICTNAMEH,
          DISTRICTSHORT,
          DISTRICTSHORTH,
          INACTIVE,
          STATENAME,
          DIVISION
        )
        VALUES
        (
          @CM_DISTRICTID,
          @DISTRICTCODE,
          @DISTRICTNAME,
          @DISTRICTNAMEH,
          @DISTRICTSHORT,
          @DISTRICTSHORTH,
          @INACTIVE,
          @STATENAME,
          @DIVISION
        )
      `);

    res.status(200).json({
      message: "District inserted successfully"
    });

  } catch (err) {
    console.error("Insert District Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
