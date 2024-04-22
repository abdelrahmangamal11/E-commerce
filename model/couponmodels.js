const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "the title is required"],
      unique: true,
    },

    discount: {
      type: Number,
    },
    expiredAt: {
      type: Date,
      required: [true, "the expired date is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("coupon", couponSchema);
