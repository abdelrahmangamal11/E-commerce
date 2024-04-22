const categoryroutes = require("./categoryroutes");
const subcategoryroutes = require("./SubcategoryRoutes");
const Brandsroutes = require("./BrandsRoutes");
const productroutes = require("./ProductRoutes");
const Userroutes = require("./UserRoutes");
const Authroutes = require("./AuthRoutes");
const Reviews = require("./ReviewsRoutes");
const wishlist = require("./wishlistRoutes ");
const address = require("./AddressRoutes");
const coupon = require("./CouponRoutes");
const cart = require("./CartRoutes");
const order = require("./orderroute");

const confirmroute = (app) => {
  app.use("/api/v1/categories", categoryroutes);
  app.use("/api/v1/subcategories", subcategoryroutes);
  app.use("/api/v1/brands", Brandsroutes);
  app.use("/api/v1/Products", productroutes);
  app.use("/api/v1/Users", Userroutes);
  app.use("/api/v1/Auths", Authroutes);
  app.use("/api/v1/Reviews", Reviews);
  app.use("/api/v1/wishlist", wishlist);
  app.use("/api/v1/address", address);
  app.use("/api/v1/coupon", coupon);
  app.use("/api/v1/cart", cart);
  app.use("/api/v1/order", order);
};

module.exports = confirmroute;
