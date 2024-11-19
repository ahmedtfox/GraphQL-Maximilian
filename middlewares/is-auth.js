const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const tokenHeaders =
      req.headers["Authorization"] || req.headers["authorization"];
    if (!tokenHeaders) {
      const err = new Error("Invalid token");
      err.statusCode = 401;
      throw err;
    }

    const token = tokenHeaders.split(" ")[1];
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const result = jwt.verify(token, JWT_SECRET_KEY);
    if (result) {
      req.userId = result.userId; // Set user info to request object
      return next();
    } else {
      const err = new Error("Invalid token");
      err.statusCode = 401;
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return next(err);
  }
};
