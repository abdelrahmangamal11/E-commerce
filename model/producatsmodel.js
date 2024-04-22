// const mongoose = require("mongoose");

// const productschema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [0, "the title of product is required"],
//       minlength: [3, "the title is too short"],
//       maxlength: [100, "the title is too long"],
//     },
//     description: {
//       type: String,
//       required: [0, "the description of product is required"],
//       minlength: [3, "the description is too short"],
//       maxlength: [1000, "the description is too long"],
//     },
//     imageCover: {
//       type: String,
//       required: [true, "the coverage is required"],
//     },
//     images: [String],
//     quantity: {
//       type: Number,
//       required: [true, "the quantity is required"],
//     },
//     color: [String],
//     price: {
//       type: Number,
//       required: [true, "the price is required"],
//       trim: true,
//       max: [200000000000000, "the price is too large"],
//     },
//     priceAfterDiscount: {
//       type: Number,
//     },
//     sold: {
//       type: Number,
//       default: 0,
//     },
//     category: {
//       type: mongoose.Schema.ObjectId,
//       ref: "Category",
//       required: [true, "should be added to category"],
//     },
//     subcategory: [
//       {
//         type: mongoose.Schema.ObjectId,
//         ref: "subcategory",
//       },
//     ],
//     brands: {
//       type: mongoose.Schema.ObjectId,
//       ref: "Brands",
//     },
//     ratingavg: {
//       type: Number,
//       min: [1, "the rating must be 1 OR above"],
//       max: [5, "the rating must be 5 OR less"],
//     },
//     ratingsQuantity: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );
// // const productmodel =
// module.exports = mongoose.model("product", productschema);
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// Mongoose query middleware

// to enable virual populate
productSchema.virtual("reviews", {
  ref: "reviews",
  localField: "_id",
  foreignField: "Product",
});

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name-_id" });
  next();
});
const mongoosemiddle = (doc) => {
  if (doc.imageCover) {
    const BaseUrl = `${process.env.BaseURL}/products/${doc.imageCover}`;
    doc.imageCover = BaseUrl;
  }
  if (doc.images) {
    const imageslist = [];
    doc.images.forEach((img) => {
      const BaseUrl = `${process.env.BaseURL}/products/${img}`;
      imageslist.push(BaseUrl);
    });
    doc.images = imageslist;
  }
};
productSchema.post("init", (doc) => {
  mongoosemiddle(doc);
});
productSchema.post("save", (doc) => {
  mongoosemiddle(doc);
});
module.exports = mongoose.model("Product", productSchema);
