const stripe = require("stripe")(process.env.SECRET_KEY);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const cartmodel = require("../model/Cartmodel");
const ordermodel = require("../model/ordermodel");
const productmodel = require("../model/producatsmodel");
const Handler = require("./Handlerfactories");

// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User
const creatcashorder = asyncHandler(async (req, res, next) => {
  const taxprice = 0;
  const shippingprice = 0;
  // 1) Get cart depend on cartId
  const cart = await cartmodel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("there is no cart", 404));
  }
  // 2) Get order price depend on cart price "Check if coupon apply"
  const orderprice = cart.totalpriceafterdiscount
    ? cart.totalpriceafterdiscount
    : cart.totalprice;
  const totalorderprice = orderprice + taxprice + shippingprice;
  // 3) Create order with default paymentMethodType cash
  const order = await ordermodel.create({
    user: req.user._id,
    totalorderprice,
    cartitem: cart.cartItems,
    shippingaddress: req.body.shippingaddress,
  });
  // 4) After creating order, decrement product quantity, increment product sold
  const bulkopts = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));
  console.log(bulkopts);
  const product = await productmodel.bulkWrite(bulkopts);
  // 5) Clear cart depend on cartId
  await cartmodel.findByIdAndDelete(req.params.cartId);
  res.status(200).json({ data: order, message: "success" });
});

//create filterobject
const filterforuser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filterobj = { user: req.user._id };
  }
  next();
});

// @desc    get cash orders
// @route   POST /api/v1/orders
// @access  Protected/User,admin,manager
const getorders = Handler.getAll(ordermodel);

// @desc    get cash order
// @route   POST /api/v1/orders/orderId
// @access  Protected/User,admin,manager
const getOneorder = Handler.getOne(ordermodel);

// @desc    update ispaid to true
// @route   POST /api/v1/orders/orderId/paid
// @access  Protected/admin
const updateispaid = asyncHandler(async (req, res, next) => {
  const order = await ordermodel.findByIdAndUpdate(
    req.params.orderId,
    {
      orderpaied: true,
      orederedAt: Date.now(),
    },
    { new: true }
  );

  res.status(200).json({ data: order });
});

// @desc    update orderdelivered to true
// @route   POST /api/v1/orders/orderId/delivered
// @access  Protected/admin
const updatedelivered = asyncHandler(async (req, res, next) => {
  const order = await ordermodel.findByIdAndUpdate(
    req.params.orderId,
    {
      orderdelivered: true,
      deliveredAt: Date.now(),
    },
    { new: true }
  );

  res.status(200).json({ data: order });
});

// @desc   create-checkout-session
// @route   get /api/v1/checkout-session/cartId
// @access  Protected/user
const checksession = asyncHandler(async (req, res, next) => {
  const taxprice = 0;
  const shippingprice = 0;
  // 1) Get cart depend on cartId
  const cart = await cartmodel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("there is no cart", 404));
  }
  // 2) Get order price depend on cart price "Check if coupon apply"
  const orderprice = cart.totalpriceafterdiscount
    ? cart.totalpriceafterdiscount
    : cart.totalprice;
  const totalorderprice = orderprice + taxprice + shippingprice;
  // 3)creat the session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalorderprice * 100,
          product_data: { name: req.user.name },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/order`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    client_reference_id: req.params.cartId,
    customer_email: req.user.email,
    metadata: req.body.shippingaddress,
  });
  // 4)send session to response
  res.status(200).json({ message: "success", data: session });
});

// const creatcardorder = async (session) => {};

const webhook = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    console.log("event completed...1223");
    console.log(event.data.object.client_reference_id);
  }
});
module.exports = {
  creatcashorder,
  filterforuser,
  getorders,
  getOneorder,
  updateispaid,
  updatedelivered,
  checksession,
  webhook,
};
