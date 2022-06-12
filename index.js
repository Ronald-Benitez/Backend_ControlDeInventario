require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const apiRouter = require("./routes/api");

//Express setup
const app = express();

require("./db");

//Body parser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
//Root route
app.use("/api", apiRouter);

app.listen(process.env.PORT || process.env.PORT2, () => {
  console.log("Server is running on port " + process.env.PORT);
});
