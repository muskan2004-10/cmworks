const db = require("../db");

// CREATE Financial Year
exports.createFinancialYear = (req, res) => {
  const { fy, fvalue, isactive } = req.body;

  const sql = `
    INSERT INTO trn_fy (fy, fvalue, isactive)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [fy, fvalue, isactive], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    res.status(201).json({
      message: "Financial Year created successfully",
      id: result.insertId,
    });
  });
};

// GET Financial Years
exports.getFinancialYears = (req, res) => {
  const sql = `SELECT * FROM trn_fy ORDER BY TRN_FYID DESC`;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};
