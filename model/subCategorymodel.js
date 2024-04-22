const mongoose = require("mongoose");

const subcategoryschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "u must insert name"],
      unique: [true, "is existed"],
      minlength: [2, "the name is too short"],
      maxlength: [32, "the name is too long"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    Category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "the subcategory must be added"],
    },
  },
  { timestamps: true }
);
subcategoryschema.pre(/^find/, function (next) {
  this.populate({ path: "Category", select: "name-_id" });
  next();
});

module.exports = mongoose.model("subcategory", subcategoryschema);
