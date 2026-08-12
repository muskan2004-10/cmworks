const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

/* ===============================
   GET ALL ASSEMBLY
================================ */
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
        COM_MST_ACMASTERID,
        ASC_NAME,
        ASC_OLNAME,
        ASC_DISTRICT,
        DISTRICT,
        ASC_MLANAME
      FROM com_mst_acmaster
      WHERE CANCEL = 'N'
      ORDER BY ASC_NAME
    `);

    res.json(result.recordset);

  } catch (err) {
    console.error("Fetch Assembly Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {

  try {
    const pool = getPool();

    const { name, nameHindi, district, mlaName } = req.body;

    // Validation
    if (!name || !nameHindi || !district) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Duplicate Check
    const duplicate = await pool.request()
      .input("ASC_NAME", sql.VarChar(100), name)
      .query(`
        SELECT 1 FROM com_mst_acmaster 
        WHERE ASC_NAME = @ASC_NAME
      `);

    if (duplicate.recordset.length > 0) {
      return res.status(400).json({ error: "Assembly already exists" });
    }

    // Get District Name
    const districtResult = await pool.request()
      .input("DISTRICTID", sql.Numeric(38, 0), district)
      .query(`
        SELECT DISTRICTNAME 
        FROM cm_district 
        WHERE CM_DISTRICTID = @DISTRICTID
      `);

    if (districtResult.recordset.length === 0) {
      return res.status(400).json({ error: "Invalid District" });
    }

    const districtName = districtResult.recordset[0].DISTRICTNAME;

    // Generate ID
    const idResult = await pool.request().query(`
      SELECT ISNULL(MAX(COM_MST_ACMASTERID),0)+1 AS newId 
      FROM com_mst_acmaster
    `);

    const newId = idResult.recordset[0].newId;

    // Insert
    await pool.request()
      .input("ID", sql.Numeric(38, 0), newId)
      .input("ASC_NAME", sql.NVarChar(100), name)        // Unicode safe
      .input("ASC_OLNAME", sql.NVarChar(100), nameHindi) // Unicode safe
      .input("ASC_DISTRICT", sql.Numeric(38, 0), district)
      .input("DISTRICT", sql.VarChar(100), districtName)
      .input("ASC_MLANAME", sql.VarChar(200), mlaName)
      .input("CREATEDBY", sql.VarChar(50), "admin")
      .query(`
        INSERT INTO com_mst_acmaster
        (
          COM_MST_ACMASTERID,
          ASC_NAME,
          ASC_OLNAME,
          ASC_DISTRICT,
          DISTRICT,
          ASC_MLANAME,
          CREATEDBY,
          CREATEDON,
          CANCEL
        )
        VALUES
        (
          @ID,
          @ASC_NAME,
          @ASC_OLNAME,
          @ASC_DISTRICT,
          @DISTRICT,
          @ASC_MLANAME,
          @CREATEDBY,
          GETDATE(),
          'N'
        )
      `);

    res.json({
      message: "Assembly saved successfully"
    });

  } catch (err) {

    console.error("Insert Error:", err);

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;
