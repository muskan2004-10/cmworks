const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

/* =====================================================
   CREATE ISSUE
===================================================== */
router.post("/", async (req, res) => {
  try {
    const pool = await getPool();

    console.log("BODY =", req.body);

    const {
      projectId,
      issueDate,
      issueCategory,
      issueType,
      description,
      status
    } = req.body;

    if (!projectId || !issueDate || !issueCategory || !issueType || !status) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const idResult = await pool.request().query(`
      SELECT ISNULL(MAX(PD_ISSUEHDRID), 0) + 1 AS NEWID
      FROM PD_ISSUEHDR
    `);

    const newId = idResult.recordset[0].NEWID;

    await pool.request()
      .input("PD_ISSUEHDRID", sql.Int, newId)
      .input("PROJECTID", sql.VarChar(50), projectId)
      .input("ISSUEDT", sql.DateTime, new Date(issueDate))
      .input("ISSUECAT", sql.VarChar(200), issueCategory)
      .input("ISSUETYP", sql.VarChar(200), issueType)
      .input("ISSUEDESC", sql.NVarChar(sql.MAX), description || "")
      .input("ISS_STATUS", sql.VarChar(20), status)
      .query(`
        INSERT INTO PD_ISSUEHDR
        (
          PD_ISSUEHDRID,
          PROJECTID,
          ISSUEDT,
          ISSUECAT,
          ISSUETYP,
          ISSUEDESC,
          ISS_STATUS
        )
        VALUES
        (
          @PD_ISSUEHDRID,
          @PROJECTID,
          @ISSUEDT,
          @ISSUECAT,
          @ISSUETYP,
          @ISSUEDESC,
          @ISS_STATUS
        )
      `);

    res.json({
      message: "Issue Saved Successfully",
      id: newId
    });

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =====================================================
   GET ISSUES BY PROJECT
===================================================== */
router.get("/by-project/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const projectId = req.params.id;

    const result = await pool.request()
      .input("projectId", sql.Int, projectId)
      .query(`
        SELECT 
          PD_ISSUEHDRID,
          PROJECTID,
          ISSUEDT,
          ISSUECAT,
          ISSUETYP,
          ISSUEDESC,
          ISS_STATUS
        FROM PD_ISSUEHDR
        WHERE PROJECTID = @projectId
        ORDER BY PD_ISSUEHDRID ASC
      `);

    res.json(result.recordset);

  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =====================================================
   UPDATE ISSUE
===================================================== */
router.put("/update/:id", async (req, res) => {
  try {
    const pool = await getPool();
    const id = req.params.id;

    const {
      description,
      status
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing issue ID" });
    }

    await pool.request()
      .input("id", sql.Int, id)
      .input("description", sql.NVarChar(sql.MAX), description || "")
      .input("status", sql.VarChar(20), status)
      .query(`
        UPDATE PD_ISSUEHDR
        SET 
          ISSUEDESC = @description,
          ISS_STATUS = @status
        WHERE PD_ISSUEHDRID = @id
      `);

    res.json({
      message: "Issue Updated Successfully"
    });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;