require("dotenv").config({ path: "./.env" });
const mysql = require("mysql");

exports.database = mysql.createConnection({
  host: "localhost",
  user: process.env.USERID,
  password: process.env.PASSWORD,
  database: "inventam_task",
  multipleStatements: true,
});
