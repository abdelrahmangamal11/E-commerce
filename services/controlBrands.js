const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const uploadsimage = require("../middleware/imageUploadMiddleware");
const Brandsmodel = require("../model/Brandsmodels");
const Handler = require("./Handlerfactories");

// to modifie the images
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  // console.log(req.file);
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 20 })
    .toFile(`uploads/brands/${filename}`);

  //save image into the data base
  req.body.image = filename;
  next();
});
// to uploads images
const uploadbrandsimage = uploadsimage.uploadsImage("image");
// to add Brands
// method post-request
// privat
const postBrands = Handler.createOne(Brandsmodel);
// const name=req.body.name;
// console.log(name);

// const Brands=new Brandsmodel({name,slug:slugify(name)});
// Brands
// .save()
// .then((result)=>{res.json(result);})
// .catch((err)=>{res.json(err);})
// ##########################################################################

// to get Brands
// method get-request
// privat
const getBrands = Handler.getAll(Brandsmodel);

// to get specific_Brands
// method get-request(/:id)
// privat
const getSpecificBrand = Handler.getOne(Brandsmodel);
// to update specific_Brands
// method put-request(/:id)
// privat
// const slufgif=(req,res,next)=>{
//   req.body.slug=slugify(req.body.name)
// }
const updateBrands = Handler.updateOne(Brandsmodel);

// to delete specific_Brands
// method Delete-request(/:id)
// privat

const deletBrands = Handler.deleteOne(Brandsmodel);
//  asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const Brands = await Brandsmodel.findByIdAndDelete(id);
//   if (!Brands) {
//     return next(new ApiError("not founded Brands", 404));
//   }
//   res.status(204 /*كان موجود و اتمسح*/).send({ reso: "deleted" });
// });

module.exports = {
  postBrands,
  getBrands,
  getSpecificBrand,
  updateBrands,
  deletBrands,
  uploadbrandsimage,
  resizeImage,
};
