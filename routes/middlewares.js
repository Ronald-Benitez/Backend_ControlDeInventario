const jwt = require("jwt-simple");
require("dotenv").config();
const moment = require("moment");

const checkToken = (req, res, next) => {
  if (!req.headers["user-token"]) {
    return res.json({ error: "Se necessita un token" });
  }

  const userToken = req.headers["user-token"];
  let payload = {};

  try {
    payload = jwt.decode(userToken, process.env.JWT_SECRET);
  } catch (err) {
    return res.json({ error: "Token invalido" });
  }

  if (payload.expiredAt < moment().unix()) {
    return res.json({ error: "Token expirado" });
  }

  req.type = payload.type;

  next();
};

module.exports = {
    checkToken : checkToken
};
