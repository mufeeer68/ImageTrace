const fs = require("fs");
const path = require("path");

export const clearDirectory = async (req, res) => {
  try {
    let filePath = req.body.path;
    let extension = path.parse(filePath).ext;
    let name = path.parse(filePath).name;
    if (fs.existsSync(filePath)) {
      let tempname = "_" + name + extension + ".extracted";
      const data = [];
      var textData;
      if (fs.existsSync("uploads/" + tempname)) {
        var files = fs.readdirSync("uploads/" + tempname);
        files.forEach(file => {
          if (".rar" == path.parse(file).ext) {
            data.push({ file: tempname + "/" + file });
          } else if (".zip" == path.parse(file).ext) {
            data.push({ file: tempname + "/" + file });
          } else if (".txt" == path.parse(file).ext) {
            textData = fs
              .readFileSync("uploads/" + tempname + "/" + file)
              .toString();
          }
        });
      }

      res.send({ file: data, text: textData });
    }
  } catch (err) {
    console.info(err);

    res.status(500).send(err.message);
  }
};
