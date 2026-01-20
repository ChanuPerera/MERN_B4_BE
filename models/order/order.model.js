const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Watch",
          required: true,
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      postalCode: String,
      state: String,
      country: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "CARD"],
      default: "COD",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
