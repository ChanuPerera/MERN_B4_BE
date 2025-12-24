const Customer = require("../../models/user/customer.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

///////// Customer Login

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    ///validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    ////////////Find Customer
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    //////////////// Compare Password

    const isPasswordMatch = await bcrypt.compare(password, customer.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Email or password is Incorrect",
      });
    }

    //////// Create JWT token
    const token = jwt.sign(
      {
        id: customer._id,
        email: customer.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    /////////// Remove password before sending response
    const customerData = customer.toObject();
    delete customerData.password;

    return res.status(201).json({
      success: true,
      message: "Login successfully!",
      customer: customerData,
      token,
    });
  } catch (error) {
    next(error);
  }
};

////// Customer Logout

exports.logoutUser = async (req, res, next) => {
  try {
    /// id the token  stored in cookies
    res.clearCookies("token");

    return res.status(200).json({
      success: true,
      message: "Log out successfully!",
    });
  } catch (error) {
    next(error);
  }
};

///// Get logged in customer details

exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: req.customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
