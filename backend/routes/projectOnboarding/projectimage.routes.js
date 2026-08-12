const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { sql, getPool } = require("../../db");

/* ==================================
   CREATE FOLDERS
================================== */

const createDir = (dir) => {

  if (!fs.existsSync(dir)) {

    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
};

createDir("uploads/images");
createDir("uploads/docs");

/* ==================================
   MULTER STORAGE
================================== */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    if (
      file.fieldname === "images"
    ) {

      cb(null, "uploads/images/");

    } else {

      cb(null, "uploads/docs/");
    }
  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
        "-" +
        Math.round(
          Math.random() * 1e9
        ) +
        path.extname(
          file.originalname
        )
    );
  },
});

const upload = multer({
  storage,
});

/* ==================================
   GET PROJECT LIST
================================== */

router.get(
  "/projects",
  async (req, res) => {

    try {

      const pool =
        await getPool();

      const result =
        await pool.request().query(`

          SELECT
            TRN_CMWORKDATAID,
            PRJ_NAME
          FROM TRN_CMWORKDATA
          WHERE ISACTIVE = 1
          ORDER BY PRJ_NAME
        `);

      res.json(
        result.recordset
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

/* ==================================
   GET IMAGES BY PROJECT
================================== */

router.get(
  "/by-project/:id",
  async (req, res) => {

    try {

      const pool =
        await getPool();

      const projectId =
        req.params.id;

      const result =
        await pool.request()
          .input(
            "id",
            sql.Numeric(38, 0),
            projectId
          )
          .query(`

            SELECT
              DTL.*
            FROM PRJ_IMGHDR HDR

            INNER JOIN PRJ_IMGDTL DTL
              ON HDR.PRJ_IMGHDRID =
                 DTL.PRJ_IMGHDRID

            WHERE HDR.TRN_CMWORKDATAID = @id

            ORDER BY
              DTL.PRJ_IMGDTLID DESC
          `);

      res.json(
        result.recordset
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

/* ==================================
   UPLOAD
================================== */

router.post(
  "/upload",

  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "document",
      maxCount: 1,
    },
  ]),

  async (req, res) => {

    try {

      const pool =
        await getPool();

      const {
        PRJ_NAME,
        PRJIMGDT,
        IMGTITLE,
      } = req.body;

      const projectId =
        Number(PRJ_NAME);

      if (
        !projectId ||
        isNaN(projectId)
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid Project ID",
        });
      }

      const images =
        req.files["images"] || [];

      const doc =
        req.files["document"]?.[0] ||
        null;

      if (
        images.length === 0
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Please upload at least one image",
        });
      }

      /* HEADER ID */

      const hdr =
        await pool.request().query(`

          SELECT
          ISNULL(
            MAX(PRJ_IMGHDRID),
            0
          ) + 1 AS id

          FROM PRJ_IMGHDR
        `);

      const hdrId =
        hdr.recordset[0].id;

      /* INSERT HEADER */

      await pool
        .request()
        .input(
          "id",
          sql.Numeric(38, 0),
          hdrId
        )
        .input(
          "prj",
          sql.Numeric(38, 0),
          projectId
        )
        .input(
          "dt",
          sql.DateTime,
          new Date(PRJIMGDT)
        )
        .query(`

          INSERT INTO PRJ_IMGHDR
          (
            PRJ_IMGHDRID,
            PRJ_NAME,
            TRN_CMWORKDATAID,
            PRJIMGDT,
            CREATEDON
          )

          VALUES
          (
            @id,
            @prj,
            @prj,
            @dt,
            GETDATE()
          )
        `);

      /* INSERT DETAILS */

      for (
        let i = 0;
        i < images.length;
        i++
      ) {

        const dtl =
          await pool.request().query(`

            SELECT
            ISNULL(
              MAX(PRJ_IMGDTLID),
              0
            ) + 1 AS id

            FROM PRJ_IMGDTL
          `);

        const dtlId =
          dtl.recordset[0].id;

        await pool
          .request()
          .input(
            "dtlid",
            sql.Numeric(38, 0),
            dtlId
          )
          .input(
            "hdrid",
            sql.Numeric(38, 0),
            hdrId
          )
          .input(
            "row",
            sql.Numeric(38, 0),
            i + 1
          )
          .input(
            "title",
            sql.VarChar(200),
            IMGTITLE
          )
          .input(
            "img",
            sql.VarChar(sql.MAX),
            images[i].filename
          )
          .input(
            "doc",
            sql.VarChar(sql.MAX),
            doc
              ? doc.filename
              : ""
          )
          .input(
            "docpath",
            sql.VarChar(sql.MAX),
            doc
              ? `uploads/docs/${doc.filename}`
              : ""
          )
          .query(`

            INSERT INTO PRJ_IMGDTL
            (
              PRJ_IMGDTLID,
              PRJ_IMGHDRID,
              PRJ_IMGDTLROW,
              IMGTITLE,
              AXP_GRIDATTACH_2,
              AXPFILE_MYDOCS,
              AXPFILEPATH_MYDOCS
            )

            VALUES
            (
              @dtlid,
              @hdrid,
              @row,
              @title,
              @img,
              @doc,
              @docpath
            )
          `);
      }

      res.json({
        success: true,
        message:
          "Saved Successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

module.exports = router;