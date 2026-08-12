const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");


/* ===============================
   GET ALL DIVISIONS
================================ */
router.get("/", async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request()
      .query("SELECT * FROM cm_division ORDER BY DIVISIONCODE");

    res.json(result.recordset);

  } catch (err) {
    console.error("Fetch Division Error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ===============================
   INSERT DIVISION
================================ */
router.post("/", async (req, res) => {
  try {
    const pool = getPool();

    const {
      divisionCode,
      divisionName,
      divisionHindi,
      stateCode
    } = req.body;

    /* GET STATE ID FROM STATE CODE */
    const stateResult = await pool.request()
      .input("STATECODE", sql.VarChar(60), stateCode)
      .query(`
        SELECT CM_STATEID 
        FROM CM_STATE 
        WHERE STATECODE = @STATECODE
      `);

    if (stateResult.recordset.length === 0) {
      return res.status(400).json({
        error: "State not found. Please create the state first."
      });
    }

    const stateId = stateResult.recordset[0].CM_STATEID;


    /* GENERATE NEXT DIVISION ID */
    const idResult = await pool.request()
      .query(`
        SELECT ISNULL(MAX(CM_DIVISIONID),0) + 1 AS NEWID
        FROM CM_DIVISION
      `);

    const newDivisionId = idResult.recordset[0].NEWID;


    /* INSERT DIVISION */
    await pool.request()
      .input("CM_DIVISIONID", sql.Numeric(38,0), newDivisionId)
      .input("DIVISIONCODE", sql.VarChar(50), divisionCode)
      .input("DIVISION", sql.VarChar(100), divisionName)
      .input("DIVISION_H", sql.VarChar(100), divisionHindi)
      .input("STATENAME", sql.Numeric(38,0), stateId)
      .input("STATECODE", sql.VarChar(60), stateCode)

      .query(`
        INSERT INTO CM_DIVISION
        (
          CM_DIVISIONID,
          DIVISIONCODE,
          DIVISION,
          DIVISION_H,
          STATENAME,
          STATECODE
        )
        VALUES
        (
          @CM_DIVISIONID,
          @DIVISIONCODE,
          @DIVISION,
          @DIVISION_H,
          @STATENAME,
          @STATECODE
        )
      `);

    res.status(200).json({
      message: "Division inserted successfully"
    });

  } catch (err) {
    console.error("Insert Division Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
