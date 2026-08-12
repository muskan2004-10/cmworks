const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

/* =====================================================
   SAVE MEETING
===================================================== */

router.post("/", async (req, res) => {

  try {

    const pool = getPool();

    const { meetingDate, meetingTitle } = req.body;

    // ================= VALIDATION =================

    if (!meetingDate || !meetingTitle || !meetingTitle.trim()) {

      return res.status(400).json({
        error: "Meeting Date and Title are required"
      });
    }

    console.log("Received Data:", req.body);

    // ================= GENERATE ID =================

    const idResult = await pool.request().query(`
      SELECT ISNULL(MAX(MST_MEETHDRID),0) + 1 AS NEWID
      FROM mst_meethdr
    `);

    const newId = idResult.recordset[0].NEWID;

    console.log("Generated ID:", newId);

    // ================= GENERATE MEETING ID =================

    const meetingId = "MTG" + newId;

    // ================= INSERT =================

    await pool.request()

      .input("MST_MEETHDRID", sql.BigInt, newId)

      .input("MEETINGID", sql.VarChar(20), meetingId)

      .input("MEETINGDT", sql.DateTime, meetingDate)

      .input("MEETINGTITLE", sql.VarChar(50), meetingTitle)

      .input("CREATEDBY", sql.VarChar(50), "admin")

      .input("CANCEL", sql.Char(1), "N")

      .query(`
        INSERT INTO mst_meethdr
        (
          MST_MEETHDRID,
          MEETINGID,
          MEETINGDT,
          MEETINGTITLE,
          CREATEDBY,
          CREATEDON,
          CANCEL
        )

        VALUES
        (
          @MST_MEETHDRID,
          @MEETINGID,
          @MEETINGDT,
          @MEETINGTITLE,
          @CREATEDBY,
          GETDATE(),
          @CANCEL
        )
      `);

    res.json({
      success: true,
      message: "Meeting saved successfully",
      meetingId: meetingId
    });

  } catch (err) {

    console.error("Insert Meeting Error:", err);

    res.status(500).json({
      error: err.message
    });
  }
});

/* =====================================================
   GET MEETING LIST FOR DROPDOWN
===================================================== */

router.get("/list", async (req, res) => {

  try {

    const pool = getPool();

    const result = await pool.request().query(`
      SELECT
        MEETINGID,
        MEETINGDT,
        MEETINGTITLE
      FROM mst_meethdr
      WHERE CANCEL = 'N'
      ORDER BY MST_MEETHDRID DESC
    `);

    console.log("Meeting List:", result.recordset);

    res.json(result.recordset);

  } catch (err) {

    console.error("Meeting Fetch Error:", err);

    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;