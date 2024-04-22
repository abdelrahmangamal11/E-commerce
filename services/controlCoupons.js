const couponmodel = require("../model/couponmodels");
const Handler = require("./Handlerfactories");

// to add Brands
// method post-request
// privat
const postcoupons = Handler.createOne(couponmodel);

// to get coupons
// method get-request
// privat
const getcoupons = Handler.getAll(couponmodel);

// to get specific_coupons
// method get-request(/:id)
// privat
const getSpecificcoupon = Handler.getOne(couponmodel);

// to update specific_coupons
// method put-request(/:id)
// privat
const updatecoupons = Handler.updateOne(couponmodel);

// to delete specific_coupons
// method Delete-request(/:id)
// privat
const deletcoupons = Handler.deleteOne(couponmodel);

module.exports = {
  postcoupons,
  getcoupons,
  getSpecificcoupon,
  updatecoupons,
  deletcoupons,
};
