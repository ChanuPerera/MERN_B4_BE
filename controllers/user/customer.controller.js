const Customer = require("../../models/user/customer.model");
const bcrypt = require("bcryptjs");

//// Create Customer
exports.createCustomer = async (req, res, next) => {
  try {
    const { name, email, password, contactNumber, shippingAddress } = req.body;

    /////////// Validate required fields

    if (!name || !email || !password || !contactNumber || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "name , email and password and contactNumber are required",
      });
    }

    //////////// CHeck if the email already exists
    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already Exists",
      });
    }


    ////////// Hash Password
    const hashedPassword = await bcrypt.hash(password , 10);
    
    
    ////////// Create Customer
    const customer = await Customer.create({
        name,
        email,
        password: hashedPassword, 
        contactNumber,
        shippingAddress,
    })


    /////////// Remove password before sending response
    const customerData = customer.toObject();
    delete customerData.password;


     return res.status(201).json({
      success: true,
      message: "Customer created successfully!",
      customer: customerData,
    });

  } catch (error) {
    next(error);
  }
};


