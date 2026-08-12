const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

// GET ISSUES BY PROJECT ID (SAFE + SORTED)
router.get("/by-project/:projectId", async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request()
      .input("projectId", sql.VarChar(200), req.params.projectId)
      .query(`
        SELECT *
        FROM PD_ISSUEHDR
        WHERE PROJECTID = @projectId
        ORDER BY PD_ISSUEHDRID ASC
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error("Issue Fetch Error:", err);
    res.status(500).json({ error: "Failed to load issues" });
  }
});

module.exports = router;