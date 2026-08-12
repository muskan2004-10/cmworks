const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

/* =========================================
   GET DASHBOARD DATA
========================================= */
router.get("/", async (req, res) => {
  try {

    const pool = await getPool();

    /* ======================================
       MAIN PROJECT DATA
    ====================================== */

    const result = await pool.request().query(`
      SELECT
        t.TRN_CMWORKDATAID,
        t.PRJ_NAME,
        t.DISTRICT,

        /* FINAL DEPARTMENT NAME FIX */
        COALESCE(
          d.DEPTNAME,
          d2.DEPTNAME,
          d3.DEPTNAME,
          CAST(t.DEPTNAME AS VARCHAR(200))
        ) AS DEPTNAME,

        t.FINYR,
        t.PRJ_COST,
        t.PHYFINPROGPER,

        t.WORKORDER_FILEPATH,
        t.FS_FILEPATH,

        t.BRFPRJ AS DESCRIPTION,

        t.PRJ_STAGE AS PROJECT_STAGE,
        t.MODEOFIMP AS MODE_IMPL,

        /* IMPLEMENTING DEPARTMENT */
        COALESCE(
          idp.DEPTNAME,
          CAST(t.IMPDEPT AS VARCHAR(200))
        ) AS IMPL_DEPT,

        t.IMPAGENCIES AS IMPL_AGENCY,
        t.MLACONST AS MLA_CONST,
        t.PARCONST AS PARLIAMENT_CONST,
        t.NOOFVILL AS TOWNS,
        t.POPBEN AS POPULATION,
        t.DCONTRACTNAME AS CONTRACTOR_NAME,

        t.PRJ_DTSANPRJ AS DATE_SANCTION,
        t.PRJ_STARTDT AS START_DATE,
        t.PRJ_REVPRJDT AS REV_START_DATE,
        t.PRJ_COMPLEPRJDT AS END_DATE,
        t.PRJ_REVCOMPLEDT AS REV_END_DATE,

        t.PRJ_TIMEOVRRUN AS TIME_OVERRUN,
        t.PRJ_REVCOST AS REV_COST,
        t.PRJ_COSTOVERRUN AS COST_OVERRUN,
        t.PRJ_TOTFUN AS FUNDS_RELEASED,
        t.PRJ_FINPRGPER AS FIN_PROGRESS_PER,

        t.PRJ_FUNDBY AS FUNDING_BY,
        t.PRJ_FUNDYPER AS FUNDING_PER,

        t.PHOPT AS MULTI_PACKAGES,
        t.PHOPT1 AS MULTI_FUNDING,

        /* IMAGE NAME */
        (
          SELECT TOP 1 dtl.AXP_GRIDATTACH_2
          FROM PRJ_IMGHDR hdr
          INNER JOIN PRJ_IMGDTL dtl
            ON hdr.PRJ_IMGHDRID = dtl.PRJ_IMGHDRID
          WHERE hdr.TRN_CMWORKDATAID = t.TRN_CMWORKDATAID
          ORDER BY dtl.PRJ_IMGDTLID DESC
        ) AS IMAGE_NAME,

        /* IMAGE DOC */
        (
          SELECT TOP 1 dtl.AXPFILEPATH_MYDOCS
          FROM PRJ_IMGHDR hdr
          INNER JOIN PRJ_IMGDTL dtl
            ON hdr.PRJ_IMGHDRID = dtl.PRJ_IMGHDRID
          WHERE hdr.TRN_CMWORKDATAID = t.TRN_CMWORKDATAID
          ORDER BY dtl.PRJ_IMGDTLID DESC
        ) AS IMAGE_DOC_PATH

      FROM TRN_CMWORKDATA t

      /* MAIN DEPARTMENT */

      LEFT JOIN CMO_DEPARTMENT d
        ON TRY_CAST(t.DEPTNAME AS NUMERIC(38,0))
        = d.CMO_DEPARTMENTID

      LEFT JOIN CMO_DEPARTMENT d2
        ON LTRIM(RTRIM(CAST(t.DEPTNAME AS VARCHAR(50))))
        = LTRIM(RTRIM(CAST(d2.CMO_DEPARTMENTID AS VARCHAR(50))))

      LEFT JOIN CMO_DEPARTMENT d3
        ON LTRIM(RTRIM(CAST(t.DEPTNAME AS VARCHAR(200))))
        = LTRIM(RTRIM(d3.DEPTNAME))

      /* IMPLEMENTING DEPARTMENT */

      LEFT JOIN CMO_DEPARTMENT idp
        ON TRY_CAST(t.IMPDEPT AS NUMERIC(38,0))
        = idp.CMO_DEPARTMENTID

      WHERE ISNULL(t.ISACTIVE,1) = 1

      ORDER BY t.TRN_CMWORKDATAID DESC
    `);

    /* ======================================
       BUILD FINAL RESPONSE
    ====================================== */

    const data = await Promise.all(

      result.recordset.map(async (item) => {

        /* ======================================
           FUNDING DATA
        ====================================== */

        const fundingResult = await pool
          .request()
          .input(
            "projectId",
            sql.Numeric(38, 0),
            item.TRN_CMWORKDATAID
          )
          .query(`
            SELECT
              FUNDBY,
              FUNDBYPER
            FROM PRJ_FUNDDTL
            WHERE TRN_CMWORKDATAID = @projectId
              AND ISACTIVE = 1
          `);

        /* ======================================
           PACKAGE DATA
        ====================================== */

        const packageResult = await pool
          .request()
          .input(
            "projectId",
            sql.Numeric(38, 0),
            item.TRN_CMWORKDATAID
          )
          .query(`
            SELECT

              PACKAGEPHASE,
              PH_CONTRACTNAME,

              PH_DTSANPRJ,
              PH_PRJSTARTDT,
              PH_COMPLEDT,
              PH_REVCOMPLEDT,

              PH_WORKCOST,
              PH_REVCOST,
              PH_COSTOVERRUN,

              PH_TOTFUN,

              PH_FINPRG,
              PH_FINPRGPER,

              PH_PHYSPRG,
              PH_PHYSPRGPER

            FROM PRJ_CONTRACTDTL

            WHERE TRN_CMWORKDATAID = @projectId
              AND ISACTIVE = 1
          `);

        return {

          ...item,

          /* ======================================
             FUNDING ARRAY
          ====================================== */

          FUNDING_PATTERN:
            fundingResult.recordset || [],

          /* ======================================
             PACKAGE ARRAY
          ====================================== */

          PACKAGES:
            packageResult.recordset || [],

          /* ======================================
             IMAGE URL
          ====================================== */

          IMAGE_URL: item.IMAGE_NAME
            ? `http://localhost:5000/uploads/images/${item.IMAGE_NAME}`
            : null,

          /* ======================================
             IMAGE DOC URL
          ====================================== */

          IMAGE_DOC_URL:
            item.IMAGE_DOC_PATH
              ? `http://localhost:5000/${String(
                  item.IMAGE_DOC_PATH
                )
                  .replace(/\\/g, "/")
                  .replace(/^\/+/, "")}`
              : null,

          /* ======================================
             WORK ORDER URL
          ====================================== */

          WORKORDER_URL:
            item.WORKORDER_FILEPATH
              ? `http://localhost:5000/${String(
                  item.WORKORDER_FILEPATH
                )
                  .replace(/\\/g, "/")
                  .replace(/^\/+/, "")}`
              : null,

          /* ======================================
             FS DOC URL
          ====================================== */

          FS_URL:
            item.FS_FILEPATH
              ? `http://localhost:5000/${String(
                  item.FS_FILEPATH
                )
                  .replace(/\\/g, "/")
                  .replace(/^\/+/, "")}`
              : null,
        };
      })
    );

    res.json(data);

  } catch (err) {

    console.error(
      "Dashboard Error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load dashboard data",
      error: err.message,
    });
  }
});

