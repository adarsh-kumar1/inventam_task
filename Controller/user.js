require("dotenv").config({ path: "../.env" });
const { database } = require("../utils/database");

exports.userGetlist = (req, res, next) => {
  try {
    let sql;
    switch (req.role_name) {
      case "Admin":
        sql = `select * from  tbl_user`;
        break;
      case "Superviser":
        sql = `select * from tbl_user join tbl_role using(user_id) where role_name<>'Admin' `;
        break;
      case "Customer":
        sql = `select * from tbl_user join tbl_role using(user_id) where role_name='Customer' `;
    }
    database.query(sql, function (err, result) {
      if (err) throw err;
      if (result.length <= 0) {
        res.status(500).json({ message: "data not found" });
      } else {
        console.log(result.length);
        res.status(200).json(result);
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
