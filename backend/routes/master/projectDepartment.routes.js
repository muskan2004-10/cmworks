const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

/* ===============================
   GET ALL DEPARTMENTS
================================ */
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
        CMO_DEPARTMENTID,
        DEPTNAME,
        ISBENEFICARY
      FROM CMO_DEPARTMENT
      ORDER BY DEPTNAME
    `);

    res.json(result.recordset);

  } catch (err) {
    console.error("Fetch Department Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {

  try {

    const pool = getPool();

    const { departmentName, isBeneficiary, officers, agencies } = req.body;

    /* ===================================
       GENERATE DEPARTMENT ID
    =================================== */

    const deptIdResult = await pool.request().query(`
      SELECT ISNULL(MAX(CMO_DEPARTMENTID),0) + 1 AS NEWID
      FROM CMO_DEPARTMENT
    `);

    const departmentId = deptIdResult.recordset[0].NEWID;

    /* ===================================
       INSERT DEPARTMENT
    =================================== */

    await pool.request()
      .input("CMO_DEPARTMENTID", sql.Numeric(38,0), departmentId)
      .input("DEPTNAME", sql.VarChar(200), departmentName)
      .input("ISBENEFICARY", sql.VarChar(20), isBeneficiary ? "Y" : "N")

      .query(`
        INSERT INTO CMO_DEPARTMENT
        (
          CMO_DEPARTMENTID,
          DEPTNAME,
          ISBENEFICARY
        )
        VALUES
        (
          @CMO_DEPARTMENTID,
          @DEPTNAME,
          @ISBENEFICARY
        )
      `);


    /* ===================================
       INSERT OFFICERS
    =================================== */

    for (let i = 0; i < officers.length; i++) {

      const officer = officers[i];

      const officerIdResult = await pool.request().query(`
        SELECT ISNULL(MAX(CMO_DEPTOFFICERID),0) + 1 AS NEWID
        FROM CMO_DEPTOFFICER
      `);

      const officerId = officerIdResult.recordset[0].NEWID;

      await pool.request()
        .input("CMO_DEPTOFFICERID", sql.Numeric(38,0), officerId)
        .input("CMO_DEPARTMENTID", sql.Numeric(38,0), departmentId)
        .input("ROWNO", sql.Numeric(38,0), i + 1)
        .input("DESIGNATION", sql.VarChar(200), officer.designation)
        .input("NAME", sql.VarChar(200), officer.name)
        .input("MOBILE", sql.Numeric(10,0), officer.mobile)
        .input("EMAIL", sql.VarChar(50), officer.email)
        .input("SSOID", sql.VarChar(100), officer.ssoId)

        .query(`
          INSERT INTO CMO_DEPTOFFICER
          (
            CMO_DEPTOFFICERID,
            CMO_DEPARTMENTID,
            CMO_DEPTOFFICERROW,
            DESIGNATION,
            NAME,
            MOBILE,
            EMAIL,
            SSOID
          )
          VALUES
          (
            @CMO_DEPTOFFICERID,
            @CMO_DEPARTMENTID,
            @ROWNO,
            @DESIGNATION,
            @NAME,
            @MOBILE,
            @EMAIL,
            @SSOID
          )
        `);

    }


    /* ===================================
       INSERT AGENCIES
    =================================== */

    if (agencies && agencies.length > 0) {

      for (let i = 0; i < agencies.length; i++) {

        const agencyIdResult = await pool.request().query(`
          SELECT ISNULL(MAX(CMO_DEPTAGENCYID),0) + 1 AS NEWID
          FROM CMO_DEPTAGENCY
        `);

        const agencyId = agencyIdResult.recordset[0].NEWID;

        await pool.request()
          .input("CMO_DEPTAGENCYID", sql.BigInt, agencyId)
          .input("CMO_DEPARTMENTID", sql.BigInt, departmentId)
          .input("ROWNO", sql.BigInt, i + 1)
          .input("AGENCYNAME", sql.VarChar(200), agencies[i].agencyName)

          .query(`
            INSERT INTO CMO_DEPTAGENCY
            (
              CMO_DEPTAGENCYID,
              CMO_DEPARTMENTID,
              CMO_DEPTAGENCYROW,
              AGENCYNAME
            )
            VALUES
            (
              @CMO_DEPTAGENCYID,
              @CMO_DEPARTMENTID,
              @ROWNO,
              @AGENCYNAME
            )
          `);

      }

    }

    res.json({
      message: "Project Department saved successfully"
    });

  }
  catch (err) {

    console.error("Insert Department Error:", err);

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;