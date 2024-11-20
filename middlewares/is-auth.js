const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
module.exports = async (req, res, next) => {
  try {
    const tokenHeaders =
      req.headers["Authorization"] || req.headers["authorization"];
    if (!tokenHeaders) {
      req.isAuth = false;
      return next();
    }
    const token = tokenHeaders.split(" ")[1];
    const result = jwt.verify(token, JWT_SECRET_KEY);
    if (result) {
      req.userId = result.userId;
      req.isAuth = true;
      return next();
    } else {
      req.isAuth = false;
      next();
    }
  } catch (err) {
    req.isAuth = false;
    return next();
  }
};
