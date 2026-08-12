const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

/* =====================================================
   UPDATE ISSUE
===================================================== */
router.put("/update/:id", async (req, res) => {
  try {

    const pool = await getPool();

    const id = req.params.id;

    const {
      issueDate,
      issueCategory,
      issueType,
      description,
      status
    } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "Missing issue ID"
      });
    }

    console.log("UPDATE BODY =", req.body);

    await pool.request()

      .input("id", sql.Int, id)

      .input(
        "issueDate",
        sql.DateTime,
        issueDate ? new Date(issueDate) : null
      )

      .input(
        "issueCategory",
        sql.VarChar(200),
        issueCategory || ""
      )

      .input(
        "issueType",
        sql.VarChar(200),
        issueType || ""
      )

      .input(
        "description",
        sql.NVarChar(sql.MAX),
        description || ""
      )

      .input(
        "status",
        sql.VarChar(20),
        status || ""
      )

      .query(`
        UPDATE PD_ISSUEHDR
        SET 
          ISSUEDT = @issueDate,
          ISSUECAT = @issueCategory,
          ISSUETYP = @issueType,
          ISSUEDESC = @description,
          ISS_STATUS = @status
        WHERE PD_ISSUEHDRID = @id
      `);

    res.json({
      success: true,
      message: "Issue Updated Successfully"
    });

  } catch (err) {

    console.log("UPDATE ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;