const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

router.get("/:name", async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request()
      .input("name", sql.VarChar(200), req.params.name)
      .query(`
        SELECT * FROM TRN_CMWORKDATA WHERE PRJ_NAME = @name
      `);

    res.json(result.recordset[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
