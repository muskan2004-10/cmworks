const sql = require("mssql");

const config = {
  user: "sa",
  password: "muskan",
  server: "localhost",
  database: "CMWMS",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool;

const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log("✅ SQL Server Connected");
  } catch (err) {
    console.error("❌ Database Connection Failed:", err);
  }
};

module.exports = {
  sql,
  connectDB,
  getPool: () => pool
};
