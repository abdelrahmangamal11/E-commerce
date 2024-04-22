const mongoose = require("mongoose");

const cartschema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        color: String,
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],
    totalprice: Number,
    totalpriceafterdiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartschema);
