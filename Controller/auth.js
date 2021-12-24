require("dotenv").config({ path: "../.env" });
const { database } = require("../utils/database");
const bcrypt = require("bcryptjs");
const path = require("path");
const jwt = require("jsonwebtoken");

exports.signin = (req, res, next) => {
  const user_id = req.body.user_id;
  const password = req.body.password;
  console.log(req.body);
  try {
    var sql = `select * from tbl_user join tbl_role using(user_id) where user_id='${user_id}' and password='${password}'`;
    database.query(sql, function (err, result) {
      if (err) throw err;
      if (result.length <= 0) {
        res.status(500).json({ message: "Wrong Email or Password" });
      } else {
        console.log("result", result[0]);

        const token = jwt.sign(
          {
            user_id: result[0].user_id,
            role_name: result[0].role_name,
          },
          process.env.jwtToken
        );

        res.cookie("token", token, { httpOnly: true, signed: true });
        res.status(200).json({ message: "Login Sucessfull", token: token });
      }
    });
  } catch (err) {
    {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
};
