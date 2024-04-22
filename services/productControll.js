const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const { v4: uuidv4 } = require("uuid");

const producatsmodel = require("../model/producatsmodel");
const uploadsimages = require("../middleware/imageUploadMiddleware");
const Handler = require("./Handlerfactories");

const uploadsImage = uploadsimages.uploadsImagesAndCoverimages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

const resizeimage = asyncHandler(async (req, res, next) => {
  // console.log(req.file);
  if (req.files.imageCover) {
    const imageCoverName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(3000, 1200)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverName}`);
    // console.log(req.files);

    //save image into the data bas
    req.body.imageCover = imageCoverName;
    // console.log(req.files);
  }
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${1 + index}.jpeg`;
        await sharp(img.buffer)
          .resize(3000, 1200)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        //save image into the data bas
        req.body.images.push(imageName);
      })
    );
  }
  next();
  // console.log(req.body.imageCover, req.body.images);
});
// to add product
// method post-request
// privat
const postproduct = Handler.createOne(producatsmodel);

// to get product
// method get-request
// privat
// ( // const name=req.body.name;
// console.log(name);

// const product=new producatsmodel({name,slug:slugify(name)});
// product
// .save()
// .then((result)=>{res.json(result);})
// .catch((err)=>{res.json(err);})
// ##########################################################################)
const getproduct = Handler.getAll(producatsmodel);
// 1) filteration
// to remove the limit and p from the pagination for the filteration.
// const queryObject = { ...req.query };
// const deletedQuery = ["p", "limit", "sort", "fields", "keyword"];
// deletedQuery.forEach((delet) => {
//   delete queryObject[delet];
// });

// let querystring = JSON.stringify(queryObject);
// // {{sold:{$lt:50}},{quantity:{$gt:10}}}
// // b=>عشان اجيب الكلام اللى انا عاوزه بالظبط ميكنش جزء من كلمة
// // g=>عشان لو فى كلمة متكررة اعمل عليها لكن لو مستخدمتهاش كدا هيعمل على اول واحدة يلاقيها
// // eslint-disable-next-line no-const-assign
// querystring = querystring.replace(
//   /\b(gt|gte|lt|lte)\b/g,
//   (resault) => `$${resault}`
// );
// 2)pagination
// console.log(req.baseUrl.includes("Products"));
// const modelName = req.baseUrl;

//   .find(JSON.parse(querystring))
//   // .sort({author:1})
//   .skip(catPerPage * (page - 1))
//   .limit(catPerPage);
// // // sorting
// if (req.query.sort) {
//   console.log(req.query.sort);
// const sortby = req.query.sort.split(",").join(" ");
// console.log(sortby);
//   buildQuery = buildQuery.sort(req.query.sort);
// } else {
//   buildQuery = buildQuery.sort("createdAt");
// }

// fields limiting

// if (req.query.fields) {
//   const fields = req.query.sort.split(",").join(" ");
//   buildQuery = buildQuery.select(fields);
// } else {
//   buildQuery = buildQuery.select("-__v");
// }
// // search
// if (req.query.keyword) {
//   const query = {};

//   query.$or = [
//     { title: { $regex: req.query.keyword, $options: "i" } },
//     { description: { $regex: req.query.keyword, $options: "i" } },
//   ];

//   buildQuery = buildQuery.find(query);
// }

// to get specific_product
// method get-request(/:id)
// privat
const getSpecificproduct = Handler.getOne(producatsmodel, "reviews");
// to update specific_product
// method put-request(/:id)
// privat

const updateproduct = Handler.updateOne(producatsmodel);

// to delete specific_product
// method Delete-request(/:id)
// privat

const deletproduct = Handler.deleteOne(producatsmodel);
// \asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await producatsmodel.findByIdAndDelete(id);
//   if (!product) {
//     return next(new ApiError("not founded product", 404));
//   }
//   res.status(204 /*كان موجود و اتمسح*/).send({ reso: "deleted" });
// });

module.exports = {
  postproduct,
  getproduct,
  getSpecificproduct,
  updateproduct,
  deletproduct,
  uploadsImage,
  resizeimage,
};
