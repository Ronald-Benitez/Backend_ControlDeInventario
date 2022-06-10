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

//Root route
app.use("/api",apiRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port "+process.env.PORT);
});
