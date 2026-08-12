const express = require("express");
const router = express.Router();

const { sql, getPool } = require("../../db");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* =========================================
   CREATE FOLDERS
========================================= */
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

createDir("uploads/workorders");
createDir("uploads/fs");

const safeNumber = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

const safeDecimalOrNull = (value) => {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const num = parseFloat(value);

  return isNaN(num) ? null : num;
};

const safeInt = (value) => {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const num = parseInt(value);

  return isNaN(num) ? null : num;
};

const safeDate = (value) => {
  if (
    !value ||
    value === "" ||
    value === "undefined" ||
    value === "null"
  ) {
    return null;
  }

  const d = new Date(value);

  return isNaN(d.getTime())
    ? null
    : d;
};

/* =========================================
   MULTER CONFIG
========================================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    if (file.fieldname === "workOrderFile") {

      cb(null, "uploads/workorders/");

    } else if (file.fieldname === "fsFile") {

      cb(null, "uploads/fs/");

    } else {

      cb(new Error("Invalid file field"));

    }
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s/g, "_");

    cb(null, uniqueName);
  }
});

const upload = multer({

  storage,

  fileFilter: (req, file, cb) => {

    const allowedExt = [
      ".pdf",
      ".doc",
      ".docx",
      ".jpg",
      ".jpeg",
      ".png"
    ];

    const ext =
      path.extname(file.originalname)
        .toLowerCase();

    if (!allowedExt.includes(ext)) {

      return cb(
        new Error("Invalid file type")
      );

    }

    cb(null, true);
  }

});

/* =========================================
   GET PROJECT BY ID
========================================= */
router.get("/:id", async (req, res) => {

  try {

    const pool = getPool();

    const result =
      await pool
        .request()
        .input(
          "ID",
          sql.Numeric(38,0),
          req.params.id
        )
        .query(`
          SELECT *
          FROM TRN_CMWORKDATA
          WHERE TRN_CMWORKDATAID = @ID
        `);

    if (result.recordset.length === 0) {

      return res.status(404).json({
        error: "Project not found"
      });

    }

    const project =
      result.recordset[0];

    /* ===============================
       FUNDING
    =============================== */
    const fundingResult =
      await pool
        .request()
        .input(
          "ID",
          sql.Numeric(38,0),
          req.params.id
        )
        .query(`
          SELECT
            FUNDBY,
            FUNDBYPER
          FROM PRJ_FUNDDTL
          WHERE TRN_CMWORKDATAID = @ID
          ORDER BY PRJ_FUNDDTLID
        `);

    /* ===============================
       PHASES
    =============================== */
    const phaseResult =
      await pool
        .request()
        .input(
          "ID",
          sql.Numeric(38,0),
          req.params.id
        )
        .query(`
          SELECT
            PACKAGEPHASE,
            PH_CONTRACTNAME,
            PH_DTSANPRJ,
            PH_PRJSTARTDT,
            PH_REVPRJDT,
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
          WHERE TRN_CMWORKDATAID = @ID
          ORDER BY PRJ_CONTRACTDTLROW
        `);

    project.fundingPattern =
      fundingResult.recordset;

    project.phases =
      phaseResult.recordset;

    res.json(project);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});

/* =========================================
   UPDATE PROJECT
========================================= */
router.put(
  "/:id",

  upload.fields([
    {
      name: "workOrderFile",
      maxCount: 1
    },
    {
      name: "fsFile",
      maxCount: 1
    }
  ]),

  async (req, res) => {

    const pool = getPool();

    const transaction =
      new sql.Transaction(pool);

    try {

      const data = req.body;

      /* ===============================
         PARSE FUNDING
      =============================== */
      let fundingPattern = [];

      try {

        fundingPattern =
          data.fundingPattern
            ? JSON.parse(data.fundingPattern)
            : [];

      } catch {

        fundingPattern = [];

      }

      /* ===============================
         PARSE PHASES
      =============================== */
      let phases = [];

      try {

        phases =
          data.phases
            ? JSON.parse(data.phases)
            : [];

      } catch {

        phases = [];

      }

      /* ===============================
         VALIDATION
      =============================== */
      if (!data.projectName) {

        return res.status(400).json({
          error: "Project Name required"
        });

      }

      if (!data.ownerDept) {

        return res.status(400).json({
          error: "Owner Department required"
        });

      }

      /* ===============================
         FILES
      =============================== */
      let workOrderPath = null;

      if (req.files?.workOrderFile) {

        workOrderPath =
          "uploads/workorders/" +
          req.files.workOrderFile[0]
            .filename;

      }

      let fsPath = null;

      if (req.files?.fsFile) {

        fsPath =
          "uploads/fs/" +
          req.files.fsFile[0]
            .filename;

      }

      /* ===============================
         CALCULATIONS
      =============================== */
      const projectCost =
        safeNumber(data.projectCost);

      const revisedCost =
        safeNumber(data.revisedCost);

      const costOverrun =
        revisedCost - projectCost;

      const financialAmount =
        safeNumber(
          data.financialProgressAmount
        );

      const financialPercent =
        projectCost > 0
          ? (
              financialAmount /
              projectCost
            ) * 100
          : 0;

          const deptId =
  data.ownerDept &&
  !isNaN(data.ownerDept)
    ? parseInt(data.ownerDept)
    : null;

const stageId =
  data.projectStage &&
  !isNaN(data.projectStage)
    ? parseInt(data.projectStage)
    : null;

console.log("REQ BODY:", req.body);
console.log("PHASES:", phases);
console.log("FUNDING:", fundingPattern);

      /* ===============================
         START TRANSACTION
      =============================== */
      await transaction.begin();

      /* ===============================
         UPDATE MAIN TABLE
      =============================== */
      await new sql.Request(transaction)

        .input(
          "ID",
          sql.Numeric(38,0),
          req.params.id
        )

        .input(
          "PRJ_NAME",
          sql.VarChar(200),
          data.projectName
        )

        .input(
  "DEPTNAME",
  sql.Numeric(38,0),
  deptId
)
.input(
  "PRJ_STAGE",
  sql.Numeric(38,0),
  stageId
)

        .input(
          "FINYR",
          sql.VarChar(20),
          data.financialYear
        )

        .input(
          "DISTRICT",
          sql.VarChar(2000),
          data.location
        )

        .input(
          "MODEOFIMP",
          sql.VarChar(100),
          data.modeOfImplementation
        )

        .input(
          "IMPDEPT",
          sql.VarChar(200),
          data.implementingDepartment
        )

        .input(
          "IMPAGENCIES",
          sql.VarChar(200),
          data.implementingAgency
        )

        .input(
          "MLACONST",
          sql.VarChar(200),
          data.mlaConstituency
        )

        .input(
          "PARCONST",
          sql.VarChar(200),
          data.parliamentConstituency
        )

        .input(
          "NOOFVILL",
          sql.VarChar(50),
          data.townsBenefited
        )

        .input(
          "POPBEN",
          sql.Numeric(38,0),
          safeDecimalOrNull(data.populationBenefited)
        )

        .input(
          "CURRENTSLAB",
          sql.VarChar(200),
          data.physicalProgress
        )

        .input(
  "PHYFINPROGPER",
  sql.Decimal(18,2),
  safeDecimalOrNull(
    data.physicalProgressPercent
  )
)

        .input(
          "AFILL",
          sql.Char(1),
          data.autoFillBrief === "true"
            ? "Y"
            : "N"
        )

        .input(
          "WORKSTARTED",
          sql.Char(1),
          data.isWorkOrderGenerated === "true"
            ? "Y"
            : "N"
        )

        .input(
          "FSREASON",
          sql.Char(1),
          data.isFsGenerated === "true"
            ? "Y"
            : "N"
        )

        .input(
          "BRFPRJ",
          sql.NVarChar(sql.MAX),
          data.briefDescription
        )

        .input(
          "DCONTRACTNAME",
          sql.VarChar(200),
          data.contractorName
        )

        .input(
          "PRJ_DTSANPRJ",
          sql.DateTime,
          safeDate(data.dateOfSanction)
        )

        .input(
          "PRJ_STARTDT",
          sql.DateTime,
          safeDate(data.projectStartDate)
        )

        .input(
          "PRJ_REVPRJDT",
          sql.DateTime,
          safeDate(data.revisedStartDate)
        )

        .input(
          "PRJ_COMPLEPRJDT",
          sql.DateTime,
          safeDate(data.projectCompletionDate)
        )

        .input(
          "PRJ_REVCOMPLEDT",
          sql.DateTime,
          safeDate(
            data.revisedProjectCompletionDate
          )
        )

        .input(
          "PRJ_TIMEOVRRUN",
          sql.VarChar(80),
          data.projectTimeOverrun
        )

        .input(
          "PRJ_COST",
          sql.Decimal(18,2),
          projectCost
        )

        .input(
          "PRJ_REVCOST",
          sql.Decimal(18,2),
          revisedCost
        )

        .input(
          "PRJ_COSTOVERRUN",
          sql.Decimal(18,2),
          costOverrun
        )

        .input(
          "PRJ_TOTFUN",
          sql.Decimal(18,2),
          safeDecimalOrNull(data.totalFundsReleased)
        )

        .input(
  "PRJ_FINPRG",
  sql.Decimal(18,2),
  financialAmount
)


        .input(
  "PRJ_FINPRGPER",
  sql.Decimal(18,2),
  financialPercent
)

        .input(
          "PRJ_FUNDBY",
          sql.VarChar(100),
          data.fundingBy
        )

        .input(
  "PRJ_FUNDYPER",
  sql.Decimal(18,2),
  safeDecimalOrNull(data.fundingByPercent)
)

        .input(
          "PHOPT",
          sql.Char(1),
          data.multiplePackages === "true"
            ? "Y"
            : "N"
        )

        .input(
  "PHOPT1",
  sql.VarChar(20),
  data.multipleFundingSources === "true"
    ? "Y"
    : "N"
)

        .input(
          "WORKORDER_FILEPATH",
          sql.VarChar(500),
          workOrderPath
        )

        .input(
          "FS_FILEPATH",
          sql.VarChar(500),
          fsPath
        )

        .query(`
          UPDATE TRN_CMWORKDATA
          SET

            PRJ_NAME = @PRJ_NAME,
            DEPTNAME = @DEPTNAME,
            PRJ_STAGE = @PRJ_STAGE,
            FINYR = @FINYR,
            DISTRICT = @DISTRICT,
            MODEOFIMP = @MODEOFIMP,
            IMPDEPT = @IMPDEPT,
            IMPAGENCIES = @IMPAGENCIES,
            MLACONST = @MLACONST,
            PARCONST = @PARCONST,
            NOOFVILL = @NOOFVILL,
            POPBEN = @POPBEN,
            CURRENTSLAB = @CURRENTSLAB,
            PHYFINPROGPER = @PHYFINPROGPER,

            AFILL = @AFILL,
            WORKSTARTED = @WORKSTARTED,
            FSREASON = @FSREASON,

            BRFPRJ = @BRFPRJ,
            DCONTRACTNAME = @DCONTRACTNAME,

            PRJ_DTSANPRJ = @PRJ_DTSANPRJ,
            PRJ_STARTDT = @PRJ_STARTDT,
            PRJ_REVPRJDT = @PRJ_REVPRJDT,
            PRJ_COMPLEPRJDT = @PRJ_COMPLEPRJDT,
            PRJ_REVCOMPLEDT = @PRJ_REVCOMPLEDT,

            PRJ_TIMEOVRRUN = @PRJ_TIMEOVRRUN,

            PRJ_COST = @PRJ_COST,
PRJ_REVCOST = @PRJ_REVCOST,
PRJ_COSTOVERRUN = @PRJ_COSTOVERRUN,
PRJ_TOTFUN = @PRJ_TOTFUN,
PRJ_FINPRG = @PRJ_FINPRG,
PRJ_FINPRGPER = @PRJ_FINPRGPER,

            PRJ_FUNDBY = @PRJ_FUNDBY,
            PRJ_FUNDYPER = @PRJ_FUNDYPER,

            PHOPT = @PHOPT,
            PHOPT1 = @PHOPT1,

            WORKORDER_FILEPATH =
              ISNULL(
                @WORKORDER_FILEPATH,
                WORKORDER_FILEPATH
              ),

            FS_FILEPATH =
              ISNULL(
                @FS_FILEPATH,
                FS_FILEPATH
              )

          WHERE TRN_CMWORKDATAID = @ID
        `);

      /* ===============================
         DELETE OLD FUNDING
      =============================== */
      await new sql.Request(transaction)

        .input(
          "ID",
          sql.Numeric(38,0),
          req.params.id
        )

        .query(`
          DELETE FROM PRJ_FUNDDTL
          WHERE TRN_CMWORKDATAID = @ID
        `);

      /* ===============================
         INSERT FUNDING
      =============================== */
      for (let i = 0; i < fundingPattern.length; i++) {

        const f = fundingPattern[i];

        await new sql.Request(transaction)

          .input(
            "TRN_CMWORKDATAID",
            sql.Numeric(38,0),
            req.params.id
          )

         .input(
  "FUNDBY",
  sql.VarChar(200),
  f.FUNDBY ||
  f.fundingBy ||
  null
)

.input(
  "FUNDBYPER",
  sql.Numeric(5,2),
  safeDecimalOrNull(
    f.FUNDBYPER ||
    f.fundingByPercent
  )
)


          .query(`
            INSERT INTO PRJ_FUNDDTL
            (
              TRN_CMWORKDATAID,
              FUNDBY,
              FUNDBYPER,
              CREATEDON,
              ISACTIVE
            )
            VALUES
            (
              @TRN_CMWORKDATAID,
              @FUNDBY,
              @FUNDBYPER,
              GETDATE(),
              1
            )
          `);

      }

      /* ===============================
         DELETE OLD PHASES
      =============================== */
      await new sql.Request(transaction)

        .input(
          "ID",
          sql.Numeric(38,0),
          req.params.id
        )

        .query(`
          DELETE FROM PRJ_CONTRACTDTL
          WHERE TRN_CMWORKDATAID = @ID
        `);

      /* ===============================
         INSERT PHASES
      =============================== */
      for (let i = 0; i < phases.length; i++) {
        const p = phases[i];

        if (
          !p.packagePhase &&
          !p.contractorName &&
          !p.cost
        ) {
          continue;
        }

        const phaseCost =
  safeNumber(p.cost);

const revisedPhaseCost =
  safeNumber(p.revisedCost);

const phaseCostOverrun =
  revisedPhaseCost - phaseCost;

const phaseFinancial =
  safeNumber(
    p.financialProgress
  );

const phaseFinancialPercent =
  phaseCost > 0
    ? (
        phaseFinancial /
        phaseCost
      ) * 100
    : 0;
        await new sql.Request(transaction)

          .input(
            "TRN_CMWORKDATAID",
            sql.Numeric(38,0),
            req.params.id
          )

          .input(
            "PACKAGEPHASE",
            sql.VarChar(80),
            p.packagePhase || null
          )

          .input(
            "PH_CONTRACTNAME",
            sql.VarChar(80),
            p.contractorName || null
          )

          .input(
            "PHASECNT",
            sql.Numeric(18,0),
            i + 1
          )

          .input(
            "PRJ_CONTRACTDTLROW",
            sql.Numeric(18,0),
            i + 1
          )

          .input(
  "PH_DTSANPRJ",
  sql.DateTime,
  safeDate(p.dateOfSanction)
)

.input(
  "PH_PRJSTARTDT",
  sql.DateTime,
  safeDate(p.startDate)
)

.input(
  "PH_REVPRJDT",
  sql.DateTime,
  safeDate(p.revisedStartDate)
)

.input(
  "PH_COMPLEDT",
  sql.DateTime,
  safeDate(p.completionDate)
)

.input(
  "PH_REVCOMPLEDT",
  sql.DateTime,
  safeDate(p.revisedCompletionDate)
)

          .input(
            "PH_WORKCOST",
            sql.Decimal(18,2),
            phaseCost
          )

          .input(
            "PH_REVCOST",
            sql.Decimal(18,2),
            revisedPhaseCost
          )

          .input(
            "PH_COSTOVERRUN",
            sql.Decimal(18,2),
            phaseCostOverrun
          )

          .input(
            "PH_TOTFUN",
            sql.Decimal(18,2),
            safeNumber(p.totalFunds)
          )

          .input(
            "PH_FINPRG",
            sql.Decimal(18,2),
            phaseFinancial
          )

          .input(
            "PH_FINPRGPER",
            sql.Decimal(18,2),
            phaseFinancialPercent
          )

          .input(
            "PH_PHYSPRG",
            sql.VarChar(100),
            p.physicalProgress || null
          )

          .input(
            "PH_PHYSPRGPER",
            sql.Decimal(18,2),
            safeNumber(
              p.physicalProgressPercent
            )
          )

          .query(`
            INSERT INTO PRJ_CONTRACTDTL
            (
              TRN_CMWORKDATAID,
              PACKAGEPHASE,
              PH_CONTRACTNAME,
              PHASECNT,
              PRJ_CONTRACTDTLROW,

              PH_DTSANPRJ,
              PH_PRJSTARTDT,
              PH_REVPRJDT,
              PH_COMPLEDT,
              PH_REVCOMPLEDT,

              PH_WORKCOST,
              PH_REVCOST,
              PH_COSTOVERRUN,
              PH_TOTFUN,
              PH_FINPRG,
              PH_FINPRGPER,

              PH_PHYSPRG,
              PH_PHYSPRGPER,

              CREATEDON,
              ISACTIVE
            )

            VALUES
            (
              @TRN_CMWORKDATAID,
              @PACKAGEPHASE,
              @PH_CONTRACTNAME,
              @PHASECNT,
              @PRJ_CONTRACTDTLROW,

              @PH_DTSANPRJ,
              @PH_PRJSTARTDT,
              @PH_REVPRJDT,
              @PH_COMPLEDT,
              @PH_REVCOMPLEDT,

              @PH_WORKCOST,
              @PH_REVCOST,
              @PH_COSTOVERRUN,
              @PH_TOTFUN,
              @PH_FINPRG,
              @PH_FINPRGPER,

              @PH_PHYSPRG,
              @PH_PHYSPRGPER,

              GETDATE(),
              1
            )
          `);

      }

      await transaction.commit();

      res.json({
        success: true,
        message:
          "Project updated successfully"
      });

    } catch (err) {

      console.log(err);

      if (transaction._aborted !== true) {
        await transaction.rollback();
      }

      res.status(500).json({
        error: err.message
      });

    }

  }
);

module.exports = router;