/* =========================================
   GET DOCUMENTS BY PROJECT ID
========================================= */

router.get("/docs/:id", async (req, res) => {
  try {

    const pool = await getPool();

    const result = await pool
      .request()
      .input(
        "id",
        sql.Numeric(38, 0),
        req.params.id
      )
      .query(`
        SELECT
          0 AS ID,
          'Work Order' AS FILE_NAME,
          WORKORDER_FILEPATH AS FILE_PATH,
          'WORK_ORDER' AS TYPE
        FROM TRN_CMWORKDATA
        WHERE TRN_CMWORKDATAID = @id
          AND WORKORDER_FILEPATH IS NOT NULL

        UNION ALL

        SELECT
          0 AS ID,
          'FS Document' AS FILE_NAME,
          FS_FILEPATH AS FILE_PATH,
          'FS_DOC' AS TYPE
        FROM TRN_CMWORKDATA
        WHERE TRN_CMWORKDATAID = @id
          AND FS_FILEPATH IS NOT NULL
      `);

    const docs = result.recordset.map((row) => ({
      ...row,

      FILE_URL: row.FILE_PATH
        ? `http://localhost:5000/${String(
            row.FILE_PATH
          )
            .replace(/\\/g, "/")
            .replace(/^\/+/, "")}`
        : null,
    }));

    res.json(docs);

  } catch (err) {

    console.error(
      "Docs Error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load documents",
      error: err.message,
    });
  }
});

/* =========================================
   SOFT DELETE PROJECT
========================================= */

router.delete("/:id", async (req, res) => {
  try {

    const pool = await getPool();

    await pool
      .request()
      .input(
        "id",
        sql.Numeric(38, 0),
        req.params.id
      )
      .query(`
        UPDATE TRN_CMWORKDATA
        SET ISACTIVE = 0
        WHERE TRN_CMWORKDATAID = @id
      `);

    res.json({
      success: true,
      message:
        "Project deleted successfully",
    });

  } catch (err) {

    console.error(
      "Delete Error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete project",
      error: err.message,
    });
  }
});

module.exports = router;