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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
