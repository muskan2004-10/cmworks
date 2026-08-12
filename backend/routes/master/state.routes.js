const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

/* ===============================
   GET ALL STATES
================================ */
router.get("/", async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request()
      .query("SELECT * FROM cm_state ORDER BY STATECODE");

    res.json(result.recordset);

  } catch (err) {
    console.error("❌ Fetch State Error:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
});


/* ===============================
   INSERT STATE
================================ */
router.post("/", async (req, res) => {
  try {
    const pool = getPool();
    const { stateCode, stateName, stateNameHindi, isActive } = req.body;

    await pool.request()
      .input("STATECODE", sql.VarChar(10), stateCode)
      .input("STATENAME", sql.VarChar(100), stateName)
      .input("STATENAMEH", sql.VarChar(100), stateNameHindi)
      .input("INACTIVE", sql.Char(1), isActive ? "N" : "Y")
      .query(`
        INSERT INTO CM_STATE
        (STATECODE, STATENAME, STATENAMEH, INACTIVE)
        VALUES (@STATECODE, @STATENAME, @STATENAMEH, @INACTIVE)
      `);

    res.status(200).json({ message: "State inserted successfully" });

  } catch (err) {
    console.error("Insert State Error:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
