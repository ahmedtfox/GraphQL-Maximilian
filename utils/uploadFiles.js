const moment = require("moment");
const multer = require("multer");

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype;
  if (
    fileType === "image/jpeg" ||
    fileType === "image/jpg" ||
    fileType === "image/png"
  ) {
    req.uploadStatus = "success";
    cb(null, true); // Accept the file
  } else {
    req.uploadStatus = "wrong file type";
    cb(null, false); // Reject the file
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    req.uploadStatus = "success";
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    req.uploadStatus = "success";
    const dateString = moment().format("YYYY-MM-DD HH-mm-SSS");
    const diskFileName = dateString + "." + file.mimetype.split("/")[1];
    cb(null, diskFileName);
  },
});

const upload = multer({ storage, fileFilter });

module.exports = upload;
