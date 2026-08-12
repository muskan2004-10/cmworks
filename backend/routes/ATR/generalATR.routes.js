// routes/atr/generalATR.routes.js

const express = require("express");
const router = express.Router();

const sql = require("mssql");
const { config } = require("../../db");

/* =====================================================
   GET MEETINGS
===================================================== */

router.get("/meetings", async (req, res) => {
  try {

    const pool = await sql.connect(config);

    const result = await pool.request().query(`
      SELECT
        MST_MEETHDRID,
        MEETINGID,
        MEETINGTITLE,
        MEETINGDT
      FROM mst_meethdr
      ORDER BY MEETINGDT DESC
    `);

    res.json(result.recordset);

  } catch (err) {

    console.error("Meeting Fetch Error:", err);

    res.status(500).json({
      success: false,
      error: "Failed to fetch meetings",
    });
  }
});

/* =====================================================
   GET DEPARTMENTS
===================================================== */

router.get("/departments", async (req, res) => {
  try {

    const pool = await sql.connect(config);

    const result = await pool.request().query(`
      SELECT
        DEPTNAME
      FROM cmo_department
      ORDER BY DEPTNAME
    `);

    res.json(result.recordset);

  } catch (err) {

    console.error("Department Fetch Error:", err);

    res.status(500).json({
      success: false,
      error: "Failed to fetch departments",
    });
  }
});

/* =====================================================
   SAVE GENERAL ATR
===================================================== */

router.post("/save", async (req, res) => {

  try {

    const {
      meetingId,
      meetingTitle,
      meetingDate,
      departmentName,
      directionGiven,
      adminResponse,
      status,
    } = req.body;

    console.log(req.body);

    const pool = await sql.connect(config);

    /* =====================================================
       MANUAL ID GENERATION
    ===================================================== */

    const maxResult = await pool.request().query(`
      SELECT ISNULL(MAX(TRN_ATRDTLID), 0) + 1 AS NEW_ID
      FROM TRN_ATRDTL
    `);

    const newId = maxResult.recordset[0].NEW_ID;

    /* =====================================================
       INSERT
    ===================================================== */

    await pool.request()

      .input("TRN_ATRDTLID", sql.BigInt, newId)

      .input("MEET_ID", sql.VarChar, meetingId)

      .input("MEETINGTITLE", sql.VarChar, meetingTitle)

      .input("MEET_DT", sql.DateTime, meetingDate)

      .input("DIRDESC", sql.Text, directionGiven)

      .input("ADRESDESC", sql.Text, adminResponse)

      .input("ISSUE_STAT", sql.VarChar, status)

      .input("CONCENDEPT", sql.VarChar, departmentName)

      .query(`
        INSERT INTO TRN_ATRDTL
        (
          TRN_ATRDTLID,

          MEET_ID,
          MEETINGTITLE,
          MEET_DT,

          DIRDESC,
          ADRESDESC,

          ISSUE_STAT,
          CONCENDEPT,

          CREATEDON
        )

        VALUES
        (
          @TRN_ATRDTLID,

          @MEET_ID,
          @MEETINGTITLE,
          @MEET_DT,

          @DIRDESC,
          @ADRESDESC,

          @ISSUE_STAT,
          @CONCENDEPT,

          GETDATE()
        )
      `);

    res.json({
      success: true,
      message: "General ATR saved successfully",
    });

  } catch (err) {

    console.error("Save General ATR Error:", err);

    res.status(500).json({
      success: false,
      error: "Failed to save General ATR",
    });
  }
});

module.exports = router;