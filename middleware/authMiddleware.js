const jwt = require("jsonwebtoken");
const Customer = require("../models/user/customer.model");

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }
    const token = authHeader.split(" ")[1];
    ////////// Verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Token invalid or expired. Please log in again",
        });
      }
      ////// Find user in DB
      const customer = await Customer.findById(decoded.id).select("-password");

      if(!customer){
        return res.status(404).json({
          success: false,
          message: "User no longer exists",
        });
      }

        ///// add user to request
        req.customer = customer;
        next();

    });

 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
