const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "the user is required"],
    },
    cartitem: [
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
    shippingaddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    taxprice: { type: Number, default: 0 },
    shippingprice: { type: Number, default: 0 },
    totalorderprice: Number,
    orederedAt: Date,
    orderpaied: { type: Boolean, default: false },
    deliveredAt: Date,
    orderdelivered: { type: Boolean, default: false },
    paymentmethod: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
  },
  { timestamps: true }
);
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email profileImage phone",
  }).populate({ path: "cartitem.product", select: "imageCover title" });
  next();
});
module.exports = mongoose.model("Order", orderSchema);
