const mongooose = require("mongoose");

const productmodel = require("./producatsmodel");

const reviewsschema = new mongooose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "the rating must be larger than 1"],
      max: [5, "the rating must be lower than 5"],
    },
    User: {
      type: mongooose.Schema.ObjectId,
      ref: "User",
      required: [true, "the user is required"],
    },
    Product: {
      type: mongooose.Schema.ObjectId,
      ref: "Product",
      required: [true, "the product is required"],
    },
  },
  { timestamps: true }
);

reviewsschema.post("save", function () {
  this.constructor.gettheQuantityAndTheAvgofRatings(this.Product);
});

reviewsschema.post("remove", function () {
  this.constructor.gettheQuantityAndTheAvgofRatings(this.Product);
});

reviewsschema.statics.gettheQuantityAndTheAvgofRatings = async function (
  productId
) {
  const resault = await this.aggregate([
    // Stage 1 : get all reviews in specific product
    {
      $match: { Product: productId },
    },
    // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: "Product",
        ratingsAverage: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (resault.length > 0) {
    await productmodel.findOneAndUpdate(
      { _id: productId },
      {
        // to give the value of aggregate to the(ratingsQuantity,ratingsAverage) at the product Model
        ratingsAverage: resault[0].ratingsAverage,
        ratingsQuantity: resault[0].ratingsQuantity,
      }
    );
  } else {
    await productmodel.findOneAndUpdate(
      { _id: productId },
      {
        // to give the value of aggregate to the(ratingsQuantity,ratingsAverage) at the product Model
        ratingsAverage: 0,
        ratingsQuantity: 0,
      }
    );
  }
};

reviewsschema.pre(/^find/, function (next) {
  this.populate({ path: "User", select: "name" });
  next();
});
module.exports = mongooose.model("reviews", reviewsschema);
