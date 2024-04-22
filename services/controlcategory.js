const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const categormodel = require("../model/categorymodel");
const Handler = require("./Handlerfactories");

const uploadsimage = require("../middleware/imageUploadMiddleware");

// to modifie the images
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 20 })
      .toFile(`uploads/categories/${filename}`);

    //save image into the data base
    req.body.image = filename;
  }
  next();
});
const uploadcategoryimage = uploadsimage.uploadsImage("image");
// to add category
// method post-request
// privat(admin,manager)
const postcategory = Handler.createOne(categormodel);
// to get category
// method get-request
// privat
const getcategory = Handler.getAll(categormodel);

// to get specific_category
// method get-request(/:id)
// privat
const getSpecificcategory = Handler.getOne(categormodel);
// to update specific_category
// method put-request(/:id)
// privat

const updateCategory = Handler.updateOne(categormodel);

// to delete specific_category
// method Delete-request(/:id)
// privat

const deletCategory = Handler.deleteOne(categormodel);
// asyncHandler(async (req, res, next) => {
//   const id = req.params.id;
//   const category = await categormodel.findByIdAndDelete(id);
//   console.log(category);
//   if (!category) {
//     return next(new ApiError("not founded category", 404));
//   }
//   res.status(204 /*كان موجود و اتمسح*/).send({ reso: "deleted" });
// });

module.exports = {
  postcategory,
  getcategory,
  getSpecificcategory,
  updateCategory,
  deletCategory,
  uploadcategoryimage,
  resizeImage,
};

// app.patch('/book/:id',(req,res)=>{
//     let newupdate=req.body;
//      if(ObjectId.isValid(req.params.id)){
//          db.collection('book')
//          .updateOne({_id: new ObjectId(req.params.id)},{$set:newupdate})
//          .then((result)=>{res.status(200).json(result)})
//          .catch((err)=>{res.status(500).json({mssg:'nononono'})})
//      }else{
//           res.json({mssg:'there is no data'})
//      }
//   })
