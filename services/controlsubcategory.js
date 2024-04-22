const { default: slugify } = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const SubCategorymodel = require("../model/subCategorymodel");
const Apifeatures = require("../utils/APIfeeatures");
const Handler = require("./Handlerfactories");

const getsubcategoriesforcategoryID = (req, res, next) => {
  let filterobject = {};
  if (req.params.Categoryid) {
    filterobject = { Category: req.params.Categoryid };
    req.filterobj = filterobject;
    console.log(req.filterobj, filterobject, "hello");
  }
  next();
};
const setsubcategorytocategoryID = (req, res, next) => {
  if (!req.body.Category) {
    req.body.Category = req.params.Categoryid;
  }
  next();
};
// to add Subcategory
// method post-request
// privat
const postSubcategory = Handler.createOne(SubCategorymodel);

// the rout api/v1/category/:categoryid/subcategories(عشان اجيب كل ال sub اللى بتنتمى لى category معين)
// to get subcategory
// method get-request
// privat
const getSubcategory = Handler.getAll(SubCategorymodel);
// to get specific_category
// method get-request(/:id)
// privat
const getSpecificSubcategory = Handler.getOne(SubCategorymodel);

// to update specific_subcategory
// method put-request(/:id)
// privat

const updateCategory = Handler.updateOne(SubCategorymodel);

// to delete specific_subcategory
// method Delete-request(/:id)
// privat

const deletCategory = Handler.deleteOne(SubCategorymodel);
// asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const subcategory = await SubCategorymodel.findByIdAndDelete(id);
//   if (!subcategory) {
//     return next(new ApiError("not founded Subcategory", 404));
//   }
//   res.status(204 /*كان موجود و اتمسح*/).send({ reso: "deleted" });
// });
module.exports = {
  postSubcategory,
  getSubcategory,
  getSpecificSubcategory,
  updateCategory,
  deletCategory,
  setsubcategorytocategoryID,
  getsubcategoriesforcategoryID,
};
