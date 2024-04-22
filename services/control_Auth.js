const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const Usermodel = require("../model/UserModel");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/SendEmail");
const creatToken = require("../utils/crateToken");

// to SignUp
// method post-request///api/v1/Auths/signUp
// public
const signUp = asyncHandler(async (req, res, next) => {
  const user = await Usermodel.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
  });

  const token = creatToken(user._id);
  //   console.log(token);
  res.status(201).json({ data: user, token });
});

// to  SignIn
// method post-request///api/v1/Auths/login
// public
const signIn = asyncHandler(async (req, res, next) => {
  const user = await Usermodel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new Error("the email or the password is incorrect", 400);
  }
  const token = creatToken(user._id);
  res.status(200).json({ data: user, token });
});

// @desc make sure the user is loggedin
const protect = asyncHandler(async (req, res, next) => {
  // 1) check if the token exist or Not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("you are not login plz login to access to this route", 401)
    );
  }
  // 2) verify if the token not changed or expired
  const decoded = jwt.verify(token, process.env.secure_JWTPrivatekey);
  console.log(decoded);
  // 3)check if the user for this token exist or not
  const tokenUser = await Usermodel.findById(decoded.UserId);
  if (!tokenUser) {
    return next(new ApiError("this user is no longer exist ", 401));
  }
  // 4)check if the user change his password or not
  if (tokenUser.passwordchangedAt) {
    const passwordchangedAtToTimeStamps = parseInt(
      tokenUser.passwordchangedAt.getTime() / 1000,
      10
    );

    if (passwordchangedAtToTimeStamps > decoded.iat) {
      return next(new ApiError("the token is invalid plz login again"), 401);
    }
    console.log(passwordchangedAtToTimeStamps === decoded.iat);
  }
  req.user = tokenUser;
  console.log(req.user._id, "oooooooooooooo");
  next();
});

// @desc  Autharization(get permission)
// ['manager','admin']
const onlyAllowed = (...roles) =>
  // 1)access the roles
  // 2)access registered user
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this route", 403)
      );
    }
    next();
  });

// @desc forget password
// @public
const forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) get the user by e-mail
  const user = await Usermodel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`this email(${req.body.email}) doesnot exist`, 403)
    );
  }

  // 2) if the user exists ,Generate a reset random 6-didgits and save it in the DB
  const resetcode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedcode = crypto
    .createHash("sha256")
    .update(resetcode)
    .digest("hex");

  // to save the hashed password in the database
  user.ChangPasswordHashedCode = hashedcode;

  // the expiration time of the code in 10min
  user.ChangPasswordHashedCodeExpiration = Date.now() + 10 * 60 * 1000;

  user.ChangPasswordConfirmation = false;

  //save the user in the database
  user.save();

  // 3) send this digits to the email
  const message = `Hi ${user.name} \n we recieved a request to reset your password on E-Shop\n  \n${resetcode}\n \n thanks for helping us keep your account secure :)\n`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.ChangPasswordHashedCode = undefined;
    user.ChangPasswordHashedCodeExpiration = undefined;
    user.ChangPasswordConfirmation = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res.status(200).json({ message: "the email is sent succefully" });
});

// @desc reset code validation
// @public
const resetCodeValidation = asyncHandler(async (req, res, next) => {
  const hashedcode = crypto
    .createHash("sha256")
    .update(req.body.resetcode)
    .digest("hex");

  const user = await Usermodel.findOne({
    ChangPasswordHashedCode: hashedcode,
    ChangPasswordHashedCodeExpiration: {
      /*for the expiration check*/
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(new ApiError("this code is invalid or expired"));
  }
  user.ChangPasswordConfirmation = true;
  user.save();
  res.status(200).json("success");
});

// @desc reset password
// @public
const resetpassword = asyncHandler(async (req, res, next) => {
  // check if the user exist
  const user = await Usermodel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("the user doesnot exist"));
  }

  // if the confirmation of the reset code occured
  if (!user.ChangPasswordConfirmation) {
    return next(new ApiError("the code is not valid"));
  }
  user.password = req.body.password;
  user.ChangPasswordHashedCode = undefined;
  user.ChangPasswordHashedCodeExpiration = undefined;
  user.ChangPasswordConfirmation = undefined;
  // user.passwordchangedAt = undefined;

  // save the user in the database
  user.save();
  // generate token to login again
  const token = await creatToken(user._id);
  res.status(200).json({ token: token });
});

module.exports = {
  signUp,
  signIn,
  protect,
  onlyAllowed,
  forgetPassword,
  resetCodeValidation,
  resetpassword,
};
