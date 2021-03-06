require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const apiRouter = require("./routes/api");
const cors = require("cors");

//Express setup
const app = express();
app.use(cors());
require("./db");

//Body parser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Root route
app.use("/api", apiRouter);

app.listen(process.env.PORT || process.env.PORT2, () => {
  console.log("Server is running on port " + process.env.PORT);
});
