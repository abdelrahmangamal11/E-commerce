const mongoose = require("mongoose");

const schema = mongoose.Schema(
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
    image: String,
  },
  { timestamps: true }
);
const mongoosemiddle = (doc) => {
  const BaseUrl = `${process.env.BaseURL}/brands/${doc.image}`;
  doc.image = BaseUrl;
};
schema.post("init", (doc) => {
  mongoosemiddle(doc);
});
schema.post("save", (doc) => {
  mongoosemiddle(doc);
});

module.exports = mongoose.model("Brands", schema);
// const Brandsmodel = new mongoose.model("Brands", schema);
// module.exports = Brandsmodel;
