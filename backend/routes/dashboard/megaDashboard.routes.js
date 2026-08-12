const express = require("express");
const router = express.Router();

const sql = require("mssql");
const { config } = require("../../db");

/* ======================================================
   DROPDOWNS
====================================================== */

router.get("/dropdowns", async (req, res) => {

  try {

    const pool = await sql.connect(config);

    /* =========================================
       FINANCIAL YEARS
    ========================================= */

    const financialYears =
      await pool.request().query(`
        SELECT DISTINCT FINYR
        FROM TRN_CMWORKDATA
        WHERE FINYR IS NOT NULL
        ORDER BY FINYR DESC
      `);

    /* =========================================
       DISTRICTS
    ========================================= */

    const districts =
      await pool.request().query(`
        SELECT DISTINCT DISTRICT
        FROM TRN_CMWORKDATA
        WHERE DISTRICT IS NOT NULL
        ORDER BY DISTRICT
      `);

    /* =========================================
       EXECUTING DEPARTMENTS
    ========================================= */

    const executingDepartments =
      await pool.request().query(`
        SELECT DISTINCT EXCUTINGDEPT
        FROM TRN_CMWORKDATA
        WHERE EXCUTINGDEPT IS NOT NULL
        ORDER BY EXCUTINGDEPT
      `);

    /* =========================================
       PROJECT STAGES
    ========================================= */

    const identifiedProjects =
      await pool.request().query(`
        SELECT
          PRJ_STAGE_HDRID,
          PRJ_STAGE
        FROM PRJ_STAGE_HDR
        ORDER BY PRJ_STAGE
      `);

    /* =========================================
       MEETING STATUS
    ========================================= */

    const meetingStatuses = [
      { STATUS: "Pending" },
      { STATUS: "Completed" },
      { STATUS: "In Progress" }
    ];

    res.json({

      financialYears:
        financialYears.recordset,

      districts:
        districts.recordset,

      executingDepartments:
        executingDepartments.recordset,

      identifiedProjects:
        identifiedProjects.recordset,

      meetingStatuses,

    });

  } catch (err) {

    console.log(
      "Dropdown Error:",
      err
    );

    res.status(500).json({
      error: "Failed to load dropdowns",
    });
  }
});

/* ======================================================
   DASHBOARD COUNTS
====================================================== */

router.get("/", async (req, res) => {

  try {

    const pool = await sql.connect(config);

    const {
      financialYear,
      district,
      executingDept,
      identifiedProject,
    } = req.query;

    let whereClause =
      "WHERE T.ISACTIVE = 1";

    /* =========================================
       FILTERS
    ========================================= */

    if (financialYear) {

      whereClause += `
        AND T.FINYR='${financialYear}'
      `;
    }

    if (district) {

      whereClause += `
        AND T.DISTRICT='${district}'
      `;
    }

    if (executingDept) {

      whereClause += `
        AND T.EXCUTINGDEPT='${executingDept}'
      `;
    }

    if (identifiedProject) {

      whereClause += `
        AND P.PRJ_STAGE='${identifiedProject}'
      `;
    }

    /* =========================================
       COUNTS
    ========================================= */

    const result =
      await pool.request().query(`

      SELECT

      COUNT(*) AS totalProjects,

      SUM(
        CASE
          WHEN P.PRJ_STAGE='Ideation'
          THEN 1 ELSE 0
        END
      ) AS underConcept,

      SUM(
        CASE
          WHEN P.PRJ_STAGE='Planning'
          THEN 1 ELSE 0
        END
      ) AS underDevelopment,

      SUM(
        CASE
          WHEN P.PRJ_STAGE='Execution'
          THEN 1 ELSE 0
        END
      ) AS underImplementation,

      SUM(
        CASE
          WHEN P.PRJ_STAGE='Closure'
          THEN 1 ELSE 0
        END
      ) AS completedProjects,

      SUM(
        CASE
          WHEN
          TRY_CAST(
            T.PRJ_COSTOVERRUN
            AS FLOAT
          ) > 0
          THEN 1 ELSE 0
        END
      ) AS costOverRun,

      SUM(
        CASE
          WHEN
          T.PRJ_TIMEOVRRUN IS NOT NULL
          AND
          T.PRJ_TIMEOVRRUN <> ''
          THEN 1 ELSE 0
        END
      ) AS timeOverRun

      FROM TRN_CMWORKDATA T

      LEFT JOIN PRJ_STAGE_HDR P
      ON TRY_CAST(T.PRJ_STAGE AS BIGINT)
      =
      TRY_CAST(P.PRJ_STAGE_HDRID AS BIGINT)

      ${whereClause}

    `);

    res.json({

      ...result.recordset[0],

      officersMapped: 25,

    });

  } catch (err) {

    console.log(
      "Mega Dashboard Error:",
      err
    );

    res.status(500).json({
      error:
        "Failed to load dashboard",
    });
  }
});

module.exports = router;