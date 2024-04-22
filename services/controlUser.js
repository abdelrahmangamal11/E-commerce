const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const uploadsimage = require("../middleware/imageUploadMiddleware");
const Usermodel = require("../model/UserModel");
const Handler = require("./Handlerfactories");
const ApiError = require("../utils/ApiError");
const creatToken = require("../utils/crateToken");

// to modifie the images
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `uSer-${uuidv4()}-${Date.now()}.jpeg`;
  // console.log(req.file);
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 20 })
      .toFile(`uploads/users/${filename}`);

    //save image into the data base
    req.body.profileImage = filename;
  }

  next();
});
// to uploads images
const uploadUsersimage = uploadsimage.uploadsImage("profileImage");
// to add Users
// method post-request
// privat
const postUsers = Handler.createOne(Usermodel);
// const name=req.body.name;
// console.log(name);

// const Users=new Usermodel({name,slug:slugify(name)});
// Users
// .save()
// .then((result)=>{res.json(result);})
// .catch((err)=>{res.json(err);})
// ##########################################################################

// to get Users
// method get-request
// privat
const getUsers = Handler.getAll(Usermodel);

// to get specific_Users
// method get-request(/:id)
// privat
const getSpecificUsers = Handler.getOne(Usermodel);

// to update specific_Users
// method put-request(/:id)
// privat
const updateUsers = asyncHandler(async (req, res, next) => {
  const Users = await Usermodel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      slug: req.body.slug,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
    },
    { new: true } /*to send the data after updated*/
  );
  if (!Users) {
    return next(new ApiError("not founded Brands", 404));
  }
  res.status(200).json(Users);
});

// to get the user's data
// method get-request(/getme)
// public
const changpassword = asyncHandler(async (req, res, next) => {
  const Users = await Usermodel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordchangedAt: Date.now(),
    },
    { new: true } /*to send the data after updated*/
  );
  if (!Users) {
    return next(new ApiError("not founded Users", 404));
  }
  res.status(200).json(Users);
});

// to get the user's data
// method get-request(/getme)
// public
const getloggeduserdata = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// to change my password
// method get-request(/changepassword)
// public
const changemypassword = asyncHandler(async (req, res, next) => {
  const User = await Usermodel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordchangedAt: Date.now(),
    },
    { new: true } /*to send the data after updated*/
  );
  if (!User) {
    return next(new ApiError("not founded Users", 404));
  }
  const token = creatToken(User._id);
  res.status(200).json({ data: User, token });
});

// to change my password
// method get-request(/changepassword)
// public
const updateMyData = asyncHandler(async (req, res, next) => {
  const user = await Usermodel.findByIdAndUpdate(
    req.user._id,
    {
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );
  res.status(200).json({ data: user });
});
// to delete specific_Users
// method Delete-request(/:id)
// privat
const deletUsers = asyncHandler(async (req, res) => {
  await Usermodel.findByIdAndUpdate(req.user._id, { $set: { active: false } });
  res
    .status(200)
    .json({ status: "success", message: "this email deactivated" });
});

module.exports = {
  postUsers,
  getUsers,
  getSpecificUsers,
  updateUsers,
  uploadUsersimage,
  resizeImage,
  changpassword,
  getloggeduserdata,
  changemypassword,
  updateMyData,
  deletUsers,
};
