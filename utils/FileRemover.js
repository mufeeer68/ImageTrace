const fs = require("fs");
const path = require("path");

export const clearDirectory = async () => {
  let extractedPath = "_" + "complex" + ".jpg" + ".extracted";
  console.log(extractedPath);
  if (fs.existsSync(extractedPath)) {
    console.log("2");
    fs.readdir(extractedPath, (err, files) => {
      if (err) console.log(err);
      console.log("hi");
      for (const file of files) {
        console.log(file);
      }
    });
  }
};
