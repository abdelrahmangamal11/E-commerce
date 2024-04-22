const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Apifeatures = require("../utils/APIfeeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const Brands = await Model.findByIdAndDelete(id);
    if (!Brands) {
      return next(new ApiError("not founded Brands", 404));
    }
    // to apply the change in the reviews while deleting reviews( Trigger "delete" event when delete document)
    Brands.remove();
    res.status(204 /*كان موجود و اتمسح*/).send({ reso: "deleted" });
  });
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const Brands = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } /*to send the data after updated*/
    );
    // to apply the change in the reviews while updating reviews( Trigger "save" event when update document)
    Brands.save();
    if (!Brands) {
      return next(new ApiError("not founded Brands", 404));
    }
    res.status(200).json(Brands);
  });
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(200).json(document);
  });
exports.getOne = (Model, populateOpts) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let review = Model.findById(id);
    if (populateOpts) {
      review = review.populate(populateOpts);
    }
    const documents = await review;
    if (!documents) {
      return next(new ApiError("not founded document", 404));
      // res.status(400).json({mssg:'not founded category'})
    }
    res.status(200).json(documents);
    console.log(req.params);
  });
exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    // console.log(req);
    let filter = {};
    if (req.filterobj) {
      filter = req.filterobj;
    }
    const countDOCS = await Model.countDocuments();
    const Features = new Apifeatures(Model.find(filter), req.query)
      .filter()
      .paginate(countDOCS)
      .search(req.baseUrl)
      .sort();
    const { buildquery, paginationResault } = Features;
    const subcategory = await buildquery;

    res.status(200).json(
      {
        result: subcategory.length,
        paginationResault,
        data: subcategory,
      } /*return an array*/
    );
  });
