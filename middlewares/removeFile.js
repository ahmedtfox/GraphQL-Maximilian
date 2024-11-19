const fs = require("fs");
const path = require("path");

function removeFile(filename, filePath) {
  if (!filePath) {
    const filePath = path.join("images", filename);
  }
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("file has been removed");
  });
}
module.exports = removeFile;
