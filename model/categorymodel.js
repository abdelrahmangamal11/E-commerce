const mongoose = require("mongoose");
//Schema
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category required"],
      unique: [true, "category should be unique"],
      minlength: [3, "too short name"],
      maxlength: [32, "too long name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);
const mongoosemiddle = (doc) => {
  const BaseUrl = `${process.env.BaseURL}/categories/${doc.image}`;
  doc.image = BaseUrl;
};
schema.post("init", (doc) => {
  mongoosemiddle(doc);
});
schema.post("save", (doc) => {
  mongoosemiddle(doc);
});

mongoose.set("strictQuery", false);
// Model
const categoryodel = mongoose.model("Category", schema);
module.exports = categoryodel;
