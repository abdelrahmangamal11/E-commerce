const asyncHandler = require("express-async-handler");
const cartmodel = require("../model/Cartmodel");
const productmodel = require("../model/producatsmodel");
const couponmodel = require("../model/couponmodels");
const ApiError = require("../utils/ApiError");

const gettotalprice = (cart) => {
  let thetotalprice = 0;
  cart.cartItems.forEach((item) => {
    thetotalprice += item.price * item.quantity;
  });
  cart.totalprice = thetotalprice;
  cart.totalpriceafterdiscount = undefined;
};

// @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User
const AddproductTocart = asyncHandler(async (req, res, next) => {
  // 1) Get Cart for logged user
  let cart = await cartmodel.findOne({ user: req.user._id });

  const Product = await productmodel.findOne({ _id: req.body.product });

  if (!cart) {
    // 2) If there is no acart Create a one
    cart = await cartmodel.create({
      user: req.user._id,
      cartItems: [
        {
          product: req.body.product,
          color: req.body.color,

          price: Product.price,
        },
      ],
    });
    console.log(cart);
  } else {
    // a-product exist in cart, update product quantity
    const cartindex = await cart.cartItems.findIndex(
      (index) =>
        req.body.product === index.product.toString() &&
        index.color === req.body.color
    );
    console.log(cartindex);

    if (cartindex > -1) {
      cart.cartItems[cartindex].quantity += 1;
    } else {
      // b-product does not exist in cart, add new product to cart
      cart.cartItems.push({
        product: req.body.product,
        color: req.body.color,
        price: Product.price,
      });
    }
  }
  gettotalprice(cart);
  cart.save();
  res.status(200).json({ data: cart });
});

// @desc    get user   cart
// @route   get /api/v1/cart
// @access  Private/User
const getloggedusercart = asyncHandler(async (req, res, next) => {
  const cart = await cartmodel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("there is no cart for this user"), 404);
  }
  gettotalprice(cart);
  cart.save();
  res.status(200).json({ data: cart });
});

// @desc    remove product fromcart
// @route   delete /api/v1/cart
// @access  Private/User
const removeproductfromcart = asyncHandler(async (req, res, next) => {
  const cart = await cartmodel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  );
  if (!cart) {
    return next(new ApiError("there is no cart for this user"), 404);
  }
  res.status(204);
  gettotalprice(cart);
  cart.save();
});

// @desc    remove cart
// @route   delete /api/v1/cart
// @access  Private/User
const removeallproductfromcart = asyncHandler(async (req, res, next) => {
  const cart = await cartmodel.findOneAndDelete({ user: req.user._id });
  res.status(204);
  gettotalprice(cart);
  cart.save();
});

// @desc    update cartitem quantity
// @route   put /api/v1/cart/:id
// @access  Private/User
const updatycartitemquantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await cartmodel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("there is no cart for this user"), 404);
  }
  const cartindex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.id
  );
  if (cartindex > -1) {
    cart.cartItems[cartindex].quantity = quantity;
  } else {
    return next(new ApiError("this product doesnot exist"), 404);
  }
  gettotalprice(cart);
  cart.save();
  res.status(200).json({ data: cart });
});

// @desc    apply coupon in the cart
// @route   put /api/v1/cart/applycoupon
// @access  Private/User
const applycoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await couponmodel.findOne({
    title: req.body.name,
    expiredAt: { $gte: Date.now() },
  });
  if (!coupon) {
    return next(
      new ApiError("the title is not valid or the coupon expired"),
      404
    );
  }
  // 2) Get logged user cart to get total cart price
  const cart = await cartmodel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("there is no cart for this user"), 404);
  }
  // 3) Calculate price after priceAfterDiscount
  const totalpriceafterDiscount = (
    cart.totalprice -
    (coupon.discount / 100) * cart.totalprice
  ).toFixed(2);
  cart.totalpriceafterdiscount = totalpriceafterDiscount;
  cart.save();

  res.status(200).json({ data: cart });
});
module.exports = {
  AddproductTocart,
  getloggedusercart,
  removeproductfromcart,
  removeallproductfromcart,
  updatycartitemquantity,
  applycoupon,
};
