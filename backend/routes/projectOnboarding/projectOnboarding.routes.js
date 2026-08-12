const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");
const multer = require("multer");
const fs = require("fs");

/* ===============================
   CREATE FOLDERS
=============================== */
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

createDir("uploads/workorders");
createDir("uploads/fs");

/* ===============================
   MULTER CONFIG
=============================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "workOrderFile") {
      cb(null, "uploads/workorders/");
    } else if (file.fieldname === "fsFile") {
      cb(null, "uploads/fs/");
    }
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s/g, "_");
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* ===============================
   ROUTE
=============================== */
router.post(
  "/",
  upload.fields([
    { name: "workOrderFile", maxCount: 1 },
    { name: "fsFile", maxCount: 1 }
  ]),
  async (req, res) => {
    const pool = getPool();
    const transaction = new sql.Transaction(pool);

    try {
      const data = req.body;

      /* ===============================
         FUNDING PARSE
      =============================== */
      let fundingPattern = [];
      try {
        fundingPattern = data.fundingPattern
          ? JSON.parse(data.fundingPattern)
          : [];
      } catch {
        fundingPattern = [];
      }

      /* ===============================
         PHASE PARSE
      =============================== */
      let phases = [];
      try {
        phases = data.phases ? JSON.parse(data.phases) : [];
      } catch {
        phases = [];
      }

      /* ===============================
         FILE PATHS
      =============================== */
      let workOrderPath = req.files?.workOrderFile
        ? "uploads/workorders/" + req.files.workOrderFile[0].filename
        : null;

      let fsPath = req.files?.fsFile
        ? "uploads/fs/" + req.files.fsFile[0].filename
        : null;

      /* ===============================
         VALIDATION
      =============================== */
      if (!data.projectName)
        return res.status(400).json({ error: "Project Name required" });

      if (!data.ownerDept)
        return res.status(400).json({ error: "Owner Department required" });

      /* ===============================
         CALCULATIONS
      =============================== */
      const projectCost = parseFloat(data.projectCost || 0);
      const revisedCost = parseFloat(data.revisedCost || 0);
      const costOverrun = revisedCost - projectCost;

      const financialAmount = parseFloat(data.financialProgressAmount || 0);
      const financialPercent =
        projectCost > 0 ? (financialAmount / projectCost) * 100 : 0;

      /* ===============================
         START TRANSACTION
      =============================== */
      await transaction.begin();
      const request = new sql.Request(transaction);

      const deptId =
        data.ownerDept && !isNaN(data.ownerDept)
          ? parseInt(data.ownerDept)
          : null;

      const stageId =
        data.projectStage && !isNaN(data.projectStage)
          ? parseInt(data.projectStage)
          : null;

      console.log("RAW ownerDept:", data.ownerDept);
      console.log("RAW projectStage:", data.projectStage);

      console.log("FINAL deptId:", deptId);
      console.log("FINAL stageId:", stageId);
      console.log("REQ BODY:", req.body);
      /* ===============================
         INSERT MAIN PROJECT
      =============================== */
      const result = await request
        .input("PRJ_NAME", sql.VarChar(200), data.projectName)
        .input("DEPTNAME", sql.BigInt, deptId)
        .input("PRJ_STAGE", sql.BigInt, stageId)
        .input("FINYR", sql.VarChar(20), data.financialYear)
        .input("DISTRICT", sql.VarChar(2000), data.location)
        .input("MODEOFIMP", sql.VarChar(100), data.modeOfImplementation)
        .input("IMPDEPT", sql.VarChar(200), data.implementingDepartment)
        .input("IMPAGENCIES", sql.VarChar(200), data.implementingAgency)
        .input("MLACONST", sql.VarChar(200), data.mlaConstituency)
        .input("PARCONST", sql.VarChar(200), data.parliamentConstituency)        
        .input("NOOFVILL", sql.VarChar(50), data.townsBenefited)
        .input("POPBEN", sql.Numeric(38, 0), data.populationBenefited || null)
        .input("CURRENTSLAB", sql.VarChar(200), data.physicalProgress)
        .input("PHYFINPROGPER", sql.Decimal(10, 2), data.physicalProgressPercent || null)
        .input("AFILL", sql.Char(1), data.autoFillBrief === "true" ? "Y" : "N")
        .input("WORKSTARTED", sql.Char(1), data.isWorkOrderGenerated === "true" ? "Y" : "N")
        .input("FSREASON", sql.Char(1), data.isFsGenerated === "true" ? "Y" : "N")
        .input("BRFPRJ", sql.NVarChar(sql.MAX), data.briefDescription)
        .input("DCONTRACTNAME", sql.VarChar(200), data.contractorName)
        .input("PRJ_DTSANPRJ", sql.DateTime, data.dateOfSanction || null)
        .input("PRJ_STARTDT", sql.DateTime, data.projectStartDate || null)
        .input("PRJ_REVPRJDT", sql.DateTime, data.revisedStartDate || null)
        .input("PRJ_COMPLEPRJDT", sql.DateTime, data.projectCompletionDate || null)
        .input("PRJ_REVCOMPLEDT", sql.DateTime, data.revisedProjectCompletionDate || null)
        .input("PRJ_TIMEOVRRUN", sql.VarChar(80), data.projectTimeOverrun)
        .input("PRJ_COST", sql.Decimal(18, 2), projectCost)
        .input("PRJ_REVCOST", sql.Decimal(18, 2), revisedCost)
        .input("PRJ_COSTOVERRUN", sql.Decimal(18, 2), costOverrun)
        .input("PRJ_TOTFUN", sql.Decimal(18, 2), data.totalFundsReleased || null)
        .input("PRJ_FINPRGPER", sql.Decimal(10, 2), financialPercent)
        .input("PHOPT", sql.Char(1), data.multiplePackages === "true" ? "Y" : "N")
        .input("PHOPT1", sql.Char(1), data.multipleFundingSources === "true" ? "Y" : "N")
        .input("WORKORDER_FILEPATH", sql.VarChar(500), workOrderPath)
        .input("FS_FILEPATH", sql.VarChar(500), fsPath)
        .input("PRJ_FUNDBY", sql.VarChar(100), data.fundingBy)
        .input("PRJ_FUNDYPER", sql.Decimal(5,2), data.fundingByPercent || null)
        .query(`
          INSERT INTO TRN_CMWORKDATA (
            PRJ_NAME, DEPTNAME, FINYR, DISTRICT, PRJ_STAGE, MODEOFIMP,
            IMPDEPT, IMPAGENCIES, MLACONST, PARCONST,
            NOOFVILL, POPBEN, CURRENTSLAB, PHYFINPROGPER,
            AFILL, WORKSTARTED, FSREASON, BRFPRJ,
            DCONTRACTNAME,
            PRJ_DTSANPRJ,
            PRJ_STARTDT,
            PRJ_REVPRJDT,
            PRJ_COMPLEPRJDT,
            PRJ_REVCOMPLEDT,
            PRJ_TIMEOVRRUN,
            PRJ_COST,
            PRJ_REVCOST,
            PRJ_COSTOVERRUN,
            PRJ_TOTFUN,
            PRJ_FINPRGPER,
            PRJ_FUNDBY,
            PRJ_FUNDYPER,
            PHOPT,
            PHOPT1,
            WORKORDER_FILEPATH,
            FS_FILEPATH
          )
          OUTPUT INSERTED.TRN_CMWORKDATAID
          VALUES (
            @PRJ_NAME, @DEPTNAME, @FINYR, @DISTRICT, @PRJ_STAGE, @MODEOFIMP,
            @IMPDEPT, @IMPAGENCIES, @MLACONST, @PARCONST,
            @NOOFVILL, @POPBEN, @CURRENTSLAB, @PHYFINPROGPER,
            @AFILL, @WORKSTARTED, @FSREASON, @BRFPRJ,
            @DCONTRACTNAME,
            @PRJ_DTSANPRJ,
            @PRJ_STARTDT,
            @PRJ_REVPRJDT,
            @PRJ_COMPLEPRJDT,
            @PRJ_REVCOMPLEDT,
            @PRJ_TIMEOVRRUN,
            @PRJ_COST,
            @PRJ_REVCOST,
            @PRJ_COSTOVERRUN,
            @PRJ_TOTFUN,
            @PRJ_FINPRGPER,
            @PRJ_FUNDBY,
            @PRJ_FUNDYPER,
            @PHOPT,
            @PHOPT1,
            @WORKORDER_FILEPATH,
            @FS_FILEPATH
          )
        `);

      const workId = result.recordset[0].TRN_CMWORKDATAID;

      /* ===============================
         INSERT FUNDING
      =============================== */
     
      for (let i = 0; i < fundingPattern.length; i++) {

        const f = fundingPattern[i];

        // GET NEXT ID
        const maxIdResult = await new sql.Request(transaction)
          .query(`
            SELECT ISNULL(MAX(PRJ_FUNDDTLID),0) + 1 AS NEXTID
            FROM PRJ_FUNDDTL
          `);

        const nextFundId = maxIdResult.recordset[0].NEXTID;

    

        await new sql.Request(transaction)
          .input("PRJ_FUNDDTLID", sql.Numeric(38,0), nextFundId)
          .input("TRN_CMWORKDATAID", sql.Numeric(38,0), workId)
          .input("FUNDBY", sql.VarChar(200), f.FUNDBY)
          .input(
            "FUNDBYPER",
            sql.Decimal(10,2),
            f.FUNDBYPER !== "" &&
            f.FUNDBYPER !== null &&
            f.FUNDBYPER !== undefined
              ? parseFloat(f.FUNDBYPER)
              : null
          )

          .query(`
            INSERT INTO PRJ_FUNDDTL
            (
              PRJ_FUNDDTLID,
              TRN_CMWORKDATAID,
              FUNDBY,
              FUNDBYPER,
              CREATEDON,
              ISACTIVE
            )
            VALUES
            (
              @PRJ_FUNDDTLID,
              @TRN_CMWORKDATAID,
              @FUNDBY,
              @FUNDBYPER,
              GETDATE(),
              1
            )
          `);
      }
       
      console.log("PHASES RECEIVED:", phases);
            
     /* ===============================
        INSERT PHASES
      ================================ */
      console.log("PHASES RECEIVED:", phases);

      for (let i = 0; i < phases.length; i++) {

        const p = phases[i];
        const phaseCost =
        parseFloat(p.cost) || 0;

      const revisedPhaseCost =
        parseFloat(p.revisedCost) || 0;

      const phaseCostOverrun =
        revisedPhaseCost - phaseCost;

      const phaseFinancial =
        parseFloat(p.financialProgress) || 0;

      const phaseFinancialPercent =
        phaseCost > 0
          ? (phaseFinancial / phaseCost) * 100
          : 0;

      const phaseTotalFunds =
        parseFloat(p.totalFunds) || 0;

      const phasePhysicalPercent =
        parseFloat(p.physicalProgressPercent) || 0;

        if (
        !p.packagePhase &&
        !p.contractorName &&
        !p.cost
      ) {
        continue;
      }

        await new sql.Request(transaction)

          /* REQUIRED IDS */

          .input(
            "TRN_CMWORKDATAID",
            sql.Numeric(38, 0),
            workId
          )

          /* ROW DETAILS */
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
            sql.Numeric(18, 0),
            i + 1
          )

          .input(
            "PRJ_CONTRACTDTLROW",
            sql.Numeric(18, 0),
            i + 1
          )

          /* OPTIONAL DATES */
          .input(
          "PH_DTSANPRJ",
          sql.DateTime,
          p.dateOfSanction
            ? new Date(p.dateOfSanction)
            : null
        )

        .input(
          "PH_PRJSTARTDT",
          sql.DateTime,
          p.startDate
            ? new Date(p.startDate)
            : null
        )

        .input(
          "PH_REVPRJDT",
          sql.DateTime,
          p.revisedStartDate
            ? new Date(p.revisedStartDate)
            : null
        )

        .input(
          "PH_COMPLEDT",
          sql.DateTime,
          p.completionDate
            ? new Date(p.completionDate)
            : null
        )

        .input(
          "PH_REVCOMPLEDT",
          sql.DateTime,
          p.revisedCompletionDate
            ? new Date(p.revisedCompletionDate)
            : null
        )

          /* COSTS */
          .input("PH_WORKCOST", sql.Decimal(18, 2), phaseCost)

          .input("PH_REVCOST", sql.Decimal(18, 2), revisedPhaseCost)

          .input("PH_COSTOVERRUN", sql.Decimal(18, 2), phaseCostOverrun)

          .input("PH_TOTFUN", sql.Decimal(10, 2), phaseTotalFunds)

          .input("PH_FINPRG", sql.Decimal(18, 2), phaseFinancial)

          .input("PH_FINPRGPER", sql.Decimal(18, 2), phaseFinancialPercent)

          /* PHYSICAL */
          .input(
            "PH_PHYSPRG",
            sql.VarChar(100),
            p.physicalProgress || null
          )

          .input(
            "PH_PHYSPRGPER",
            sql.Decimal(18, 2),
            p.physicalProgressPercent || 0
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
      res.json({ success: true });

    } catch (err) {
      await transaction.rollback();
      console.error("ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;