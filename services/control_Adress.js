const asyncHandler = require("express-async-handler");
const Usermodel = require("../model/UserModel");
const Handler = require("./Handlerfactories");
const ApiError = require("../utils/ApiError");

// @desc    Add address to userAddress
// @route   POST /api/v1/address
// @access  Protected/User
const addAdress = asyncHandler(async (req, res, next) => {
  // $addToSet => add address to wishlist array if productId not exist
  const user = await Usermodel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { address: req.body } },
    { new: true }
  );

  res.status(200).json({ data: user.address });
  next();
});

// @desc    remove address from userAddress
// @route   delete /api/v1/address
// @access  Protected/User
const removeAddress = asyncHandler(async (req, res, next) => {
  // $pull => remove address from wishlist array if address exist
  const user = await Usermodel.findByIdAndUpdate(
    req.user._id,
    { $pull: { address: { _id: req.params.id } } },
    { new: true }
  );

  res.status(200).json({ data: user.address });
  next();
});

// @desc    Get logged user addresses list
// @route   GET /api/v1/address
// @access  Protected/User
const getAddress = asyncHandler(async (req, res, next) => {
  // to get the logged user address
  const user = await Usermodel.findOne(req.user._id).populate({
    path: "address",
  });

  res.status(200).json(user.address);
  next();
});
module.exports = {
  addAdress,
  removeAddress,
  getAddress,
};
