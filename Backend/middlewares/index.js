const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: `Token Missing Please Login Again` });
    }
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Token Authentication Failed`,
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Admin",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Authorization Failed` });
  }
};

exports.isSalesman = async (req, res, next) => {
  try {
    if (req.user.role !== "Salesman") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Salesman",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Authorization Failed` });
  }
};
