const fs = require("fs");
const path = require("path");

function removeFile(input) {
  let filePath = input.filePath || undefined;
  const filename = input.filename || undefined;
  if (!filePath) {
    filePath = path.join("images", filename);
  }
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("file has been removed");
  });
}
module.exports = removeFile;
