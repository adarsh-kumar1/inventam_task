require("dotenv").config({ path: "../.env" });
const jwt = require("jsonwebtoken");
const { database } = require("../utils/database");

module.exports = (req, res, next) => {
  let token = req.signedCookies.token;

  console.log("getting token", token);

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.jwtToken);
  } catch (err) {
    const error = new Error("Your Login Id Expired So, Please Login Again");
    error.statusCode = 500;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error("Your Login Id Expired So, Please Login Again");
    error.statusCode = 500;
    throw error;
  } else {
    const user_id = decodedToken.user_id;

    console.log("tokendata", user_id);

    var sql = `select * from tbl_user where user_id='${user_id}'`;
    database.query(sql, function (err, result) {
      if (err) throw err;
      if (result.length <= 0) {
        res.status(401).json({ message: "Not Authenticate" });
      } else {
        // res.status(200).json({ message: "Authenticate" });
        req.user_id = decodedToken.user_id;
        req.role_name = decodedToken.role_name;
        next();
      }
    });
  }
};
