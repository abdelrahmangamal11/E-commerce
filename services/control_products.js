// const { default: slugify } = require("slugify");
// const asyncHandler = require("express-async-handler");
// const ApiError = require("../utils/ApiError");
// const productmodel = require("../model/producatsmodel");

// // to add product
// // method post-request
// // privat
// const postproduct = asyncHandler(async (req, res) => {
//   // const name=req.body.name;
//   // console.log(name);

//   // const product=new productmodel({name,slug:slugify(name)});
//   // product
//   // .save()
//   // .then((result)=>{res.json(result);})
//   // .catch((err)=>{res.json(err);})
//   // ##########################################################################
//   req.body.slug = slugify(req.body.title);
//   const product = await productmodel.create(req.body);
//   res.status(200).json(product);
// });

// // to get product
// // method get-request
// // privat
// const getproduct = asyncHandler(async (req, res) => {
//   // 1) to remove the limit and p from the pagination for the filteration.
//   // filteration
//   const queryObject = { ...req.query };
//   const deletedQuery = ["p", "limit"];
//   deletedQuery.forEach((delet) => {
//     delete queryObject[delet];
//   });
//   // console.log(queryObject);

//   let querystring = JSON.stringify(queryObject);
//   // {{sold:{$lt:50}},{quantity:{$gt:10}}}
//   // b=>عشان اجيب الكلام اللى انا عاوزه بالظبط ميكنش جزء من كلمة
//   // g=>عشان لو فى كلمة متكررة اعمل عليها لكن لو مستخدمتهاش كدا هيعمل على اول واحدة يلاقيها
//   // eslint-disable-next-line no-const-assign
//   querystring = querystring.replace(
//     /\b(gt|gte|lt|lte)\b/g,
//     (resault) => `$${resault}`
//   );
//   // const queryObj = JSON.parse(querystring);

//   // 2) pagenation.
//   const page = req.query.p || 1; /*http://localhost:8000/?p=value*/
//   const catPerPage = req.query.limit || 10;
//   // building Query
//   let buildQuery = productmodel
//     .find(JSON.parse(querystring))
//     // .sort({ author: -1 })
//     .skip(catPerPage * (page - 1))
//     .limit(catPerPage)
//     .populate({ path: "category", select: "name-_id" });
//   console.log(typeof JSON.stringify(req.query.sort));
//   // sorting
//   if (req.query.sort) {
//     console.log(req.query.sort);
//     // const sortby = req.query.sort.split(",").join(" ");
//     // console.log(sortby);
//     buildQuery = buildQuery.sort(req.query.sort);
//   } else {
//     buildQuery = buildQuery.sort("createdAt");
//   }

//   // fields limiting

//   if (req.query.fields) {
//     console.log(typeof req.query.fields);
//     const fields = req.query.sort.split(",").join(" ");
//     buildQuery = buildQuery.select(fields);
//   } else {
//     buildQuery = buildQuery.select("-__v");
//   }
//   // excuting query
//   const product = await buildQuery;
//   res
//     .status(200)
//     .json({ result: product.length, data: product } /*return an array*/);
// });

// // to get specific_product
// // method get-request(/:id)
// // privat
// const getSpecificproduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   console.log(id);
//   const product = await productmodel.findById(id);
//   if (!product) {
//     return next(new ApiError("not founded product", 404));
//     // res.status(400).json({mssg:'not founded product'})
//   }
//   res.status(200).json(product);
// });

// // to update specific_product
// // method put-request(/:id)
// // privat
// const updateproduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   if (req.body.title) {
//     req.body.slug = slugify(req.body.title);
//   }
//   const product = await productmodel.findOneAndUpdate(
//     { _id: id },
//     req.body,
//     { new: true } /*to send the data after updated*/
//   );
//   if (!product) {
//     return next(new ApiError("not founded product", 404));
//   }
//   res.status(200).json(product);
// });

// // to delete specific_product
// // method Delete-request(/:id)
// // privat

// const deletproduct = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const product = await productmodel.findByIdAndDelete(id);
//   if (!product) {
//     return next(new ApiError("not founded product", 404));
//   }
//   res.status(204 /*كان موجود و اتمسح*/).send({ reso: "deleted" });
// });

// module.exports = {
//   postproduct,
//   getproduct,
//   getSpecificproduct,
//   updateproduct,
//   deletproduct,
// };

// // app.patch('/book/:id',(req,res)=>{
// //     let newupdate=req.body;
// //      if(ObjectId.isValid(req.params.id)){
// //          db.collection('book')
// //          .updateOne({_id: new ObjectId(req.params.id)},{$set:newupdate})
// //          .then((result)=>{res.status(200).json(result)})
// //          .catch((err)=>{res.status(500).json({mssg:'nononono'})})
// //      }else{
// //           res.json({mssg:'there is no data'})
// //      }
// //   })
