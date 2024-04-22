const multer = require("multer");
const ApiError = require("../utils/ApiError");
// disck storage
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     //  to put the type in array( For example, "image/jpeg" would split into ["image", "jpeg"].)
//     const type = file.mimetype.split("/")[1];
//     // uuidv4: to add an unique id to the filename
//     const filename = `category-${uuidv4()}-${Date.now()}.${type}`;
//     cb(null, filename);
//   },
// });

// to filter the type of file
const upload = () => {
  const filefilteration = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else cb(new ApiError("the file should be an image", 400), false);
  };

  // memmory storage
  const multerStorage =
    multer.memoryStorage(); /*return a buffer for the sharp chaining*/

  return multer({
    storage: multerStorage,
    fileFilter: filefilteration,
  });
};
const uploadsImage = (fieldName) => upload().single(fieldName);
// to filter the type of file

const uploadsImagesAndCoverimages = (arrayoffields) =>
  upload().fields(arrayoffields);

module.exports = { uploadsImage, uploadsImagesAndCoverimages };
