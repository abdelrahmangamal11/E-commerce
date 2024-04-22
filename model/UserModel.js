const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "the name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "the email is required"],
      unique: true,
      lowercase: true,
    },
    passwordchangedAt: Date,
    phone: String,
    profileImage: String,
    ChangPasswordHashedCode: String,
    ChangPasswordHashedCodeExpiration: Date,
    ChangPasswordConfirmation: Boolean,
    password: {
      type: String,
      required: [true, "the password required"],
      minlength: [6, "the password should be longer than 6"],
    },
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    address: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
module.exports = mongoose.model("User", userSchema);
