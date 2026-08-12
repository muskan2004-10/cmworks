const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

router.get("/", async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request().query(`
      SELECT
        TRN_CMWORKDATAID,
        PRJ_NAME
      FROM TRN_CMWORKDATA
      ORDER BY PRJ_NAME
    `);

    res.json(result.recordset);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;