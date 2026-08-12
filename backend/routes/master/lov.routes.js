const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

/* ===============================
   GET ALL LOV
================================ */
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
        CM_LOVID,
        LISTCODE,
        LISTDESC,
        LISTACTIVE
      FROM cm_lov
      ORDER BY LISTCODE
    `);

    res.json(result.recordset);

  } catch (err) {
    console.error("Fetch LOV Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   GET LOV VALUES BY LISTCODE
================================ */
router.get("/values/:listCode", async (req, res) => {
  try {
    const pool = await getPool();

    const { listCode } = req.params;

    const result = await pool.request()
      .input("LISTCODE", sql.VarChar(50), listCode)
      .query(`
        SELECT 
          v.CM_LOV_VALUESID,
          v.VALUECODE,
          v.VALUEDESC,
          v.ACTIVE
        FROM cm_lov_values v
        INNER JOIN cm_lov l 
          ON v.CM_LOVID = l.CM_LOVID
        WHERE l.LISTCODE = @LISTCODE
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error("Fetch LOV Values Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {

    const pool = getPool();
    const { listCode, listDesc, rows } = req.body;

    /* =============================
       INSERT INTO cm_lov
    ============================= */

    const lovResult = await pool.request()
      .input("LISTCODE", sql.VarChar(50), listCode)
      .input("LISTDESC", sql.VarChar(200), listDesc)
      .input("LISTACTIVE", sql.VarChar(20), "Y")

      .query(`
        INSERT INTO cm_lov
        (
          LISTCODE,
          LISTDESC,
          LISTACTIVE
        )
        VALUES
        (
          @LISTCODE,
          @LISTDESC,
          @LISTACTIVE
        );

        SELECT SCOPE_IDENTITY() AS CM_LOVID;
      `);

    const cmLovId = lovResult.recordset[0].CM_LOVID;

    /* =============================
       INSERT INTO cm_lov_values
    ============================= */

    for (let i = 0; i < rows.length; i++) {

      const row = rows[i];

      await pool.request()
        .input("CM_LOVID", sql.BigInt, cmLovId)
        .input("CM_LOV_VALUESROW", sql.BigInt, i + 1)
        .input("VALUECODE", sql.VarChar(100), row.code)
        .input("VALUEDESC", sql.VarChar(200), row.desc)
        .input("ACTIVE", sql.VarChar(20), row.active ? "Y" : "N")
        .input("UNITIFANY", sql.VarChar(10), "")

        .query(`
          INSERT INTO cm_lov_values
          (
            CM_LOVID,
            CM_LOV_VALUESROW,
            VALUECODE,
            VALUEDESC,
            ACTIVE,
            UNITIFANY
          )
          VALUES
          (
            @CM_LOVID,
            @CM_LOV_VALUESROW,
            @VALUECODE,
            @VALUEDESC,
            @ACTIVE,
            @UNITIFANY
          )
        `);

    }

    res.json({
      message: "List of Value saved successfully"
    });

  }
  catch (err) {

    console.error("Insert LOV Error:", err);

    res.status(500).json({
      error: err.message
    });

  }
});

module.exports = router;
