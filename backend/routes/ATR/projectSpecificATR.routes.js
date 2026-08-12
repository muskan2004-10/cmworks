const express = require("express");
const router = express.Router();

const sql = require("mssql");
const { config } = require("../../db");

/* =====================================================
   GET ATR BY PROJECT
===================================================== */

router.get("/by-project/:projectId", async (req, res) => {

  try {

    const { projectId } = req.params;

    const pool = await sql.connect(config);

    const result = await pool.request()

      .input(
        "PROJECTID",
        sql.VarChar(30),
        projectId
      )

      .query(`
        SELECT

          TRN_ATRDTLID,

          FINYR,

          MEET_ID,

          MEETINGTITLE,

          MEET_DT,

          PROJECTID,

          PRJ_NAME,

          DIRDESC,

          ADRESDESC,

          ISSUE_STAT,

          CONCENDEPT,

          CREATEDON

        FROM TRN_ATRDTL

        WHERE PROJECTID = @PROJECTID

        ORDER BY CREATEDON DESC
      `);

    res.json(result.recordset);

  } catch (err) {

    console.error(
      "Get ATR By Project Error:",
      err
    );

    res.status(500).json({
      error: "Failed to fetch ATR records",
    });
  }
});

/* =====================================================
   GET PROJECT DROPDOWN
===================================================== */

router.get("/projects", async (req, res) => {

  try {

    const pool = await sql.connect(config);

    const result = await pool.request().query(`
      SELECT
        TRN_CMWORKDATAID AS PROJECTID,
        PRJ_NAME,
        FINYR
      FROM TRN_CMWORKDATA
      WHERE ISACTIVE = 1
      ORDER BY PRJ_NAME
    `);

    res.json(result.recordset);

  } catch (err) {

    console.error("Project Dropdown Error:", err);

    res.status(500).json({
      error: "Failed to fetch projects",
    });
  }
});

/* =====================================================
   GET MEETING DROPDOWN
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
      FROM MST_MEETHDR
      ORDER BY MEETINGDT DESC
    `);

    res.json(result.recordset);

  } catch (err) {

    console.error("Meeting Dropdown Error:", err);

    res.status(500).json({
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
      FROM CMO_DEPARTMENT
      ORDER BY DEPTNAME
    `);

    res.json(result.recordset);

  } catch (err) {

    console.error("Department Error:", err);

    res.status(500).json({
      error: "Failed to fetch departments",
    });
  }
});

/* =====================================================
   SAVE PROJECT SPECIFIC ATR
===================================================== */

router.post("/save", async (req, res) => {

  try {

    const {
      meetingId,
      meetingTitle,
      meetingDate,

      projectId,
      projectName,
      financialYear,

      directionGiven,
      adminResponse,

      status,
      concernDept,
    } = req.body;

    console.log({
      meetingId,
      meetingTitle,
      projectId,
      projectName,
      financialYear,
    });

    const pool = await sql.connect(config);

    /* =====================================================
       GENERATE NEW ATR ID
    ===================================================== */

    const maxIdResult = await pool.request().query(`
      SELECT ISNULL(MAX(TRN_ATRDTLID), 0) + 1 AS NEWID
      FROM TRN_ATRDTL
    `);

    const newAtrId =
      maxIdResult.recordset[0].NEWID;

    console.log("Generated ATR ID:", newAtrId);

    /* =====================================================
       INSERT
    ===================================================== */

    await pool.request()

      .input("TRN_ATRDTLID", sql.BigInt, newAtrId)

      .input("FINYR", sql.VarChar(10), financialYear)

      .input("MEET_ID", sql.VarChar(20), meetingId)

      .input("MEET_DT", sql.DateTime, meetingDate)

      .input("PROJECTID", sql.VarChar(30), projectId)

      .input("DIRDESC", sql.Text, directionGiven)

      .input("ADRESDESC", sql.Text, adminResponse)

      .input("ISSUE_STAT", sql.VarChar(80), status)

      .input("CONCENDEPT", sql.VarChar(200), concernDept)

      // IMPORTANT:
      // these columns should be VARCHAR in SQL
      .input("MEETINGTITLE", sql.VarChar(500), meetingTitle)

      .input("PRJ_NAME", sql.VarChar(500), projectName)

      .query(`
        INSERT INTO TRN_ATRDTL
        (
          TRN_ATRDTLID,
          FINYR,
          MEET_ID,
          MEET_DT,
          PROJECTID,
          DIRDESC,
          ADRESDESC,
          ISSUE_STAT,
          CONCENDEPT,
          MEETINGTITLE,
          PRJ_NAME,
          CREATEDON
        )

        VALUES
        (
          @TRN_ATRDTLID,
          @FINYR,
          @MEET_ID,
          @MEET_DT,
          @PROJECTID,
          @DIRDESC,
          @ADRESDESC,
          @ISSUE_STAT,
          @CONCENDEPT,
          @MEETINGTITLE,
          @PRJ_NAME,
          GETDATE()
        )
      `);

    res.json({
      success: true,
      message: "ATR saved successfully",
    });

  } catch (err) {

    console.error("Save ATR Error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;