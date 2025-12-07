const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim:true,
    },
    password: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    shippingAddress: {
      addressLine1:{type: String, required: true},
      addressLine2:{type: String, default: ""},
      city:{type: String, required: true},
      postalCode:{type: String, required: true},
      state:{type: String, required: true},
      country: {type: String, required: true},
    },

    orders:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Order"
        }
    ],

    wishlist:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Watch"
        }
    ],
    cart:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Watch"
            },
            quantity:{
                type: Number,
                default: 1,
            }
        }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", CustomerSchema);
