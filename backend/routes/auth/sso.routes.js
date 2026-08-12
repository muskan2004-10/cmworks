const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/sso-callback", async (req, res) => {

    try {

        const { userdetails } = req.body;

        if (!userdetails) {
            return res.status(401).json({
                message: "INVALID_SSO_PAYLOAD"
            });
        }

        // STEP 2
        const tokenResponse = await axios.get(
            `${process.env.SSO_BASE_URL}/SSOREST/GetTokenDetailJSON/${userdetails}`
        );

        const tokenData = tokenResponse.data;

        // STEP 3
        const userResponse = await axios.get(
            `${process.env.SSO_BASE_URL}/SSOREST/GetUserDetailJSON/${tokenData.SAMAccountName}/${process.env.SSO_USERNAME}/${process.env.SSO_PASSWORD}`
        );

        const ssoUser = userResponse.data;
        console.log(ssoUser);
        
        const existingUser = await pool
        .request()
        .input("username", sql.VarChar,
        ssoUser.SSOID.toLowerCase())
        .query(`
        SELECT *
        FROM Users
        WHERE LOWER(username)=LOWER(@username)
        `);

        if (existingUser.recordset.length === 0) {

        await pool.request()
          .input("username", sql.VarChar,
          ssoUser.SSOID)

          .input("fullname",
          sql.VarChar,
          ssoUser.DisplayName)

          .input("email",
          sql.VarChar,
          ssoUser.MailPersonal)

          .query(`
            INSERT INTO Users
            (
              username,
              fullname,
              email
            )
            VALUES
            (
              @username,
              @fullname,
              @email
            )
          `);
        }



    }
    catch(error){
        console.log(error);
    }

});

module.exports = router;