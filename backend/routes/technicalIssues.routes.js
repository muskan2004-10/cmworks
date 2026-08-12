// technicalIssue.routes.js

const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const { sql } = require("../db");

// ======================================================
// FILE UPLOAD CONFIG
// ======================================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/technical/");
  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
      path.extname(
        file.originalname
      )
    );
  },
});

const upload = multer({
  storage
});

// ======================================================
// GET NEXT TICKET
// ======================================================

router.get(
  "/next-ticket",
  async (req, res) => {

    try {

      const result =
        await sql.query(`
          SELECT ISNULL(MAX(TECHISSUESID),0)+1 AS NEWID
          FROM TECHISSUES
        `);

      const newId =
        result.recordset[0].NEWID;

      const year =
        new Date().getFullYear();

      const ticketNo =
        `TICK-${year}-${String(newId).padStart(3, "0")}`;

      res.status(200).json({
        success: true,
        newId,
        ticketNo
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });
    }
  }
);

// ======================================================
// CREATE ISSUE
// ======================================================

router.post(
  "/create",
  upload.single("file"),
  async (req, res) => {

    let transaction;

    try {

      const {
        TECHISSUESID,
        TICKENO,
        USERNAME,
        CREATEDBY,
        RELATEDISSUE,
        REPORTFORMNAME,
        ISSUEDESCRIPTION,
        STATUS,
        DEPTNAME,
        ISSTYPE,
      } = req.body;

      const uploadedFile =
        req.file
          ? req.file.filename
          : "";

      const uploadedFilePath =
        req.file
          ? `/uploads/technical/${req.file.filename}`
          : "";

      const pool =
        await sql.connect();

      transaction =
        new sql.Transaction(pool);

      await transaction.begin();

      const request =
        new sql.Request(
          transaction
        );

      // ======================================================
      // INSERT QUERY
      // ======================================================

      await request.query(`
        INSERT INTO TECHISSUES
        (
          TECHISSUESID,
          CANCEL,
          USERNAME,
          MODIFIEDON,
          CREATEDBY,
          CREATEDON,
          TICKENO,
          ISSTYPE,
          RELATEDISSUE,
          REPORTFORMNAME,
          ISSUEDESCRIPTION,
          AXPFILE_FILE,
          STATUS,
          DEPTNAME,
          AXPFILEPATH_MYDOCS,
          AXPFILE_MYDOCS
        )
        VALUES
        (
          ${TECHISSUESID},
          'N',
          '${USERNAME || "ADMIN"}',
          GETDATE(),
          '${CREATEDBY || "ADMIN"}',
          GETDATE(),
          '${TICKENO}',
          '${ISSTYPE || "Technical"}',
          '${RELATEDISSUE || ""}',
          '${REPORTFORMNAME || ""}',
          '${ISSUEDESCRIPTION || ""}',
          '${uploadedFile}',
          '${STATUS || "Pending"}',
          '${DEPTNAME || "ALL"}',
          '${uploadedFilePath}',
          '${uploadedFile}'
        )
      `);

      await transaction.commit();

      res.status(201).json({
        success: true,
        message:
          "Technical Issue Submitted Successfully",
        ticketNo: TICKENO
      });

    } catch (error) {

      if (transaction) {

        await transaction.rollback();
      }

      console.log(
        "SERVER ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message
      });
    }
  }
);

// ======================================================
// GET ALL ISSUES
// ======================================================

router.get(
  "/all",
  async (req, res) => {

    try {

      const result =
        await sql.query(`
          SELECT *
          FROM TECHISSUES
          ORDER BY CREATEDON DESC
        `);

      res.status(200).json({
        success: true,
        data:
          result.recordset
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });
    }
  }
);

// ======================================================
// UPDATE STATUS
// ======================================================

router.put(
  "/status/:ticketNo",
  async (req, res) => {

    try {

      const { ticketNo } =
        req.params;

      const { STATUS } =
        req.body;

      await sql.query(`
        UPDATE TECHISSUES
        SET STATUS='${STATUS}'
        WHERE TICKENO='${ticketNo}'
      `);

      res.status(200).json({
        success: true,
        message:
          "Status Updated Successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });
    }
  }
);

// ======================================================
// DELETE ISSUE
// ======================================================

router.delete(
  "/delete/:ticketNo",
  async (req, res) => {

    try {

      const { ticketNo } =
        req.params;

      await sql.query(`
        DELETE FROM TECHISSUES
        WHERE TICKENO='${ticketNo}'
      `);

      res.status(200).json({
        success: true,
        message:
          "Deleted Successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });
    }
  }
);

module.exports = router;