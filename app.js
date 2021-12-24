require("dotenv").config({ path: "./.env" });

const express = require("express");
const cookieParser = require("cookie-parser");
const authController = require("./Controller/auth");
const userController = require("./Controller/user");
const is_auth = require("./Controller/is_auth");
const { database } = require("./utils/database");
const app = new express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.cookieToken));

app.use("/userlogin", authController.signin);

app.use("/user/getlist", is_auth, userController.userGetlist);

app.use((error, req, res, next) => {
  console.log("error find ", error);
  if (error.code === "EBADCSRFTOKEN") {
    error.statusCode = 403;
    error.message = "Access Denied ";
  }

  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(process.env.PORT || 5000, () => {
  database.connect((err) => {
    if (err) throw err;
    console.log("server started successfully");
  });
});
