const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

/* ===============================
   GET ALL PC MASTER
================================ */
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
        COM_MST_PCMASTERID,
        PRC_NAME,
        PRC_OLNAME,
        PRC_PMNAME
      FROM com_mst_pcmaster
      WHERE CANCEL = 'N'
      ORDER BY PRC_NAME
    `);

    res.json(result.recordset);

  } catch (err) {
    console.error("Fetch PC Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const pool = getPool();

    const { name, hindi, pm } = req.body;

    // ✅ Validation
    if (!name || !hindi) {
      return res.status(400).json({
        error: "Name and Name (Hindi) are required"
      });
    }

    // ✅ Duplicate Check
    const duplicate = await pool.request()
      .input("PRC_NAME", sql.VarChar(100), name)
      .query(`
        SELECT 1 FROM com_mst_pcmaster
        WHERE PRC_NAME = @PRC_NAME
      `);

    if (duplicate.recordset.length > 0) {
      return res.status(400).json({
        error: "Parliamentary Constituency already exists"
      });
    }

    // ✅ Generate ID
    const idResult = await pool.request().query(`
      SELECT ISNULL(MAX(COM_MST_PCMASTERID),0)+1 AS newId
      FROM com_mst_pcmaster
    `);

    const newId = idResult.recordset[0].newId;

    // ✅ Insert
    await pool.request()
      .input("ID", sql.Numeric(38, 0), newId)
      .input("PRC_NAME", sql.NVarChar(100), name)
      .input("PRC_OLNAME", sql.NVarChar(100), hindi)
      .input("PRC_PMNAME", sql.VarChar(100), pm)
      .input("CREATEDBY", sql.VarChar(50), "admin")
      .query(`
        INSERT INTO com_mst_pcmaster
        (
          COM_MST_PCMASTERID,
          PRC_NAME,
          PRC_OLNAME,
          PRC_PMNAME,
          CREATEDBY,
          CREATEDON,
          CANCEL
        )
        VALUES
        (
          @ID,
          @PRC_NAME,
          @PRC_OLNAME,
          @PRC_PMNAME,
          @CREATEDBY,
          GETDATE(),
          'N'
        )
      `);

    res.json({
      message: "Parliamentary Constituency saved successfully"
    });

  } catch (err) {
    console.error("Insert PC Error:", err);

    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;
