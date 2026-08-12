const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../../db");

router.post("/", async (req, res) => {
  try {
    const pool = getPool();
    const { category, rows } = req.body;

    // ================= VALIDATION =================
    if (!category || !category.trim()) {
      return res.status(400).json({ error: "Issue Category is required" });
    }

    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: "At least one subcategory required" });
    }

    console.log("Received Data:", req.body);

    // ================= INSERT CATEGORY =================
    // (issue_cat HAS audit fields)
    const result = await pool.request()
      .input("CATNAME", sql.VarChar(100), category)
      .input("CREATEDBY", sql.VarChar(50), "admin")
      .input("CANCEL", sql.Char(1), "N")
      .query(`
        INSERT INTO issue_cat
        (
          CATNAME,
          CREATEDBY,
          CREATEDON,
          CANCEL
        )
        OUTPUT INSERTED.ISSUE_CATID
        VALUES
        (
          @CATNAME,
          @CREATEDBY,
          GETDATE(),
          @CANCEL
        )
      `);

    const issueCatId = result.recordset[0].ISSUE_CATID;

    console.log("Inserted Category ID:", issueCatId);

    // ================= INSERT SUBCATEGORIES =================
    // (issue_subcat DOES NOT HAVE audit fields)
    for (let i = 0; i < rows.length; i++) {
      const sub = rows[i];

      if (sub.value && sub.value.trim()) {
        console.log(`Inserting Subcategory ${i + 1}:`, sub.value);

        await pool.request()
          .input("ISSUE_CATID", sql.BigInt, issueCatId)
          .input("SUBCATNAME", sql.VarChar(100), sub.value)
          .query(`
            INSERT INTO issue_subcat
            (
              ISSUE_CATID,
              SUBCATNAME
            )
            VALUES
            (
              @ISSUE_CATID,
              @SUBCATNAME
            )
          `);
      }
    }

    // ================= SUCCESS =================
    res.status(200).json({
      message: "Issue Category and Types saved successfully"
    });

  } catch (err) {
    console.error("Insert Issue Category Error:", err);

    res.status(500).json({
      error: err.message
    });
  }
});
router.get("/list", async (req, res) => {
  try {
    const pool = getPool();

    const result = await pool.request().query(`
      SELECT 
        c.ISSUE_CATID,
        c.CATNAME,
        s.SUBCATNAME
      FROM issue_cat c
      LEFT JOIN issue_subcat s 
        ON c.ISSUE_CATID = s.ISSUE_CATID
      ORDER BY c.CATNAME
    `);

    res.json(result.recordset);

  } catch (err) {
    console.error("Fetch Category Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;