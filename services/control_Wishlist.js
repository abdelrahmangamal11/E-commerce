const asyncHandler = require("express-async-handler");
const Usermodel = require("../model/UserModel");

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Protected/User
const addProductToWishList = asyncHandler(async (req, res, next) => {
  // $addToSet => add productId to wishlist array if productId not exist
  const user = await Usermodel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: req.body.product } },
    { new: true }
  );

  res.status(200).json({ data: user.wishlist });
  next();
});

// @desc    remove adress from wishlist
// @route   POST /api/v1/wishlist
// @access  Protected/User
const removeProductfromWishList = asyncHandler(async (req, res, next) => {
  // $pull => remove productId from wishlist array if productId exist
  const user = await Usermodel.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.params.id } },
    { new: true }
  );

  res.status(200).json({ data: user.wishlist });
  next();
});

// @desc    Get logged user wishlist
// @route   GET /api/v1/wishlist
// @access  Protected/User
const getloggeduserwishlist = asyncHandler(async (req, res, next) => {
  // $pull => remove productId from wishlist array if productId exist
  const user = await Usermodel.findOne(req.user._id).populate({
    path: "wishlist",
  });

  res.status(200).json(user);
  next();
});
module.exports = {
  addProductToWishList,
  removeProductfromWishList,
  getloggeduserwishlist,
};
